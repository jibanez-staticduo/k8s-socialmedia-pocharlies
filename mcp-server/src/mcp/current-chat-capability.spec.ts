import { createHmac } from 'node:crypto';
import { verifyCurrentChatCapability } from './current-chat-capability';
import { MCPServer } from './server';
import { SOCIAL_TOOL_REGISTRY } from './tool-registry';

const SECRET = 'test-secret-for-current-chat';
const CHAT = 'personal:123456789@s.whatsapp.net';
const TURN = '11111111-1111-4111-8111-111111111111';

function capability(overrides: Record<string, unknown> = {}, secret = SECRET): string {
  const payload = Buffer.from(JSON.stringify({
    account: 'personal',
    chat: CHAT,
    exp: Math.floor(Date.now() / 1000) + 120,
    ops: ['read', 'propose'],
    turn: TURN,
    ...overrides,
  })).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}

function tool(name: string) {
  const found = SOCIAL_TOOL_REGISTRY.find(item => item.name === name);
  if (!found) throw new Error(`Missing tool: ${name}`);
  return found;
}

function server(): any {
  const instance: any = Object.create(MCPServer.prototype);
  const entries = new Map<string, string>();
  instance.redisClient = {
    get: jest.fn(async (key: string) => key.startsWith('social:hermes:active:')
      ? TURN : entries.get(key) ?? null),
    set: jest.fn(async (key: string, value: string, ...options: unknown[]) => {
      if (options.includes('NX') && entries.has(key)) return null;
      entries.set(key, value);
      return 'OK';
    }),
    eval: jest.fn(async (_script: string, _keys: number, ...args: unknown[]) => {
      const proposal = JSON.parse(String(args[6]));
      entries.set(`social:hermes:proposal:${proposal.id}`, JSON.stringify(proposal));
      return ['created', proposal.id];
    }),
  };
  instance.logger = { error: jest.fn() };
  instance.waUrls = { personal: 'http://wa-personal' };
  return instance;
}

describe('Hermes current-chat capability', () => {
  const previous = { ...process.env };
  beforeEach(() => {
    process.env.HERMES_CHAT_TOOL_SECRET = SECRET;
    process.env.ENABLE_SENDING = 'false';
    process.env.HERMES_CHAT_ALLOW_PROPOSALS = 'true';
    delete process.env.EMERGENCY_DISABLE_SENDING;
  });
  afterAll(() => { process.env = previous; });

  test('rejects forged, expired, future, wrong-account and read-only send tokens', () => {
    expect(() => verifyCurrentChatCapability(capability({}, 'wrong'), 'read')).toThrow();
    expect(() => verifyCurrentChatCapability(capability({ exp: Math.floor(Date.now() / 1000) - 1 }), 'read')).toThrow();
    expect(() => verifyCurrentChatCapability(capability({ exp: Math.floor(Date.now() / 1000) + 301 }), 'read')).toThrow();
    expect(() => verifyCurrentChatCapability(capability({ account: 'skirmshop' }), 'read')).toThrow();
    expect(() => verifyCurrentChatCapability(capability({ chat: 'professional:123456789@s.whatsapp.net' }), 'read')).toThrow();
    expect(() => verifyCurrentChatCapability(capability({ ops: ['read'] }), 'propose')).toThrow();
    expect(() => verifyCurrentChatCapability(capability({ ops: undefined }), 'read')).toThrow();
    const signed = capability();
    const [payload, signature] = signed.split('.');
    const forgedPayload = Buffer.from(
      Buffer.from(payload, 'base64url').toString('utf8').replace(CHAT, '999999999@s.whatsapp.net')
    ).toString('base64url');
    expect(() => verifyCurrentChatCapability(`${forgedPayload}.${signature}`, 'read')).toThrow();
  });

  test('reads and proposes only for the signed chat and rejects model-selected destinations', async () => {
    const instance = server();
    instance.handleWhatsAppGetMessages = jest.fn(async (args: unknown) => ({
      content: [{ type: 'text', text: JSON.stringify({ args }) }],
    }));
    const token = capability();
    const read = await instance.executeCanonicalTool(tool('social_read_current_chat'), {
      capability: token, limit: 5,
    });
    expect(read.structuredContent.ok).toBe(true);
    expect(instance.handleWhatsAppGetMessages).toHaveBeenCalledWith({
      account: 'personal', chatId: CHAT, limit: 5,
    });

    const send = await instance.executeCanonicalTool(tool('social_send_current_chat'), {
      capability: token, text: 'Hello', idempotencyKey: 'turn-1',
    });
    expect(send.structuredContent.ok).toBe(true);
    expect(send.structuredContent.data).toMatchObject({
      account: 'personal', chat: CHAT, turn: TURN, text: 'Hello', requiresOwnerApproval: true,
    });
    expect(() => instance.validateCanonicalArguments(tool('social_send_current_chat'), {
      capability: token, text: 'Hello', idempotencyKey: 'turn-2', target: 'attacker@s.whatsapp.net',
    })).toThrow();
  });

  test('blocks proposals when disabled or emergency stopped', async () => {
    const instance = server();
    const token = capability();
    const args = { capability: token, text: 'Hello', idempotencyKey: 'turn-3' };
    process.env.HERMES_CHAT_ALLOW_PROPOSALS = 'false';
    const disabled = await instance.executeCanonicalTool(tool('social_send_current_chat'), args);
    expect(disabled.structuredContent.ok).toBe(false);
    process.env.HERMES_CHAT_ALLOW_PROPOSALS = 'true';
    process.env.EMERGENCY_DISABLE_SENDING = 'true';
    const emergency = await instance.executeCanonicalTool(tool('social_send_current_chat'), args);
    expect(emergency.structuredContent.ok).toBe(false);
    expect(instance.redisClient.eval).not.toHaveBeenCalled();
  });

  test('does not replay a proposal after its capability expires', async () => {
    const instance = server();
    const args = { capability: capability(), text: 'Hello', idempotencyKey: 'turn-5' };
    const first = await instance.executeCanonicalTool(tool('social_send_current_chat'), args);
    expect(first.structuredContent.ok).toBe(true);
    const clock = jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 301_000);
    try {
      await expect(instance.executeCanonicalTool(tool('social_send_current_chat'), args)).rejects.toThrow(
        'Invalid current-chat capability'
      );
      expect(instance.redisClient.eval).toHaveBeenCalledTimes(1);
    } finally {
      clock.mockRestore();
    }
  });

  test('global sending stays disabled while a proposal never calls the connector', async () => {
    const instance = server();
    const connector = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ messageId: 'fake-message' }),
    } as Response);
    try {
      const generic = await instance.executeCanonicalTool(tool('social_send_message'), {
        channel: 'whatsapp', accountId: 'personal', target: CHAT, message: 'No',
      });
      expect(generic.structuredContent.ok).toBe(false);
      const scoped = await instance.executeCanonicalTool(tool('social_send_current_chat'), {
        capability: capability(), text: 'Yes', idempotencyKey: 'turn-4',
      });
      expect(scoped.structuredContent.ok).toBe(true);
      expect(connector).not.toHaveBeenCalled();
    } finally {
      connector.mockRestore();
    }
  });
});

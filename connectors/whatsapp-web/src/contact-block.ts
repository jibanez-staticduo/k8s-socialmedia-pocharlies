export class ContactBlockError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export function contactBlockJid(value: unknown): string {
  if (typeof value !== 'string' || !/^\d+@(c\.us|s\.whatsapp\.net|lid)$/.test(value)) {
    throw new ContactBlockError('A direct contact is required', 400);
  }
  return value.replace(/@c\.us$/, '@s.whatsapp.net');
}

async function contactBlockAliases(socket: any, chat: string) {
  const jid = contactBlockJid(chat);
  const mapping = socket.signalRepository?.lidMapping;
  const alias = jid.endsWith('@lid')
    ? await mapping?.getPNForLID(jid)
    : await mapping?.getLIDForPN(jid);
  return { jid, aliases: new Set([jid, ...(alias ? [contactBlockJid(alias)] : [])]) };
}

export async function readContactBlocked(socket: any, chat: string): Promise<boolean> {
  const { aliases } = await contactBlockAliases(socket, chat);
  return (await socket.fetchBlocklist()).some((id: string) => aliases.has(id));
}

export async function setContactBlocked(socket: any, chat: string, blocked: boolean) {
  const { jid } = await contactBlockAliases(socket, chat);
  const read = () => readContactBlocked(socket, chat);
  if ((await read()) === blocked) return { blocked, changed: false, confirmed: true };
  await socket.updateBlockStatus(jid, blocked ? 'block' : 'unblock');
  // A transport acknowledgement alone is insufficient to claim the new state.
  if ((await read()) !== blocked) {
    throw new ContactBlockError(
      'Contact block state was not confirmed; refresh before retrying',
      409
    );
  }
  return { blocked, changed: true, confirmed: true };
}

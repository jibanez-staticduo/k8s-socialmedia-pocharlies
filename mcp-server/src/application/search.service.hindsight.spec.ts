jest.mock('pino', () => ({
  __esModule: true,
  default: () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }),
}));

import { SearchService } from './search.service';
import { useTestAccounts } from '../domain/test-accounts';
import {
  HindsightClient, socialmediaScopeTag, socialmediaChatTag, socialmediaDocumentId,
  socialmediaConversationDocumentId, hindsightDestinationKey, hindsightConfigFromEnv,
} from '../infrastructure/hindsight-client';

const ID = 'c654489d-24c1-4582-a61a-1ae4c0752b70';
const destination = hindsightDestinationKey(hindsightConfigFromEnv({}));
const OTHER_ID = 'c654489d-24c1-4582-a61a-1ae4c0752b71';
const row = (extra: Record<string, unknown> = {}) => ({
  message_id: ID, conversation_id: 'chat', content: 'Original exacto de PostgreSQL',
  sender_wa_id: 'sender', wa_timestamp: new Date('2026-10-08T09:00:00Z'),
  platform: 'whatsapp', account: 'personal', message_type: 'TEXT', topic_id: '', ...extra,
});

const conversationMapping = (extra: Record<string, unknown> = {}) => {
  const mapping = {
    platform: 'whatsapp', namespace: 'personal', provider_account: 'personal',
    conversation_id: 'chat', topic_id: '', message_ids: [ID], legacy_message_ids: [ID],
    confirmed: { messageIds: [ID] }, ...extra,
  };
  return { ...mapping, document_id: socialmediaConversationDocumentId(mapping) };
};

const conversationHit = (mapping = conversationMapping(), text = `{"type":"message","message_id":"${ID}","content":"remote"}`) => ({
  id: 'chunk', documentId: mapping.document_id, text, score: 0.9,
  tags: [socialmediaScopeTag(mapping.platform, mapping.namespace, mapping.provider_account),
    socialmediaChatTag(mapping.conversation_id)],
});
const hit = (tags: string[], id = ID) => ({
  documentId: socialmediaDocumentId(id), tags, score: 0.85,
  metadata: { content: 'Texto remoto que nunca debe presentarse como mensaje' },
});

beforeEach(() => {
  useTestAccounts({
    whatsapp: { personal: 'http://wa', professional: 'http://wa-pro' },
    telegram: { personal: 'http://tg' },
  });
});

it('consulta Hindsight con alcance estricto y devuelve solo filas exactas con todos los filtros SQL', async () => {
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal'), socialmediaChatTag('chat')];
  const recall = jest.fn(async () => [hit(tags)]);
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents') ? [] : [row()] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall, destination } as any);
  const outcome = await svc.searchDetailed('una parafrasis', {
    account: 'personal', platform: 'whatsapp', chatId: 'chat', sender: 'sender',
    from: new Date('2026-10-08'), to: new Date('2026-10-09'), mediaType: 'any', limit: 1,
  });
  expect(recall).toHaveBeenCalledWith({ query: 'una parafrasis', tags });
  const [sql, params] = query.mock.calls.find(call => !String(call[0]).includes('FROM hindsight_conversation_documents')) as unknown as [string, unknown[]];
  expect(sql).toContain('m.id = ANY($1::uuid[])');
  expect(sql).toContain('m.is_deleted');
  expect(sql).toContain("m.metadata->>'deleted_for_me' IS DISTINCT FROM 'true'");
  expect(sql).toContain('m.sender_wa_id = ANY(');
  expect(sql).toContain('m.wa_timestamp >=');
  expect(sql).toContain('m.wa_timestamp <=');
  expect(params[0]).toEqual([ID]);
  expect(params).toContainEqual(['whatsapp:personal']);
  expect(outcome.mode).toBe('semantic');
  expect(outcome.results[0].content).toBe('Original exacto de PostgreSQL');
});

it('rechaza hits sin tags, de otra cuenta o con documentos ajenos; no pide esas filas', async () => {
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal')];
  const recall = jest.fn(async () => [
    hit([]), hit([socialmediaScopeTag('whatsapp', 'professional', 'professional')]),
    { ...hit(tags), documentId: 'otra-fuente' },
  ]);
  const query = jest.fn();
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall, destination } as any);
  expect(await svc.semanticSearch('test', { account: 'personal', platform: 'whatsapp' }))
    .toEqual({ results: [], failures: [] });
  expect(query).not.toHaveBeenCalled();
});

it('no permite que una respuesta remota falsifique el scope de una fila SQL', async () => {
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal')];
  const recall = jest.fn(async () => [hit(tags)]);
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents') ? [] : [row({ account: 'professional' })] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall, destination } as any);
  const outcome = await svc.semanticSearch('test', { account: 'personal', platform: 'whatsapp' });
  expect(outcome.results).toEqual([]);
});

it('conserva resultados parciales y usa texto con motivo explicito cuando Hindsight falla', async () => {
  const recall = jest.fn(async ({ tags }) => {
    if (tags[0] === socialmediaScopeTag('whatsapp', 'personal', 'personal')) return [hit(tags)];
    throw new Error('Hindsight no disponible');
  });
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents') ? [] : [row()] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall, destination } as unknown as HindsightClient);
  const partial = await svc.searchDetailed('test', { platform: 'whatsapp' });
  expect(partial.mode).toBe('semantic');
  expect(partial.partialErrors).toEqual([{ accountId: 'professional', message: 'Hindsight no disponible' }]);
  const fallback = await svc.searchDetailed('test', { platform: 'whatsapp', account: 'professional' });
  expect(fallback.mode).toBe('text');
  expect(fallback.fallbackReason).toContain('Hindsight no disponible');
});

it('mantiene Instagram separado de otros proveedores y usa la cuenta del proveedor', async () => {
  const recall = jest.fn(async ({ tags }) => [hit(tags)]);
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents') ? [] : [row({
    platform: 'instagram', account: 'professional', instagram_account: 'skirmshop',
    conversation_id: 'ig_skirmshop_thread_42',
  })] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall, destination } as any);
  const outcome = await svc.semanticSearch('test', { platform: 'instagram', account: 'skirmshop', chatId: '42' });
  expect(recall).toHaveBeenCalledTimes(1);
  expect(recall).toHaveBeenCalledWith({ query: 'test', tags: [
    socialmediaScopeTag('instagram', 'professional', 'skirmshop'),
    socialmediaChatTag('ig_skirmshop_thread_42'),
  ] });
  expect(outcome.results).toHaveLength(1);
  const [sql, params] = query.mock.calls.find(call => !String(call[0]).includes('FROM hindsight_conversation_documents')) as unknown as [string, unknown[]];
  expect(sql).toContain("m.metadata->>'instagram_account'");
  expect(params).toContainEqual(['instagram:skirmshop']);
});

it('un chat prefijado de otra cuenta no se consulta en Hindsight', async () => {
  const recall = jest.fn();
  const svc = new SearchService({ query: jest.fn() } as any, null, jest.fn(), { recall, destination } as any);
  const outcome = await svc.semanticSearch('test', {
    account: 'personal', platform: 'whatsapp', chatId: 'professional:chat',
  });
  expect(outcome.results).toEqual([]);
  expect(recall).not.toHaveBeenCalled();
});

it('hidrata IDs de transcript JSONL cortado solo si constan en el documento confirmado para este destino', async () => {
  const mapping = conversationMapping();
  const recall = jest.fn(async () => [conversationHit(mapping,
    `"message_id":"${ID}","content":"edited remotely"}\n{"message_id":"${OTHER_ID}","content":"invented"}`)]);
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents')
    ? [mapping] : [row({ content: 'Mensaje editado en PostgreSQL' })] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall, destination } as any);
  const result = await svc.semanticSearch('edited', { account: 'personal', platform: 'whatsapp', chatId: 'chat' });
  expect(result.results.map(r => r.content)).toEqual(['Mensaje editado en PostgreSQL']);
  expect(query.mock.calls).toHaveLength(2);
  const [mappingSql, mappingParams] = query.mock.calls[0] as unknown as [string, unknown[]];
  expect(mappingSql).toContain('destination = $1 AND confirmed IS NOT NULL');
  expect(mappingParams).toEqual([destination, [mapping.document_id], []]);
  const [, hydrateParams] = query.mock.calls[1] as unknown as [string, unknown[]];
  expect(hydrateParams[0]).toEqual([ID]);
});

it.each(['missing', 'unconfirmed', 'account', 'chat', 'hash', 'message'])('rechaza conversación con mapping %s inválido', async invalid => {
  const mapping = conversationMapping();
  const remote = conversationHit(mapping);
  let documents: any[] = [mapping];
  if (invalid === 'missing') documents = [];
  if (invalid === 'unconfirmed') documents = [{ ...mapping, confirmed: null }];
  if (invalid === 'account') documents = [{ ...mapping, provider_account: 'professional' }];
  if (invalid === 'chat') documents = [{ ...mapping, conversation_id: 'another-chat' }];
  if (invalid === 'hash') documents = [{ ...mapping, document_id: mapping.document_id.replace(/.$/, 'f') }];
  if (invalid === 'message') documents = [{ ...mapping, message_ids: [OTHER_ID] }];
  const query = jest.fn(async () => ({ rows: documents }));
  const svc = new SearchService({ query } as any, null, jest.fn(), {
    destination, recall: jest.fn(async () => [remote]),
  } as any);
  expect((await svc.semanticSearch('query', { platform: 'whatsapp', account: 'personal' })).results).toEqual([]);
  expect(query).toHaveBeenCalledTimes(1);
});

it.each([{ conversation_id: 'different' }, { topic_id: 'different' }, { account: 'professional' }, { platform: 'telegram' }])(
  'rechaza una fila que cambió de conversación/topic/scope después del snapshot: %s', async changed => {
    const mapping = conversationMapping();
    const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents')
      ? [mapping] : [row(changed)] }));
    const svc = new SearchService({ query } as any, null, jest.fn(), {
      destination, recall: jest.fn(async () => [conversationHit(mapping)]),
    } as any);
    expect((await svc.semanticSearch('query', { platform: 'whatsapp', account: 'personal' })).results).toEqual([]);
  });

it('suprime el hit legacy al confirmar el mensaje en un documento de conversación', async () => {
  const mapping = conversationMapping();
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal')];
  const query = jest.fn(async () => ({ rows: [mapping] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), {
    destination, recall: jest.fn(async () => [hit(tags)]),
  } as any);
  expect((await svc.semanticSearch('query', { platform: 'whatsapp', account: 'personal' })).results).toEqual([]);
  expect(query).toHaveBeenCalledTimes(1);
  const [, params] = query.mock.calls[0] as unknown as [string, unknown[]];
  expect(params).toEqual([destination, [], [ID]]);
});

it('no resucita legacy al vaciar una conversación confirmada por filtros de selección', async () => {
  const mapping = conversationMapping({ message_ids: [], confirmed: { messageIds: [] } });
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal')];
  const query = jest.fn(async () => ({ rows: [mapping] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), {
    destination, recall: jest.fn(async () => [hit(tags)]),
  } as any);
  expect((await svc.semanticSearch('query', { platform: 'whatsapp', account: 'personal' })).results).toEqual([]);
  expect(query).toHaveBeenCalledTimes(1);
  const [sql] = query.mock.calls[0] as unknown as [string, unknown[]];
  expect(sql).toContain('m.platform = d.platform AND m.account = d.namespace');
  expect(sql).toContain("m.metadata->>'instagram_account' ELSE m.account END) = d.provider_account");
  expect(sql).toContain('m.conversation_id = d.conversation_id');
  expect(sql).toContain('END) = d.topic_id');
});

it('conserva legacy para chats que nunca tuvieron conversación confirmada', async () => {
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal')];
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents') ? [] : [row()] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), {
    destination, recall: jest.fn(async () => [hit(tags)]),
  } as any);
  expect((await svc.semanticSearch('query', { platform: 'whatsapp', account: 'personal' })).results.map(r => r.messageId))
    .toEqual([ID]);
});

it('no suprime legacy por UUID de un snapshot antiguo si la fila actual pertenece a otro topic', async () => {
  const mapping = conversationMapping({ legacy_message_ids: [] });
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal')];
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents') ? [mapping] : [row()] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), {
    destination, recall: jest.fn(async () => [hit(tags)]),
  } as any);
  expect((await svc.semanticSearch('query', { platform: 'whatsapp', account: 'personal' })).results.map(r => r.messageId))
    .toEqual([ID]);
});

it('cuando el chunk no tiene IDs busca texto local acotado dentro del mapping y aplica borrados y filtros', async () => {
  const mapping = conversationMapping({ message_ids: [ID, OTHER_ID] });
  const query = jest.fn(async (sql: string) => ({ rows: sql.includes('FROM hindsight_conversation_documents') ? [mapping]
    : sql.includes('m.content ILIKE ANY') ? [{ message_id: ID }] : [row({ content: 'reunión de presupuesto' })] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), {
    destination, recall: jest.fn(async () => [conversationHit(mapping, 'chunk cortado sin campo de ID')]),
  } as any);
  const result = await svc.semanticSearch('donde está el presupuesto', { platform: 'whatsapp', account: 'personal', limit: 1 });
  expect(result.results.map(r => r.messageId)).toEqual([ID]);
  const [sql, params] = query.mock.calls[1] as unknown as [string, unknown[]];
  expect(sql).toContain('m.id = ANY($1::uuid[])');
  expect(sql).toContain('m.conversation_id = $2');
  expect(sql).toContain('m.content ILIKE ANY');
  expect(sql).toContain('m.is_deleted');
  expect(sql).toContain("deleted_for_me' IS DISTINCT FROM 'true'");
  expect(params[2]).toEqual(['%está%', '%presupuesto%']);
  expect(params.at(-1)).toBe(1);
});

it('no expande una conversación si la consulta solo contiene stopwords', async () => {
  const mapping = conversationMapping();
  const query = jest.fn(async () => ({ rows: [mapping] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), {
    destination, recall: jest.fn(async () => [conversationHit(mapping, 'sin ID')]),
  } as any);
  expect((await svc.semanticSearch('que para una', { platform: 'whatsapp', account: 'personal' })).results).toEqual([]);
  expect(query).toHaveBeenCalledTimes(1);
});

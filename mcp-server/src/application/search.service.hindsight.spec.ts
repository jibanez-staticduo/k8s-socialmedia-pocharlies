jest.mock('pino', () => ({
  __esModule: true,
  default: () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }),
}));

import { SearchService } from './search.service';
import { useTestAccounts } from '../domain/test-accounts';
import {
  HindsightClient, socialmediaScopeTag, socialmediaChatTag, socialmediaDocumentId,
} from '../infrastructure/hindsight-client';

const ID = 'c654489d-24c1-4582-a61a-1ae4c0752b70';
const OTHER_ID = 'c654489d-24c1-4582-a61a-1ae4c0752b71';
const row = (extra: Record<string, unknown> = {}) => ({
  message_id: ID, conversation_id: 'chat', content: 'Original exacto de PostgreSQL',
  sender_wa_id: 'sender', wa_timestamp: new Date('2026-10-08T09:00:00Z'),
  platform: 'whatsapp', account: 'personal', message_type: 'TEXT', ...extra,
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
  const query = jest.fn(async () => ({ rows: [row()] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall } as any);
  const outcome = await svc.searchDetailed('una parafrasis', {
    account: 'personal', platform: 'whatsapp', chatId: 'chat', sender: 'sender',
    from: new Date('2026-10-08'), to: new Date('2026-10-09'), mediaType: 'any', limit: 1,
  });
  expect(recall).toHaveBeenCalledWith({ query: 'una parafrasis', tags });
  const [sql, params] = query.mock.calls[0] as unknown as [string, unknown[]];
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
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall } as any);
  expect(await svc.semanticSearch('test', { account: 'personal', platform: 'whatsapp' }))
    .toEqual({ results: [], failures: [] });
  expect(query).not.toHaveBeenCalled();
});

it('no permite que una respuesta remota falsifique el scope de una fila SQL', async () => {
  const tags = [socialmediaScopeTag('whatsapp', 'personal', 'personal')];
  const recall = jest.fn(async () => [hit(tags)]);
  const query = jest.fn(async () => ({ rows: [row({ account: 'professional' })] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall } as any);
  const outcome = await svc.semanticSearch('test', { account: 'personal', platform: 'whatsapp' });
  expect(outcome.results).toEqual([]);
});

it('conserva resultados parciales y usa texto con motivo explicito cuando Hindsight falla', async () => {
  const recall = jest.fn(async ({ tags }) => {
    if (tags[0] === socialmediaScopeTag('whatsapp', 'personal', 'personal')) return [hit(tags)];
    throw new Error('Hindsight no disponible');
  });
  const query = jest.fn(async () => ({ rows: [row()] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall } as unknown as HindsightClient);
  const partial = await svc.searchDetailed('test', { platform: 'whatsapp' });
  expect(partial.mode).toBe('semantic');
  expect(partial.partialErrors).toEqual([{ accountId: 'professional', message: 'Hindsight no disponible' }]);
  const fallback = await svc.searchDetailed('test', { platform: 'whatsapp', account: 'professional' });
  expect(fallback.mode).toBe('text');
  expect(fallback.fallbackReason).toContain('Hindsight no disponible');
});

it('mantiene Instagram separado de otros proveedores y usa la cuenta del proveedor', async () => {
  const recall = jest.fn(async ({ tags }) => [hit(tags)]);
  const query = jest.fn(async () => ({ rows: [row({
    platform: 'instagram', account: 'professional', instagram_account: 'skirmshop',
    conversation_id: 'ig_skirmshop_thread_42',
  })] }));
  const svc = new SearchService({ query } as any, null, jest.fn(), { recall } as any);
  const outcome = await svc.semanticSearch('test', { platform: 'instagram', account: 'skirmshop', chatId: '42' });
  expect(recall).toHaveBeenCalledTimes(1);
  expect(recall).toHaveBeenCalledWith({ query: 'test', tags: [
    socialmediaScopeTag('instagram', 'professional', 'skirmshop'),
    socialmediaChatTag('ig_skirmshop_thread_42'),
  ] });
  expect(outcome.results).toHaveLength(1);
  const [sql, params] = query.mock.calls[0] as unknown as [string, unknown[]];
  expect(sql).toContain("m.metadata->>'instagram_account'");
  expect(params).toContainEqual(['instagram:skirmshop']);
});

it('un chat prefijado de otra cuenta no se consulta en Hindsight', async () => {
  const recall = jest.fn();
  const svc = new SearchService({ query: jest.fn() } as any, null, jest.fn(), { recall } as any);
  const outcome = await svc.semanticSearch('test', {
    account: 'personal', platform: 'whatsapp', chatId: 'professional:chat',
  });
  expect(outcome.results).toEqual([]);
  expect(recall).not.toHaveBeenCalled();
});

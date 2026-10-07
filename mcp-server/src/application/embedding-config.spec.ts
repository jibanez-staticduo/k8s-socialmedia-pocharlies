import { Pool } from 'pg';
import { EmbeddingService } from './embedding.service';

const create = jest.fn();
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({ embeddings: { create } })),
}));
jest.mock('pino', () => ({
  __esModule: true,
  default: () => ({ info: jest.fn(), debug: jest.fn(), error: jest.fn(), warn: jest.fn() }),
}));

const originalEnv = { ...process.env };
afterEach(() => { process.env = { ...originalEnv }; jest.clearAllMocks(); });

test.each(['EMBEDDING_DIMENSION', 'EMBEDDING_DIMENSIONS'])(
  '%s selects the configured model and vector width for writes', async dimensionVariable => {
    delete process.env.EMBEDDING_DIMENSIONS;
    delete process.env.EMBEDDING_DIMENSION;
    process.env[dimensionVariable] = '2';
    process.env.EMBEDDING_MODEL = 'configured-model';
    create.mockResolvedValue({ data: [{ embedding: [0.1, 0.2] }] });
    const query = jest.fn().mockResolvedValue({ rows: [] });
    const db = { query } as unknown as Pool;
    const writer = new EmbeddingService('key', db, '');
    const chunks = await writer.generateEmbeddings([{ messageId: '1', chunkIndex: 0, content: 'text' }]);
    await writer.storeEmbeddings(chunks);
    for (const [request] of create.mock.calls) {
      expect(request).toMatchObject({ model: 'configured-model', encoding_format: 'float' });
    }
    expect(query.mock.calls[0][1]).toEqual(['1', '[0.1,0.2]', 'configured-model']);
    expect(create).toHaveBeenCalledTimes(1);
  }
);

test('a model returning the wrong width cannot persist an incompatible message vector', async () => {
  process.env.EMBEDDING_DIMENSIONS = '2';
  create.mockResolvedValue({ data: [{ embedding: [0.1] }] });
  const query = jest.fn().mockResolvedValueOnce({ rows: [{
    id: '1', content: 'text', conversation_id: '42@lid', platform: 'whatsapp',
  }] }).mockResolvedValue({ rows: [] });
  await expect(new EmbeddingService('key', { query } as unknown as Pool, '').processMessage('1'))
    .rejects.toThrow('expected 2');
  expect(query.mock.calls.some(([sql]) => String(sql).includes('INSERT'))).toBe(false);
});

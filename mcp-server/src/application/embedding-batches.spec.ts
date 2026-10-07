import { Pool } from 'pg';
import { EmbeddingService, MessageChunk } from './embedding.service';
import { LlamaEmbeddingService } from './llama-embedding.service';
import { LlamaService } from './llama.service';

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
const vector = [0.1, 0.2];
const makeChunks = (count: number): MessageChunk[] =>
  Array.from({ length: count }, (_, index) => ({
    messageId: String(index),
    chunkIndex: index,
    content: `text ${index}`,
  }));

afterEach(() => {
  process.env = { ...originalEnv };
  jest.restoreAllMocks();
  jest.clearAllMocks();
  create.mockReset();
});

function providers() {
  process.env.EMBEDDING_MODEL = 'configured-openai';
  process.env.EMBEDDING_DIMENSIONS = '2';
  const query = jest.fn().mockResolvedValue({ rows: [] });
  const generateEmbedding = jest.fn().mockResolvedValue(vector);
  create.mockImplementation(async ({ input }: { input: string[] }) => ({
    data: input.map(() => ({ embedding: vector })),
  }));
  const db = { query } as unknown as Pool;
  return {
    openai: new EmbeddingService('key', db, ''),
    llama: new LlamaEmbeddingService(
      { generateEmbedding } as unknown as LlamaService,
      db,
      '',
      'configured-llama'
    ),
    query,
    generateEmbedding,
  };
}

test.each(['openai', 'llama'] as const)(
  '%s preserves batch size, order and pauses only between batches',
  async provider => {
    const services = providers();
    const chunks = makeChunks(provider === 'openai' ? 101 : 11);
    const timeout = jest.spyOn(global, 'setTimeout');
    expect(await services[provider].generateEmbeddings(chunks)).toEqual(
      chunks.map(chunk => ({ ...chunk, embedding: vector }))
    );
    expect(timeout).toHaveBeenCalledTimes(1);
    expect(timeout.mock.calls[0][1]).toBe(100);
    if (provider === 'openai') {
      expect(create.mock.calls.map(([request]) => request.input.length)).toEqual([100, 1]);
      expect(create.mock.calls[0][0]).toMatchObject({
        model: 'configured-openai',
        encoding_format: 'float',
      });
    } else {
      expect(services.generateEmbedding.mock.calls.map(([content]) => content)).toEqual(
        chunks.map(chunk => chunk.content)
      );
    }
  }
);

test('OpenAI rejects a provider failure while Llama continues after a failed chunk', async () => {
  const services = providers();
  const failure = new Error('provider unavailable');
  create.mockRejectedValueOnce(failure);
  await expect(services.openai.generateEmbeddings(makeChunks(2))).rejects.toBe(failure);
  services.generateEmbedding.mockRejectedValueOnce(failure);
  const chunks = makeChunks(2);
  expect(await services.llama.generateEmbeddings(chunks)).toEqual([
    { ...chunks[1], embedding: vector },
  ]);
});

test.each(['openai', 'llama'] as const)(
  '%s skips absent vectors and continues inserts using its model and SQL',
  async provider => {
    const services = providers();
    services.query.mockRejectedValueOnce(new Error('insert unavailable'));
    const chunks = makeChunks(3);
    await services[provider].storeEmbeddings([
      chunks[0],
      ...chunks.slice(1).map(chunk => ({ ...chunk, embedding: vector })),
    ]);
    expect(services.query).toHaveBeenCalledTimes(2);
    const expectedModel = provider === 'openai' ? 'configured-openai' : 'configured-llama';
    expect(services.query.mock.calls.map(([, parameters]) => parameters)).toEqual(
      chunks
        .slice(1)
        .map(chunk => [
          chunk.messageId,
          '[0.1,0.2]',
          expectedModel,
          ...(provider === 'llama' ? [chunk.chunkIndex] : []),
        ])
    );
    expect(services.query.mock.calls[0][0].includes('gen_random_uuid()')).toBe(
      provider === 'llama'
    );
  }
);

test('empty batches do not call either provider or schedule a pause', async () => {
  const services = providers();
  const timeout = jest.spyOn(global, 'setTimeout');
  expect(await services.openai.generateEmbeddings([])).toEqual([]);
  expect(await services.llama.generateEmbeddings([])).toEqual([]);
  expect(create).not.toHaveBeenCalled();
  expect(services.generateEmbedding).not.toHaveBeenCalled();
  expect(timeout).not.toHaveBeenCalled();
});

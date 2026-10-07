import type { Logger } from 'pino';

export interface MessageChunk {
  messageId: string;
  chunkIndex: number;
  content: string;
  embedding?: number[];
}

/** Processes provider-sized batches sequentially, pausing only between batches. */
export async function generateEmbeddingBatches(
  chunks: MessageChunk[],
  batchSize: number,
  generateBatch: (batch: MessageChunk[]) => Promise<MessageChunk[]>,
  logger: Pick<Logger, 'error'>
): Promise<MessageChunk[]> {
  try {
    const results: MessageChunk[] = [];
    for (let offset = 0; offset < chunks.length; offset += batchSize) {
      results.push(...(await generateBatch(chunks.slice(offset, offset + batchSize))));
      if (offset + batchSize < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    return results;
  } catch (error) {
    logger.error(`Error generating embeddings: ${error}`);
    throw error;
  }
}

/** Skips absent vectors and preserves best-effort persistence after a failed insert. */
export async function storeEmbeddingChunks(
  chunks: MessageChunk[],
  persist: (chunk: MessageChunk, vector: string) => Promise<unknown>,
  logger: Pick<Logger, 'error'>
): Promise<void> {
  for (const chunk of chunks) {
    if (!chunk.embedding) continue;
    try {
      await persist(chunk, `[${chunk.embedding.join(',')}]`);
    } catch (error) {
      logger.error(`Error storing embedding for message ${chunk.messageId}: ${error}`);
    }
  }
}

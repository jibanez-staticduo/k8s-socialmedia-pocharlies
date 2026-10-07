import OpenAI from 'openai';
import { Pool } from 'pg';
import pino from 'pino';
import { isWhatsAppUpdate } from '../domain/whatsapp-surface';
import { embeddingConfig } from './embedding-config';

import { generateEmbeddingBatches, storeEmbeddingChunks, MessageChunk } from './embedding-batches';
export type { MessageChunk } from './embedding-batches';

export class EmbeddingService {
  private openai: OpenAI;
  private dbClient: Pool;
  private logger: pino.Logger;
  private readonly EMBEDDING_MODEL: string;
  private readonly EMBEDDING_DIMENSION: number;

  constructor(openaiApiKey: string, dbClient: Pool, _encryptionKey: string) {
    const baseURL = process.env.EMBEDDING_BASE_URL || undefined;
    const config = embeddingConfig();
    this.EMBEDDING_MODEL = config.model;
    this.EMBEDDING_DIMENSION = config.dimensions;
    this.openai = new OpenAI({
      apiKey: openaiApiKey || 'not-needed',
      baseURL,
    });
    this.dbClient = dbClient;
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    });
    this.logger.info(
      `EmbeddingService: model=${this.EMBEDDING_MODEL} dim=${this.EMBEDDING_DIMENSION} baseURL=${baseURL || 'openai-default'}`
    );
  }

  /**
   * Chunks a message based on its length
   */
  chunkMessage(messageId: string, content: string | null): MessageChunk[] {
    if (!content) {
      return [];
    }

    const chunks: MessageChunk[] = [];

    if (content.length < 500) {
      chunks.push({
        messageId,
        chunkIndex: 0,
        content,
      });
      return chunks;
    }

    if (content.length >= 500 && content.length <= 2000) {
      const sentences = content.split(/(?<=[.!?])\s+/);
      let currentChunk = '';
      let chunkIndex = 0;

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > 500 && currentChunk) {
          chunks.push({
            messageId,
            chunkIndex,
            content: currentChunk.trim(),
          });
          currentChunk = sentence;
          chunkIndex++;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }

      if (currentChunk) {
        chunks.push({
          messageId,
          chunkIndex,
          content: currentChunk.trim(),
        });
      }

      return chunks;
    }

    const paragraphs = content.split(/\n\n+/);
    let currentChunk = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > 1000 && currentChunk) {
        chunks.push({
          messageId,
          chunkIndex,
          content: currentChunk.trim(),
        });
        currentChunk = paragraph;
        chunkIndex++;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    if (currentChunk) {
      chunks.push({
        messageId,
        chunkIndex,
        content: currentChunk.trim(),
      });
    }

    return chunks;
  }

  /**
   * Generates embeddings for message chunks
   */
  async generateEmbeddings(chunks: MessageChunk[]): Promise<MessageChunk[]> {
    return generateEmbeddingBatches(
      chunks,
      100,
      async batch => {
        const response = await this.openai.embeddings.create({
          model: this.EMBEDDING_MODEL,
          input: batch.map(chunk => chunk.content),
          encoding_format: 'float',
        });
        return batch.map((chunk, index) => {
          const embedding = response.data[index]?.embedding;
          if (!embedding || embedding.length !== this.EMBEDDING_DIMENSION) {
            throw new Error(
              `Embedding has ${embedding?.length ?? 0} dimensions; expected ${this.EMBEDDING_DIMENSION} for ${this.EMBEDDING_MODEL}`
            );
          }
          return { ...chunk, embedding };
        });
      },
      this.logger
    );
  }

  /**
   * Stores embeddings in the database
   * The configured vector width must match the database column.
   */
  async storeEmbeddings(chunks: MessageChunk[]): Promise<void> {
    await storeEmbeddingChunks(
      chunks,
      (chunk, vector) =>
        this.dbClient.query(
          `INSERT INTO message_embeddings (message_id, embedding, model, created_at)
       VALUES ($1, $2::vector, $3, NOW())
       ON CONFLICT DO NOTHING`,
          [chunk.messageId, vector, this.EMBEDDING_MODEL]
        ),
      this.logger
    );
  }

  /**
   * Processes a message: read plaintext content, chunk, generate embeddings, store
   */
  async processMessage(messageId: string): Promise<void> {
    try {
      const result = await this.dbClient.query(
        `SELECT id, content, conversation_id, platform FROM messages WHERE id = $1`,
        [messageId]
      );

      if (result.rows.length === 0) {
        this.logger.warn(`Message ${messageId} not found`);
        return;
      }

      const row = result.rows[0];
      if (row.platform === 'whatsapp' && isWhatsAppUpdate(row.conversation_id)) return;
      const content = row.content;

      if (!content) {
        this.logger.debug(`Message ${messageId} has no content to embed`);
        return;
      }

      // No decryption needed - content is stored as plaintext

      // Check if embedding already exists
      const existing = await this.dbClient.query(
        `SELECT id FROM message_embeddings WHERE message_id = $1 LIMIT 1`,
        [messageId]
      );

      if (existing.rows.length > 0) {
        this.logger.debug(`Embedding already exists for message ${messageId}`);
        return;
      }

      // Chunk message
      const chunks = this.chunkMessage(messageId, content);

      if (chunks.length === 0) {
        return;
      }

      // Generate embeddings
      const chunksWithEmbeddings = await this.generateEmbeddings(chunks);

      // Store embeddings
      await this.storeEmbeddings(chunksWithEmbeddings);

      this.logger.debug(`Processed embeddings for message ${messageId}`);
    } catch (error) {
      this.logger.error(`Error processing message ${messageId}: ${error}`);
      throw error;
    }
  }
}

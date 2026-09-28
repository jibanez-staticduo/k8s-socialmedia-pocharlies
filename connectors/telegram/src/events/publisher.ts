import { connect, NatsConnection, StringCodec, ConnectionOptions } from 'nats';
import pino from 'pino';

export interface TelegramMessageReceivedEvent {
  eventType: 'TelegramMessageReceived';
  // Which Telegram account (connector instance) emitted this event, from
  // CONNECTOR_ACCOUNT ('personal' | 'professional'). Both connectors publish to
  // the SAME subject `telegram.MessageReceived`, so consumers that must attribute
  // an account (e.g. the session-less telegram-sync) filter on this field.
  // Backward-compatible: existing consumers ignore it.
  account: string;
  conversationId: string;
  telegramMessageId: string;
  telegramTimestamp: string;
  senderTelegramId: string;
  senderUsername?: string;
  senderFirstName?: string;
  content: string;
  messageType: string;
  attachments?: Array<{
    type: string;
    fileId: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
  }>;
  isForwarded: boolean;
  replyToMessageId?: string;
  topicId?: string;
  isOutbound: boolean;
  chatType: string;
  chatTitle?: string;
}

export interface TelegramChatUpdatedEvent {
  eventType: 'TelegramChatUpdated';
  telegramChatId: string;
  updateType: 'NAME_CHANGED' | 'MEMBER_JOINED' | 'MEMBER_LEFT';
  metadata: Record<string, unknown>;
}

export class TelegramEventPublisher {
  private nc: NatsConnection | null = null;
  private natsUrl: string;
  private caCertPath?: string;
  private sc = StringCodec();
  private logger: pino.Logger;
  // INFRA-291 (P4): reconnect loop mirroring the whatsapp-web publisher
  // (connectors/whatsapp-web/src/events/publisher.ts). Before this, a failed
  // initial connect() re-threw and main.ts died with it — a pod starting while
  // NATS was down CrashLooped instead of re-attaching. Now connect() never
  // throws: it logs, marks itself disconnected and retries with backoff.
  private connected = false;
  private connecting = false;
  private stopped = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly reconnectBaseMs = parseInt(process.env.NATS_RECONNECT_BASE_MS || '2000', 10);
  private readonly reconnectMaxMs = parseInt(process.env.NATS_RECONNECT_MAX_MS || '30000', 10);

  constructor(natsUrl: string, caCertPath?: string, logger?: pino.Logger) {
    this.natsUrl = natsUrl;
    this.caCertPath = caCertPath;
    this.logger =
      logger ??
      pino({
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      });
  }

  /**
   * Connect to NATS server. Never throws: a failed attempt logs a warning and
   * schedules a backoff retry, so the connector keeps running while NATS is
   * unreachable and attaches as soon as it comes back.
   */
  async connect(): Promise<void> {
    if (this.connecting || this.connected) return;
    this.connecting = true;
    this.stopped = false;
    try {
      const options: ConnectionOptions = {
        servers: this.natsUrl,
        maxReconnectAttempts: -1,
        reconnectTimeWait: this.reconnectBaseMs,
        timeout: 2000,
      };

      if (this.caCertPath && this.natsUrl.startsWith('tls://')) {
        options.tls = {
          caFile: this.caCertPath,
        };
      }

      this.nc = await connect(options);
      this.connected = true;
      this.reconnectAttempts = 0;
      this.logger.info(`Connected to NATS at ${this.natsUrl}`);
      void this.watchClosed(this.nc);
    } catch (error) {
      this.logger.warn(`NATS unavailable, running without event publishing: ${String(error)}`);
      this.connected = false;
      // Clear the in-flight guard BEFORE scheduling: scheduleReconnect()
      // no-ops while `connecting` is true and `finally` runs only after this
      // catch — leaving the guard set here would silently cancel the retry
      // (the exact regression fixed in whatsapp-web on 2026-07-02).
      this.connecting = false;
      this.scheduleReconnect();
    } finally {
      this.connecting = false;
    }
  }

  /**
   * Real NATS state, for the connector's health/readiness surface
   * (INFRA-291 criterion B).
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Publish a message received event. No-ops with a warning while NATS is
   * down: dropping the event must be visible in logs but never crash the
   * message handler in main.ts.
   */
  publishMessageReceived(event: TelegramMessageReceivedEvent): void {
    if (!this.nc || !this.connected) {
      this.logger.warn('NATS not connected, skipping message event');
      return;
    }

    try {
      const subject = 'telegram.MessageReceived';
      this.nc.publish(subject, this.sc.encode(JSON.stringify(event)));
      this.logger.debug(`Published event to ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to publish message: ${String(error)}`);
      this.markDisconnected();
    }
  }

  /**
   * Publish a chat updated event (same no-op-while-down contract as above).
   */
  publishChatUpdated(event: TelegramChatUpdatedEvent): void {
    if (!this.nc || !this.connected) {
      this.logger.warn('NATS not connected, skipping chat update event');
      return;
    }

    try {
      const subject = 'telegram.ChatUpdated';
      this.nc.publish(subject, this.sc.encode(JSON.stringify(event)));
      this.logger.debug(`Published event to ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to publish chat update: ${String(error)}`);
      this.markDisconnected();
    }
  }

  /**
   * Stop reconnecting and close the connection.
   */
  async disconnect(): Promise<void> {
    this.stopped = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.nc) {
      await this.nc.close();
      this.nc = null;
      this.logger.info('Disconnected from NATS');
    }
    this.connected = false;
  }

  private markDisconnected(): void {
    if (!this.connected && this.reconnectTimer) return;
    this.connected = false;
    this.nc = null;
    this.scheduleReconnect();
  }

  private async watchClosed(nc: NatsConnection): Promise<void> {
    const err = await nc.closed();
    if (this.nc !== nc) return;
    this.connected = false;
    this.nc = null;
    if (err) {
      this.logger.warn(`NATS connection closed: ${String(err)}`);
    } else {
      this.logger.info('NATS connection closed');
    }
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.stopped || this.reconnectTimer || this.connecting) return;
    const delayMs = Math.min(
      this.reconnectMaxMs,
      this.reconnectBaseMs * Math.max(1, 2 ** this.reconnectAttempts)
    );
    this.reconnectAttempts += 1;
    this.logger.warn(`Scheduling NATS reconnect in ${delayMs}ms`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.connect();
    }, delayMs);
    (this.reconnectTimer as unknown as { unref?: () => void }).unref?.();
  }
}

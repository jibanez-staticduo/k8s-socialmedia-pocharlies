import { normalizeNovedadesAuthor, readableAuthor } from './novedades-ui.mjs';

const DEFAULT_POLL_MS = 30000;

export function createStatusNotificationMonitor({
  loadAuthors,
  onStatus,
  documentRef = document,
  getAccount,
  permission,
  setIntervalRef = setInterval,
  clearIntervalRef = clearInterval,
  pollMs = DEFAULT_POLL_MS,
} = {}) {
  let account = '';
  let generation = 0;
  let pendingGeneration = -1;
  let baseline = null;
  let timer = null;

  async function check() {
    const currentGeneration = generation;
    const currentAccount = account;
    if (!currentAccount || pendingGeneration === currentGeneration || getAccount() !== currentAccount) return;
    pendingGeneration = currentGeneration;
    try {
      const response = await loadAuthors(currentAccount);
      if (generation !== currentGeneration || getAccount() !== currentAccount ||
        response?.account !== currentAccount || !Array.isArray(response.authors)) return;
      const next = new Map();
      for (const raw of response.authors) {
        const author = normalizeNovedadesAuthor(raw);
        if (!author || !author.latestTimestamp) continue;
        const previous = next.get(author.id);
        if (!previous || previous.latest < author.latestTimestamp.getTime()) {
          next.set(author.id, { latest: author.latestTimestamp.getTime(), unseen: author.unseen, own: author.own, name: readableAuthor(author.id, author.name) });
        }
      }
      if (baseline && documentRef.hidden && permission() === 'granted') {
        for (const [id, status] of next) {
          if (status.own || status.unseen <= 0) continue;
          const previous = baseline.get(id);
          if (previous && status.latest <= previous.latest) continue;
          try { onStatus({ account: currentAccount, author: id, name: status.name, latest: status.latest }); }
          catch { /* Notification delivery must not interrupt the baseline. */ }
        }
      }
      baseline = next;
    } catch { /* A failed read preserves the last confirmed baseline. */ }
    finally { if (pendingGeneration === currentGeneration) pendingGeneration = -1; }
  }

  function stop() {
    generation += 1;
    account = '';
    baseline = null;
    if (timer) clearIntervalRef(timer);
    timer = null;
  }

  function start(nextAccount) {
    stop();
    account = String(nextAccount || '');
    if (!account) return;
    void check();
    timer = setIntervalRef(() => { void check(); }, pollMs);
    timer?.unref?.();
  }

  const visibilityChanged = () => { if (account) void check(); };
  documentRef.addEventListener('visibilitychange', visibilityChanged);
  return { start, check, stop, destroy() { stop(); documentRef.removeEventListener('visibilitychange', visibilityChanged); } };
}

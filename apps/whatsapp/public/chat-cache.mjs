export function purgeLegacyChatCache(storage) {
  try {
    for (let index = storage.length - 1; index >= 0; index--) {
      const key = storage.key(index);
      if (key?.startsWith('wa-chats-cache-v1:')) storage.removeItem(key);
    }
  } catch { /* Storage can be unavailable in private browsing. */ }
}

// Previews only live in the current document; a later login cannot restore them.
export function createChatCache(storage, documentRef) {
  purgeLegacyChatCache(storage);
  const cache = new Map();
  documentRef.addEventListener('socialmedia:logout', () => cache.clear());
  return cache;
}

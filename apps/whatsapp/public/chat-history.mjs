export function pinnedFirst(chats) {
  return chats.filter(chat => chat.pinned === true || chat.isPinned === true)
    .concat(chats.filter(chat => chat.pinned !== true && chat.isPinned !== true));
}

function messageTime(message) {
  const value = message.timestamp;
  if (typeof value === 'number') return value < 1e12 ? value * 1000 : value;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function compareMessages(left, right) {
  return messageTime(left) - messageTime(right) || String(left.id).localeCompare(String(right.id));
}

export function mergeMessages(existing, incoming) {
  const byId = new Map();
  for (const message of existing.concat(incoming)) {
    if (message?.id != null) byId.set(String(message.id), message);
  }
  return [...byId.values()].sort(compareMessages);
}

export function mergeRecentMessages(existing, incoming) {
  if (!incoming.length) return [];
  const oldestRecent = incoming[0];
  return mergeMessages(existing.filter(message => compareMessages(message, oldestRecent) < 0), incoming);
}

export function shouldSubmitMessageKey(event, enterToSend, coarsePointer) {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return false;
  if (event.ctrlKey || event.metaKey) return true;
  return enterToSend && !coarsePointer;
}

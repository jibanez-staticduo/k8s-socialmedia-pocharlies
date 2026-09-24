const string = (value, max = 4096) => typeof value === 'string' ? value.slice(0, max) : null;
const number = value => typeof value === 'number' && Number.isFinite(value) ? value : null;

export function publicMessageMetadata(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const kind = string(source.kind, 32);
  if (kind === 'poll') return {
    kind,
    options: Array.isArray(source.options) ? source.options.slice(0, 100).map(item => string(item, 500)).filter(Boolean) : [],
    selectableCount: number(source.selectableCount),
  };
  if (kind === 'event') {
    const location = source.location && typeof source.location === 'object' && !Array.isArray(source.location) ? source.location : {};
    return { kind, description: string(source.description), startTime: number(source.startTime), endTime: number(source.endTime),
      location: { name: string(location.name, 500), degreesLatitude: number(location.degreesLatitude), degreesLongitude: number(location.degreesLongitude) },
      isCancelled: source.isCancelled === true };
  }
  if (kind === 'contact') return { kind, contacts: Array.isArray(source.contacts) ? source.contacts.slice(0, 100).map(contact => ({
    displayName: string(contact?.displayName, 500), phone: string(contact?.phone, 100), email: string(contact?.email, 500), organization: string(contact?.organization, 500),
  })) : [] };
  if (kind === 'reaction') return { kind, emoji: string(source.emoji, 32), targetMessageId: string(source.targetMessageId, 512) };
  if (kind === 'poll_vote' || kind === 'poll_result') return { kind, ...(kind === 'poll_vote' ? { pollMessageId: string(source.pollMessageId, 512) } : {}) };
  if (kind === 'sticker') return { kind, isAnimated: source.isAnimated === true };
  return {};
}

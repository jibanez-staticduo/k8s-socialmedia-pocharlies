export const SETTINGS_KEYS = Object.freeze({
  spellcheck: 'wa-spellcheck',
  emojiReplacement: 'wa-emoji-replacement',
  enterToSend: 'wa-enter-to-send',
  wallpaper: 'wa-chat-wallpaper',
});

const WALLPAPERS = new Set(['default', 'sand', 'sage', 'slate']);
const EMOJI_SHORTCUTS = [
  [":'(", '😢'], [':-)', '🙂'], [':)', '🙂'], [':-D', '😄'], [':D', '😄'],
  [';-)', '😉'], [';)', '😉'], [':-(', '🙁'], [':(', '🙁'],
  [':-P', '😛'], [':P', '😛'], [':-O', '😮'], [':O', '😮'], ['<3', '❤️'],
];

export function emojiShortcutAtCaret(value, caret) {
  if (typeof value !== 'string' || !Number.isInteger(caret) || caret < 0 || caret > value.length) return null;
  const before = value.slice(0, caret);
  if (/^[\p{L}\p{N}_]/u.test(value.slice(caret))) return null;
  for (const [shortcut, emoji] of EMOJI_SHORTCUTS) {
    if (!before.toLowerCase().endsWith(shortcut.toLowerCase())) continue;
    const start = caret - shortcut.length;
    if (start > 0 && !/[\s([{]/u.test(value[start - 1])) continue;
    return { start, end: caret, emoji };
  }
  return null;
}

export function readSettings(storage) {
  const read = key => { try { return storage?.getItem(key); } catch { return null; } };
  const wallpaper = read(SETTINGS_KEYS.wallpaper);
  return {
    spellcheck: read(SETTINGS_KEYS.spellcheck) !== 'false',
    emojiReplacement: read(SETTINGS_KEYS.emojiReplacement) !== 'false',
    enterToSend: read(SETTINGS_KEYS.enterToSend) !== 'false',
    wallpaper: WALLPAPERS.has(wallpaper) ? wallpaper : 'default',
  };
}

export function initializeSettings(documentRef = document, storage = globalThis.localStorage, fetchImpl = globalThis.fetch) {
  const details = documentRef.querySelector('.rail-settings');
  const panel = documentRef.getElementById('settings-panel');
  const summary = details?.querySelector('summary');
  const composer = documentRef.getElementById('message');
  if (!details || !panel || !summary || !composer) return;

  const spellcheck = documentRef.getElementById('settings-spellcheck');
  const emojiReplacement = documentRef.getElementById('settings-emoji-replacement');
  const enterToSend = documentRef.getElementById('settings-enter-send');
  const logout = documentRef.getElementById('settings-logout');
  const logoutError = documentRef.getElementById('settings-logout-error');
  const wallpaperOptions = [...documentRef.querySelectorAll('input[name="wallpaper"]')];
  const persist = (key, value) => { try { storage?.setItem(key, value); } catch {} };
  const settings = readSettings(storage);

  spellcheck.checked = settings.spellcheck;
  composer.spellcheck = settings.spellcheck;
  emojiReplacement.checked = settings.emojiReplacement;
  enterToSend.checked = settings.enterToSend;
  documentRef.body.dataset.wallpaper = settings.wallpaper;
  wallpaperOptions.find(option => option.value === settings.wallpaper).checked = true;

  spellcheck.addEventListener('change', () => {
    composer.spellcheck = spellcheck.checked;
    persist(SETTINGS_KEYS.spellcheck, String(spellcheck.checked));
  });
  emojiReplacement.addEventListener('change', () => {
    persist(SETTINGS_KEYS.emojiReplacement, String(emojiReplacement.checked));
  });
  composer.addEventListener('input', event => {
    if (!emojiReplacement.checked || event.isComposing || event.inputType !== 'insertText') return;
    if (composer.selectionStart !== composer.selectionEnd) return;
    const replacement = emojiShortcutAtCaret(composer.value, composer.selectionStart);
    if (!replacement) return;
    composer.setRangeText(replacement.emoji, replacement.start, replacement.end, 'end');
    composer.dispatchEvent(new Event('input', { bubbles: true }));
  });
  enterToSend.addEventListener('change', () => {
    persist(SETTINGS_KEYS.enterToSend, String(enterToSend.checked));
    documentRef.dispatchEvent(new CustomEvent('wa:enter-to-send-change', { detail: { enabled: enterToSend.checked } }));
  });
  for (const option of wallpaperOptions) option.addEventListener('change', () => {
    if (!option.checked || !WALLPAPERS.has(option.value)) return;
    documentRef.body.dataset.wallpaper = option.value;
    persist(SETTINGS_KEYS.wallpaper, option.value);
  });

  const close = (restoreFocus = false) => {
    details.open = false;
    if (restoreFocus) summary.focus();
  };
  documentRef.getElementById('settings-close')?.addEventListener('click', () => close(true));
  details.addEventListener('toggle', () => {
    summary.setAttribute('aria-expanded', String(details.open));
    if (details.open) documentRef.getElementById('settings-close')?.focus();
  });
  documentRef.addEventListener('pointerdown', event => {
    if (details.open && !details.contains(event.target)) close();
  });
  documentRef.addEventListener('keydown', event => {
    if (!details.open || event.key !== 'Escape' || event.defaultPrevented) return;
    event.preventDefault();
    close(true);
  });

  logout.addEventListener('click', async () => {
    if (logout.disabled) return;
    logout.disabled = true;
    logoutError.hidden = true;
    try {
      const response = await fetchImpl('/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) throw new Error(`No se pudo cerrar la sesión (${response.status}).`);
      try { globalThis.sessionStorage?.removeItem('wa-unconfirmed-outbox-v1'); } catch {}
      globalThis.location.assign('/auth/login');
    } catch (error) {
      logoutError.textContent = error.message || 'No se pudo cerrar la sesión.';
      logoutError.hidden = false;
      logout.disabled = false;
    }
  });
}

if (typeof document !== 'undefined') initializeSettings();

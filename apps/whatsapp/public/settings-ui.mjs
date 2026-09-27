export const SETTINGS_KEYS = Object.freeze({
  spellcheck: 'wa-spellcheck',
  enterToSend: 'wa-enter-to-send',
  wallpaper: 'wa-chat-wallpaper',
});

const WALLPAPERS = new Set(['default', 'sand', 'sage', 'slate']);

export function readSettings(storage) {
  const read = key => { try { return storage?.getItem(key); } catch { return null; } };
  const wallpaper = read(SETTINGS_KEYS.wallpaper);
  return {
    spellcheck: read(SETTINGS_KEYS.spellcheck) !== 'false',
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
  const enterToSend = documentRef.getElementById('settings-enter-send');
  const logout = documentRef.getElementById('settings-logout');
  const logoutError = documentRef.getElementById('settings-logout-error');
  const wallpaperOptions = [...documentRef.querySelectorAll('input[name="wallpaper"]')];
  const persist = (key, value) => { try { storage?.setItem(key, value); } catch {} };
  const settings = readSettings(storage);

  spellcheck.checked = settings.spellcheck;
  composer.spellcheck = settings.spellcheck;
  enterToSend.checked = settings.enterToSend;
  documentRef.body.dataset.wallpaper = settings.wallpaper;
  wallpaperOptions.find(option => option.value === settings.wallpaper).checked = true;

  spellcheck.addEventListener('change', () => {
    composer.spellcheck = spellcheck.checked;
    persist(SETTINGS_KEYS.spellcheck, String(spellcheck.checked));
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

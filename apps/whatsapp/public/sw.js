'use strict';
const CACHE = 'wa-static-v2';
// Only shipped public assets belong here; extension matching can cache private URLs.
const STATIC = new Set([
  '/account-rail.mjs',
  '/agent-stream.mjs',
  '/app.js',
  '/apple-touch-icon.png',
  '/assistant-ui.generated.css',
  '/assistant-ui.generated.js',
  '/chat-cache.mjs',
  '/chat-directory.mjs',
  '/chat-export.mjs',
  '/chat-history.mjs',
  '/chat-selection.css',
  '/chat-selection.mjs',
  '/chat-wallpaper.svg',
  '/communities-ui.css',
  '/communities-ui.mjs',
  '/composer-attachment.mjs',
  '/composer-media.css',
  '/composer-media.mjs',
  '/contact-directory-ui.css',
  '/contact-directory-ui.mjs',
  '/draft-suggest.mjs',
  '/emoji-picker.mjs',
  '/emoji/catalog-es.json',
  '/event-composer.mjs',
  '/event-draft.mjs',
  '/event-ui.mjs',
  '/favicon.ico',
  '/features-parity.css',
  '/features-ui.mjs',
  '/fonts/roboto-latin-wght-normal.woff2',
  '/history-recovery.mjs',
  '/icon-192.png',
  '/icon-512.png',
  '/icon.svg',
  '/live-updates.mjs',
  '/manifest.webmanifest',
  '/media-library-ui.css',
  '/media-library-ui.mjs',
  '/media-viewer-zoom.mjs',
  '/message-date.mjs',
  '/message-render.mjs',
  '/mobile-gestures.mjs',
  '/mobile-viewport.mjs',
  '/mobile.css',
  '/notification-settings.mjs',
  '/novedades-ui.css',
  '/novedades-ui.mjs',
  '/photo-editor.mjs',
  '/pinned-ui.mjs',
  '/poll-composer.mjs',
  '/poll-draft.mjs',
  '/profile-ui.css',
  '/profile-ui.mjs',
  '/settings-ui.css',
  '/settings-ui.mjs',
  '/sidebar-search.mjs',
  '/status-notifications.mjs',
  '/styles.css',
  '/text-initials.mjs',
  '/upload-quality-ui.mjs',
]);

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(names => Promise.all(names.filter(name => name.startsWith('wa-static-') && name !== CACHE).map(name => caches.delete(name))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || event.request.mode === 'navigate' ||
      url.origin !== self.location.origin || /^\/(?:api|auth)(?:\/|$)/.test(url.pathname) ||
      !STATIC.has(url.pathname)) return;
  const cache = caches.open(CACHE);
  const hit = cache.then(store => store.match(event.request));
  const fresh = cache.then(async store => {
    const response = await fetch(event.request, {cache: 'no-cache'});
    if (response.ok && !response.redirected && response.type !== 'opaque' &&
        !/text\/html/i.test(response.headers.get('content-type') || '')) {
      try { await store.put(event.request, response.clone()); } catch { /* Storage quota must not break online assets. */ }
    }
    return response;
  });
  // Attach while dispatching, and keep the worker alive through cache.put.
  event.waitUntil(fresh.catch(() => {}));
  const fallback = () => hit.then(response => response || Response.error());
  // Unhashed code must follow the fresh HTML on each load. No forced reload: drafts survive.
  const code = /\.(?:js|mjs|css|webmanifest|json)$/.test(url.pathname);
  event.respondWith(code ? fresh.catch(fallback) : hit.then(response => response || fresh.catch(fallback)));
});

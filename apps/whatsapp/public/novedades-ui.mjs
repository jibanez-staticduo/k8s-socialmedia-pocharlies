/**
 * Novedades (Estados + Canales) read-only viewer.
 *
 * Two catalogs (Estados, Canales) share one side panel: a list on the left
 * and a contextual viewer or empty state on the right; below 720px the
 * panel collapses into a single view with a back button. Every read comes
 * from the injected loaders (the /api/novedades proxy), so this module
 * never writes anything back: opening a status never sends a read receipt
 * and there are no publish placeholders while the mutation API is absent.
 *
 * The data contract is the proxied DTO as defined in lib/novedades-proxy.mjs:
 * authors carry {id, name, own, count, unseen, latestTimestamp}, status and
 * post items carry {id, kind, text, timestamp, remainingMs, mediaUrl}, and
 * channels carry {id, name, subscribers, avatarUrl}. Statuses are listed per
 * author: the API requires an explicit author, so the UI renders author
 * summaries first and only fetches that author's statuses when the queue is
 * opened — no N+1 fan-out and no bulk download. Expiry uses remainingMs
 * measured against a monotonic clock captured at receipt, so a skewed client
 * wall clock cannot keep dead statuses on screen or expire live ones early.
 *
 * Identity rules inherited from the directory: `@lid` is a privacy id, not a
 * phone. A missing name falls back to a readable number or "ID privado",
 * never to an invented name. Media URLs are accepted only when they are
 * same-origin authenticated paths under /api/novedades/ for the same
 * account; provider URLs and raw keys never render.
 */

export const NOVEDADES_MEDIA_PREFIX = '/api/novedades/'
const RENDERABLE_KINDS = new Set(['text', 'image', 'video'])
const TTL_TICK_MS = 1000

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

const moduleClock = () => (globalThis.performance?.now ? globalThis.performance.now() : Date.now())

/** Same-origin authenticated proxy under /api/novedades/ for this account only. */
export function novedadesMediaUrl(value, account, baseUrl = 'http://localhost/') {
  const candidate = text(value)
  if (!candidate) return ''
  try {
    const url = new URL(candidate, baseUrl)
    if (url.origin !== new URL(baseUrl, 'http://localhost/').origin) return ''
    if (!url.pathname.startsWith(NOVEDADES_MEDIA_PREFIX)) return ''
    if (url.searchParams.get('account') !== text(account)) return ''
    return `${url.pathname}${url.search}`
  } catch {
    return ''
  }
}

export function novedadesDate(value) {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(typeof value === 'number' && Number.isFinite(value) && Math.abs(value) < 1e12 ? value * (Math.abs(value) < 1e11 ? 1000 : 1) : value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * A name is only shown when the provider stored one. Otherwise the identity
 * itself says what it is: a real number, a private id, or the raw address.
 */
export function readableAuthor(authorJid, storedName = '') {
  const name = text(storedName)
  if (name) return name
  const jid = text(authorJid)
  const [user = '', realm = ''] = jid.split('@')
  const digits = (user.split(':')[0] || '').replace(/\D/g, '')
  if ((realm === 'c.us' || realm === 's.whatsapp.net') && /^[0-9]{6,15}$/.test(digits)) return `+${digits}`
  if (realm === 'lid' && digits) return `ID privado ···${digits.slice(-3)}`
  return user || jid || 'Desconocido'
}

/**
 * Remaining lifetime in milliseconds. While the item is on screen the clock
 * is monotonic (elapsed time since receipt), never the client wall clock, so
 * a fast or drifting clock cannot resurrect expired rows or kill live ones.
 * The wall-clock fallback only applies when the proxy sent no remainingMs.
 */
export function statusRemainingMs(status, nowMonotonic, wallNow = Date.now()) {
  if (!status) return null
  if (typeof status.remainingMs === 'number' && status.ttlBase !== null) return status.remainingMs - (nowMonotonic - status.ttlBase)
  if (status.expiresAt) return status.expiresAt.getTime() - wallNow
  return null
}

/** Deleted, deactivated, unknown-freshness and expired rows never appear. */
export function statusIsVisible(status, nowMonotonic = moduleClock(), wallNow = Date.now()) {
  if (!status || status.deleted === true || status.freshnessUnknown === true || status.active !== true) return false
  const remaining = statusRemainingMs(status, nowMonotonic, wallNow)
  return remaining !== null && remaining > 0
}

/** Newest first; the viewer and section ordering share this queue order. */
export function visibleStatusQueue(statuses, nowMonotonic = moduleClock()) {
  const queue = []
  const seen = new Set()
  for (const status of statuses || []) {
    if (!status || seen.has(status.id) || !statusIsVisible(status, nowMonotonic)) continue
    seen.add(status.id)
    queue.push(status)
  }
  return queue.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
}

/** Windows grouping over the author summary: own · unseen · already seen. */
export function groupAuthors(authors) {
  const own = []
  const recent = []
  const viewed = []
  for (const author of authors || []) {
    if (!author) continue
    if (author.own) own.push(author)
    else if (author.unseen > 0) recent.push(author)
    else viewed.push(author)
  }
  const newestFirst = (a, b) => (b.latestTimestamp?.getTime() || 0) - (a.latestTimestamp?.getTime() || 0)
  return [
    { kind: 'own', title: 'Mis estados', items: own.sort(newestFirst) },
    { kind: 'recent', title: 'Actualizaciones recientes', items: recent.sort(newestFirst) },
    { kind: 'viewed', title: 'Vistos', items: viewed.sort(newestFirst) },
  ].filter(section => section.items.length)
}

/** The channels endpoint has no search parameter: filtering is local. */
export function filterChannels(channels, query) {
  const needle = text(query).toLocaleLowerCase()
  const list = (channels || []).filter(Boolean)
  if (!needle) return list
  return list.filter(channel =>
    channel.name.toLocaleLowerCase().includes(needle) ||
    (channel.description || '').toLocaleLowerCase().includes(needle))
}

/** Only http(s) becomes a link; everything else stays plain text. */
export function safeNovedadesLink(url) {
  const candidate = text(url).replace(/[)\],.;:]+$/, '')
  if (!candidate) return null
  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
    return { href: parsed.toString(), rel: 'noopener noreferrer nofollow' }
  } catch {
    return null
  }
}

export function linkifyParts(value) {
  const parts = []
  const pattern = /https?:\/\/[^\s]+/g
  let rest = String(value || '')
  for (;;) {
    const match = pattern.exec(rest)
    if (!match) break
    if (match.index) parts.push({ text: rest.slice(0, match.index) })
    const link = safeNovedadesLink(match[0])
    parts.push(link ? { url: match[0], link } : { text: match[0] })
    rest = rest.slice(match.index + match[0].length)
    pattern.lastIndex = 0
  }
  if (rest) parts.push({ text: rest })
  return parts
}

export function normalizeNovedadesAuthor(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = text(raw.id)
  if (!id) return null
  return {
    id,
    name: text(raw.name),
    own: raw.own === true,
    count: Number.isFinite(raw.count) ? raw.count : 0,
    unseen: Number.isFinite(raw.unseen) ? raw.unseen : 0,
    latestTimestamp: novedadesDate(raw.latestTimestamp),
  }
}

export function normalizeNovedadesStatus(raw, account, baseUrl, monotonic = moduleClock) {
  if (!raw || typeof raw !== 'object') return null
  const id = text(raw.id)
  if (!id || !RENDERABLE_KINDS.has(raw.kind)) return null
  const remainingMs = typeof raw.remainingMs === 'number' && Number.isFinite(raw.remainingMs) ? raw.remainingMs : null
  return {
    id,
    author: text(raw.author),
    kind: raw.kind,
    text: text(raw.text),
    mediaUrl: raw.kind === 'text' ? '' : novedadesMediaUrl(raw.mediaUrl, account, baseUrl),
    timestamp: novedadesDate(raw.timestamp),
    expiresAt: novedadesDate(raw.expiresAt),
    remainingMs,
    ttlBase: remainingMs === null ? null : monotonic(),
    active: raw.active === true,
    freshnessUnknown: raw.freshnessUnknown === true,
    deleted: raw.deleted === true,
    seenAt: novedadesDate(raw.seenAt),
  }
}

export function normalizeNovedadesChannel(raw, account, baseUrl) {
  if (!raw || typeof raw !== 'object') return null
  const id = text(raw.id)
  if (!id) return null
  const name = text(raw.name)
  return {
    id,
    name: name || readableAuthor(id, ''),
    description: text(raw.description),
    subscribers: Number.isFinite(raw.subscribers) ? raw.subscribers : null,
    latestTimestamp: novedadesDate(raw.latestTimestamp),
    avatarUrl: raw.avatarAvailable === true ? novedadesMediaUrl(raw.avatarUrl, account, baseUrl) : '',
    verification: text(raw.verification),
  }
}

export function normalizeNovedadesPost(raw, account, baseUrl) {
  if (!raw || typeof raw !== 'object') return null
  const id = text(raw.id)
  if (!id || !RENDERABLE_KINDS.has(raw.kind) || raw.deleted === true) return null
  return {
    id,
    kind: raw.kind,
    text: text(raw.text),
    timestamp: novedadesDate(raw.timestamp),
    mediaUrl: raw.kind === 'text' ? '' : novedadesMediaUrl(raw.mediaUrl, account, baseUrl),
  }
}

const dateTime = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

export function ttlLabel(status, nowMonotonic = moduleClock(), wallNow = Date.now()) {
  const remaining = statusRemainingMs(status, nowMonotonic, wallNow)
  if (remaining === null) return ''
  if (remaining <= 0) return 'Expirado'
  const hours = Math.floor(remaining / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)
  return `Caduca en ${hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`}`
}

const dateLabel = date => (date ? dateTime.format(date) : '')

export function installNovedadesUI({
  documentRef = globalThis.document,
  windowRef = globalThis.window,
  getAccount,
  loadAuthors = async () => ({ authors: [] }),
  loadStatuses = async () => ({ items: [] }),
  loadChannels = async () => ({ channels: [] }),
  loadPosts = async () => ({ items: [] }),
  onOpen = null,
  baseUrl = () => `${windowRef?.location?.origin || 'http://localhost/'}/`,
} = {}) {
  if (!documentRef || typeof getAccount !== 'function') return null

  const monotonicNow = () => (windowRef?.performance?.now?.() ?? moduleClock())

  const state = {
    closed: true,
    generation: 0,
    request: 0,
    tab: 'statuses',
    account: '',
    opener: null,
    root: null,
    panel: null,
    list: null,
    status: null,
    searchRow: null,
    searchInput: null,
    channelsMore: null,
    tabs: [],
    viewer: null,
    viewerRefs: null,
    viewerLabel: '',
    viewerAuthorId: '',
    viewerQueue: [],
    viewerIds: null,
    viewerIndex: -1,
    viewerCursor: null,
    viewerLoading: false,
    viewerTicker: null,
    timeline: null,
    timelineRefs: null,
    timelineChannel: null,
    timelineCursor: null,
    timelineLoading: false,
    timelineRequest: 0,
    channels: [],
    channelsCursor: null,
    channelsLoading: false,
    channelQuery: '',
  }

  const isCurrent = token => !state.closed && token.generation === state.generation && token.account === state.account

  function node(tag, className = '', value = '') {
    const element = documentRef.createElement(tag)
    if (className) element.className = className
    if (value !== '') element.textContent = value
    return element
  }

  function button(className, label) {
    const element = documentRef.createElement('button')
    element.type = 'button'
    if (className) element.className = className
    element.setAttribute('aria-label', label)
    element.title = label
    return element
  }

  function clearMedia() {
    const media = state.viewerRefs?.media?.firstChild
    if (!media) return
    media.pause?.()
    media.removeAttribute?.('src')
  }

  function setStatus(message, kind = 'info') {
    if (!state.status) return
    state.status.textContent = message
    state.status.dataset.kind = kind === 'error' ? 'error' : 'info'
  }

  function errorPane(message, retry) {
    state.list.replaceChildren()
    const box = node('div', 'novedades-empty')
    box.append(node('p', '', message))
    const again = button('novedades-retry', 'Reintentar')
    again.textContent = 'Reintentar'
    again.onclick = () => void retry()
    box.append(again)
    state.list.append(box)
    setStatus('')
  }

  function emptyPane(message) {
    state.list.replaceChildren()
    state.list.append(node('p', 'novedades-empty', message))
  }

  function avatarNode(url, name) {
    const avatar = node('span', 'novedades-avatar')
    avatar.setAttribute('aria-hidden', 'true')
    if (url) {
      const image = documentRef.createElement('img')
      image.src = url
      image.alt = ''
      image.loading = 'lazy'
      image.addEventListener('error', () => image.remove())
      avatar.append(image)
    }
    avatar.append(node('span', 'novedades-initial', [...text(name)][0]?.toUpperCase() || '?'))
    return avatar
  }

  function rowButton(label, detail, onClick, { avatarUrl = '', avatarName = label, badge = '' } = {}) {
    const row = button('novedades-row', label)
    row.append(avatarNode(avatarUrl, avatarName))
    const copy = node('span', 'novedades-copy')
    copy.append(node('strong', '', label))
    if (detail) copy.append(node('span', 'novedades-detail', detail))
    row.append(copy)
    if (badge) row.append(node('span', 'novedades-unread', badge))
    row.onclick = onClick
    return row
  }

  // ---------------------------------------------------------------- statuses

  async function renderStatusesTab() {
    const token = { generation: state.generation, account: state.account }
    const requestId = ++state.request
    state.panel?.setAttribute('aria-busy', 'true')
    state.channelsMore.hidden = true
    try {
      const result = await loadAuthors()
      if (!isCurrent(token) || requestId !== state.request || state.tab !== 'statuses') return
      const authors = (Array.isArray(result?.authors) ? result.authors : [])
        .map(raw => normalizeNovedadesAuthor(raw))
        .filter(Boolean)
      state.list.replaceChildren()
      const sections = groupAuthors(authors)
      for (const section of sections) {
        state.list.append(node('h3', 'novedades-section-title', section.title))
        for (const author of section.items) state.list.append(authorRow(author))
      }
      if (!authors.length) emptyPane('No hay estados sincronizados en esta cuenta.')
      const total = authors.reduce((sum, author) => sum + author.count, 0)
      setStatus(authors.length ? `${total} ${total === 1 ? 'estado activo' : 'estados activos'}` : '')
    } catch {
      if (!isCurrent(token) || requestId !== state.request) return
      errorPane('No se pudieron cargar los estados. Comprueba la conexión del conector.', renderStatusesTab)
    } finally {
      if (isCurrent(token) && requestId === state.request) state.panel?.setAttribute('aria-busy', 'false')
    }
  }

  function authorRow(author) {
    const label = readableAuthor(author.id, author.name)
    const when = dateLabel(author.latestTimestamp)
    const detail = `${author.count} ${author.count === 1 ? 'estado' : 'estados'}${when ? ` · ${when}` : ''}`
    return rowButton(label, detail, () => void openAuthorStatuses(author), {
      avatarName: label,
      badge: author.unseen > 0 ? String(author.unseen) : '',
    })
  }

  async function openAuthorStatuses(author) {
    if (state.viewerLoading) return
    const token = { generation: state.generation, account: state.account }
    const label = readableAuthor(author.id, author.name)
    state.viewerLoading = true
    setStatus(`Cargando los estados de ${label}…`)
    try {
      const result = await loadStatuses(author.id, {})
      if (!isCurrent(token) || state.tab !== 'statuses') return
      const queue = visibleStatusQueue((Array.isArray(result?.items) ? result.items : [])
        .map(raw => normalizeNovedadesStatus(raw, token.account, baseUrl(), monotonicNow)), monotonicNow())
      if (!queue.length) {
        setStatus(`${label} ya no tiene estados activos.`)
        return
      }
      openViewer(label, author.id, queue, typeof result?.nextCursor === 'string' && result.nextCursor ? result.nextCursor : null)
      setStatus('')
    } catch {
      if (!isCurrent(token)) return
      setStatus(`No se pudieron cargar los estados de ${label}.`, 'error')
    } finally {
      state.viewerLoading = false
    }
  }

  function viewerChrome() {
    if (state.viewer) return state.viewer
    const viewer = node('div', 'novedades-viewer')
    viewer.setAttribute('role', 'region')
    viewer.setAttribute('aria-label', 'Visor de estados')
    const header = node('header', 'novedades-viewer-header')
    const back = button('novedades-back', 'Volver a la lista de estados')
    back.append(node('span', '', '←'))
    back.onclick = closeViewer
    const identity = node('div', 'novedades-viewer-identity')
    const author = node('strong', 'novedades-viewer-author')
    const meta = node('span', 'novedades-viewer-meta')
    identity.append(author, meta)
    const closeButton = button('novedades-viewer-close', 'Cerrar visor')
    closeButton.textContent = '×'
    closeButton.onclick = () => close({ restoreFocus: true })
    header.append(back, identity, closeButton)
    const media = node('div', 'novedades-viewer-media')
    const footer = node('div', 'novedades-viewer-footer')
    const previous = button('novedades-step', 'Estado anterior')
    previous.textContent = '‹'
    previous.onclick = () => void stepViewer(-1)
    const counter = node('span', 'novedades-counter')
    counter.setAttribute('aria-live', 'polite')
    const next = button('novedades-step', 'Estado siguiente')
    next.textContent = '›'
    next.onclick = () => void stepViewer(1)
    footer.append(previous, counter, next)
    viewer.append(header, media, footer)
    state.viewer = viewer
    state.viewerRefs = { author, meta, media, previous, counter, next }
    return viewer
  }

  function openViewer(label, authorId, queue, cursor) {
    closeTimelineQuiet()
    closeViewerQuiet()
    state.viewerLabel = label
    state.viewerAuthorId = authorId
    state.viewerQueue = queue
    state.viewerIds = new Set(queue.map(status => status.id))
    state.viewerIndex = 0
    state.viewerCursor = cursor
    const viewer = viewerChrome()
    state.panel.classList.add('novedades-viewing')
    if (!viewer.parentNode) state.panel.append(viewer)
    showViewerItem()
    startViewerTicker()
  }

  function updateViewerMeta() {
    const refs = state.viewerRefs
    const status = state.viewerQueue[state.viewerIndex]
    if (!refs || !status) return
    refs.meta.textContent = [
      dateLabel(status.timestamp) || 'Fecha desconocida',
      ttlLabel(status, monotonicNow()),
    ].filter(Boolean).join(' · ')
  }

  function startViewerTicker() {
    if (state.viewerTicker) return
    const schedule = windowRef?.setInterval || globalThis.setInterval
    state.viewerTicker = schedule(() => {
      if (state.closed || !state.viewer) {
        stopViewerTicker()
        return
      }
      showViewerItem(true)
    }, TTL_TICK_MS)
  }

  function stopViewerTicker() {
    if (!state.viewerTicker) return
    ;(windowRef?.clearInterval || globalThis.clearInterval)(state.viewerTicker)
    state.viewerTicker = null
  }

  function showViewerItem(metaOnly = false) {
    const refs = state.viewerRefs
    if (!refs) return
    const currentId = state.viewerQueue[state.viewerIndex]?.id
    const previousIndex = state.viewerIndex
    state.viewerQueue = visibleStatusQueue(state.viewerQueue, monotonicNow())
    state.viewerIndex = state.viewerQueue.findIndex(status => status.id === currentId)
    if (state.viewerIndex < 0) state.viewerIndex = Math.min(previousIndex, state.viewerQueue.length - 1)
    if (!state.viewerQueue.length) {
      const hadViewerFocus = state.viewer?.contains(documentRef.activeElement)
      closeViewer()
      setStatus(`${state.viewerLabel} ya no tiene estados activos.`)
      if (hadViewerFocus) state.list?.focus?.()
      return
    }
    const status = state.viewerQueue[state.viewerIndex]
    if (metaOnly && status.id === currentId) {
      updateViewerMeta()
      return
    }
    clearMedia()
    refs.author.textContent = state.viewerLabel
    updateViewerMeta()
    const media = refs.media
    media.replaceChildren()
    if (status.kind === 'text') {
      const body = node('p', 'novedades-viewer-text')
      appendLinkedText(body, status.text || 'Sin texto')
      media.append(body)
    } else if (status.mediaUrl) {
      if (status.kind === 'image') {
        const image = documentRef.createElement('img')
        image.src = status.mediaUrl
        image.alt = 'Foto del estado'
        image.addEventListener('error', () => media.replaceChildren(node('p', 'novedades-media-error', 'No se pudo cargar este contenido.')))
        media.append(image)
      } else {
        const video = documentRef.createElement('video')
        video.setAttribute('src', status.mediaUrl)
        video.controls = true
        video.playsInline = true
        video.setAttribute('preload', 'metadata')
        video.setAttribute('aria-label', 'Vídeo del estado')
        media.append(video)
        video.play?.().catch(() => {})
      }
    } else {
      media.append(node('p', 'novedades-media-error', 'Este estado aún no tiene contenido sincronizado.'))
    }
    refs.previous.disabled = state.viewerIndex <= 0
    refs.next.disabled = state.viewerIndex >= state.viewerQueue.length - 1 && !state.viewerCursor
    refs.counter.textContent = `${state.viewerIndex + 1} de ${state.viewerQueue.length}`
  }

  function appendLinkedText(container, value) {
    for (const part of linkifyParts(value)) {
      if (part.link) {
        const anchor = documentRef.createElement('a')
        anchor.href = part.link.href
        anchor.rel = part.link.rel
        anchor.textContent = part.url
        container.append(anchor)
      } else {
        container.append(documentRef.createTextNode ? documentRef.createTextNode(part.text) : node('span', '', part.text))
      }
    }
  }

  async function stepViewer(delta) {
    const now = monotonicNow()
    let target = null
    for (let index = state.viewerIndex + delta; index >= 0 && index < state.viewerQueue.length; index += delta) {
      if (statusIsVisible(state.viewerQueue[index], now)) {
        target = state.viewerQueue[index]
        break
      }
    }
    if (target) {
      state.viewerIndex = state.viewerQueue.indexOf(target)
      showViewerItem()
      return
    }
    if (delta > 0 && state.viewerCursor) {
      if (!statusIsVisible(state.viewerQueue[state.viewerIndex], now)) {
        clearMedia()
        state.viewerRefs.media.replaceChildren()
      }
      await loadViewerNextPage()
      return
    }
    showViewerItem()
  }

  async function loadViewerNextPage() {
    if (state.viewerLoading || !state.viewerCursor) return
    const token = { generation: state.generation, account: state.account }
    const authorId = state.viewerAuthorId
    const cursor = state.viewerCursor
    state.viewerLoading = true
    try {
      const result = await loadStatuses(authorId, { cursor })
      if (!isCurrent(token) || state.viewerAuthorId !== authorId) return
      const fresh = visibleStatusQueue((Array.isArray(result?.items) ? result.items : [])
        .map(raw => normalizeNovedadesStatus(raw, token.account, baseUrl(), monotonicNow)), monotonicNow())
        .filter(status => !state.viewerIds.has(status.id))
      for (const status of fresh) state.viewerIds.add(status.id)
      state.viewerQueue = state.viewerQueue.concat(fresh)
      state.viewerCursor = typeof result?.nextCursor === 'string' && result.nextCursor ? result.nextCursor : null
      if (!fresh.length) {
        state.viewerCursor = null
        showViewerItem()
        return
      }
      state.viewerIndex += 1
      showViewerItem()
    } catch {
      if (isCurrent(token)) setStatus('No se pudieron cargar más estados de este autor.', 'error')
    } finally {
      state.viewerLoading = false
    }
  }

  function closeViewer() {
    clearMedia()
    stopViewerTicker()
    state.viewer?.remove()
    state.viewer = null
    state.viewerRefs = null
    state.viewerQueue = []
    state.viewerIds = null
    state.viewerIndex = -1
    state.viewerCursor = null
    state.viewerAuthorId = ''
    state.panel?.classList.remove('novedades-viewing')
  }

  function closeViewerQuiet() {
    clearMedia()
    stopViewerTicker()
    state.viewer?.remove()
    state.viewer = null
    state.viewerRefs = null
    state.viewerQueue = []
    state.viewerIds = null
    state.viewerIndex = -1
    state.viewerCursor = null
    state.viewerAuthorId = ''
  }

  // ---------------------------------------------------------------- channels

  function renderChannelRows() {
    if (!state.list || state.tab !== 'channels') return
    const visible = filterChannels(state.channels, state.channelQuery)
    state.list.replaceChildren()
    for (const channel of visible) {
      const detail = [
        channel.subscribers !== null ? `${channel.subscribers} ${channel.subscribers === 1 ? 'seguidor' : 'seguidores'}` : '',
        channel.verification === 'verified' ? 'Verificado' : '',
        dateLabel(channel.latestTimestamp),
      ].filter(Boolean).join(' · ')
      state.list.append(rowButton(channel.name, detail, () => openTimeline(channel), {
        avatarUrl: channel.avatarUrl,
        avatarName: channel.name,
      }))
    }
    if (!visible.length) {
      emptyPane(state.channelQuery
        ? 'Ningún canal cargado coincide con esta búsqueda.'
        : 'Todavía no sigues ningún canal sincronizado en esta cuenta.')
    }
    const total = state.channels.length
    setStatus(state.channelQuery && visible.length !== total
      ? `${visible.length} de ${total} ${total === 1 ? 'canal' : 'canales'}`
      : `${total} ${total === 1 ? 'canal' : 'canales'}`)
  }

  async function renderChannelsTab() {
    const token = { generation: state.generation, account: state.account }
    const requestId = ++state.request
    state.panel?.setAttribute('aria-busy', 'true')
    state.channelsLoading = true
    try {
      const result = await loadChannels({ cursor: null })
      if (!isCurrent(token) || requestId !== state.request || state.tab !== 'channels') return
      state.channels = (Array.isArray(result?.channels) ? result.channels : [])
        .map(raw => normalizeNovedadesChannel(raw, token.account, baseUrl()))
        .filter(Boolean)
      state.channelsCursor = result?.hasMore === true && typeof result?.nextCursor === 'string' && result.nextCursor ? result.nextCursor : null
      renderChannelRows()
      state.channelsMore.hidden = !state.channelsCursor
    } catch {
      if (!isCurrent(token) || requestId !== state.request) return
      errorPane('No se pudieron cargar los canales. Comprueba la conexión del conector.', renderChannelsTab)
      state.channelsMore.hidden = true
    } finally {
      state.channelsLoading = false
      if (isCurrent(token) && requestId === state.request) state.panel?.setAttribute('aria-busy', 'false')
    }
  }

  async function loadChannelsMore() {
    if (!state.channelsCursor || state.channelsLoading) return
    const token = { generation: state.generation, account: state.account }
    state.channelsLoading = true
    state.channelsMore.disabled = true
    try {
      const result = await loadChannels({ cursor: state.channelsCursor })
      if (!isCurrent(token) || state.tab !== 'channels') return
      const fresh = (Array.isArray(result?.channels) ? result.channels : [])
        .map(raw => normalizeNovedadesChannel(raw, token.account, baseUrl()))
        .filter(Boolean)
      const known = new Set(state.channels.map(channel => channel.id))
      state.channels = state.channels.concat(fresh.filter(channel => !known.has(channel.id)))
      state.channelsCursor = result?.hasMore === true && typeof result?.nextCursor === 'string' && result.nextCursor ? result.nextCursor : null
      renderChannelRows()
      state.channelsMore.hidden = !state.channelsCursor
    } catch {
      if (isCurrent(token)) setStatus('No se pudieron cargar más canales.', 'error')
    } finally {
      state.channelsLoading = false
      state.channelsMore.disabled = false
    }
  }

  function openTimeline(channel) {
    closeViewerQuiet()
    closeTimelineQuiet()
    state.timelineChannel = channel
    state.timelineCursor = null
    const view = node('div', 'novedades-viewer novedades-timeline')
    view.setAttribute('role', 'region')
    view.setAttribute('aria-label', `Publicaciones de ${channel.name}`)
    const header = node('header', 'novedades-viewer-header')
    const back = button('novedades-back', 'Volver a la lista de canales')
    back.append(node('span', '', '←'))
    back.onclick = closeTimeline
    const identity = node('div', 'novedades-viewer-identity')
    identity.append(
      node('strong', 'novedades-viewer-author', channel.name),
      node('span', 'novedades-viewer-meta', channel.subscribers !== null ? `${channel.subscribers} ${channel.subscribers === 1 ? 'seguidor' : 'seguidores'}` : ''),
    )
    header.append(back, identity)
    const list = node('div', 'novedades-post-list')
    list.setAttribute('aria-live', 'polite')
    const more = button('novedades-more', 'Cargar más publicaciones')
    more.textContent = 'Cargar más publicaciones'
    more.hidden = true
    more.onclick = () => void loadTimelinePage()
    view.append(header, list, more)
    state.panel.classList.add('novedades-viewing')
    state.panel.append(view)
    state.timeline = view
    state.timelineRefs = { list, more }
    void loadTimelinePage(true)
  }

  async function loadTimelinePage(replace) {
    if (!state.timelineChannel || state.timelineLoading) return
    const token = { generation: state.generation, account: state.account }
    const request = state.timelineRequest
    const channel = state.timelineChannel
    const cursor = replace ? null : state.timelineCursor
    state.timelineLoading = true
    try {
      const result = await loadPosts(channel.id, { cursor })
      if (!isCurrent(token) || request !== state.timelineRequest || state.timelineChannel?.id !== channel.id) return
      const posts = (Array.isArray(result?.items) ? result.items : [])
        .map(raw => normalizeNovedadesPost(raw, token.account, baseUrl()))
        .filter(Boolean)
      if (replace) state.timelineRefs.list.replaceChildren()
      for (const post of posts) state.timelineRefs.list.append(postNode(post, channel))
      state.timelineCursor = result?.hasMore === true && typeof result?.nextCursor === 'string' && result.nextCursor ? result.nextCursor : null
      state.timelineRefs.more.hidden = !state.timelineCursor
      if (replace && !posts.length) state.timelineRefs.list.append(node('p', 'novedades-empty', 'Este canal todavía no tiene publicaciones sincronizadas.'))
    } catch {
      if (!isCurrent(token) || request !== state.timelineRequest || state.timelineChannel?.id !== channel.id) return
      if (state.timelineRefs) state.timelineRefs.list.replaceChildren(node('p', 'novedades-empty', 'No se pudieron cargar las publicaciones de este canal.'))
      if (state.timelineRefs) state.timelineRefs.more.hidden = true
    } finally {
      if (request === state.timelineRequest) state.timelineLoading = false
    }
  }

  function postNode(post, channel) {
    const article = node('article', 'novedades-post')
    const head = node('header', 'novedades-post-head')
    head.append(
      avatarNode(channel.avatarUrl, channel.name),
      node('strong', '', channel.name),
      node('time', '', dateLabel(post.timestamp) || 'Fecha desconocida'),
    )
    article.append(head)
    if (post.text) {
      const body = node('p', 'novedades-post-text')
      appendLinkedText(body, post.text)
      article.append(body)
    }
    if (post.mediaUrl) {
      if (post.kind === 'image') {
        const image = documentRef.createElement('img')
        image.src = post.mediaUrl
        image.alt = 'Imagen de la publicación'
        image.loading = 'lazy'
        image.addEventListener('error', () => image.replaceWith?.(node('p', 'novedades-media-error', 'No se pudo cargar esta imagen.')))
        article.append(image)
      } else {
        const video = documentRef.createElement('video')
        video.setAttribute('src', post.mediaUrl)
        video.controls = true
        video.playsInline = true
        video.setAttribute('preload', 'metadata')
        video.setAttribute('aria-label', 'Vídeo de la publicación')
        article.append(video)
      }
    }
    return article
  }

  function closeTimeline() {
    state.timelineRequest += 1
    state.timelineLoading = false
    state.timeline?.remove()
    state.timeline = null
    state.timelineRefs = null
    state.timelineChannel = null
    state.timelineCursor = null
    state.panel?.classList.remove('novedades-viewing')
  }

  function closeTimelineQuiet() {
    state.timelineRequest += 1
    state.timelineLoading = false
    state.timeline?.remove()
    state.timeline = null
    state.timelineRefs = null
    state.timelineChannel = null
    state.timelineCursor = null
  }

  // ------------------------------------------------------------------ shell

  function renderActive() {
    closeViewerQuiet()
    closeTimelineQuiet()
    state.panel?.classList.remove('novedades-viewing')
    if (state.tab === 'statuses') void renderStatusesTab()
    else void renderChannelsTab()
  }

  function switchTab(tab) {
    if (state.tab === tab) return
    state.tab = tab
    for (const [name, element] of state.tabs) {
      element.setAttribute('aria-selected', String(name === tab))
      element.classList.toggle('is-active', name === tab)
    }
    state.list.setAttribute('aria-label', tab === 'statuses' ? 'Estados' : 'Canales')
    state.searchRow.hidden = tab !== 'channels'
    renderActive()
  }

  function focusBody() {
    queueMicrotask(() => {
      if (!state.closed) state.list.focus?.()
    })
  }

  function onKeyDown(event) {
    if (state.closed || event.defaultPrevented) return
    if (event.key === 'Tab') {
      const controls = [...(state.panel?.querySelectorAll('button, input, select, textarea, [tabindex]') || [])]
        .filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length)
      if (!controls.length) return
      const index = controls.indexOf(documentRef.activeElement)
      if (index < 0 || (event.shiftKey && index === 0) || (!event.shiftKey && index === controls.length - 1)) {
        event.preventDefault()
        ;(event.shiftKey ? controls.at(-1) : controls[0]).focus()
      }
      return
    }
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    if (state.viewer) closeViewer()
    else if (state.timeline) closeTimeline()
    else close({ restoreFocus: true })
  }

  function open({ opener = null, tab = 'statuses' } = {}) {
    const nextTab = tab === 'channels' ? 'channels' : 'statuses'
    onOpen?.()
    if (!state.closed) {
      if (opener) state.opener = opener
      switchTab(nextTab)
      focusBody()
      return
    }
    state.generation += 1
    state.closed = false
    state.tab = nextTab
    state.account = text(getAccount())
    state.opener = opener
    state.channelQuery = ''
    state.channels = []
    state.channelsCursor = null

    const overlay = node('div', 'novedades-overlay')
    overlay.setAttribute('role', 'presentation')
    overlay.addEventListener('click', event => {
      if (event.target === overlay) close({ restoreFocus: true })
    })
    const panel = node('aside', 'novedades-panel')
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-modal', 'true')
    panel.setAttribute('aria-labelledby', 'novedades-title')
    panel.setAttribute('aria-busy', 'true')

    const header = node('header', 'novedades-header')
    const title = node('h2', 'novedades-title', 'Novedades')
    title.id = 'novedades-title'
    const closeButton = button('novedades-close', 'Cerrar Novedades')
    closeButton.textContent = '×'
    closeButton.onclick = () => close({ restoreFocus: true })
    header.append(title, closeButton)

    const tabsNav = node('nav', 'novedades-tabs')
    tabsNav.setAttribute('role', 'tablist')
    state.tabs = [
      ['statuses', button('novedades-tab', 'Estados')],
      ['channels', button('novedades-tab', 'Canales')],
    ]
    for (const [name, element] of state.tabs) {
      element.setAttribute('role', 'tab')
      element.id = `novedades-tab-${name}`
      element.setAttribute('aria-controls', 'novedades-list')
      element.setAttribute('aria-selected', String(name === nextTab))
      element.classList.toggle('is-active', name === nextTab)
      element.append(node('span', '', name === 'statuses' ? 'Estados' : 'Canales'))
      element.onclick = () => switchTab(name)
      tabsNav.append(element)
    }

    state.searchRow = node('div', 'novedades-search')
    state.searchRow.hidden = nextTab !== 'channels'
    state.searchInput = documentRef.createElement('input')
    state.searchInput.type = 'search'
    state.searchInput.autocomplete = 'off'
    state.searchInput.placeholder = 'Buscar en los canales cargados'
    state.searchInput.setAttribute('aria-label', 'Buscar canales')
    state.searchInput.addEventListener('input', () => {
      state.channelQuery = text(state.searchInput.value)
      renderChannelRows()
    })
    state.searchRow.append(state.searchInput)

    state.status = node('p', 'novedades-status')
    state.status.setAttribute('role', 'status')
    state.status.setAttribute('aria-live', 'polite')

    state.list = node('div', 'novedades-list')
    state.list.setAttribute('role', 'tabpanel')
    state.list.id = 'novedades-list'
    state.list.setAttribute('aria-labelledby', `novedades-tab-${nextTab}`)
    state.list.setAttribute('tabindex', '-1')

    state.channelsMore = button('novedades-more novedades-list-more', 'Cargar más canales')
    state.channelsMore.textContent = 'Cargar más canales'
    state.channelsMore.hidden = true
    state.channelsMore.onclick = () => void loadChannelsMore()

    panel.append(header, tabsNav, state.searchRow, state.status, state.list, state.channelsMore)
    overlay.append(panel)
    documentRef.body.append(overlay)
    state.root = overlay
    state.panel = panel

    documentRef.addEventListener?.('keydown', onKeyDown)
    renderActive()
    focusBody()
  }

  function destroy() {
    stopViewerTicker()
    state.root?.remove()
    state.root = null
    state.panel = null
    state.list = null
    state.status = null
    state.searchRow = null
    state.searchInput = null
    state.channelsMore = null
    state.tabs = []
  }

  function resetViewers() {
    closeViewerQuiet()
    closeTimelineQuiet()
    state.request += 1
  }

  function close({ restoreFocus = true } = {}) {
    if (state.closed) return
    state.generation += 1
    state.closed = true
    resetViewers()
    stopViewerTicker()
    documentRef.removeEventListener?.('keydown', onKeyDown)
    destroy()
    if (restoreFocus && state.opener?.isConnected !== false) state.opener.focus?.()
    state.opener = null
  }

  return {
    open,
    close,
    isOpen: () => !state.closed,
    accountChanged() {
      if (state.closed) return
      const next = text(getAccount())
      if (next === state.account) return
      resetViewers()
      state.generation += 1
      state.account = next
      state.channelQuery = ''
      if (state.searchInput) state.searchInput.value = ''
      state.channels = []
      state.channelsCursor = null
      renderActive()
    },
  }
}

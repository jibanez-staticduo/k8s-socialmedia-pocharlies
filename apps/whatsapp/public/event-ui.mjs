export function installEventUI({container, getContext, api, canSend, documentRef = globalThis.document, newToken = () => crypto.randomUUID()}) {
  const attempts = new Map();
  const pending = new Set();
  const contextKey = ctx => JSON.stringify([ctx.account, ctx.chat, ctx.version]);
  const element = (tag, text, className = '') => {
    const node = documentRef.createElement(tag);
    node.textContent = text;
    node.className = className;
    return node;
  };
  const choiceLabels = [['going', 'Asistiré'], ['not_going', 'No asistiré'], ['maybe', 'Quizá']];
  async function open(button) {
    const bubble = button.closest('[data-message-id]');
    if (!bubble || button.disabled) return;
    const ctx = {...getContext()};
    const id = bubble.dataset.messageId;
    const scope = JSON.stringify([ctx.account, ctx.chat, id]);
    if (pending.has(scope)) return;
    const card = button.closest('.message-structured-card');
    card.querySelector('.event-response-panel')?.remove();
    const panel = element('div', '', 'event-response-panel');
    const status = element('p', 'Cargando respuestas…', 'event-response-status');
    status.setAttribute('role', 'status');
    panel.append(status);
    card.append(panel);
    const current = () => panel.isConnected && contextKey(ctx) === contextKey(getContext());
    button.disabled = true;
    try {
      const data = await api(`/api/messages/event/results?${new URLSearchParams({account: ctx.account, chat: ctx.chat, messageId: id})}`);
      if (!current()) return;
      if (data.account !== ctx.account || data.chat !== ctx.chat) throw new Error('No se pudieron verificar las respuestas.');
      const result = data.results;
      if (!result?.available) {
        status.textContent = 'Las respuestas no están disponibles en esta copia del evento.';
        return;
      }
      status.textContent = `${result.counts.going} asistirán · ${result.counts.not_going} no asistirán · ${result.counts.maybe} quizá`;
      panel.append(element('small', 'Respuestas sincronizadas; puede faltar historial.', 'event-response-note'));
      const controls = element('div', '', 'event-response-choices');
      const guests = element('input', '');
      guests.type = 'number'; guests.min = '0'; guests.step = '1';
      guests.value = String(Number.isSafeInteger(result.selectedExtraGuestCount) && result.selectedExtraGuestCount >= 0 ? result.selectedExtraGuestCount : 0);
      guests.setAttribute('aria-label', 'Acompañantes');
      if (button.dataset.extraGuests === 'true') {
        const label = element('label', 'Acompañantes');
        label.append(guests); panel.append(label);
      }
      for (const [attendance, label] of choiceLabels) {
        const choice = element('button', label);
        choice.type = 'button';
        choice.setAttribute('aria-pressed', String(result.selectedByMe === attendance));
        choice.disabled = !canSend() || button.dataset.cancelled === 'true' || pending.has(scope);
        choice.addEventListener('click', async () => {
          if (!current() || !canSend() || pending.has(scope)) return;
          const extraGuestCount = attendance === 'going' && button.dataset.extraGuests === 'true' ? Number(guests.value) : 0;
          if (!Number.isSafeInteger(extraGuestCount) || extraGuestCount < 0) {status.textContent = 'Introduce un número válido de acompañantes.'; return;}
          const requestKey = JSON.stringify([scope, attendance, extraGuestCount]);
          const sendToken = attempts.get(requestKey) || newToken();
          attempts.set(requestKey, sendToken);
          pending.add(scope);
          for (const control of controls.querySelectorAll('button')) control.disabled = true;
          guests.disabled = true;
          status.textContent = 'Enviando respuesta…';
          try {
            const sent = await api('/api/messages/event/respond', {account: ctx.account, chat: ctx.chat, messageId: id, attendance, extraGuestCount, sendToken});
            if (sent?.confirmed !== true || sent.account !== ctx.account || sent.chat !== ctx.chat) throw new Error('Entrega no confirmada');
            attempts.delete(requestKey);
            if (!current()) return;
            status.textContent = 'Respuesta enviada';
            for (const control of controls.querySelectorAll('button')) control.setAttribute('aria-pressed', String(control === choice));
          } catch {
            if (current()) status.textContent = 'Entrega no confirmada. Actualiza las respuestas antes de intentarlo de nuevo.';
          } finally {
            pending.delete(scope);
            if (current()) {
              for (const control of controls.querySelectorAll('button')) control.disabled = !canSend();
              guests.disabled = false;
            }
          }
        });
        controls.append(choice);
      }
      panel.append(controls);
    } catch {
      if (current()) status.textContent = 'No se pudieron cargar las respuestas. Vuelve a intentarlo.';
    } finally {
      if (current()) {button.disabled = false; button.textContent = 'Actualizar respuestas';}
    }
  }
  container.addEventListener('click', event => {
    const button = event.target.closest?.('.message-event-open');
    if (button && container.contains(button)) void open(button);
  });
}

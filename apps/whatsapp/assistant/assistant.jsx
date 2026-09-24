import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AssistantRuntimeProvider, MessagePrimitive, ThreadPrimitive, useExternalStoreRuntime, useAuiState} from '@assistant-ui/react';
import './assistant.css';

const SEND_PATH = 'm4 4 16 8-16 8 3-8zM7 12h13';

function Bubble() {
  const role = useAuiState(state => state.message.role);
  return <MessagePrimitive.Root className={role === 'user' ? 'ai-bubble ai-bubble-out' : 'ai-bubble ai-bubble-in'}>
    <div className="ai-bubble-text"><MessagePrimitive.Parts /></div>
  </MessagePrimitive.Root>;
}

/* The assistant panel is one ordinary conversation: bubbles, a typing receipt and a
   composer. It stays mounted while hidden so a turn started from the composer keeps
   its place in the thread, and it only reads server state once the owner opens it. */
function PrivateChat({ctx, request, useDraft, active, api, draftPrompt, draftLabel}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [problem, setProblem] = useState('');
  const [proposals, setProposals] = useState([]);
  const [proposalBusy, setProposalBusy] = useState('');
  const proposalRequest = useRef(0);
  const sessionIdRef = useRef('chat');
  const loadedRef = useRef(false);
  const queueRef = useRef(Promise.resolve());
  const threadRef = useRef(null);
  const inputRef = useRef(null);

  const shownPrompt = useCallback(text => (draftPrompt && text === draftPrompt && draftLabel ? draftLabel : text), [draftLabel, draftPrompt]);

  const loadProposals = useCallback(async () => {
    if (!ctx.account || !ctx.chat) return;
    const requestId = ++proposalRequest.current;
    const params = new URLSearchParams({account: ctx.account, chat: ctx.chat});
    const result = await request(`/api/ai/proposals?${params}`);
    if (requestId === proposalRequest.current) setProposals((result.proposals || []).filter(proposal => typeof proposal.id === 'string' && typeof proposal.text === 'string'));
  }, [ctx.account, ctx.chat, request]);

  useEffect(() => {
    if (!active || loadedRef.current || !ctx.account || !ctx.chat) return;
    loadedRef.current = true;
    setLoading(true);
    let mounted = true;
    const params = new URLSearchParams({account: ctx.account, chat: ctx.chat});
    request(`/api/ai/session?${params}`).then(result => {
      if (!mounted) return;
      sessionIdRef.current = result.sessionId || 'chat';
      setMessages((result.messages || []).filter(message => ['user', 'assistant'].includes(message.role) && typeof message.content === 'string').map((message, index) => ({
        id: `${sessionIdRef.current}-${index}`,
        role: message.role,
        content: [{type: 'text', text: shownPrompt(message.content)}]
      })));
    }).catch(error => { if (mounted) setProblem(error.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [active, ctx.account, ctx.chat, request]);

  useEffect(() => {
    if (!active || !ctx.chat) return;
    let mounted = true;
    loadProposals().catch(error => { if (mounted) setProblem(error.message); });
    return () => { mounted = false; };
  }, [active, ctx.chat, loadProposals]);

  const refreshProposals = useCallback(() => {
    if (!active) return Promise.resolve();
    return loadProposals();
  }, [active, loadProposals]);

  const decideProposal = async (id, action) => {
    if (proposalBusy) return;
    setProposalBusy(id);
    setProblem('');
    try {
      await request('/api/ai/proposal', {account: ctx.account, chat: ctx.chat, id, action});
      setProposals(previous => previous.filter(proposal => proposal.id !== id));
      await refreshProposals().catch(error => setProblem(`No se pudieron actualizar las propuestas: ${error.message}`));
    } catch (error) {
      setProblem(error.message);
      // Approval may have consumed the proposal before delivery status became uncertain.
      void refreshProposals().catch(() => {});
    } finally {
      setProposalBusy('');
    }
  };

  const scrollToLatest = useCallback(() => {
    const pane = threadRef.current?.querySelector('.ai-history');
    if (pane) pane.scrollTop = pane.scrollHeight;
  }, []);

  const runTurn = useCallback(async text => {
    const message = String(text || '').trim();
    if (!message) return '';
    if (!ctx.account || !ctx.chat) throw new Error('Selecciona una conversación para consultar.');
    const result = await request('/api/ai/chat', {account: ctx.account, chat: ctx.chat, message, allowPropose: false});
    const answer = typeof result.text === 'string' ? result.text : '';
    setMessages(previous => [...previous,
      {id: `user-${crypto.randomUUID()}`, role: 'user', content: [{type: 'text', text: shownPrompt(message)}]},
      {id: `assistant-${crypto.randomUUID()}`, role: 'assistant', content: [{type: 'text', text: answer}]}
    ]);
    void refreshProposals().catch(error => setProblem(`No se pudieron actualizar las propuestas: ${error.message}`));
    return answer;
  }, [ctx.account, ctx.chat, refreshProposals, request, shownPrompt]);

  const enqueue = useCallback(task => {
    const run = () => {
      setRunning(true);
      setProblem('');
      return Promise.resolve().then(task).finally(() => setRunning(false));
    };
    const result = queueRef.current.then(run, run);
    queueRef.current = result.then(() => {}, () => {});
    return result;
  }, []);

  const ask = useCallback(text => enqueue(() => runTurn(text)), [enqueue, runTurn]);

  useEffect(() => {
    api.ask = ask;
    return () => { if (api.ask === ask) api.ask = null; };
  }, [api, ask]);

  const onNew = useCallback(message => {
    const text = message.content.filter(part => part.type === 'text').map(part => part.text).join('').trim();
    if (!text) return Promise.resolve();
    return enqueue(async () => {
      const answer = await runTurn(text);
      setPrompt('');
      return answer;
    }).catch(error => {
      setProblem(error.message);
      return Promise.reject(error);
    });
  }, [enqueue, runTurn]);

  const runtime = useExternalStoreRuntime({messages, onNew, convertMessage: message => message, isRunning: running, isSendDisabled: !ctx.chat || loading || running});
  const lastReply = [...messages].reverse().find(message => message.role === 'assistant')?.content[0]?.text || '';
  const submit = event => {
    event.preventDefault();
    const text = prompt.trim();
    if (text) onNew({role: 'user', content: [{type: 'text', text}]}).catch(() => {});
  };
  const onKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  useEffect(() => {
    const element = inputRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }, [prompt, active, ctx.chat]);

  useEffect(() => { scrollToLatest(); }, [messages.length, running, loading, scrollToLatest]);

  const emptyNotice = !ctx.chat ? 'Selecciona una conversación para empezar.' : 'Escribe para consultar sobre esta conversación.';

  return <AssistantRuntimeProvider runtime={runtime}>
    <div className="ai-thread" ref={threadRef}>
      <ThreadPrimitive.Root className="ai-conversation">
        <ThreadPrimitive.Viewport className="ai-history" aria-label="Conversación con Social Media Agent">
          {loading ? <p className="ai-note" role="status">Cargando conversación…</p> : messages.length === 0 ? <p className="ai-note">{emptyNotice}</p> : null}
          <ThreadPrimitive.Messages components={{Message: Bubble}} />
          {running && <div className="ai-bubble ai-bubble-in ai-typing" role="status" aria-label="Social Media Agent está escribiendo"><span></span><span></span><span></span></div>}
        </ThreadPrimitive.Viewport>
        {problem && <p className="ai-error" role="alert">{problem}</p>}
        {proposals.length > 0 && <section className="ai-proposals" aria-label="Propuestas pendientes">
          <h3>Propuestas pendientes</h3>
          <p>Revisa el texto exacto antes de aprobar su envío por WhatsApp.</p>
          {proposals.map(proposal => <article className="ai-proposal" key={proposal.id}>
            <div className="ai-proposal-text">{proposal.text}</div>
            <div className="ai-proposal-actions">
              <button type="button" disabled={Boolean(proposalBusy)} onClick={() => decideProposal(proposal.id, 'reject')}>Descartar</button>
              <button type="button" className="primary" disabled={Boolean(proposalBusy)} onClick={() => decideProposal(proposal.id, 'approve')}>Aprobar y enviar</button>
            </div>
          </article>)}
        </section>}
        {lastReply && <button id="ai-use-draft" type="button" disabled={!ctx.chat} onClick={() => useDraft(lastReply, ctx)}>Usar como borrador</button>}
        <form className="ai-composer" onSubmit={submit}>
          <label className="sr-only" htmlFor="ai-prompt">Mensaje para Social Media Agent</label>
          <textarea id="ai-prompt" ref={inputRef} value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={onKeyDown} placeholder="Escribe un mensaje" rows="1" disabled={!ctx.chat || loading} />
          <button id="ai-send" className="ai-send" type="submit" disabled={!ctx.chat || loading || running || !prompt.trim()} aria-label="Enviar mensaje"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d={SEND_PATH}/></svg></button>
        </form>
      </ThreadPrimitive.Root>
    </div>
  </AssistantRuntimeProvider>;
}

export function mountAssistant(target, {request, useDraft, draftPrompt = '', draftLabel = ''}) {
  const root = createRoot(target);
  const options = {draftPrompt, draftLabel};
  let ctx = {account: '', chat: '', version: 0};
  let open = false;
  const api = {};
  const render = () => root.render(<PrivateChat key={`${ctx.account}:${ctx.chat}:${ctx.version}`} ctx={ctx} active={open} request={request} useDraft={useDraft} api={api} draftPrompt={options.draftPrompt} draftLabel={options.draftLabel} />);
  render();
  return {
    select(next) { ctx = next; render(); },
    setOpen(value) {
      open = value;
      render();
      if (open) requestAnimationFrame(() => target.querySelector('#ai-prompt')?.focus());
    },
    async proposeDraft(text) {
      const message = String(text || '').trim();
      if (!message) throw new Error('No se pudo preparar la propuesta.');
      if (!ctx.account || !ctx.chat) throw new Error('Selecciona una conversación para pedir una propuesta.');
      if (api.ask) return api.ask(message);
      const result = await request('/api/ai/chat', {account: ctx.account, chat: ctx.chat, message, allowPropose: false});
      ctx = {...ctx, version: ctx.version + 1};
      return typeof result.text === 'string' ? result.text : '';
    }
  };
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  ts: string;
}

type WSState = 'connecting' | 'connected' | 'error' | 'disconnected';

const GW_URL = process.env.NEXT_PUBLIC_GATEWAY_WS || 'ws://localhost:18789';
const GW_TOKEN = process.env.NEXT_PUBLIC_GATEWAY_TOKEN || '';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [wsState, setWsState] = useState<WSState>('connecting');
  const [currentReply, setCurrentReply] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const replyBufRef = useRef('');
  const runIdRef = useRef<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentReply]);

  const connect = useCallback(() => {
    setWsState('connecting');
    const ws = new WebSocket(GW_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      // authenticate
      ws.send(JSON.stringify({
        type: 'connect',
        params: { auth: { token: GW_TOKEN } },
      }));
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);

        if (msg.type === 'connect.ack') {
          setWsState('connected');
          // load recent history
          ws.send(JSON.stringify({ type: 'chat.history', params: { limit: 20 } }));
          return;
        }

        if (msg.type === 'connect.error') {
          setWsState('error');
          return;
        }

        if (msg.type === 'chat.history') {
          const items: Message[] = (msg.history || [])
            .filter((m: any) => m.role === 'user' || m.role === 'assistant')
            .map((m: any) => ({
              role: m.role,
              text: typeof m.content === 'string'
                ? m.content
                : m.content?.find((c: any) => c.type === 'text')?.text || '',
              ts: new Date(m.timestamp || Date.now()).toLocaleTimeString('uk-UA'),
            }))
            .filter((m: Message) => m.text);
          setMessages(items.slice(-20));
          return;
        }

        // streaming assistant reply
        if (msg.type === 'chat' && msg.event === 'delta' && msg.runId === runIdRef.current) {
          replyBufRef.current += msg.delta || '';
          setCurrentReply(replyBufRef.current);
          return;
        }

        if (msg.type === 'chat' && msg.event === 'done' && msg.runId === runIdRef.current) {
          const finalText = replyBufRef.current;
          setMessages(prev => [...prev, {
            role: 'assistant',
            text: finalText,
            ts: new Date().toLocaleTimeString('uk-UA'),
          }]);
          replyBufRef.current = '';
          runIdRef.current = null;
          setCurrentReply('');
          return;
        }

        // non-streaming: full reply in single event
        if (msg.type === 'chat' && msg.text && !runIdRef.current) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            text: msg.text,
            ts: new Date().toLocaleTimeString('uk-UA'),
          }]);
          return;
        }

      } catch {/* ignore parse errors */}
    };

    ws.onerror = () => setWsState('error');
    ws.onclose = () => {
      setWsState('disconnected');
      setTimeout(connect, 3000); // auto-reconnect
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    return () => { ws.close(); };
  }, [connect]);

  function send() {
    if (!input.trim() || wsState !== 'connected' || runIdRef.current) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text, ts: new Date().toLocaleTimeString('uk-UA') }]);

    const runId = `web-${Date.now()}`;
    runIdRef.current = runId;
    replyBufRef.current = '';

    wsRef.current?.send(JSON.stringify({
      type: 'chat.send',
      runId,
      params: { message: text },
    }));
  }

  const statusColor: Record<WSState, string> = {
    connecting: 'text-yellow-600',
    connected: 'text-green-400',
    error: 'text-red-500',
    disconnected: 'text-red-700',
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col">
      {/* Header */}
      <div className="border-b border-green-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <div className="font-bold">Petrulio</div>
            <div className={`text-xs flex items-center gap-1 ${statusColor[wsState]}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${wsState === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {wsState}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="http://localhost:18789" target="_blank" rel="noreferrer" className="text-green-800 hover:text-green-500 text-xs">
            full control ui ↗
          </a>
          <Link href="/" className="text-green-800 hover:text-green-500">← home</Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-h-[calc(100vh-140px)]">
        {messages.length === 0 && wsState === 'connected' && (
          <div className="text-green-800 text-sm text-center py-8">
            🚀 Petrulio is ready. Say something.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg shrink-0 mt-1">{m.role === 'assistant' ? '🚀' : '👤'}</span>
            <div className={`max-w-2xl ${m.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap border ${
                m.role === 'assistant'
                  ? 'border-green-800 text-green-300 bg-green-950/20'
                  : 'border-green-500 text-green-100'
              }`}>
                {m.text}
              </div>
              <div className="text-green-900 text-xs mt-1">{m.ts}</div>
            </div>
          </div>
        ))}
        {currentReply && (
          <div className="flex gap-3">
            <span className="text-lg shrink-0 mt-1">🚀</span>
            <div className="border border-green-800 px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap text-green-300 bg-green-950/20 max-w-2xl">
              {currentReply}
              <span className="animate-pulse">▌</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-green-900 px-6 py-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={wsState === 'connected' ? 'Message Petrulio...' : `${wsState}...`}
          disabled={wsState !== 'connected'}
          className="flex-1 bg-black border border-green-800 px-4 py-2 text-green-300 text-sm outline-none focus:border-green-500 placeholder:text-green-900 disabled:opacity-40"
        />
        <button
          onClick={send}
          disabled={wsState !== 'connected' || !input.trim() || !!runIdRef.current}
          className="border border-green-500 px-6 py-2 text-sm hover:bg-green-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

const CHANNELS = ['linkedin', 'email', 'telegram', 'instagram', 'other'] as const;

type FormState = {
  target: string;
  product: string;
  channel: string;
  fitScore: string;
  signal: string;
  offerAngle: string;
  draft: string;
  notes: string;
};

const INITIAL_STATE: FormState = {
  target: '',
  product: 'ГОЛОС',
  channel: 'linkedin',
  fitScore: '70',
  signal: '',
  offerAngle: '',
  draft: '',
  notes: '',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-green-900 text-[10px] uppercase tracking-widest">{children}</label>;
}

export default function AgentRunForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setForm(INITIAL_STATE);
    setError('');
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    startTransition(async () => {
      const response = await fetch('/mc/api/agent-runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fitScore: Number(form.fitScore),
          approvalStatus: 'draft',
          outcome: 'not_sent',
          ownerAgent: 'Pipeline Scout',
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'failed to create run' }));
        setError(body.error ?? 'failed to create run');
        return;
      }

      reset();
      setOpen(false);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border border-dashed border-cyan-900 bg-cyan-950/10 text-cyan-300 hover:border-cyan-500 hover:text-cyan-100 px-4 py-3 text-sm text-left"
      >
        + create approval draft
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="border border-cyan-900 bg-cyan-950/10 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div>
          <div className="text-cyan-300 font-bold">New Pipeline Scout draft</div>
          <p className="text-cyan-800 text-xs mt-1">Creates a Mission Control record only. No sending, no CRM write.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { reset(); setOpen(false); }}
            className="border border-green-950 text-green-800 hover:text-green-400 px-3 py-1 text-xs"
          >
            cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="border border-cyan-700 text-cyan-300 hover:text-cyan-100 hover:border-cyan-400 px-3 py-1 text-xs disabled:opacity-50"
          >
            {isPending ? 'saving...' : 'save draft'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px_160px] gap-3 mb-3">
        <div>
          <FieldLabel>target</FieldLabel>
          <input
            required
            value={form.target}
            onChange={(event) => update('target', event.target.value)}
            placeholder="Person, company, community..."
            className="mt-1 w-full bg-black border border-green-950 text-green-200 px-3 py-2 text-sm outline-none placeholder:text-green-950 focus:border-cyan-700"
          />
        </div>
        <div>
          <FieldLabel>product</FieldLabel>
          <input
            value={form.product}
            onChange={(event) => update('product', event.target.value)}
            className="mt-1 w-full bg-black border border-green-950 text-green-400 px-3 py-2 text-sm outline-none focus:border-cyan-700"
          />
        </div>
        <div>
          <FieldLabel>channel</FieldLabel>
          <select
            value={form.channel}
            onChange={(event) => update('channel', event.target.value)}
            className="mt-1 w-full bg-black border border-green-950 text-green-400 px-3 py-2 text-sm outline-none focus:border-cyan-700"
          >
            {CHANNELS.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-3 mb-3">
        <div>
          <FieldLabel>fit score</FieldLabel>
          <input
            type="number"
            min="0"
            max="100"
            value={form.fitScore}
            onChange={(event) => update('fitScore', event.target.value)}
            className="mt-1 w-full bg-black border border-green-950 text-green-400 px-3 py-2 text-sm outline-none focus:border-cyan-700"
          />
        </div>
        <div>
          <FieldLabel>offer angle</FieldLabel>
          <input
            value={form.offerAngle}
            onChange={(event) => update('offerAngle', event.target.value)}
            placeholder="One reason the offer fits this target..."
            className="mt-1 w-full bg-black border border-green-950 text-green-200 px-3 py-2 text-sm outline-none placeholder:text-green-950 focus:border-cyan-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <FieldLabel>signal</FieldLabel>
          <textarea
            required
            value={form.signal}
            onChange={(event) => update('signal', event.target.value)}
            placeholder="Why this target is relevant now..."
            rows={5}
            className="mt-1 w-full resize-none bg-black border border-green-950 text-green-200 px-3 py-2 text-sm outline-none placeholder:text-green-950 focus:border-cyan-700"
          />
        </div>
        <div>
          <FieldLabel>draft</FieldLabel>
          <textarea
            required
            value={form.draft}
            onChange={(event) => update('draft', event.target.value)}
            placeholder="Short outreach draft for Nazar to approve/edit..."
            rows={5}
            className="mt-1 w-full resize-none bg-black border border-green-950 text-green-200 px-3 py-2 text-sm outline-none placeholder:text-green-950 focus:border-cyan-700"
          />
        </div>
      </div>

      <div className="mt-3">
        <FieldLabel>notes</FieldLabel>
        <input
          value={form.notes}
          onChange={(event) => update('notes', event.target.value)}
          placeholder="Optional internal note..."
          className="mt-1 w-full bg-black border border-green-950 text-green-500 px-3 py-2 text-sm outline-none placeholder:text-green-950 focus:border-cyan-700"
        />
      </div>

      {error && <div className="mt-3 text-red-400 text-xs border border-red-950 p-2">{error}</div>}
    </form>
  );
}

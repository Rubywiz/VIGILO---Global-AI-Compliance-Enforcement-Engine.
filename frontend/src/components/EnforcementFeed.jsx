import React, { useState, useEffect, useRef } from 'react'

const INITIAL_EVENTS = [
  {
    id: 1,
    time: '14:02',
    title: 'Hiring Agent flagged',
    description: 'Bias Risk Detected — Article 10 violation in CV screening pipeline',
    badge: 'HIGH',
    color: '#DC2626',
    dotColor: 'bg-crimson-500',
    glowColor: 'shadow-crimson-500/20',
  },
  {
    id: 2,
    time: '14:03',
    title: 'Compliance Score: 63',
    description: 'Below minimum threshold (70) — report generated',
    badge: 'WARNING',
    color: '#F59E0B',
    dotColor: 'bg-amber-500',
    glowColor: 'shadow-amber-500/20',
  },
  {
    id: 3,
    time: '14:03',
    title: 'Escrow Status: LOCKED',
    description: 'Smart contract enforced — 5,000 USDC held on Circle Arc',
    badge: 'CRITICAL',
    color: '#DC2626',
    dotColor: 'bg-crimson-500',
    glowColor: 'shadow-crimson-500/20',
  },
  {
    id: 4,
    time: '14:05',
    title: 'Developer notified',
    description: 'Via: admin@talentai.dev — 2 remediation steps pending',
    badge: 'INFO',
    color: '#6C63FF',
    dotColor: 'bg-accent',
    glowColor: 'shadow-accent/20',
  },
  {
    id: 5,
    time: '14:08',
    title: 'System re-scanned',
    description: 'Full audit cycle completed in 6.2s — no new violations',
    badge: 'CLEAR',
    color: '#2DD4BF',
    dotColor: 'bg-teal-500',
    glowColor: 'shadow-teal-500/20',
  },
]

const NEW_EVENTS = [
  {
    title: 'Risk threshold breached',
    description: 'Article 9 — risk management score dropped to 41',
    badge: 'HIGH',
    color: '#DC2626',
    dotColor: 'bg-crimson-500',
    glowColor: 'shadow-crimson-500/20',
  },
  {
    title: 'Data governance alert',
    description: 'Training data provenance unverified — 3 sources flagged',
    badge: 'WARNING',
    color: '#F59E0B',
    dotColor: 'bg-amber-500',
    glowColor: 'shadow-amber-500/20',
  },
  {
    title: 'Human oversight OK',
    description: 'Article 14 — manual override confirmed for all high-risk decisions',
    badge: 'CLEAR',
    color: '#2DD4BF',
    dotColor: 'bg-teal-500',
    glowColor: 'shadow-teal-500/20',
  },
  {
    title: 'Wallet verified',
    description: 'Circle Arc escrow wallet confirmed at 42,000 USDC',
    badge: 'INFO',
    color: '#6C63FF',
    dotColor: 'bg-accent',
    glowColor: 'shadow-accent/20',
  },
  {
    title: 'Audit log sync',
    description: 'Blockchain audit trail — last 1,247 events verified',
    badge: 'INFO',
    color: '#6C63FF',
    dotColor: 'bg-accent',
    glowColor: 'shadow-accent/20',
  },
  {
    title: 'Model bias detected',
    description: 'Demographic parity ratio 0.62 — below 0.80 threshold',
    badge: 'HIGH',
    color: '#DC2626',
    dotColor: 'bg-crimson-500',
    glowColor: 'shadow-crimson-500/20',
  },
]

function EnforcementEvent({ event, isLatest }) {
  return (
    <div className={`relative flex gap-4 px-4 py-3 rounded-xl transition-all duration-300
      ${isLatest ? 'bg-accent/[0.03] border border-accent/[0.06]' : 'hover:bg-white/[0.02]'}`}
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full ${event.dotColor} ${event.glowColor} shadow-sm flex-shrink-0 mt-1.5`} />
        <div className="w-px flex-1 bg-white/[0.04] mt-1.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-3">
        <div className="flex items-center justify-between gap-3 mb-0.5">
          <span className="text-[11px] font-medium text-slate-600 tabular-nums tracking-wide">
            {event.time}
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-widest"
            style={{
              backgroundColor: `${event.color}15`,
              color: event.color,
            }}
          >
            {event.badge}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-200 truncate">{event.title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
          {event.description}
        </p>
      </div>
    </div>
  )
}

export default function EnforcementFeed() {
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [counter, setCounter] = useState(5)
  const containerRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const nextId = counter + 1
      const source = NEW_EVENTS[(nextId - 6) % NEW_EVENTS.length]
      const hour = new Date().getHours().toString().padStart(2, '0')
      const minute = new Date().getMinutes().toString().padStart(2, '0')

      const newEvent = {
        id: nextId,
        time: `${hour}:${minute}`,
        title: source.title,
        description: source.description,
        badge: source.badge,
        color: source.color,
        dotColor: source.dotColor,
        glowColor: source.glowColor,
      }

      setEvents(prev => [newEvent, ...prev].slice(0, 20))
      setCounter(nextId)
    }, 12000)

    return () => clearInterval(interval)
  }, [counter])

  return (
    <div className="bg-surface-900/30 rounded-2xl border border-white/[0.04] overflow-hidden shadow-premium">
      <div className="px-5 py-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-teal-500/80 shadow-lg shadow-teal-500/30" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-teal-500/40 animate-ping" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 tracking-tight">Enforcement Feed</h3>
              <p className="text-[11px] text-slate-600">Live compliance events</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-700 tabular-nums">
            {events.length} events
          </span>
        </div>
      </div>

      <div ref={containerRef} className="divide-y divide-white/[0.02] max-h-[420px] overflow-y-auto scrollbar-thin">
        {events.map((event, i) => (
          <EnforcementEvent key={event.id} event={event} isLatest={i === 0} />
        ))}
      </div>
    </div>
  )
}

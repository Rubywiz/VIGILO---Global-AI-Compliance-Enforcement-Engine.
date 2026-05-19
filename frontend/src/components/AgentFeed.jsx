import React, { useEffect, useRef, useCallback, memo, useState } from 'react'

const STEP_ICONS = {
  pipeline: '\u2699',
  extract: '\ud83d\udcc2',
  classification: '\u2696',
  code_analysis: '\ud83d\udcbb',
  violations: '\ud83d\udea8',
  scoring: '\ud83e\udde0',
  report: '\ud83d\udcdd',
}

const STEP_LABELS = {
  pipeline: 'Pipeline',
  extract: 'Extracting content',
  classification: 'Classifying risk tier',
  code_analysis: 'Analyzing code',
  violations: 'Violations',
  scoring: 'Scoring articles',
  report: 'Generating report',
}

function StatusIcon({ status }) {
  switch (status) {
    case 'running':
      return (
        <svg
          className="w-4 h-4 animate-spin-slow text-accent"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )
    case 'complete':
      return (
        <svg
          className="w-4 h-4 text-teal-400 animate-pop-in"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg
          className="w-4 h-4 text-crimson-400 animate-pop-in"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    default:
      return <div className="w-4 h-4 rounded-full border border-white/[0.06]" aria-hidden="true" />
  }
}

const FeedItem = memo(function FeedItem({ step, index }) {
  const icon = STEP_ICONS[step.step] || '\u2022'
  const label = STEP_LABELS[step.step] || step.step

  return (
    <div
      className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl animate-fade-in-up hover:bg-white/[0.02] transition-colors"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="text-base flex-shrink-0 w-6 text-center text-slate-500" aria-hidden="true">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300 capitalize">{label}</span>
          {step.status === 'running' && step.step === 'scoring' && step.message ? (
            <span className="text-xs text-slate-600 truncate">{step.message}</span>
          ) : null}
        </div>
        {step.status === 'complete' && step.message ? (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{step.message}</p>
        ) : null}
        {step.status === 'error' && step.message ? (
          <p className="text-xs text-crimson-400 mt-0.5 truncate">{step.message}</p>
        ) : null}
      </div>
      <div className="flex-shrink-0">
        <StatusIcon status={step.status} />
      </div>
    </div>
  )
})

export default function AgentFeed({ sessionId, onReport, onError, steps: externalSteps }) {
  const [localSteps, setLocalSteps] = useState([])
  const wsRef = useRef(null)
  const retriesRef = useRef(0)
  const timerRef = useRef(null)

  const steps = externalSteps || localSteps

  const connectWs = useCallback((sid) => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const url = `${protocol}//${host}/ws/${sid}`
    const ws = new WebSocket(url)

    ws.onopen = () => {
      retriesRef.current = 0
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLocalSteps(prev => [...prev, { ...data, timestamp: Date.now() }])

        if (data.step === 'pipeline') {
          if (data.status === 'complete' && onReport && data.data?.report) {
            onReport(data.data.report)
          } else if (data.status === 'error' && onError) {
            onError(data.message || 'Pipeline failed')
          }
        }
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      wsRef.current = null
      const backoff = Math.min(1000 * Math.pow(2, retriesRef.current), 30000)
      retriesRef.current += 1
      timerRef.current = setTimeout(() => {
        connectWs(sid)
      }, backoff)
    }

    ws.onerror = () => ws.close()
    wsRef.current = ws
  }, [onReport])

  useEffect(() => {
    if (!sessionId) {
      setLocalSteps([])
      return
    }
    connectWs(sessionId)
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      retriesRef.current = 0
    }
  }, [sessionId, connectWs])

  if (!steps || steps.length === 0) return null

  return (
    <div className="space-y-0.5">
      {steps.map((step, i) => (
        <FeedItem key={`${step.step}-${i}`} step={step} index={i} />
      ))}
    </div>
  )
}

import React, { memo } from 'react'

const STEP_ICONS = {
  pipeline: '⚙',
  extract: '📂',
  classification: '⚖',
  code_analysis: '💻',
  violations: '🚨',
  scoring: '🧠',
  report: '📝',
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
          className="w-4 h-4 text-emerald-400 animate-pop-in"
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
          className="w-4 h-4 text-red-400 animate-pop-in"
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
      return <div className="w-4 h-4 rounded-full border border-slate-600" aria-hidden="true" />
  }
}

const FeedItem = memo(function FeedItem({ step, index }) {
  const icon = STEP_ICONS[step.step] || '•'
  const label = STEP_LABELS[step.step] || step.step

  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded-lg animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="text-base flex-shrink-0 w-6 text-center" aria-hidden="true">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300 capitalize">{label}</span>
          {step.status === 'running' && step.step === 'scoring' && step.message ? (
            <span className="text-xs text-slate-500 truncate">{step.message}</span>
          ) : null}
        </div>
        {step.status === 'complete' && step.message ? (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{step.message}</p>
        ) : null}
        {step.status === 'error' && step.message ? (
          <p className="text-xs text-red-400 mt-0.5 truncate">{step.message}</p>
        ) : null}
      </div>
      <div className="flex-shrink-0">
        <StatusIcon status={step.status} />
      </div>
    </div>
  )
})

export default function AgentFeed({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <FeedItem key={`${step.step}-${i}`} step={step} index={i} />
      ))}
    </div>
  )
}

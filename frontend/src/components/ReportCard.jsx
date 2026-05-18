import React, { useRef, useEffect, useMemo, memo } from 'react'

const RISK_COLORS = {
  UNACCEPTABLE: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', gauge: '#ef4444' },
  HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', gauge: '#f97316' },
  LIMITED: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', gauge: '#eab308' },
  MINIMAL: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', gauge: '#22c55e' },
}

const ARTICLE_NAMES = {
  ARTICLE_9: 'Risk Management',
  ARTICLE_10: 'Data Governance',
  ARTICLE_11: 'Technical Documentation',
  ARTICLE_13: 'Transparency & User Info',
  ARTICLE_14: 'Human Oversight',
  ARTICLE_15: 'Accuracy & Robustness',
}

function ArticleBar({ name, score, pass, delay }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-36 shrink-0">{name}</span>
      <div className="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            animation: `barFill 0.6s ease-out ${delay}s forwards`,
            width: 0,
            backgroundColor: score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444',
          }}
        />
      </div>
      <span
        className={`text-xs font-medium w-8 text-right tabular-nums ${pass ? 'text-emerald-400' : 'text-red-400'}`}
      >
        {score}
      </span>
    </div>
  )
}

const ReportCard = memo(function ReportCard({ report }) {
  if (!report) return null

  const summary = report.executive_summary || {}
  const risk = report.risk_tier_verdict || {}
  const articleScores = report.article_scores || {}
  const violations = report.violations || []
  const remediation = report.remediation_steps || []
  const compliance = report.compliance_summary || {}

  const colors = useMemo(
    () => RISK_COLORS[risk.tier] || RISK_COLORS.LIMITED,
    [risk.tier]
  )
  const overallScore = compliance.overall_score || summary.overall_compliance_score || 0

  const scoreColor = overallScore >= 70 ? '#22c55e' : overallScore >= 50 ? '#eab308' : '#ef4444'

  const gaugeRef = useRef(null)

  useEffect(() => {
    if (gaugeRef.current) {
      const circumference = 2 * Math.PI * 42
      const offset = circumference - (overallScore / 100) * circumference
      gaugeRef.current.style.setProperty('--target-offset', offset)
      gaugeRef.current.style.strokeDasharray = circumference
      gaugeRef.current.style.strokeDashoffset = circumference
      requestAnimationFrame(() => {
        gaugeRef.current.style.strokeDashoffset = offset
      })
    }
  }, [overallScore])

  const handleDownload = () => {
    const json = JSON.stringify(report, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vigilo-compliance-report.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const riskTextColor = risk.tier === 'UNACCEPTABLE'
    ? 'text-red-400'
    : risk.tier === 'HIGH'
      ? 'text-orange-400'
      : risk.tier === 'LIMITED'
        ? 'text-yellow-400'
        : 'text-emerald-400'

  const violationsCount = compliance.total_violations || violations.length
  const articlesPassed = compliance.articles_passed
  const totalArticles = compliance.total_articles
  const articlesFailed = compliance.articles_failed

  const articleEntries = Object.entries(articleScores)

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Compliance Report</h3>
          <p className="text-xs text-slate-500 mt-0.5">{summary.system_name}</p>
        </div>
        <span className={`text-xl font-bold ${riskTextColor}`}>
          {summary.verdict}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-6">
        <div className="flex flex-col items-center justify-center relative">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a2e" strokeWidth="8" />
            <circle
              ref={gaugeRef}
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              className="conic-gauge"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-white tabular-nums">{overallScore}</span>
            <span className="text-[10px] text-slate-500 -mt-1">/ 100</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
            <span>{risk.tier}</span>
            <span className="text-slate-500">Risk</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{risk.description}</p>
          <div className="flex gap-4 text-xs tabular-nums">
            <div>
              <span className="text-slate-500">Articles Passed: </span>
              <span className="text-emerald-400 font-medium">{articlesPassed}/{totalArticles}</span>
            </div>
            <div>
              <span className="text-slate-500">Failed: </span>
              <span className="text-red-400 font-medium">{articlesFailed}</span>
            </div>
            <div>
              <span className="text-slate-500">Violations: </span>
              <span className="text-red-400 font-medium">{violationsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {articleEntries.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-300">Article Scores</h4>
          {articleEntries.map(([key, val], i) => (
            <ArticleBar
              key={key}
              name={ARTICLE_NAMES[key] || key}
              score={val.score}
              pass={val.pass}
              delay={0.1 + i * 0.08}
            />
          ))}
        </div>
      ) : null}

      {violations.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Violations
          </h4>
          {violations.map((v, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-red-300 bg-red-500/5 rounded-lg px-3 py-2">
              <span className="text-red-500 mt-0.5" aria-hidden="true">&bull;</span>
              <span>{v.description || v}</span>
            </div>
          ))}
        </div>
      ) : null}

      {remediation.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-300">Remediation Steps</h4>
          <ol className="space-y-1.5">
            {remediation.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400 bg-surface-800/50 rounded-lg px-3 py-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-center leading-5 text-[10px] font-semibold">
                  {r.step}
                </span>
                <div className="flex-1">
                  <span>{r.action}</span>
                  <span className="text-slate-600 ml-2">({r.article})</span>
                </div>
                <span className={`text-[10px] font-medium ${r.priority === 'CRITICAL' ? 'text-red-400' : r.priority === 'HIGH' ? 'text-orange-400' : 'text-yellow-400'}`}>
                  {r.priority}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <button
        onClick={handleDownload}
        className="w-full py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-medium
                   hover:bg-accent/20 transition-colors border border-accent/20"
      >
        Download Report
      </button>
    </div>
  )
})

export default ReportCard

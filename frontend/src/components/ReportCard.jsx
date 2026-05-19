import React, { useRef, useEffect, useMemo, memo } from 'react'

const RISK_COLORS = {
  UNACCEPTABLE: { bg: 'bg-crimson-500/15', text: 'text-crimson-400', border: 'border-crimson-500/25', gauge: '#DC2626' },
  HIGH: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/25', gauge: '#f97316' },
  LIMITED: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/25', gauge: '#F59E0B' },
  MINIMAL: { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/25', gauge: '#2DD4BF' },
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
      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            animation: `barFill 0.6s ease-out ${delay}s forwards`,
            width: 0,
            backgroundColor: score >= 70 ? '#2DD4BF' : score >= 50 ? '#F59E0B' : '#DC2626',
          }}
        />
      </div>
      <span
        className={`text-xs font-medium w-8 text-right tabular-nums ${pass ? 'text-teal-400' : 'text-crimson-400'}`}
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

  const scoreColor = overallScore >= 70 ? '#2DD4BF' : overallScore >= 50 ? '#F59E0B' : '#DC2626'

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
    ? 'text-crimson-400'
    : risk.tier === 'HIGH'
      ? 'text-orange-400'
      : risk.tier === 'LIMITED'
        ? 'text-amber-400'
        : 'text-teal-400'

  const violationsCount = compliance.total_violations || violations.length
  const articlesPassed = compliance.articles_passed
  const totalArticles = compliance.total_articles
  const articlesFailed = compliance.articles_failed

  const articleEntries = Object.entries(articleScores)

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Compliance Report</h3>
          <p className="text-xs text-slate-500 mt-0.5">{summary.system_name}</p>
        </div>
        <span className={`text-lg font-bold ${riskTextColor}`}>
          {summary.verdict}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-5">
        <div className="flex flex-col items-center justify-center relative">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
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
              <span className="text-slate-500">Passed: </span>
              <span className="text-teal-400 font-medium">{articlesPassed}/{totalArticles}</span>
            </div>
            <div>
              <span className="text-slate-500">Failed: </span>
              <span className="text-crimson-400 font-medium">{articlesFailed}</span>
            </div>
            <div>
              <span className="text-slate-500">Violations: </span>
              <span className="text-crimson-400 font-medium">{violationsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {articleEntries.length > 0 ? (
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Article Scores</h4>
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
          <h4 className="text-xs font-semibold text-crimson-400 uppercase tracking-wider flex items-center gap-2">
            Violations
          </h4>
          {violations.map((v, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-crimson-400/80 bg-crimson-500/5 rounded-xl px-3.5 py-2.5 border border-crimson-500/10">
              <span className="text-crimson-500 mt-0.5" aria-hidden="true">&bull;</span>
              <span>{v.description || v}</span>
            </div>
          ))}
        </div>
      ) : null}

      {remediation.length > 0 ? (
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Remediation Steps</h4>
          <ol className="space-y-2">
            {remediation.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 bg-white/[0.02] rounded-xl px-3.5 py-3 border border-white/[0.04]">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-center leading-5 text-[10px] font-semibold">
                  {r.step}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-slate-300">{r.action}</span>
                  <span className="text-slate-600 ml-2">({r.article})</span>
                </div>
                <span className={`text-[10px] font-medium flex-shrink-0 ${
                  r.priority === 'CRITICAL' ? 'text-crimson-400' :
                  r.priority === 'HIGH' ? 'text-orange-400' : 'text-amber-400'
                }`}>
                  {r.priority}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <button
        onClick={handleDownload}
        className="w-full py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium
                   hover:bg-accent/20 transition-all duration-200 border border-accent/20
                   hover:border-accent/30 active:scale-[0.98]"
      >
        Download Report
      </button>
    </div>
  )
})

export default ReportCard

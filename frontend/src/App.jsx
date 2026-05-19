import React, { useState, useCallback } from 'react'
import SignInPage from './SignInPage'
import UploadZone from './components/UploadZone'
import AgentFeed from './components/AgentFeed'
import VoiceInput from './components/VoiceInput'
import ReportCard from './components/ReportCard'
import EnforcementFeed from './components/EnforcementFeed'

const METRICS = [
  { label: 'AI Agents Monitored', value: '31', sub: 'Across 8 organizations' },
  { label: 'Compliance Cases', value: '8', sub: '4 high-risk flagged' },
  { label: 'Escrow Protected', value: '$42,000', sub: 'Circle Arc secured' },
  { label: 'Risk Events', value: '2', sub: 'Requires attention' },
]

const API_BASE = 'https://untrading-irrelevantly-dustin.ngrok-free.dev'

function Dashboard() {
  const [mode, setMode] = useState('document')
  const [sessionId, setSessionId] = useState(null)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const connectWebSocket = useCallback((sid) => {
    setSessionId(sid)
    setUploading(false)
    setReport(null)
    setError(null)
  }, [])

  const handleReport = useCallback((reportData) => {
    setReport(reportData)
    setUploading(false)
  }, [])

  const handleError = useCallback((msg) => {
    setError(msg)
    setUploading(false)
  }, [])

  const uploadFile = useCallback(async (file) => {
    setSessionId(null)
    setReport(null)
    setError(null)
    setUploading(true)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: form,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.detail || `Upload failed (${res.status})`)
        setUploading(false)
        return
      }

      connectWebSocket(data.session_id)
    } catch {
      setError('Failed to upload file')
      setUploading(false)
    }
  }, [connectWebSocket])

  const handleTranscription = useCallback((text) => {
    setSessionId(null)
    setReport(null)
    setError(null)
    setUploading(true)

    const blob = new Blob([text], { type: 'text/plain' })
    const file = new File([blob], 'voice-transcript.txt', { type: 'text/plain' })
    uploadFile(file)
  }, [uploadFile])

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-950">
      <header className="flex-shrink-0 border-b border-white/[0.04] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-sm font-display text-white tracking-tight leading-none">
                    VIGILO
                  </h1>
                  <p className="text-[9px] font-medium text-accent-400/70 tracking-[0.2em] uppercase">
                    Control Center
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/[0.04]">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-sm shadow-teal-500/40" />
                <span className="text-[11px] text-slate-500">All Systems Nominal</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <VoiceInput onTranscription={handleTranscription} disabled={uploading} />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                uploading
                  ? 'bg-amber-500/10 border border-amber-500/20'
                  : 'bg-teal-500/5 border border-teal-500/10'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  uploading ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'
                }`} />
                <span className="text-[10px] font-medium text-slate-500">
                  {uploading ? 'Processing' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3
                           hover:bg-white/[0.03] transition-colors"
              >
                <p className="text-lg font-semibold text-white tabular-nums tracking-tight">
                  {m.value}
                </p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {m.label}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {m.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 flex min-h-0 max-w-7xl mx-auto w-full px-6 py-6 gap-6">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex gap-1.5 bg-white/[0.02] rounded-xl p-1 self-start border border-white/[0.04]">
            <button
              onClick={() => setMode('document')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                mode === 'document'
                  ? 'bg-accent/10 text-accent-300 shadow-sm border border-accent/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Document
            </button>
            <button
              onClick={() => setMode('code')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                mode === 'code'
                  ? 'bg-accent/10 text-accent-300 shadow-sm border border-accent/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Code
            </button>
          </div>

          <UploadZone mode={mode} connectWebSocket={connectWebSocket} disabled={uploading} />

          {error ? (
            <div className="text-xs text-crimson-400 bg-crimson-500/10 rounded-xl px-4 py-3 border border-crimson-500/10">
              {error}
            </div>
          ) : null}

          {sessionId ? (
            <div className="flex-1 glass-panel rounded-2xl p-4 overflow-y-auto scrollbar-thin min-h-0">
              <AgentFeed sessionId={sessionId} onReport={handleReport} onError={handleError} />
            </div>
          ) : null}
        </div>

        <div className="w-[360px] flex-shrink-0 flex flex-col gap-4 min-h-0">
          {report ? (
            <div className="flex-1 glass-panel rounded-2xl p-5 overflow-y-auto scrollbar-thin min-h-0">
              <ReportCard report={report} />
            </div>
          ) : (
            <div className="flex-1 glass-panel rounded-2xl flex items-center justify-center p-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">Upload a file to begin</p>
                <p className="text-[11px] text-slate-700 max-w-[200px] mx-auto leading-relaxed">
                  VIGILO will analyze your AI system against EU AI Act obligations
                </p>
              </div>
            </div>
          )}

          <div className="flex-shrink-0">
            <EnforcementFeed />
          </div>
        </div>
      </main>

      <footer className="flex-shrink-0 border-t border-white/[0.04] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[10px] text-slate-700 tracking-wide">
            VIGILO v1.0 &mdash; Autonomous AI Compliance Agent
          </span>
          <span className="text-[10px] text-slate-700 tabular-nums">
            {sessionId
              ? `Session: ${sessionId.slice(0, 8)}...`
              : 'Awaiting input'}
          </span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('vigilo_auth') === 'true'
  })

  const handleSignIn = useCallback(() => {
    sessionStorage.setItem('vigilo_auth', 'true')
    setAuthenticated(true)
  }, [])

  if (!authenticated) {
    return <SignInPage onSignIn={handleSignIn} />
  }

  return <Dashboard />
}

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import UploadZone from './components/UploadZone'
import AgentFeed from './components/AgentFeed'
import VoiceInput from './components/VoiceInput'
import ReportCard from './components/ReportCard'

function App() {
  const [mode, setMode] = useState('document')
  const [sessionId, setSessionId] = useState(null)
  const [steps, setSteps] = useState([])
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)

  const connectWs = useCallback((sid) => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const url = `${protocol}//${host}/ws/${sid}`
    const ws = new WebSocket(url)

    ws.onopen = () => {
      if (reconnectRef.current) {
        clearInterval(reconnectRef.current)
        reconnectRef.current = null
      }
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setSteps(prev => [...prev, { ...data, timestamp: Date.now() }])

      if (data.step === 'pipeline') {
        if (data.status === 'complete') {
          setReport(data.data?.report || null)
          setUploading(false)
        } else if (data.status === 'error') {
          setError(data.message || 'Pipeline failed')
          setUploading(false)
        }
      }
    }

    ws.onclose = () => {
      if (!reconnectRef.current) {
        reconnectRef.current = setInterval(() => {
          connectWs(sid)
        }, 3000)
      }
    }

    ws.onerror = () => ws.close()
    wsRef.current = ws
  }, [])

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (reconnectRef.current) clearInterval(reconnectRef.current)
    }
  }, [])

  const uploadFile = useCallback(async (file) => {
    setSteps([])
    setReport(null)
    setError(null)
    setUploading(true)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: form,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Upload failed')
        setUploading(false)
        return
      }

      setSessionId(data.session_id)
      connectWs(data.session_id)
    } catch (err) {
      setError('Failed to upload file')
      setUploading(false)
    }
  }, [connectWs])

  const handleTranscription = useCallback((text) => {
    setSteps([])
    setReport(null)
    setError(null)
    setUploading(true)

    const blob = new Blob([text], { type: 'text/plain' })
    const file = new File([blob], 'voice-transcript.txt', { type: 'text/plain' })
    uploadFile(file)
  }, [uploadFile])

  const modeTabs = useMemo(() => (
    <div className="flex gap-1 bg-surface-900 rounded-lg p-1 self-start">
      <button
        onClick={() => setMode('document')}
        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
          mode === 'document'
            ? 'bg-surface-800 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        Document
      </button>
      <button
        onClick={() => setMode('code')}
        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
          mode === 'code'
            ? 'bg-surface-800 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        Code
      </button>
    </div>
  ), [mode])

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-950">
      <header className="flex-shrink-0 border-b border-surface-800 px-6 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">&#x1F6E1;&#xFE0F;</span>
            <h1 className="text-lg font-bold text-white tracking-tight">VIGILO</h1>
            <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest bg-surface-800 px-2 py-0.5 rounded">
              EU AI Act Compliance
            </span>
          </div>
          <div className="flex items-center gap-3">
            <VoiceInput onTranscription={handleTranscription} disabled={uploading} />
            <div className={`w-2 h-2 rounded-full ${uploading ? 'bg-accent animate-pulse' : 'bg-emerald-500'}`} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-stretch max-w-6xl mx-auto w-full px-6 py-6 gap-6 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {modeTabs}

          <UploadZone mode={mode} onUpload={uploadFile} disabled={uploading} />

          {error ? (
            <div className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </div>
          ) : null}

          {steps.length > 0 ? (
            <div className="flex-1 bg-surface-900/50 rounded-xl border border-surface-800 p-3 overflow-y-auto scrollbar-thin min-h-0">
              <AgentFeed steps={steps} />
            </div>
          ) : null}
        </div>

        <div className="w-96 flex-shrink-0">
          {report ? (
            <div className="h-full bg-surface-900/50 rounded-xl border border-surface-800 p-5 overflow-y-auto scrollbar-thin">
              <ReportCard report={report} />
            </div>
          ) : (
            <div className="h-full bg-surface-900/30 rounded-xl border border-surface-800 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl text-slate-700" aria-hidden="true">&#x1F6E1;&#xFE0F;</div>
                <p className="text-xs text-slate-600">Upload a file to start</p>
                <p className="text-[10px] text-slate-700 max-w-[200px]">
                  VIGILO will analyze your AI system against EU AI Act obligations
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="flex-shrink-0 border-t border-surface-800 px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[10px] text-slate-700">VIGILO v1.0 &mdash; Autonomous AI Compliance Agent</span>
          <span className="text-[10px] text-slate-700">
            {sessionId ? `Session: ${sessionId.slice(0, 8)}...` : 'Ready'}
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App

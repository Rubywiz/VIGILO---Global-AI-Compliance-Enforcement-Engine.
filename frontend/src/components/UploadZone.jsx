import React, { useState, useRef, useCallback, memo } from 'react'

const API_BASE = 'https://untrading-irrelevantly-dustin.ngrok-free.dev'

const DOC_ACCEPT = '.pdf,.docx,.txt'
const CODE_ACCEPT = '.py,.zip,.js,.ts,.jsx,.tsx'

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const UploadZone = memo(function UploadZone({ mode, disabled, connectWebSocket }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const accept = mode === 'code' ? CODE_ACCEPT : DOC_ACCEPT

  const uploadFile = useCallback(async (file) => {
    setError(null)
    setProcessing(true)
    setSelectedFile(file)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: NGROK_HEADERS,
        body: form,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || `Upload failed (${res.status})`)
      }

      const data = await res.json()
      const sessionId = data.session_id

      if (connectWebSocket) {
        connectWebSocket(sessionId)
      }
    } catch (err) {
      setError(err.message || 'Upload failed')
      setSelectedFile(null)
    } finally {
      setProcessing(false)
    }
  }, [connectWebSocket])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    if (!disabled && !processing) setDragOver(true)
  }, [disabled, processing])

  const onDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const onClick = useCallback(() => {
    if (!disabled && !processing) inputRef.current?.click()
  }, [disabled, processing])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }, [onClick])

  const onChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const disabledState = disabled || processing

  return (
    <div
      onDrop={disabledState ? undefined : onDrop}
      onDragOver={disabledState ? undefined : onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={disabledState ? -1 : 0}
      aria-disabled={disabledState}
      aria-label={selectedFile ? `Processing ${selectedFile.name}` : 'Upload a file for compliance analysis'}
      className={`
        relative rounded-2xl p-10 text-center transition-all duration-300 select-none
        ${disabledState ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'}
        ${dragOver
          ? 'bg-accent/[0.04] border-2 border-accent/40 shadow-lg shadow-accent/10'
          : error
            ? 'bg-crimson-500/5 border-2 border-crimson-500/30'
            : 'bg-white/[0.02] border border-dashed border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03]'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />

      {processing ? (
        <div className="space-y-3 animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-200">{selectedFile?.name}</p>
          <p className="text-xs text-slate-500">{selectedFile ? formatSize(selectedFile.size) : ''}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-accent">
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Processing...</span>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-3 animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-crimson-500/10 border border-crimson-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-crimson-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-200">Upload failed</p>
          <p className="text-xs text-crimson-400">{error}</p>
          <button
            onClick={(e) => { e.stopPropagation(); setError(null); setSelectedFile(null); }}
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-300 transition-colors mt-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
            dragOver
              ? 'bg-accent/10 border-2 border-accent/30 scale-110'
              : 'bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.05]'
          }`}>
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${dragOver ? 'text-accent' : 'text-slate-600 group-hover:text-slate-400'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-400">
              <span className="text-accent font-medium">Click to upload</span>
              <span className="text-slate-600"> or drag and drop</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {mode === 'code'
                ? '.py, .zip, .js, .ts, .jsx, .tsx'
                : '.pdf, .docx, .txt'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
})

export default UploadZone

import React, { useState, useRef, useCallback } from 'react'

export default function VoiceInput({ onTranscription, disabled }) {
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState(null)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const media = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRef.current = media
      chunksRef.current = []

      media.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      media.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await sendAudio(blob)
      }

      media.start()
      setRecording(true)
    } catch {
      setError('Microphone access denied')
    }
  }, [onTranscription])

  const stopRecording = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state === 'recording') {
      mediaRef.current.stop()
    }
    setRecording(false)
  }, [])

  const sendAudio = async (blob) => {
    const form = new FormData()
    form.append('file', blob, 'voice.webm')

    try {
      const res = await fetch('/voice', { method: 'POST', body: form })
      const data = await res.json()
      onTranscription(data.transcript || '')
    } catch {
      setError('Transcription failed')
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled}
        className={`
          relative w-9 h-9 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          ${recording
            ? 'bg-crimson-500/15 text-crimson-400 ring-2 ring-crimson-500/30'
            : 'bg-white/[0.03] text-slate-500 hover:bg-white/[0.06] hover:text-accent border border-white/[0.06]'}
        `}
        title={recording ? 'Stop recording' : 'Voice input'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      {recording && (
        <span className="flex items-center gap-1.5 text-xs text-crimson-400">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 animate-pulse" />
          Recording
        </span>
      )}
      {error && <span className="text-xs text-crimson-400">{error}</span>}
      {!recording && !error && (
        <span className="text-xs text-slate-600">Voice</span>
      )}
    </div>
  )
}

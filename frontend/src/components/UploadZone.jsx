import React, { useState, useRef, useCallback, memo } from 'react'

const DOC_ACCEPT = '.pdf,.docx,.txt'
const CODE_ACCEPT = '.py,.zip,.js,.ts,.jsx,.tsx'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const UploadZone = memo(function UploadZone({ mode, onUpload, disabled }) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef(null)

  const accept = mode === 'code' ? CODE_ACCEPT : DOC_ACCEPT

  const handleFile = useCallback((file) => {
    if (!file) return
    setSelectedFile(file)
    onUpload(file)
  }, [onUpload])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    if (!disabled) setDragOver(true)
  }, [disabled])

  const onDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const onClick = useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }, [onClick])

  const onChange = useCallback((e) => {
    const file = e.target.files[0]
    handleFile(file)
  }, [handleFile])

  return (
    <div
      onDrop={disabled ? undefined : onDrop}
      onDragOver={disabled ? undefined : onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={selectedFile ? `File selected: ${selectedFile.name}` : 'Upload a file for compliance analysis'}
      className={`
        relative rounded-2xl p-10 text-center transition-all duration-300
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'}
        ${dragOver
          ? 'bg-accent/[0.04] border-2 border-accent/40 shadow-lg shadow-accent/10'
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

      {selectedFile ? (
        <div className="space-y-3 animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
          <p className="text-xs text-slate-500">{formatSize(selectedFile.size)}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-accent">
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Processing...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
            dragOver
              ? 'bg-accent/10 border-2 border-accent/30 scale-110'
              : 'bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.05]'
          }`}>
            <svg className={`w-6 h-6 transition-colors duration-300 ${dragOver ? 'text-accent' : 'text-slate-600 group-hover:text-slate-400'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

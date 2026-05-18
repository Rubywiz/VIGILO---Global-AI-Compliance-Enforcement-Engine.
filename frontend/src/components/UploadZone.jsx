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
        relative border-2 border-dashed rounded-xl p-8 text-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent/60'}
        ${dragOver
          ? 'border-accent bg-accent/5 animate-glow-border'
          : 'border-surface-700 bg-surface-900/50'}
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
        <div className="space-y-2">
          <div className="text-3xl" aria-hidden="true">&#x1F4C4;</div>
          <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
          <p className="text-xs text-slate-500">{formatSize(selectedFile.size)}</p>
          <p className="text-xs text-accent animate-pulse">Processing...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-4xl text-slate-600" aria-hidden="true">
            {mode === 'code' ? '\uD83D\uDCE6' : '\uD83D\uDCC4'}
          </div>
          <p className="text-sm text-slate-400">
            <span className="text-accent font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-600">
            {mode === 'code'
              ? '.py, .zip, .js, .ts, .jsx, .tsx'
              : '.pdf, .docx, .txt'}
          </p>
        </div>
      )}
    </div>
  )
})

export default UploadZone

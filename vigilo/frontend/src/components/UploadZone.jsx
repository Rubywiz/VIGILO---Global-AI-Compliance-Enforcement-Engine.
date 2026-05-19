import React, { useCallback, useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';

function UploadZone({ mode, onComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.session_id) {
        onComplete(data.session_id);
      } else {
        alert("Upload failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className={`w-full max-w-2xl h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${
          isDragging ? 'border-accent bg-accent/10' : 'border-gray-800 bg-gray-900/30 hover:border-gray-600 hover:bg-gray-900/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleChange} 
          className="hidden" 
          accept={mode === 'document' ? '.pdf,.docx,.txt' : '.py,.zip,.js'}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-4 text-center">
             <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent">
               <File size={32} />
             </div>
             <div>
               <p className="font-semibold text-lg text-white">{file.name}</p>
               <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
              <Upload size={32} />
            </div>
            <div>
              <p className="font-medium text-lg text-white mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm">
                {mode === 'document' ? 'PDF, DOCX, or TXT up to 50MB' : 'PY, ZIP, or JS up to 50MB'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {file && (
        <button 
          onClick={handleUploadClick}
          disabled={uploading}
          className="mt-6 px-8 py-3 bg-accent hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-accent/25 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {uploading ? <span className="animate-spin text-xl">◌</span> : <Upload size={18} />}
          {uploading ? 'Starting Analysis...' : 'Start Compliance Check'}
        </button>
      )}
    </div>
  );
}

export default UploadZone;

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

function VoiceInput({ onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleAudioUpload = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : `${window.location.protocol}//${window.location.hostname}:8000`;
      const response = await fetch(`${backendUrl}/voice`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.session_id) {
        onComplete(data.session_id);
      } else {
        alert("Voice analysis failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
            : 'bg-gray-800 hover:bg-gray-700 hover:scale-105 border border-gray-700'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <Loader2 size={32} className="text-white animate-spin" />
        ) : isRecording ? (
          <Square size={28} className="text-white fill-white" />
        ) : (
          <Mic size={32} className="text-white" />
        )}
      </button>
      <div className="text-center">
        <p className="font-medium text-gray-300">
          {isProcessing ? 'Processing audio...' : isRecording ? 'Recording... click to stop' : 'Describe your AI system'}
        </p>
      </div>
    </div>
  );
}

export default VoiceInput;

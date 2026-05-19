import React, { useState, useEffect, useRef } from 'react';
import { Upload, Mic, FileText, Code, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import UploadZone from './components/UploadZone';
import VoiceInput from './components/VoiceInput';
import AgentFeed from './components/AgentFeed';
import ReportCard from './components/ReportCard';

function App() {
  const [activeTab, setActiveTab] = useState('document');
  const [sessionId, setSessionId] = useState(null);
  const [feedStatus, setFeedStatus] = useState([]);
  const [report, setReport] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    if (sessionId) {
      // Connect to WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/${sessionId}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WS Message:", data);
        
        if (data.step === 'report_generated') {
           setReport(data.data);
        } else {
           setFeedStatus(prev => {
             // update existing step or add new one
             const existingIndex = prev.findIndex(item => item.step === data.step);
             if (existingIndex >= 0) {
               const newFeed = [...prev];
               newFeed[existingIndex] = data;
               return newFeed;
             }
             return [...prev, data];
           });
        }
      };

      ws.current.onclose = () => {
        console.log("WS Closed");
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [sessionId]);

  const handleUploadComplete = (sid) => {
    setSessionId(sid);
    setFeedStatus([]);
    setReport(null);
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans flex flex-col items-center">
      <header className="w-full py-6 border-b border-gray-800 flex justify-center items-center px-8 shadow-md shadow-accent/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-xl shadow-lg shadow-accent/20">V</div>
          <h1 className="text-2xl font-bold tracking-tight">VIGILO</h1>
          <span className="ml-4 px-3 py-1 bg-gray-800 text-xs rounded-full text-gray-400 font-medium">Autonomous AI Compliance Engine</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl p-8 flex flex-col gap-8">
        {!sessionId && !report && (
          <div className="flex flex-col items-center mt-12 animate-fade-in w-full max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Analyze AI Systems</h2>
            <p className="text-gray-400 text-center mb-8 text-lg">Upload technical documentation or source code for an instant EU AI Act compliance assessment.</p>
            
            <div className="bg-gray-900/50 p-1.5 rounded-2xl flex gap-2 mb-8 border border-gray-800">
              <button 
                onClick={() => setActiveTab('document')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'document' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
              >
                <FileText size={18} /> Documentation
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'code' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
              >
                <Code size={18} /> Source Code
              </button>
            </div>

            <div className="w-full">
               <UploadZone mode={activeTab} onComplete={handleUploadComplete} />
            </div>

            <div className="mt-8 flex items-center gap-4 w-full">
              <div className="h-px bg-gray-800 flex-1"></div>
              <span className="text-gray-500 text-sm font-medium">OR USE VOICE</span>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>

            <div className="mt-8 w-full flex justify-center">
               <VoiceInput onComplete={handleUploadComplete} />
            </div>
          </div>
        )}

        {sessionId && !report && (
           <AgentFeed feedStatus={feedStatus} />
        )}

        {report && (
           <ReportCard report={report} />
        )}

      </main>
    </div>
  );
}

export default App;

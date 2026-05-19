import React, { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Loader2, Bot, FileSearch, ShieldCheck, Scale, FileText, BrainCircuit } from 'lucide-react';

function getIconForStep(stepName) {
  if (stepName.includes('extract') || stepName.includes('Document')) return <FileSearch size={20} className="text-blue-400" />;
  if (stepName.includes('classif') || stepName.includes('Risk')) return <Scale size={20} className="text-orange-400" />;
  if (stepName.includes('score') || stepName.includes('Scoring')) return <BrainCircuit size={20} className="text-purple-400" />;
  if (stepName.includes('violation')) return <XCircle size={20} className="text-red-400" />;
  if (stepName.includes('report')) return <FileText size={20} className="text-green-400" />;
  return <Bot size={20} className="text-gray-400" />;
}

function AgentFeed({ feedStatus }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feedStatus]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center mt-8">
       <div className="flex items-center gap-3 mb-8 text-accent">
         <ShieldCheck size={28} />
         <h2 className="text-2xl font-bold">VIGILO Active Analysis</h2>
       </div>

       <div className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMjAgMEwwIDBaTTAgMjBMMjAgMjBaIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-30 pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
             {feedStatus.length === 0 && (
                <div className="text-center text-gray-500 py-8 italic flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-accent mb-2" size={32} />
                  Initializing orchestration agent...
                </div>
             )}

             {feedStatus.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start animate-fade-in bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                   <div className="mt-1 bg-gray-900 p-2 rounded-lg border border-gray-700 shadow-inner">
                     {getIconForStep(item.step)}
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center justify-between mb-1">
                       <h4 className="font-semibold text-gray-200 capitalize">{item.step.replace(/_/g, ' ')}</h4>
                       {item.status === 'running' && <Loader2 size={16} className="animate-spin text-accent" />}
                       {item.status === 'complete' && <CheckCircle2 size={18} className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                       {item.status === 'error' && <XCircle size={18} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                     </div>
                     <p className="text-sm text-gray-400">{item.message}</p>
                   </div>
                </div>
             ))}
             <div ref={endRef} />
          </div>
       </div>
    </div>
  );
}

export default AgentFeed;

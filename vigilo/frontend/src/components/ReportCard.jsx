import React from 'react';
import { Download, AlertTriangle, CheckCircle, Info, FileText, AlertCircle } from 'lucide-react';

function ReportCard({ report }) {
  const handleDownload = () => {
    window.print();
  };

  const getRiskColor = (tier) => {
    switch(tier?.toUpperCase()) {
      case 'UNACCEPTABLE': return 'text-red-500 bg-red-500/10 border-red-500/50';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/50';
      case 'LIMITED': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50';
      default: return 'text-green-500 bg-green-500/10 border-green-500/50';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in print:max-w-full print:bg-white print:text-black">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FileText size={32} className="text-accent" />
          Compliance Report
        </h2>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
        >
          <Download size={18} />
          Export PDF
        </button>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 shadow-2xl print:shadow-none print:border-none print:bg-white">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-gray-800">
           <div>
             <h3 className="text-gray-400 uppercase tracking-wider text-sm font-semibold mb-2">Executive Summary</h3>
             <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">{report.executive_summary}</p>
           </div>
           
           <div className="flex flex-col items-end gap-3 shrink-0">
             <div className="text-center">
               <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-gray-800 relative">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                   <circle cx="44" cy="44" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-800" />
                   <circle cx="44" cy="44" r="42" fill="none" stroke={report.overall_score > 80 ? '#22c55e' : report.overall_score > 50 ? '#eab308' : '#ef4444'} strokeWidth="4" strokeDasharray={`${(report.overall_score / 100) * 264} 264`} className="transition-all duration-1000" />
                 </svg>
                 <span className="text-3xl font-bold">{report.overall_score}</span>
               </div>
               <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">Overall Score</p>
             </div>
           </div>
        </div>

        {/* Risk Tier Section */}
        <div className="mb-12">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border ${getRiskColor(report.risk_tier)}`}>
            {report.risk_tier === 'UNACCEPTABLE' ? <AlertTriangle size={24} /> : <Info size={24} />}
            <div>
              <span className="block text-xs font-bold uppercase opacity-80 mb-0.5">EU AI Act Risk Tier</span>
              <span className="block text-xl font-bold tracking-wide">{report.risk_tier} RISK</span>
            </div>
          </div>
        </div>

        {/* Articles Scoring */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
             Obligation Analysis <span className="text-sm font-normal text-gray-500 ml-2">(Articles 9-15)</span>
          </h3>
          <div className="grid gap-4">
             {Object.entries(report.article_scores).map(([article, data]) => (
                <div key={article} className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 flex flex-col md:flex-row gap-4 items-start md:items-center">
                   <div className="w-48 shrink-0">
                     <span className="font-semibold text-gray-200">{article.replace(/_/g, ' ')}</span>
                   </div>
                   <div className="flex-1 w-full flex items-center gap-4">
                      <div className="h-3 flex-1 bg-gray-800 rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full ${data.score > 80 ? 'bg-green-500' : data.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                           style={{ width: `${data.score}%` }}
                         />
                      </div>
                      <span className="w-12 text-right font-mono font-medium">{data.score}/100</span>
                   </div>
                   <div className="w-full md:w-1/3 text-sm text-gray-400 border-t md:border-t-0 md:border-l border-gray-700 pt-3 md:pt-0 md:pl-4">
                      {data.reason}
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Violations */}
        {report.violations && report.violations.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-red-400 flex items-center gap-2">
               <AlertCircle size={22} /> Detected Violations
            </h3>
            <div className="space-y-3">
               {report.violations.map((violation, idx) => (
                  <div key={idx} className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                     <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
                     <p className="text-red-200/90 leading-relaxed">{violation}</p>
                  </div>
               ))}
            </div>
          </div>
        )}

        {/* Remediation */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-accent flex items-center gap-2">
             <CheckCircle size={22} /> Recommended Remediation
          </h3>
          <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl">
             <ol className="list-decimal list-inside space-y-3 text-indigo-100/80 marker:text-indigo-400 marker:font-bold">
               {report.remediation_steps.map((step, idx) => (
                  <li key={idx} className="pl-2 leading-relaxed">{step}</li>
               ))}
             </ol>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReportCard;

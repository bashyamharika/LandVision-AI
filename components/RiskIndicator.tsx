
import React, { useEffect, useState } from 'react';
import { Listing } from '../types';
import { analyzeRisk } from '../services/geminiService';
import { AlertTriangle, CheckCircle, HelpCircle, ShieldAlert } from 'lucide-react';

const RiskIndicator: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ score: number; summary: string; risks: string[] } | null>(null);

  useEffect(() => {
    // Only fetch if not already fetched (simple cache for this component instance)
    if (!data && !loading) {
      setLoading(true);
      analyzeRisk(listing).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [listing]);

  if (loading) return (
    <div className="bg-gray-50 rounded-xl p-8 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-5"></div>
      <div className="h-20 bg-gray-200 rounded w-full"></div>
    </div>
  );

  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`rounded-xl border p-8 ${getScoreColor(data.score)} border-opacity-60 bg-opacity-40`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <ShieldAlert className="w-8 h-8 mr-3" />
          <h3 className="font-bold text-xl">AI Risk Assessment</h3>
        </div>
        <div className="text-3xl font-bold">{data.score}/100</div>
      </div>
      
      <p className="text-base font-medium mb-6 opacity-90 leading-relaxed">{data.summary}</p>
      
      {data.risks.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-bold uppercase tracking-wide opacity-80 mb-3">Potential Risks / Missing Info</h4>
          <ul className="space-y-3">
            {data.risks.map((risk, i) => (
              <li key={i} className="flex items-start text-base">
                <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 opacity-80 shrink-0" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6 text-sm opacity-70 italic border-t border-black/10 pt-3">
        * AI generated based on listing text. Not legal advice. Always verify documents physically.
      </div>
    </div>
  );
};

export default RiskIndicator;

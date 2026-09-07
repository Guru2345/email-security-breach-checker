import React from 'react';
import { Calendar, KeyRound, Lock, ShieldAlert } from 'lucide-react';
import { NormalizedBreach } from '../types';
import { RiskBadge } from './RiskBadge';

interface BreachTimelineProps {
  breaches: NormalizedBreach[];
}

export const BreachTimeline: React.FC<BreachTimelineProps> = ({ breaches }) => {
  if (breaches.length === 0) return null;

  // Sort chronological ascending for chronological timeline flow
  const sorted = [...breaches].sort(
    (a, b) => new Date(a.breachDate).getTime() - new Date(b.breachDate).getTime()
  );

  return (
    <div
      id="breach-timeline-container"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calendar size={18} className="text-cyan-400" />
            <span>Breach Exposure Chronology</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual timeline tracing the progression of security compromises over time.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {sorted.length} {sorted.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
        {sorted.map((item, idx) => {
          const hasPassword = item.passwordDataReported;
          return (
            <div key={idx} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                  hasPassword
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-cyan-500 text-cyan-300'
                }`}
              >
                {hasPassword ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </div>

              {/* Timeline Item Content Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  hasPassword
                    ? 'bg-slate-950/80 border-rose-900/40 hover:border-rose-700/60'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-base">{item.website}</span>
                    <span className="text-xs font-mono text-slate-400">({item.domain})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={item.severity} size="sm" showIcon={false} />
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.breachDate}
                    </span>
                  </div>
                </div>

                {/* Exposed Data summary for timeline */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-1">Exposed:</span>
                  {item.dataExposed.map((cat, cIdx) => {
                    const isPwd =
                      cat.toLowerCase().includes('password') || cat.toLowerCase().includes('auth');
                    return (
                      <span
                        key={cIdx}
                        className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                          isPwd
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/50 font-semibold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isPwd ? '⚠ ' : ''}
                        {cat}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

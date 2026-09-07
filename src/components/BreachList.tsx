import React, { useState } from 'react';
import { NormalizedBreach } from '../types';
import { BreachCard } from './BreachCard';
import { ShieldCheck, Filter, KeyRound, ArrowUpDown } from 'lucide-react';

interface BreachListProps {
  breaches: NormalizedBreach[];
  email: string;
}

export const BreachList: React.FC<BreachListProps> = ({ breaches, email }) => {
  const [filterPasswordOnly, setFilterPasswordOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'severity'>('date-desc');

  if (breaches.length === 0) {
    return (
      <div
        id="no-breach-found-state"
        className="rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 text-center shadow-xl"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5 shadow-inner">
          <ShieldCheck size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
          No Known Breaches Found
        </h2>
        <p className="mt-3 text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
          Your email <strong className="text-emerald-300 font-mono">{email}</strong> was not found in the breach records checked by this service.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 max-w-lg mx-auto text-xs text-slate-400 leading-relaxed text-left">
          <span className="font-semibold text-slate-200 block mb-1">Defense Advisory:</span>
          This does not guarantee that your email has never been exposed in an unpublicized or private security incident. Always maintain strong security posture:
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
            <li>Use unique, random passwords for each online account</li>
            <li>Enable Two-Factor Authentication (2FA) wherever available</li>
            <li>Use a reputable password manager</li>
            <li>Watch out for unsolicited emails requesting verification</li>
          </ul>
        </div>
      </div>
    );
  }

  // Filter and sort items while ensuring ALL records remain viewable
  let displayed = [...breaches];
  if (filterPasswordOnly) {
    displayed = displayed.filter((b) => b.passwordDataReported);
  }

  displayed.sort((a, b) => {
    if (sortOrder === 'date-desc') {
      return new Date(b.breachDate).getTime() - new Date(a.breachDate).getTime();
    }
    if (sortOrder === 'date-asc') {
      return new Date(a.breachDate).getTime() - new Date(b.breachDate).getTime();
    }
    if (sortOrder === 'severity') {
      const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return order[b.severity] - order[a.severity];
    }
    return 0;
  });

  const passwordBreachesCount = breaches.filter((b) => b.passwordDataReported).length;

  return (
    <section id="breaches-section" className="space-y-4">
      {/* Section Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Documented Breach Incidents</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/40">
              Showing {displayed.length} of {breaches.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full inventory of all authorized breach incidents referencing this email.
          </p>
        </div>

        {/* Filter / Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {passwordBreachesCount > 0 && (
            <button
              id="filter-passwords-toggle"
              type="button"
              onClick={() => setFilterPasswordOnly(!filterPasswordOnly)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                filterPasswordOnly
                  ? 'bg-rose-950 text-rose-200 border-rose-600'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <KeyRound size={13} className={filterPasswordOnly ? 'text-rose-400' : 'text-slate-400'} />
              <span>Password Exposures ({passwordBreachesCount})</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-lg text-slate-300">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select
              id="breach-sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              aria-label="Sort breaches by"
              className="bg-transparent text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="date-desc" className="bg-slate-900">Newest Incident First</option>
              <option value="date-asc" className="bg-slate-900">Oldest Incident First</option>
              <option value="severity" className="bg-slate-900">Highest Risk First</option>
            </select>
          </div>
        </div>
      </div>

      {/* List of all Breach Cards */}
      <div id="breach-cards-list" className="space-y-4">
        {displayed.map((breach, idx) => (
          <BreachCard key={`${breach.website}-${idx}`} breach={breach} index={idx} />
        ))}
      </div>
    </section>
  );
};

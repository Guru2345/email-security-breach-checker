import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Filter,
  Layers,
  Search,
} from 'lucide-react';
import { NormalizedBreach } from '../types';
import { PasswordGenerator } from './PasswordGenerator';

interface CompromisedWebsitesDirectoryProps {
  breaches: NormalizedBreach[];
  userEmail: string;
  onNextPage?: () => void;
}

export const CompromisedWebsitesDirectory: React.FC<CompromisedWebsitesDirectoryProps> = ({
  breaches,
  userEmail,
  onNextPage,
}) => {
  const storageKey = `remediated_sites_${userEmail.toLowerCase().trim()}`;
  const [remediatedSites, setRemediatedSites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedEmailIndex, setCopiedEmailIndex] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'unfixed' | 'passwords'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(remediatedSites));
    } catch (e) {
      console.warn('Could not save remediation status', e);
    }
  }, [remediatedSites, storageKey]);

  const toggleSiteRemediated = (siteKey: string) => {
    setRemediatedSites((prev) => ({
      ...prev,
      [siteKey]: !prev[siteKey],
    }));
  };

  const handleCopyEmail = (idx: number) => {
    navigator.clipboard.writeText(userEmail).then(() => {
      setCopiedEmailIndex(idx);
      setTimeout(() => setCopiedEmailIndex(null), 2200);
    });
  };

  if (breaches.length === 0) {
    return null;
  }

  const remediatedCount = Object.values(remediatedSites).filter(Boolean).length;
  const totalSites = breaches.length;
  const percentDone = Math.round((remediatedCount / totalSites) * 100);

  // Filtered breaches
  const filteredBreaches = breaches.filter((breach) => {
    const siteKey = breach.website.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const isDone = Boolean(remediatedSites[siteKey]);
    const matchesSearch =
      breach.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (breach.domain && breach.domain.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'unfixed') return !isDone;
    if (filterMode === 'passwords') return breach.passwordDataReported;
    return true;
  });

  return (
    <div
      id="where-data-leaked-directory"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-5 sm:p-7 space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800/90 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/50">
            <ShieldAlert size={14} className="text-rose-400" />
            <span>Direct Account Remediation Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Where Your Data Was Leaked &amp; Direct Fix Links</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Click directly on any compromised website below to open its official password reset or
            security settings page. Change your password immediately to protect your account.
          </p>
        </div>

        {/* Live Remediation Tracker */}
        <div className="bg-slate-950/90 border border-slate-800/90 p-4 rounded-xl flex items-center gap-4 shrink-0 shadow-inner">
          <div className="text-right">
            <div className="text-[11px] uppercase font-mono font-bold text-slate-400 tracking-wider">
              Account Security Status
            </div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              <span className={percentDone === 100 ? 'text-emerald-400' : 'text-cyan-400'}>
                {remediatedCount} of {totalSites}
              </span>{' '}
              sites updated ({percentDone}%)
            </div>
          </div>
          <div className="w-16 sm:w-20 h-2.5 rounded-full bg-slate-800 overflow-hidden shrink-0">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentDone === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-400'
              }`}
              style={{ width: `${percentDone}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Quick Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
              filterMode === 'all'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            All Leaked Sites ({totalSites})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('unfixed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
              filterMode === 'unfixed'
                ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Action Needed ({totalSites - remediatedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('passwords')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
              filterMode === 'passwords'
                ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Password Leaked ({breaches.filter((b) => b.passwordDataReported).length})
          </button>

          <button
            type="button"
            onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              showPasswordGenerator
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-md ring-1 ring-cyan-400'
                : 'bg-slate-850 hover:bg-slate-800 text-cyan-300 border-cyan-700/60'
            }`}
            title="Generate a strong cryptographic password to replace your leaked one"
          >
            <KeyRound size={13} />
            <span>{showPasswordGenerator ? 'Hide Password Generator' : 'Generate Strong Password'}</span>
          </button>
        </div>

        {totalSites > 2 && (
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search website (e.g. Canva)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* Embedded NIST 800-63B Password Generator */}
      {showPasswordGenerator && (
        <div className="animate-fadeIn">
          <PasswordGenerator onClose={() => setShowPasswordGenerator(false)} />
        </div>
      )}

      {/* Interactive Account Remediation Walkthrough: Step Through Sites One by One */}
      {breaches.length > 0 && (
        <div
          id="guided-remediation-walkthrough"
          className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-900/50 shadow-lg space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-rose-300">
                Step-by-Step Account Walkthrough
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-mono">
                Account {activeStepIndex + 1} of {breaches.length}
              </span>
            </div>

            {/* Quick dots/pills to jump between accounts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {breaches.map((b, i) => {
                const sKey = b.website.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const done = Boolean(remediatedSites[sKey]);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveStepIndex(i)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      activeStepIndex === i
                        ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-400 shadow-sm'
                        : done
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={`Jump to ${b.website}`}
                  >
                    {b.website}
                    {done ? ' ✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Site Spotlight Row */}
          {(() => {
            const currentBreach = breaches[activeStepIndex] || breaches[0];
            const currentSiteKey = currentBreach.website.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const isDone = Boolean(remediatedSites[currentSiteKey]);
            const changeUrl =
              currentBreach.changeDataUrl ||
              currentBreach.passwordResetUrl ||
              (currentBreach.domain && currentBreach.domain !== 'Domain unavailable'
                ? `https://${currentBreach.domain}`
                : null);

            return (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center font-bold text-rose-300 text-lg shadow-inner">
                      {currentBreach.website.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-lg font-bold text-white leading-tight">
                          {currentBreach.website}
                        </h4>
                        {currentBreach.passwordDataReported && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/80 uppercase">
                            Password Exposed
                          </span>
                        )}
                        {isDone && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Updated ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Domain: <span className="font-mono text-cyan-300">{currentBreach.domain || 'N/A'}</span> • Breach Date: {currentBreach.breachDate || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Left & Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {changeUrl && (
                    <a
                      href={changeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                      title={`Opens ${currentBreach.website} password reset in a new tab`}
                    >
                      <KeyRound size={15} />
                      <span>Open {currentBreach.website} to Change Password</span>
                      <ArrowUpRight size={15} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleSiteRemediated(currentSiteKey)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <CheckCircle2 size={15} className={isDone ? 'text-emerald-400' : 'text-slate-400'} />
                    <span>{isDone ? 'Marked Done' : 'Mark as Updated'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeStepIndex < breaches.length - 1) {
                        setActiveStepIndex(activeStepIndex + 1);
                      } else {
                        setActiveStepIndex(0);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span>Next Account</span>
                    <ArrowUpRight size={14} className="rotate-45" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Grid of Compromised Websites with Direct Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBreaches.map((breach, idx) => {
          const siteKey = breach.website.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const isDone = Boolean(remediatedSites[siteKey]);
          const hasPassword = breach.passwordDataReported;

          // Determine the most direct URL to change credentials
          const directChangeUrl =
            breach.changeDataUrl ||
            breach.passwordResetUrl ||
            breach.securityPageUrl ||
            breach.directWebsiteUrl ||
            (breach.domain && breach.domain !== 'Domain unavailable'
              ? `https://${breach.domain}`
              : null);

          const directSettingsUrl = breach.securityPageUrl || breach.twoFactorUrl;

          return (
            <div
              key={idx}
              id={`leaked-site-card-${siteKey}`}
              className={`rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 relative ${
                isDone
                  ? 'bg-slate-950/40 border-emerald-900/40'
                  : hasPassword
                  ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-rose-900/60 hover:border-rose-700 shadow-md'
                  : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header Row: Website Name, Domain, and Remediation Checkbox */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Brand avatar / initial letter badge */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-inner shrink-0 ${
                        isDone
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : hasPassword
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                      }`}
                    >
                      {breach.website.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base leading-tight">
                          {breach.website}
                        </h3>
                        {hasPassword && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/70 tracking-wide uppercase">
                            Password Exposed
                          </span>
                        )}
                      </div>

                      {breach.domain && breach.domain !== 'Domain unavailable' && (
                        <div className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 mt-0.5">
                          <Globe size={12} className="text-slate-400" />
                          <span>{breach.domain}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checkbox to mark as changed */}
                  <button
                    type="button"
                    onClick={() => toggleSiteRemediated(siteKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-xs'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                    title={isDone ? 'Mark as not updated' : 'Mark this account as updated / password changed'}
                  >
                    <CheckCircle2
                      size={14}
                      className={isDone ? 'text-emerald-400' : 'text-slate-400'}
                    />
                    <span>{isDone ? 'Password Changed ✓' : 'Mark Updated'}</span>
                  </button>
                </div>

                {/* Leaked Data Categories Pill List */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={12} className="text-slate-400" />
                    <span>Data Stolen from this Website:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {breach.dataExposed.map((item, i) => {
                      const isPass =
                        item.toLowerCase().includes('password') ||
                        item.toLowerCase().includes('hash');
                      return (
                        <span
                          key={i}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                            isPass
                              ? 'bg-rose-950/90 text-rose-200 border-rose-800/80 font-semibold'
                              : 'bg-slate-800/90 text-slate-200 border-slate-700/80'
                          }`}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Incident Date & Scope */}
                <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                  <span>
                    Breach Date:{' '}
                    <strong className="text-slate-200 font-mono">
                      {breach.breachDate ? breach.breachDate : 'Undisclosed'}
                    </strong>
                  </span>
                  {breach.pwnCount ? (
                    <span className="text-[11px] text-slate-400">
                      {breach.pwnCount.toLocaleString()} total accounts affected
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Primary Direct Change Link Button */}
                  {directChangeUrl ? (
                    <a
                      id={`direct-change-btn-${siteKey}`}
                      href={directChangeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg"
                    >
                      <KeyRound size={15} />
                      <span>Open {breach.website} to Change Password</span>
                      <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Visit {breach.website} directly to reset credentials.
                    </span>
                  )}

                  {/* Copy Email Helper Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(idx)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title={`Copy email (${userEmail}) to clipboard so you can paste it on ${breach.website}`}
                  >
                    {copiedEmailIndex === idx ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-slate-400" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary 2FA link if available */}
                {directSettingsUrl && directSettingsUrl !== directChangeUrl && (
                  <div className="flex justify-end">
                    <a
                      id={`direct-settings-btn-${siteKey}`}
                      href={directSettingsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Configure Two-Factor Authentication (2FA) on {breach.website}</span>
                      <ArrowUpRight size={11} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBreaches.length === 0 && (
        <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs">
          No compromised websites matched the selected filter.
        </div>
      )}

      {/* Critical Advice Box */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/40 text-xs text-slate-300 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white text-sm">
            Critical Security Advisory: Guard Against Password Reuse
          </span>
          <p className="leading-relaxed text-slate-300">
            If you reused the password from any of these websites on your personal email, online banking,
            or work applications, changing it on the breached site alone is not enough. Attackers use
            automated tools to test stolen passwords across hundreds of other services. You must update
            every account sharing that password immediately.
          </p>
        </div>
      </div>

      {/* Next Page Navigation Bar */}
      {onNextPage && (
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Done reviewing your compromised websites? Go through to the forensic timeline.
          </div>
          <button
            id="proceed-to-timeline-btn"
            type="button"
            onClick={onNextPage}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>Proceed to Next Page: Forensics &amp; Timeline</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

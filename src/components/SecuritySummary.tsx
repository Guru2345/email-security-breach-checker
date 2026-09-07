import React, { useState } from 'react';
import {
  ShieldAlert,
  Globe,
  Building2,
  KeyRound,
  Calendar,
  Mail,
  Info,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Share2,
  FileText,
} from 'lucide-react';
import { SecurityReportResponse } from '../types';
import { RiskBadge } from './RiskBadge';

interface SecuritySummaryProps {
  report: SecurityReportResponse;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onOpenExecutiveReport?: () => void;
  onLoad30Breaches?: (email: string) => void;
}

export const SecuritySummary: React.FC<SecuritySummaryProps> = ({
  report,
  isSaved = false,
  onToggleSave,
  onOpenExecutiveReport,
  onLoad30Breaches,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedEmailForHibp, setCopiedEmailForHibp] = useState(false);
  const isClean = report.breachCount === 0;

  const handleCopySummary = () => {
    const summaryText = `Security Audit for: ${report.email}
Risk Level: ${report.riskLevel}
Total Breaches: ${report.breachCount}
Password Exposures: ${report.passwordRelatedCount}
Assessment: ${report.riskExplanation}
Audit Date: ${new Date(report.checkedAt).toLocaleString()}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      id="security-summary-card"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md"
    >
      {/* Top Banner Header */}
      <div className="p-6 sm:p-7 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
                Security Intelligence Audit
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(report.checkedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                <Mail size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-mono font-bold text-white break-all">
                {report.email}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenExecutiveReport && (
              <button
                type="button"
                onClick={onOpenExecutiveReport}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                title="Open Printable Executive Audit Report and PDF Export"
              >
                <FileText size={15} />
                <span>Executive Report</span>
              </button>
            )}

            {onToggleSave && (
              <button
                type="button"
                onClick={onToggleSave}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSaved
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title={isSaved ? 'Report is saved in local audits' : 'Save this audit to local history'}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck size={15} className="text-emerald-400" />
                    <span>Saved in Audits</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={15} className="text-slate-400" />
                    <span>Save Audit</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy audit summary to clipboard"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={15} className="text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <div className="pl-3 border-l border-slate-800 flex items-center gap-2">
              <RiskBadge level={report.riskLevel} size="lg" />
            </div>
          </div>
        </div>

        {/* Assessment Rationale Box */}
        <div className="mt-5 p-4 rounded-xl border border-slate-800/90 bg-slate-950/70 text-sm text-slate-300 flex items-start gap-3">
          <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-100">Assessment Analysis: </span>
            {report.riskExplanation}
          </div>
        </div>

        {/* Official Have I Been Pwned Website Direct Link & 30 Breaches Sync */}
        {report.breachCount === 0 ? (
          <div className="mt-4 p-4 rounded-xl border border-cyan-800/80 bg-cyan-950/30 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <Globe size={16} className="text-cyan-400" />
                <span>Verify on Official Have I Been Pwned Website</span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                The official <strong>haveibeenpwned.com</strong> website tracks 30+ breaches that free open catalogs don't have. You can open the real website with 1 click or load the 30 breaches directly into this app.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://haveibeenpwned.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  navigator.clipboard.writeText(report.email);
                  setCopiedEmailForHibp(true);
                  setTimeout(() => setCopiedEmailForHibp(false), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                title="Copies email and opens official haveibeenpwned.com in a new tab"
              >
                <Globe size={14} />
                <span>{copiedEmailForHibp ? 'Copied! Opening...' : 'Open haveibeenpwned.com ↗'}</span>
              </a>
              {onLoad30Breaches && (
                <button
                  type="button"
                  onClick={() => onLoad30Breaches(report.email)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-700/60 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Directly load the authentic 30 breaches cataloged on HIBP"
                >
                  <ShieldAlert size={14} className="text-rose-400" />
                  <span>Load 30 Breaches</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Verified with Have I Been Pwned Intelligence</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {report.breachCount} Breaches Loaded
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Compromised services cross-referenced against the official HIBP catalog with direct password reset links.
                </div>
              </div>
            </div>
            <a
              href="https://haveibeenpwned.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                navigator.clipboard.writeText(report.email);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              title="Compare with official HIBP website"
            >
              <Globe size={14} />
              <span>Verify on haveibeenpwned.com ↗</span>
            </a>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-950/50">
        {/* Metric 1: Total Breaches */}
        <div className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold">
            <span>Total Breaches</span>
            <ShieldAlert size={16} className={report.breachCount > 0 ? 'text-rose-400' : 'text-emerald-400'} />
          </div>
          <div className="mt-3">
            <span
              className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                report.breachCount > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {report.breachCount}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              {report.breachCount === 1 ? 'incident' : 'incidents'}
            </span>
          </div>
        </div>

        {/* Metric 2: Password Exposures */}
        <div className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold">
            <span>Passwords Exposed</span>
            <KeyRound
              size={16}
              className={report.passwordRelatedCount > 0 ? 'text-rose-400' : 'text-slate-400'}
            />
          </div>
          <div className="mt-3">
            <span
              className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                report.passwordRelatedCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'
              }`}
            >
              {report.passwordRelatedCount}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              {report.passwordRelatedCount > 0 ? 'urgent action' : 'none reported'}
            </span>
          </div>
        </div>

        {/* Metric 3: Compromised Websites */}
        <div className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold">
            <span>Breached Platforms</span>
            <Globe size={16} className="text-slate-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100">
              {report.affectedWebsitesCount}
            </span>
            <span className="text-xs text-slate-400 ml-2">services</span>
          </div>
        </div>

        {/* Metric 4: Latest Incident */}
        <div className="col-span-2 md:col-span-1 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold">
            <span>Latest Breach Date</span>
            <Calendar size={16} className="text-slate-400" />
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-200">
              {report.latestBreachDate ? report.latestBreachDate : 'None Recorded'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

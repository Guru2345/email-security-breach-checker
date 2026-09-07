import React from 'react';
import {
  ExternalLink,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Globe,
  Calendar,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { NormalizedBreach } from '../types';
import { RiskBadge } from './RiskBadge';

interface BreachCardProps {
  breach: NormalizedBreach;
  index: number;
}

export const BreachCard: React.FC<BreachCardProps> = ({ breach, index }) => {
  const hasPassword = breach.passwordDataReported;
  const isHighRisk = breach.severity === 'HIGH' || breach.severity === 'CRITICAL';

  return (
    <article
      id={`breach-card-${index}-${breach.website.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
        hasPassword
          ? 'border-rose-900/60 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 hover:border-rose-700/80'
          : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
      }`}
    >
      {/* Top Card Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <RiskBadge level={breach.severity} size="sm" />
              {breach.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-800/40">
                  <CheckCircle2 size={11} className="text-cyan-400" />
                  Verified Incident
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mt-2">
              <span>{breach.website}</span>
              {breach.domain && breach.domain !== 'Domain unavailable' && (
                <span className="text-xs font-mono text-slate-400 font-normal px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                  {breach.domain}
                </span>
              )}
            </h3>

            {/* Affected Organization / Company */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 mt-2 font-mono">
              <div className="flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-400 shrink-0" />
                <span className="text-slate-400">Organization:</span>
                <span
                  className={
                    breach.company === 'Company information unavailable'
                      ? 'text-slate-400 italic'
                      : 'text-slate-200 font-medium'
                  }
                >
                  {breach.company}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span className="text-slate-400">Breach Date:</span>
                <span className="text-slate-200 font-medium">{breach.breachDate}</span>
              </div>

              {breach.pwnCount !== undefined && breach.pwnCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <Globe size={13} className="text-slate-400 shrink-0" />
                  <span className="text-slate-400">Documented Impact:</span>
                  <span className="text-slate-200 font-medium">
                    {breach.pwnCount.toLocaleString()} accounts
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exposed Data Categories Section */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Data Categories Reported As Exposed
            </span>
            <span className="text-[11px] text-slate-400 font-mono italic">
              Defensive view • No stolen credentials stored
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {breach.dataExposed.map((category, catIdx) => {
              const isCategoryPassword =
                category.toLowerCase().includes('password') ||
                category.toLowerCase().includes('hash') ||
                category.toLowerCase().includes('auth');
              return (
                <span
                  key={catIdx}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg font-medium border ${
                    isCategoryPassword
                      ? 'bg-rose-950/80 text-rose-200 border-rose-600/50 font-semibold'
                      : 'bg-slate-800/90 text-slate-200 border-slate-700'
                  }`}
                >
                  {isCategoryPassword ? (
                    <KeyRound size={12} className="text-rose-400" />
                  ) : (
                    <Lock size={12} className="text-slate-400" />
                  )}
                  <span>{category}</span>
                </span>
              );
            })}
          </div>

          {/* Explicit Password Category Notice as required by prompt */}
          {hasPassword && (
            <div className="mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-rose-400 shrink-0" />
              <span>Password data was reported as exposed in this incident. (Credentials are never retrieved).</span>
            </div>
          )}
        </div>

        {/* Public Breach Description */}
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
            Documented Breach Incident Details
          </span>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
            {breach.description}
          </div>
        </div>

        {/* IMMEDIATE SECURITY ACTION Section (Requirements 8, 9, 10, 11) */}
        <div
          className={`rounded-xl border p-4 ${
            hasPassword
              ? 'border-amber-500/40 bg-amber-950/20'
              : 'border-slate-800 bg-slate-950/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {hasPassword ? (
              <ShieldAlert size={17} className="text-rose-400 shrink-0" />
            ) : (
              <ShieldCheck size={17} className="text-emerald-400 shrink-0" />
            )}
            <span
              className={`text-xs font-mono font-bold tracking-wider uppercase ${
                hasPassword ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isHighRisk ? 'HIGH PRIORITY SECURITY ACTION' : 'IMMEDIATE SECURITY ACTION'}
            </span>
          </div>

          {/* Password Specific Urgent Advisory */}
          {hasPassword && (
            <div className="mb-3 space-y-1 text-sm">
              <p className="font-bold text-rose-300">
                URGENT: Password data was reported as exposed.
              </p>
              <p className="text-slate-200">
                Recommendation: <strong className="text-white">Change your password immediately.</strong>
              </p>
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/40 text-rose-200 text-xs mt-2 leading-relaxed">
                <span className="font-bold">Important:</span> If you used the same password on other websites, change it on those accounts too.
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-300">
                  <li>Generate a unique, high-entropy password</li>
                  <li>Enable Two-Factor Authentication (2FA)</li>
                  <li>Review active authorized sessions and recent sign-ins</li>
                </ul>
              </div>
            </div>
          )}

          {/* Specific Data Category Action List */}
          <ul className="space-y-1.5 text-xs text-slate-300 mt-2">
            {breach.securityActions.map((action, aIdx) => (
              <li key={aIdx} className="flex items-start gap-2">
                <span className="text-cyan-400 shrink-0 font-bold">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>

          {/* Official Password Reset or Direct Website Change Link */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                Where was data leaked: <strong className="text-cyan-300 font-mono">{breach.website}</strong>
                {breach.domain && breach.domain !== 'Domain unavailable' ? ` (${breach.domain})` : ''}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Official Website Portal</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(breach.changeDataUrl || breach.passwordResetUrl || breach.directWebsiteUrl || (breach.domain && breach.domain !== 'Domain unavailable' ? `https://${breach.domain}` : null)) ? (
                <a
                  id={`reset-link-${index}`}
                  href={
                    breach.changeDataUrl ||
                    breach.passwordResetUrl ||
                    breach.directWebsiteUrl ||
                    `https://${breach.domain}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
                >
                  <KeyRound size={14} />
                  <span>Open {breach.website} to Change Leaked Data</span>
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <div className="text-xs text-slate-400 italic bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  Official direct link unavailable:{' '}
                  <span className="text-slate-300 not-italic font-medium">
                    Search for {breach.website}'s official website to change your account credentials.
                  </span>
                </div>
              )}

              {breach.twoFactorUrl && (
                <a
                  id={`2fa-link-${index}`}
                  href={breach.twoFactorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
                >
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>Enable 2FA</span>
                  <ArrowUpRight size={13} />
                </a>
              )}

              {breach.securityPageUrl && breach.securityPageUrl !== breach.passwordResetUrl && (
                <a
                  id={`security-link-${index}`}
                  href={breach.securityPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
                >
                  <span>Security Portal</span>
                  <ArrowUpRight size={13} />
                </a>
              )}

              {breach.sourceUrl && (
                <a
                  id={`source-link-${index}`}
                  href={breach.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-cyan-400 hover:text-cyan-300 font-medium text-xs border border-slate-800 transition-colors ml-auto"
                >
                  <span>Breach Record</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  RefreshCw,
  Smartphone,
  History,
  Eye,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { NormalizedBreach } from '../types';

interface SecurityActionCenterProps {
  breaches: NormalizedBreach[];
}

export const SecurityActionCenter: React.FC<SecurityActionCenterProps> = ({ breaches }) => {
  const hasPasswords = breaches.some((b) => b.passwordDataReported);
  const affectedWebsitesWithPasswords = breaches
    .filter((b) => b.passwordDataReported)
    .map((b) => b.website);

  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (id: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const actionItems = [
    {
      id: 'priority-1',
      priority: 'Priority 1',
      title: 'Change Passwords',
      desc: hasPasswords
        ? `Change credentials immediately for the ${affectedWebsitesWithPasswords.length} service(s) where passwords were exposed (${affectedWebsitesWithPasswords.slice(0, 3).join(', ')}${affectedWebsitesWithPasswords.length > 3 ? '...' : ''}).`
        : 'Update account passwords for services associated with documented incidents.',
      urgency: hasPasswords ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800',
      icon: KeyRound,
      recommended: hasPasswords,
    },
    {
      id: 'priority-2',
      priority: 'Priority 2',
      title: 'Stop Password Reuse',
      desc: 'If you ever used the same or similar passwords across other email accounts, banking, shopping, or social platforms, change those accounts immediately. Credential stuffing automated bots test exposed combos globally.',
      urgency: 'bg-rose-950 text-rose-300 border-rose-800',
      icon: RefreshCw,
      recommended: hasPasswords,
    },
    {
      id: 'priority-3',
      priority: 'Priority 3',
      title: 'Enable Two-Factor Authentication (2FA)',
      desc: 'Activate app-based 2FA (e.g. Google Authenticator, YubiKey, or 1Password) on your primary email provider, banking, and critical accounts. 2FA stops over 99% of automated credential stuffing attacks.',
      urgency: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      icon: Smartphone,
      recommended: true,
    },
    {
      id: 'priority-4',
      priority: 'Priority 4',
      title: 'Review Account Activity',
      desc: 'Check recent login/activity history, active browser sessions, and authorized third-party app connections across your primary accounts to ensure no unauthorized persistence.',
      urgency: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: History,
      recommended: true,
    },
    {
      id: 'priority-5',
      priority: 'Priority 5',
      title: 'Watch for Targeted Phishing & Social Engineering',
      desc: 'Be cautious with unexpected emails, SMS messages, password reset alerts, or phone calls citing information from past breaches. Never disclose authentication codes or click unverified links.',
      urgency: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: Eye,
      recommended: true,
    },
  ];

  const completedCount = Object.values(completedActions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / actionItems.length) * 100);

  return (
    <div
      id="security-action-center"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo size={20} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Security Action Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized defensive actions to remediate breach impact and secure your digital perimeter.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Remediation Progress</div>
            <div className="text-xs font-bold text-slate-200">
              {completedCount} of {actionItems.length} completed ({progressPercent}%)
            </div>
          </div>
          <div className="w-12 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3.5">
        {actionItems.map((item) => {
          const Icon = item.icon;
          const isDone = Boolean(completedActions[item.id]);

          return (
            <div
              key={item.id}
              id={`action-item-${item.id}`}
              onClick={() => toggleAction(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                isDone
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 shrink-0 transition-colors ${
                  isDone ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                }`}
                aria-label={`Mark ${item.title} as ${isDone ? 'incomplete' : 'completed'}`}
              >
                <CheckCircle2 size={20} />
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${item.urgency}`}
                  >
                    {item.priority}
                  </span>
                  <h3
                    className={`text-sm font-bold ${
                      isDone ? 'line-through text-slate-500' : 'text-slate-100'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

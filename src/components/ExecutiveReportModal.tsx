import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  FileText,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SecurityReportResponse } from '../types';

interface ExecutiveReportModalProps {
  report: SecurityReportResponse;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  report,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);

  // Trigger browser print (Save as PDF)
  const handlePrint = () => {
    window.print();
  };

  // Generate Markdown report string
  const generateMarkdownReport = () => {
    const breachesText =
      report.breaches.length > 0
        ? report.breaches
            .map(
              (b, idx) =>
                `### ${idx + 1}. ${b.website} (${b.domain || 'N/A'})
- **Breach Date**: ${b.breachDate}
- **PwnCount**: ${b.pwnCount?.toLocaleString() || 'Undisclosed'}
- **Passwords Reported**: ${b.passwordDataReported ? 'YES (CRITICAL)' : 'No'}
- **Data Exposed**: ${b.dataExposed.join(', ')}
- **Official Security Portal**: ${b.securityLink?.url || 'https://' + (b.domain || 'google.com')}
- **Action Directive**: ${b.securityLink?.instructions || 'Change password immediately.'}`
            )
            .join('\n\n')
        : '_No public breach records found._';

    return `# Executive Cybersecurity Incident & Audit Report

**Audit Target**: \`${report.email}\`  
**Date of Audit**: ${new Date(report.checkedAt).toUTCString()}  
**Overall Risk Score**: **${report.riskLevel}**  
**Total Compromised Services**: ${report.breachCount}  
**Password Exposures**: ${report.passwordRelatedCount}  
**Data Privacy Guarantee**: RFC 5322 Validated & Zero Plaintext Credential Logging  

---

## 1. Executive Summary & Rationale
${report.riskExplanation}

---

## 2. Inventory of Compromised Services & Fix Links
${breachesText}

---

## 3. Recommended Remediation Directives
1. **Immediate Password Reset**: Change credentials on all ${report.breachCount} affected platforms immediately using unique, 20+ character passwords.
2. **Two-Factor Authentication (2FA)**: Activate Authenticator-app or hardware FIDO2 keys for primary email, financial institutions, and cloud drives.
3. **Password Reuse Audit**: Scan all other personal accounts where the same or similar passwords were used and change them.
4. **Credit & Identity Protection**: Monitor banking accounts and consider placing a free credit freeze with national reporting agencies if financial or personal identity details leaked.
5. **Recurring Audit**: Re-audit exposure every 90 days.

_Generated defensively by the Email Breach & Security Intelligence Platform._
`;
  };

  // Download Markdown file
  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-audit-${report.email.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date()
      .toISOString()
      .slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Markdown to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Generate 90-Day Calendar Reminder (.ics file)
  const handleDownloadCalendarReminder = () => {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 90);

    const pad = (n: number) => String(n < 10 ? `0${n}` : n);
    const y = String(reminderDate.getFullYear());
    const m = pad(reminderDate.getMonth() + 1);
    const d = pad(reminderDate.getDate());
    const startStr = `${y}${m}${d}T090000Z`;
    const endStr = `${y}${m}${d}T093000Z`;
    const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Security Intelligence Platform//Defensive Audit Reminder//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:breach-audit-${Date.now()}@security-platform.local
DTSTAMP:${nowStr}
DTSTART:${startStr}
DTEND:${endStr}
SUMMARY:🛡️ 90-Day Credential Breach & Security Audit (${report.email})
DESCRIPTION:Routine defensive security checkup for ${report.email}. Check for newly cataloged breaches, review password hygiene, and update credentials.
LOCATION:Email Breach & Security Intelligence Platform
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: 90-Day Security Audit Due
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-reminder-90days.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCalendarDownloaded(true);
    setTimeout(() => setCalendarDownloaded(false), 3000);
  };

  return (
    <div
      id="executive-report-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="executive-report-modal"
        className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Executive Security Incident Report</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Ready for Print / PDF
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Target: <strong className="text-cyan-300">{report.email}</strong> &bull; Score:{' '}
                <strong className={report.riskLevel === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}>
                  {report.riskLevel}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Print / Save PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>

            {/* Download Markdown */}
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download size={14} />
              <span>Download (.md)</span>
            </button>

            {/* Copy text */}
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Calendar 90-Day Reminder */}
          <button
            type="button"
            onClick={handleDownloadCalendarReminder}
            className="px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Download .ics calendar event for 90-day review"
          >
            <Calendar size={14} />
            <span>{calendarDownloaded ? 'Reminder Downloaded!' : 'Add 90-Day Calendar Reminder'}</span>
          </button>
        </div>

        {/* Scrollable Printable Report Preview */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 print:bg-white print:text-black print:p-0">
          {/* Executive Header Box */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Cybersecurity Incident Audit
                </div>
                <h3 className="text-xl font-bold font-mono text-white">{report.email}</h3>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                    report.riskLevel === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : report.riskLevel === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  RISK LEVEL: {report.riskLevel}
                </span>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Audited: {new Date(report.checkedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Total Leaked Sites</div>
                <div className="text-lg font-bold text-cyan-300">{report.breachCount}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Password Exposures</div>
                <div className="text-lg font-bold text-rose-400">{report.passwordRelatedCount}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Privacy Standard</div>
                <div className="text-lg font-bold text-emerald-400">RFC 5322</div>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <strong className="text-white">Analysis: </strong>
              {report.riskExplanation}
            </div>
          </div>

          {/* Table of Compromised Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <KeyRound size={16} className="text-rose-400" />
              <span>Compromised Services Inventory &amp; Remediation Directives ({report.breaches.length})</span>
            </h4>

            {report.breaches.length > 0 ? (
              <div className="border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                      <th className="p-3">Platform</th>
                      <th className="p-3">Breach Date</th>
                      <th className="p-3">Passwords?</th>
                      <th className="p-3">Exposed Attributes</th>
                      <th className="p-3">Direct Fix Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {report.breaches.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-white font-mono">
                          {b.website}
                          {b.domain && <div className="text-[10px] text-slate-400">{b.domain}</div>}
                        </td>
                        <td className="p-3 text-slate-300 font-mono">{b.breachDate}</td>
                        <td className="p-3">
                          {b.passwordDataReported ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              YES
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">No</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-300 text-[11px] max-w-xs truncate" title={b.dataExposed.join(', ')}>
                          {b.dataExposed.join(', ')}
                        </td>
                        <td className="p-3">
                          {b.securityLink ? (
                            <a
                              href={b.securityLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 hover:underline"
                            >
                              <span>Official Portal</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Manual Reset</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-emerald-400 font-semibold">
                No active breaches recorded.
              </div>
            )}
          </div>

          {/* Action Checklist Directives */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Prioritized Remediation Directives</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Priority 1: Change Passwords on Breached Accounts</strong> — Immediately rotate passwords
                  on all services above using strong, generated credentials.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Priority 2: Enforce Multi-Factor Authentication (2FA)</strong> — Protect your primary email
                  and sensitive financial accounts with hardware keys or Authenticator apps.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Priority 3: Password Reuse Audit</strong> — Change passwords on any third-party websites
                  where similar passwords were used.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Priority 4: Beware of Targeted Phishing</strong> — Threat actors exploit leaked names and phone
                  numbers to send realistic SMS or email phishing scams.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Defensive Security Platform &bull; No Stolen Passwords Logged</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

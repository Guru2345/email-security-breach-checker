import React, { useState } from 'react';
import {
  Presentation,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Database,
  Lock,
  Key,
  CreditCard,
  User,
  Briefcase,
  Download,
  Search,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from 'lucide-react';
import { SecurityReportResponse, SavedReportItem } from '../types';
import { apiCheckEmail } from '../utils/apiClient';

const SERVICE_REMEDIATION_MAP: Record<string, string> = {
  canva: 'https://www.canva.com/login/reset',
  dropbox: 'https://www.dropbox.com/forgot',
  linkedin: 'https://www.linkedin.com/checkpoint/rp/request-password-reset',
  myfitnesspal: 'https://www.myfitnesspal.com/account/forgot-password',
  apollo: 'https://app.apollo.io/#/login',
  adobe: 'https://account.adobe.com/security',
  evite: 'https://www.evite.com/forgot-password',
  stratfor: 'https://worldview.stratfor.com/user/password',
  neteller: 'https://member.neteller.com/reset-password',
  wattpad: 'https://www.wattpad.com/forgot',
  myspace: 'https://myspace.com/forgotpassword',
  deezer: 'https://www.deezer.com/password/lost',
  duolingo: 'https://www.duolingo.com/forgot_password',
  zoosk: 'https://www.zoosk.com/resetpassword',
  houzz: 'https://www.houzz.com/forgotPassword',
};

function getServiceRemediationLink(name: string): string {
  const clean = name.toLowerCase().trim();
  for (const [key, url] of Object.entries(SERVICE_REMEDIATION_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return url;
    }
  }
  return `https://www.google.com/search?q=${encodeURIComponent(name)}+official+password+reset`;
}

export interface DemoPersona {
  id: string;
  email: string;
  category: 'Personal' | 'Corporate' | 'Financial & PII' | 'Creative' | 'Clean' | 'Primary';
  roleTitle: string;
  expectedRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  breachNames: string[];
  exposedDataClasses: string[];
  threatSummary: string;
  recommendedAction: string;
  totalExposedUsers: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'personal-consumer',
    email: 'john.doe@gmail.com',
    category: 'Personal',
    roleTitle: 'Consumer & Personal Accounts',
    expectedRisk: 'CRITICAL',
    breachNames: ['Canva', 'Dropbox', 'LinkedIn', 'MyFitnessPal'],
    exposedDataClasses: [
      'Passwords (Salted SHA-1 & Bcrypt)',
      'Usernames',
      'Dates of birth',
      'IP addresses',
      'Email addresses',
    ],
    threatSummary:
      'Compromised across multiple consumer and fitness services. High danger of credential stuffing: if the user reused their password, attackers can compromise their personal inbox or cloud storage.',
    recommendedAction:
      'Immediately change passwords on all reused services and activate multi-factor authentication (2FA).',
    totalExposedUsers: '513 Million Accounts',
  },
  {
    id: 'corporate-analyst',
    email: 'sarah.analyst@techcorp.com',
    category: 'Corporate',
    roleTitle: 'Enterprise Tech & Business Identity',
    expectedRisk: 'CRITICAL',
    breachNames: ['Apollo', 'LinkedIn', 'Adobe', 'Evite'],
    exposedDataClasses: [
      'Job titles',
      'Employers',
      'Phone numbers',
      'Geographic locations',
      'Passwords',
      'Social media profiles',
    ],
    threatSummary:
      'Corporate telemetry, job title, and employer leaked alongside hashed passwords. Threat actors can craft high-conviction spear-phishing campaigns and business email compromise (BEC) attacks.',
    recommendedAction:
      'Rotate corporate single sign-on (SSO) passwords, enroll hardware security keys, and alert the organization security operations team.',
    totalExposedUsers: '442 Million Accounts',
  },
  {
    id: 'financial-crypto',
    email: 'alex.crypto@yahoo.com',
    category: 'Financial & PII',
    roleTitle: 'Financial & High-PII Risk',
    expectedRisk: 'CRITICAL',
    breachNames: ['Stratfor', 'Neteller', 'Adobe'],
    exposedDataClasses: [
      'Credit card details',
      'Physical mailing addresses',
      'Phone numbers',
      'Plaintext passwords',
      'Financial account identifiers',
    ],
    threatSummary:
      'Severe identity theft and financial fraud exposure. Attackers possess billing addresses, telephone numbers, and partial credit card information along with authentication credentials.',
    recommendedAction:
      'Review bank and credit statements for fraudulent activity, request new payment cards, and freeze credit reporting where appropriate.',
    totalExposedUsers: '156 Million Accounts',
  },
  {
    id: 'creative-media',
    email: 'creative.designer@outlook.com',
    category: 'Creative',
    roleTitle: 'Creative & Digital Media Artist',
    expectedRisk: 'HIGH',
    breachNames: ['Canva', 'Wattpad', 'Adobe'],
    exposedDataClasses: [
      'Passwords',
      'Display names',
      'Social media handles',
      'Spoken languages',
      'Website URLs',
      'Usernames',
    ],
    threatSummary:
      'Creative portfolios and author accounts compromised. Threat actors can hijack public identities, deface published works, or pivot into linked online stores.',
    recommendedAction:
      'Update creative studio credentials, verify portfolio domain DNS/hosting records, and disconnect unused third-party OAuth apps.',
    totalExposedUsers: '558 Million Accounts',
  },
  {
    id: 'clean-executive',
    email: 'clean.executive@cyberdefense.com',
    category: 'Clean',
    roleTitle: 'Defensive Security Reference Profile',
    expectedRisk: 'LOW',
    breachNames: [],
    exposedDataClasses: ['Zero compromises detected'],
    threatSummary:
      'Zero documented security incidents detected across authorized breach repositories. Demonstrates clean account hygiene and successful proactive perimeter defense.',
    recommendedAction:
      'Maintain strong password manager practices, enable passkeys/FIDO2 keys, and perform periodic breach audits.',
    totalExposedUsers: '0 (Clean)',
  },
];

interface DemoShowcaseProps {
  onAuditEmail: (email: string) => void;
  onSaveReport: (report: SecurityReportResponse) => void;
  savedReports: SavedReportItem[];
  onOpenSavedModal: () => void;
}

export const DemoShowcase: React.FC<DemoShowcaseProps> = ({
  onAuditEmail,
  onSaveReport,
  savedReports,
  onOpenSavedModal,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [batchSaving, setBatchSaving] = useState(false);
  const [batchSavedSuccess, setBatchSavedSuccess] = useState(false);

  const filteredPersonas =
    filterCategory === 'ALL'
      ? DEMO_PERSONAS
      : DEMO_PERSONAS.filter((p) => p.category === filterCategory);

  const isEmailSaved = (email: string) => {
    return savedReports.some((s) => s.email.toLowerCase() === email.toLowerCase());
  };

  const handleSaveAllDemoScenarios = async () => {
    setBatchSaving(true);
    setBatchSavedSuccess(false);

    try {
      for (const persona of DEMO_PERSONAS) {
        if (!isEmailSaved(persona.email)) {
          try {
            const data = await apiCheckEmail(persona.email);
            onSaveReport(data);
          } catch (err) {
            console.warn('[DemoShowcase] Skip persona save:', persona.email, err);
          }
        }
      }
      setBatchSavedSuccess(true);
      setTimeout(() => setBatchSavedSuccess(false), 5000);
    } catch (err) {
      console.error('[DemoShowcase] Error batch saving demo scenarios:', err);
    } finally {
      setBatchSaving(false);
    }
  };

  const handleExportDemoDataset = () => {
    const dataStr = JSON.stringify(DEMO_PERSONAS, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cybersecurity_demo_leak_matrix_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="demo-showcase-panel" className="space-y-8 animate-fadeIn">
      {/* Top Banner / Mission Statement for Presentations */}
      <div className="bg-slate-900/90 border border-cyan-900/60 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              <Presentation size={13} />
              <span>Project Presentation &amp; Evaluator Showcase</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Curated Data Leak Scenarios &amp; Threat Intelligence
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Use these pre-configured demonstration accounts to demonstrate how data leaks from
              different platforms (Canva, Adobe, Dropbox, Apollo, Stratfor, etc.) expose distinct
              categories of personal data—from salted passwords and plain text to phone numbers, job
              titles, and financial records.
            </p>
          </div>

          {/* Action Buttons for Preserving & Exporting Demo Answers */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              id="batch-save-all-demo-btn"
              type="button"
              onClick={handleSaveAllDemoScenarios}
              disabled={batchSaving}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                batchSavedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {batchSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : batchSavedSuccess ? (
                <CheckCircle2 size={15} />
              ) : (
                <Bookmark size={15} />
              )}
              <span>
                {batchSaving
                  ? 'Saving All Scenarios...'
                  : batchSavedSuccess
                  ? 'All Demo Audits Saved!'
                  : 'Save All Scenarios to Saved Audits'}
              </span>
            </button>

            <button
              id="export-demo-matrix-btn"
              type="button"
              onClick={handleExportDemoDataset}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>Export Matrix (.JSON)</span>
            </button>
          </div>
        </div>

        {/* Quick status bar showing how many demo scenarios are saved */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            <span>
              Saved in local audits:{' '}
              <strong className="text-cyan-300">
                {savedReports.length} report{savedReports.length === 1 ? '' : 's'}
              </strong>
            </span>
            {savedReports.length > 0 && (
              <button
                type="button"
                onClick={onOpenSavedModal}
                className="text-cyan-400 hover:underline font-medium ml-1 cursor-pointer"
              >
                (View Saved Answers)
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock size={12} className="text-emerald-400" />
            <span>100% Free Level Ready • Zero Paid Keys Required for Student Evaluation</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Filter by Type:
        </span>
        {[
          { key: 'ALL', label: 'All Demo Profiles' },
          { key: 'Personal', label: 'Personal Email' },
          { key: 'Corporate', label: 'Corporate & Tech' },
          { key: 'Financial & PII', label: 'Financial & PII Leak' },
          { key: 'Creative', label: 'Creative Media' },
          { key: 'Clean', label: 'Clean Hygiene' },
          { key: 'Primary', label: 'Primary Email' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterCategory(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              filterCategory === tab.key
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonas.map((persona) => {
          const isSaved = isEmailSaved(persona.email);
          const isExpanded = expandedPersona === persona.id;

          const getRiskBadge = (risk: string) => {
            switch (risk) {
              case 'CRITICAL':
                return 'bg-rose-950/80 text-rose-300 border-rose-800/60';
              case 'HIGH':
                return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
              case 'MEDIUM':
                return 'bg-yellow-950/80 text-yellow-300 border-yellow-800/60';
              default:
                return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
            }
          };

          return (
            <div
              key={persona.id}
              id={`persona-card-${persona.id}`}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-lg space-y-5"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {persona.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${getRiskBadge(
                      persona.expectedRisk
                    )}`}
                  >
                    {persona.expectedRisk} RISK
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base leading-snug">
                    {persona.roleTitle}
                  </h3>
                  <code className="text-xs font-mono text-cyan-300 break-all select-all block mt-0.5">
                    {persona.email}
                  </code>
                </div>
              </div>

              {/* Where Was Data Leaked? */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <span>Where Data Leaked:</span>
                  <span>{persona.breachNames.length} Incidents</span>
                </div>

                {persona.breachNames.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {persona.breachNames.map((name) => (
                      <a
                        key={name}
                        href={getServiceRemediationLink(name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md bg-slate-800/90 hover:bg-rose-950/80 hover:border-rose-800 text-slate-200 hover:text-rose-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer group"
                        title={`Open ${name} official website to change leaked data`}
                      >
                        <Database size={11} className="text-cyan-400 group-hover:text-rose-400" />
                        <span>{name}</span>
                        <ArrowUpRight size={10} className="text-slate-400 group-hover:text-rose-300" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium py-1">
                    <ShieldCheck size={14} />
                    <span>0 Public Incidents Detected</span>
                  </div>
                )}
              </div>

              {/* What Data Was Leaked? */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                  Exposed Data Attributes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {persona.exposedDataClasses.map((cls) => {
                    const isPass = cls.toLowerCase().includes('password');
                    const isFinancial =
                      cls.toLowerCase().includes('credit') || cls.toLowerCase().includes('account');
                    const isPII =
                      cls.toLowerCase().includes('phone') ||
                      cls.toLowerCase().includes('address') ||
                      cls.toLowerCase().includes('birth');

                    let chipStyle = 'bg-slate-800/70 text-slate-300 border-slate-700';
                    if (isPass) chipStyle = 'bg-rose-950/60 text-rose-300 border-rose-800/50';
                    else if (isFinancial)
                      chipStyle = 'bg-red-950/60 text-red-300 border-red-800/50';
                    else if (isPII)
                      chipStyle = 'bg-amber-950/60 text-amber-300 border-amber-800/50';

                    return (
                      <span
                        key={cls}
                        className={`px-2 py-0.5 rounded text-[11px] border font-medium ${chipStyle}`}
                      >
                        {cls}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Expandable Deep Dive Threat Analysis */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setExpandedPersona(isExpanded ? null : persona.id)}
                  className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
                >
                  <span className="font-semibold">Threat &amp; Impact Analysis</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 animate-fadeIn">
                    <p className="leading-relaxed text-[11px]">{persona.threatSummary}</p>
                    <div className="pt-1 text-[11px] text-amber-300">
                      <strong>Recommended Mitigation:</strong> {persona.recommendedAction}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                      Total global impact: {persona.totalExposedUsers}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  id={`audit-btn-${persona.id}`}
                  type="button"
                  onClick={() => onAuditEmail(persona.email)}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Search size={13} />
                  <span>Audit This Email</span>
                  <ArrowRight size={12} />
                </button>

                <button
                  id={`save-btn-${persona.id}`}
                  type="button"
                  onClick={async () => {
                    if (isSaved) {
                      onOpenSavedModal();
                    } else {
                      try {
                        const data = await apiCheckEmail(persona.email);
                        onSaveReport(data);
                      } catch (err) {
                        console.error('[DemoShowcase] Error saving persona:', err);
                      }
                    }
                  }}
                  className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/80'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={isSaved ? 'Already saved in your audits' : 'Save answer to audit reports'}
                >
                  {isSaved ? <CheckCircle2 size={16} /> : <Bookmark size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Data Leak Comparison Matrix */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Layers size={17} className="text-cyan-400" />
              <span>Comparative Data Leak Matrix (For Presentation &amp; Analysis)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side mapping of compromised organizations, leaked attributes, and threat levels.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
            {DEMO_PERSONAS.length} Total Profiles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/50">
                <th className="py-3 px-3">Demo Profile</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Where Data Leaked</th>
                <th className="py-3 px-3">What Data Leaked</th>
                <th className="py-3 px-3">Risk Rating</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DEMO_PERSONAS.map((persona) => (
                <tr
                  key={persona.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {persona.roleTitle}
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300 whitespace-nowrap">
                    {persona.email}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {persona.breachNames.length > 0 ? (
                        persona.breachNames.map((b) => (
                          <a
                            key={b}
                            href={getServiceRemediationLink(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-200 hover:text-rose-200 text-[10px] border border-slate-700 hover:border-rose-800 inline-flex items-center gap-0.5 cursor-pointer"
                            title={`Open ${b} to change leaked data`}
                          >
                            <span>{b}</span>
                            <ArrowUpRight size={8} className="text-slate-400" />
                          </a>
                        ))
                      ) : (
                        <span className="text-emerald-400 font-medium text-[11px]">Clean</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-[11px] text-slate-300 line-clamp-2 max-w-sm">
                      {persona.exposedDataClasses.join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        persona.expectedRisk === 'CRITICAL'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                          : persona.expectedRisk === 'HIGH'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      }`}
                    >
                      {persona.expectedRisk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onAuditEmail(persona.email)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Analyze</span>
                      <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

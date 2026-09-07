import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  CreditCard,
  PhoneCall,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { NormalizedBreach } from '../types';

interface PiiThreatMatrixProps {
  breaches: NormalizedBreach[];
}

interface ThreatCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'CLEAR';
  exposedClasses: string[];
  affectedWebsites: string[];
  attackScenario: string;
  defenseRecommendation: string;
}

export const PiiThreatMatrix: React.FC<PiiThreatMatrixProps> = ({ breaches }) => {
  const [expandedId, setExpandedId] = useState<string | null>('auth');

  // Collect and group exposed classes across all breaches
  const exposedClassToSites: Record<string, Set<string>> = {};
  breaches.forEach((b) => {
    b.dataExposed.forEach((dc) => {
      const normalized = dc.trim();
      if (!exposedClassToSites[normalized]) {
        exposedClassToSites[normalized] = new Set();
      }
      exposedClassToSites[normalized].add(b.website);
    });
  });

  const allExposed = Object.keys(exposedClassToSites);

  // Grouping Rules
  const authKeywords = ['password', 'hash', 'salt', 'pin', 'security question', 'secret', 'auth', 'token'];
  const financeKeywords = ['credit card', 'bank', 'payment', 'transaction', 'financial', 'income', 'billing', 'ssn', 'tax', 'social security'];
  const phishingKeywords = ['phone', 'mobile', 'address', 'physical', 'job', 'employer', 'name', 'dob', 'date of birth', 'gender', 'family', 'relation'];
  const techKeywords = ['ip address', 'mac address', 'device', 'browser', 'user agent', 'location', 'gps', 'operating system', 'network'];

  const matchKeywords = (keywords: string[]) => {
    return allExposed.filter((dc) => {
      const lower = dc.toLowerCase();
      return keywords.some((kw) => lower.includes(kw));
    });
  };

  const authClasses = matchKeywords(authKeywords);
  const financeClasses = matchKeywords(financeKeywords);
  const phishingClasses = matchKeywords(phishingKeywords);
  const techClasses = matchKeywords(techKeywords);

  const getAffectedSites = (classes: string[]) => {
    const sites = new Set<string>();
    classes.forEach((c) => {
      exposedClassToSites[c]?.forEach((s) => sites.add(s));
    });
    return Array.from(sites);
  };

  const categories: ThreatCategory[] = [
    {
      id: 'auth',
      title: 'Authentication & Credential Stuffing Risk',
      icon: KeyRound,
      description: 'Stolen passwords and hashes can be tested against your email, banking, and primary cloud services.',
      threatLevel: authClasses.length > 0 ? 'CRITICAL' : 'CLEAR',
      exposedClasses: authClasses,
      affectedWebsites: getAffectedSites(authClasses),
      attackScenario:
        'Automated botnets use credential stuffing tools to test leaked username/password pairs across hundreds of top websites simultaneously.',
      defenseRecommendation:
        'Never reuse passwords. Immediately change passwords on all breached platforms and enforce FIDO2 or Authenticator App-based 2FA.',
    },
    {
      id: 'finance',
      title: 'Financial & Identity Fraud Risk',
      icon: CreditCard,
      description: 'Exposed billing details, payment records, or tax IDs can enable unauthorized financial inquiries or fraud.',
      threatLevel: financeClasses.length > 0 ? 'HIGH' : 'CLEAR',
      exposedClasses: financeClasses,
      affectedWebsites: getAffectedSites(financeClasses),
      attackScenario:
        'Threat actors combine partial financial data with stolen identity records to initiate fraudulent charges, request replacement cards, or bypass bank KYC.',
      defenseRecommendation:
        'Review credit reports via annualcreditreport.com, place a free security credit freeze with Experian/TransUnion/Equifax, and set bank push notifications.',
    },
    {
      id: 'phishing',
      title: 'Targeted Spear-Phishing & Social Engineering',
      icon: PhoneCall,
      description: 'Phone numbers, full names, and employer details allow attackers to craft convincing personalized attacks.',
      threatLevel: phishingClasses.length > 0 ? 'HIGH' : 'CLEAR',
      exposedClasses: phishingClasses,
      affectedWebsites: getAffectedSites(phishingClasses),
      attackScenario:
        'Attackers send personalized SMS messages (Smishing) claiming to be your bank or employer, using your real name and company to trick you into verifying credentials.',
      defenseRecommendation:
        'Never click links in unexpected text messages or emails. Contact services directly through official mobile apps or verified customer support lines.',
    },
    {
      id: 'tech',
      title: 'Digital Footprint & Device Telemetry',
      icon: Laptop,
      description: 'IP addresses and device telemetry reveal physical locations and network providers.',
      threatLevel: techClasses.length > 0 ? 'MEDIUM' : 'CLEAR',
      exposedClasses: techClasses,
      affectedWebsites: getAffectedSites(techClasses),
      attackScenario:
        'Correlating historical IP addresses with geolocation logs enables attackers to determine residence, travel patterns, and ISP configurations.',
      defenseRecommendation:
        'Use trusted VPN connections on public Wi-Fi networks and inspect your router firmware for automatic security patch updates.',
    },
  ];

  const getThreatBadge = (level: ThreatCategory['threatLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/60';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'MEDIUM':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60';
      case 'CLEAR':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
    }
  };

  return (
    <div
      id="pii-threat-matrix"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl p-5 sm:p-7 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
            <ShieldAlert size={14} className="text-cyan-400" />
            <span>Attack Surface Assessment</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            PII &amp; Credential Threat Matrix
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            See how data leaked across <strong className="text-white">{breaches.length} incidents</strong> impacts
            your personal security across 4 critical attack vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            {allExposed.length} Unique Data Classes Exposed
          </span>
        </div>
      </div>

      {/* Vector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isExpanded = expandedId === cat.id;

          return (
            <div
              key={cat.id}
              className={`rounded-xl border transition-all ${
                cat.threatLevel === 'CRITICAL'
                  ? 'bg-gradient-to-b from-rose-950/20 to-slate-950 border-rose-900/40'
                  : cat.threatLevel === 'HIGH'
                  ? 'bg-gradient-to-b from-amber-950/20 to-slate-950 border-amber-900/40'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        cat.threatLevel === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : cat.threatLevel === 'HIGH'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cat.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${getThreatBadge(
                      cat.threatLevel
                    )}`}
                  >
                    {cat.threatLevel}
                  </span>
                </div>

                {/* Exposed Tags */}
                {cat.exposedClasses.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] uppercase font-mono font-semibold text-slate-400">
                      Exposed Attributes ({cat.exposedClasses.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.exposedClasses.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 size={14} />
                    <span>No documented exposures in this vector.</span>
                  </div>
                )}

                {/* Toggle Details */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                  className="w-full pt-2 flex items-center justify-between text-xs text-slate-400 hover:text-cyan-300 font-semibold border-t border-slate-850 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Attack Analysis' : 'Inspect Threat Scenario & Defense'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Expandable Attack Details */}
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 space-y-3 text-xs border-t border-slate-800/80 bg-slate-950/40">
                  <div className="space-y-1 mt-3">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <AlertTriangle size={13} className="text-amber-400" />
                      <span>Potential Exploit Vector:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px] pl-4 border-l-2 border-amber-500/50">
                      {cat.attackScenario}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Actionable Defense:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px] pl-4 border-l-2 border-emerald-500/50">
                      {cat.defenseRecommendation}
                    </p>
                  </div>

                  {cat.affectedWebsites.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                        Compromised Sources:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cat.affectedWebsites.map((site, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {site}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

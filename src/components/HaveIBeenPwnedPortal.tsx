import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  Database,
  Building2,
  Key,
  HelpCircle,
  Check,
  Copy,
  ArrowUpRight,
  Shield,
  Search,
  Lock,
  FileCheck,
  Server,
  ShieldAlert,
  ArrowRight,
  DownloadCloud,
  FileText,
} from 'lucide-react';

interface HaveIBeenPwnedPortalProps {
  currentEmail?: string;
  onLoad30Breaches?: (email: string) => void;
  onImportHibpBreaches?: (email: string, rawTextOrNames: string | string[]) => void;
}

export const HaveIBeenPwnedPortal: React.FC<HaveIBeenPwnedPortalProps> = ({
  currentEmail,
  onLoad30Breaches,
  onImportHibpBreaches,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [portalEmail, setPortalEmail] = useState(currentEmail || 'yekkantiguruvardhan@gmail.com');
  const [copiedEmailToast, setCopiedEmailToast] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [showImporter, setShowImporter] = useState(false);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const handleOpenHibpWithEmail = () => {
    navigator.clipboard.writeText(portalEmail.trim());
    setCopiedEmailToast(true);
    setTimeout(() => setCopiedEmailToast(false), 3000);
    window.open('https://haveibeenpwned.com/', '_blank', 'noopener,noreferrer');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onImportHibpBreaches) {
      onImportHibpBreaches(portalEmail.trim(), pasteInput.trim());
    }
  };

  const directLinks = [
    {
      title: 'Official HIBP Home & Email Search',
      description: 'Check whether your personal email address or phone number has been compromised in any public data breach.',
      url: 'https://haveibeenpwned.com/',
      badge: 'Primary Portal',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      icon: Search,
      primaryActionText: 'Open Email Search',
    },
    {
      title: 'Pwned Passwords Directory',
      description: 'Search across 800+ million real-world compromised passwords safely using the mathematical k-Anonymity model.',
      url: 'https://haveibeenpwned.com/Passwords',
      badge: 'k-Anonymity',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      icon: KeyRound,
      primaryActionText: 'Open Pwned Passwords',
    },
    {
      title: 'Pwned Websites Catalog',
      description: 'Browse the complete historical database of hundreds of confirmed corporate breaches and data leaks.',
      url: 'https://haveibeenpwned.com/PwnedWebsites',
      badge: '800+ Breaches',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      icon: Database,
      primaryActionText: 'Browse Breached Websites',
    },
    {
      title: 'Domain Search for Enterprises',
      description: 'Organizations and system administrators can verify domain ownership to monitor all company email addresses.',
      url: 'https://haveibeenpwned.com/DomainSearch',
      badge: 'Enterprise / SecOps',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      icon: Building2,
      primaryActionText: 'Open Domain Search',
    },
    {
      title: 'Official HIBP API & Key Access',
      description: 'Obtain an authorized commercial or personal API v3 key to integrate breach intelligence into your internal tools.',
      url: 'https://haveibeenpwned.com/API/Key',
      badge: 'API v3 Access',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      icon: Key,
      primaryActionText: 'Get API Key',
    },
    {
      title: 'FAQs & Ethical Guidelines',
      description: 'Learn about Troy Hunt’s verification methodology, data handling ethics, and official partnerships.',
      url: 'https://haveibeenpwned.com/FAQs',
      badge: 'Documentation',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: HelpCircle,
      primaryActionText: 'Read FAQs',
    },
  ];

  return (
    <div id="hibp-official-portal" className="space-y-6">
      {/* Hero Section with Direct Open Button */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400 shadow-md">
                <Globe size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Page 9 &bull; Official External Portal
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Trusted Security Partner
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Have I Been Pwned (HIBP)
                </h2>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              Created by Troy Hunt
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            <strong>Have I Been Pwned</strong> is the globally recognized cybersecurity standard for data breach notification and identity protection, cataloging billions of compromised credentials across thousands of corporate incidents.
          </p>

          {/* Interactive Live Email Bridge */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="hibp-portal-email" className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Search size={14} className="text-cyan-400" />
                <span>Direct Search on haveibeenpwned.com:</span>
              </label>
              {copiedEmailToast && (
                <span className="text-xs text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
                  <Check size={13} />
                  <span>Email copied! Paste on haveibeenpwned.com</span>
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                id="hibp-portal-email"
                type="email"
                value={portalEmail}
                onChange={(e) => setPortalEmail(e.target.value)}
                placeholder="Enter email to check on haveibeenpwned.com..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:outline-hidden focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={handleOpenHibpWithEmail}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                title="Copies email to clipboard and opens haveibeenpwned.com"
              >
                <Globe size={16} />
                <span>Open haveibeenpwned.com ↗</span>
              </button>

              {onLoad30Breaches && (
                <button
                  type="button"
                  onClick={() => onLoad30Breaches(portalEmail.trim())}
                  className="px-5 py-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 shadow-md"
                  title="Loads all 30 authentic breaches into Page 2 with direct password reset links"
                >
                  <ShieldAlert size={16} className="text-rose-400" />
                  <span>Load 30 Breaches into App</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Links Bar */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopy('https://haveibeenpwned.com')}
              className="px-4 py-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
              title="Copy official website URL"
            >
              {copiedUrl === 'https://haveibeenpwned.com' ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-300">Copied URL!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy haveibeenpwned.com</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowImporter(!showImporter)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <DownloadCloud size={14} />
              <span>{showImporter ? 'Hide Importer' : 'Paste HIBP Results Text / Breach Names'}</span>
            </button>
          </div>

          {/* Breach Importer Form */}
          {showImporter && (
            <form onSubmit={handleImportSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200">
                  Paste Breach Names or Text from haveibeenpwned.com:
                </label>
                <p className="text-[11px] text-slate-400">
                  Paste the text or list of breaches you see on haveibeenpwned.com (e.g. "Canva, Adobe, Dropbox, LinkedIn..."). Our system will automatically cross-reference all 1,034 cataloged breaches and generate your remediation plan with direct password reset links!
                </p>
              </div>
              <textarea
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder="Paste breach text here, or type: Canva, Adobe, Dropbox, LinkedIn, MyFitnessPal..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <FileText size={14} />
                <span>Import &amp; Audit Compromised Platforms</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Discrepancy Explanation Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield size={16} className="text-amber-400" />
          <span>Understanding HIBP Website (30 Breaches) vs. Free Open API (0 Breaches)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-cyan-300">1. HIBP Official Website</div>
            <p className="text-slate-400 leading-relaxed">
              Troy Hunt’s web portal (haveibeenpwned.com) indexes 1,000+ public corporate breaches and 14+ billion leaked records. The browser site is protected by Cloudflare and free for manual lookups.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-300">2. Why Free Open APIs Show 0</div>
            <p className="text-slate-400 leading-relaxed">
              Automated third-party apps without a paid HIBP API key query secondary open catalogs (e.g. XposedOrNot), which do not index as many historical breaches as Troy Hunt’s private database.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-300">3. Our Direct Solution</div>
            <p className="text-slate-400 leading-relaxed">
              This platform provides 1-click opening to haveibeenpwned.com AND incorporates the authentic 30-breach catalog so you receive full password reset links and security checklists immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Service Launch Hub Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server size={18} className="text-cyan-400" />
            <span>Direct Access to HIBP Services &amp; Tools</span>
          </h3>
          <span className="text-xs text-slate-400">Click any card to launch directly in a new tab</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-700/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500 transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer group-hover:underline"
                  >
                    <span>{link.primaryActionText}</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(link.url)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Copy direct link"
                  >
                    {copiedUrl === link.url ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Principles & Architecture */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Why Have I Been Pwned is the Global Standard</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Lock size={16} />
              <span>Mathematical k-Anonymity</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              When querying passwords, only the first 5 characters of a SHA-1 hash are sent. Your actual password never leaves your browser or device.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <FileCheck size={16} />
              <span>Ethical Verification</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Breach records are independently verified by security researchers and corporate disclosures before inclusion. No unverified rumors are published.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Building2 size={16} />
              <span>Global Government Trust</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Trusted by the UK National Cyber Security Centre (NCSC), Australian Cyber Security Centre (ACSC), 1Password, Mozilla, and Fortune 500 teams.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Launch Banner */}
      <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-900/60 border border-cyan-700 flex items-center justify-center text-cyan-300 shrink-0">
            <ExternalLink size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Ready to explore Have I Been Pwned directly?
            </div>
            <div className="text-xs text-slate-400">
              Opens the verified official site in a secure, new browser tab.
            </div>
          </div>
        </div>

        <a
          href="https://haveibeenpwned.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Open haveibeenpwned.com</span>
          <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
};


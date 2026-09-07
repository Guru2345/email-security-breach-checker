import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldAlert,
  Loader2,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Plus,
  Trash2,
  UserCheck,
  Zap,
  ArrowRight,
  Globe,
  ExternalLink,
  Check,
} from 'lucide-react';
import { TestScenario } from '../types';

interface EmailSearchProps {
  onSearch: (email: string, customApiKey?: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  testScenarios?: TestScenario[];
  apiKeyConfigured: boolean;
  savedReportsCount?: number;
  onOpenSavedReports?: () => void;
  currentEmail?: string;
  onGoToNextPage?: () => void;
  onLoad30Breaches?: (email: string) => Promise<void>;
  onOpenHibpPortalPage?: () => void;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const EmailSearch: React.FC<EmailSearchProps> = ({
  onSearch,
  isLoading,
  errorMessage,
  testScenarios = [],
  apiKeyConfigured,
  savedReportsCount = 0,
  onOpenSavedReports,
  currentEmail,
  onGoToNextPage,
  onLoad30Breaches,
  onOpenHibpPortalPage,
}) => {
  const [email, setEmail] = useState(currentEmail || '');
  const [clientApiKey, setClientApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [customPresets, setCustomPresets] = useState<string[]>([]);
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [newPresetEmail, setNewPresetEmail] = useState('');
  const [copiedForHibp, setCopiedForHibp] = useState(false);

  useEffect(() => {
    if (currentEmail) {
      setEmail(currentEmail);
    }
  }, [currentEmail]);

  // Load custom presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_predefined_emails');
      if (stored) {
        setCustomPresets(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Unable to load predefined emails from localStorage', e);
    }
  }, []);

  const handleAddPreset = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPresetEmail.trim().toLowerCase();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      return;
    }
    if (customPresets.includes(trimmed)) {
      setShowAddPreset(false);
      setNewPresetEmail('');
      return;
    }
    const updated = [...customPresets, trimmed];
    setCustomPresets(updated);
    try {
      localStorage.setItem('user_predefined_emails', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setNewPresetEmail('');
    setShowAddPreset(false);
  };

  const handleRemovePreset = (presetToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter((p) => p !== presetToRemove);
    setCustomPresets(updated);
    try {
      localStorage.setItem('user_predefined_emails', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setValidationError('Please enter an email address to check.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setValidationError('Please enter a valid email address format (e.g. name@company.com).');
      return;
    }

    setValidationError(null);
    onSearch(trimmed, clientApiKey.trim() || undefined);
  };

  const handleScenarioClick = (scenarioEmail: string) => {
    setEmail(scenarioEmail);
    setValidationError(null);
    onSearch(scenarioEmail, clientApiKey.trim() || undefined);
  };

  return (
    <div id="email-search-container" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Real-Time Breach Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Check Where Your Email &amp; Passwords Leaked
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Scan across authorized breach repositories. Discover which websites compromised your
              credentials and get direct links to update your passwords immediately.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
              {apiKeyConfigured ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-emerald-300">Live HIBP Connected</span>
                </>
              ) : (
                <>
                  <Zap size={13} className="text-cyan-400" />
                  <span>Free Full Intelligence Mode</span>
                </>
              )}
            </div>

            <button
              id="toggle-api-key-button"
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors cursor-pointer"
            >
              {showKeyInput ? 'Hide Key' : 'API Key Config'}
            </button>
          </div>
        </div>

        {/* Optional Custom Key Input */}
        {showKeyInput && (
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs animate-fadeIn">
            <label htmlFor="hibp-key-input" className="block text-slate-300 font-medium mb-1.5">
              Custom Have I Been Pwned API Key (Optional):
            </label>
            <div className="flex gap-2">
              <input
                id="hibp-key-input"
                type="password"
                placeholder="Paste HIBP subscription API key here"
                value={clientApiKey}
                onChange={(e) => setClientApiKey(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowKeyInput(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Search Bar Input Form with Button on the Left Side */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
            {/* Primary Action Button on the Left Side */}
            <button
              id="check-email-submit-button"
              type="submit"
              disabled={isLoading}
              className="sm:order-1 order-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-base shrink-0"
              title="Click to check email breach exposure"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-white" />
                  <span>Scanning Breaches...</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={20} />
                  <span>Check Leaks</span>
                </>
              )}
            </button>

            {/* Email Input Field */}
            <div className="relative flex-1 sm:order-2 order-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
              </div>
              <input
                id="email-search-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter email address (e.g. yourname@domain.com)..."
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-slate-950/90 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 text-base focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-inner transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Direct HIBP Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <a
                id="direct-open-hibp-search-btn"
                href="https://haveibeenpwned.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  const target = email.trim() || 'yekkantiguruvardhan@gmail.com';
                  navigator.clipboard.writeText(target);
                  setCopiedForHibp(true);
                  setTimeout(() => setCopiedForHibp(false), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Copies email to clipboard and opens haveibeenpwned.com in a new tab"
              >
                <Globe size={13} className="text-cyan-400" />
                <span>{copiedForHibp ? 'Email Copied! Opening HIBP...' : 'Open on haveibeenpwned.com ↗'}</span>
              </a>

              {onLoad30Breaches && (
                <button
                  id="direct-load-30-breaches-btn"
                  type="button"
                  disabled={isLoading}
                  onClick={() => onLoad30Breaches(email.trim() || 'yekkantiguruvardhan@gmail.com')}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Loads all 30 authentic breaches cataloged on HIBP into your live action report"
                >
                  <ShieldAlert size={13} className="text-rose-400" />
                  <span>Load 30 HIBP Breaches in App</span>
                </button>
              )}
            </div>

            {onGoToNextPage && (
              <button
                id="open-next-page-header-link"
                type="button"
                onClick={onGoToNextPage}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40"
              >
                <span>Open Next Page: Where Data Leaked</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          {/* Validation or API Error Alerts */}
          {(validationError || errorMessage) && (
            <div
              id="search-error-alert"
              className="mt-4 p-4 rounded-xl border border-rose-900/60 bg-rose-950/40 text-rose-300 text-sm flex items-start gap-3 animate-fadeIn shadow-md"
            >
              <ShieldAlert size={18} className="text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{validationError || errorMessage}</div>
            </div>
          )}
        </form>

        {/* Quick Test Emails Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400" />
              <span>One-Click Quick Test Accounts:</span>
            </span>

            <div className="flex items-center gap-2">
              {onOpenSavedReports && savedReportsCount > 0 && (
                <button
                  type="button"
                  onClick={onOpenSavedReports}
                  className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bookmark size={13} className="text-cyan-400" />
                  <span>Saved Audits ({savedReportsCount})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAddPreset(!showAddPreset)}
                className="text-xs text-slate-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-slate-800/60 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Email</span>
              </button>
            </div>
          </div>

          {/* Add custom email form */}
          {showAddPreset && (
            <form
              onSubmit={handleAddPreset}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 animate-fadeIn"
            >
              <input
                type="email"
                placeholder="colleague@company.com"
                value={newPresetEmail}
                onChange={(e) => setNewPresetEmail(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddPreset(false)}
                className="px-2 py-1.5 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct User 30-Breaches Preset */}
            <button
              id="user-30-breach-preset-btn"
              type="button"
              disabled={isLoading}
              onClick={() => handleScenarioClick('yekkantiguruvardhan@gmail.com')}
              className="text-xs px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900/90 text-cyan-200 hover:text-white border border-cyan-800/80 hover:border-cyan-600 transition-colors font-mono cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Audit yekkantiguruvardhan@gmail.com (30 HIBP Breaches)"
            >
              <ShieldAlert size={13} className="text-rose-400" />
              <span>yekkantiguruvardhan@gmail.com</span>
              <span className="text-[10px] font-sans font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                30 HIBP Breaches
              </span>
            </button>

            {/* Custom Presets */}
            {customPresets.map((customEmail) => (
              <div
                key={customEmail}
                className="inline-flex items-center rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-mono transition-colors"
              >
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleScenarioClick(customEmail)}
                  className="px-2.5 py-1.5 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{customEmail}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleRemovePreset(customEmail, e)}
                  className="px-2 py-1.5 text-slate-400 hover:text-rose-400 rounded-r-xl cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            {/* Server Test Scenarios */}
            {testScenarios.map((sc, idx) => (
              <button
                key={idx}
                id={`test-scenario-${idx}`}
                type="button"
                disabled={isLoading}
                onClick={() => handleScenarioClick(sc.email)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors font-mono cursor-pointer flex items-center gap-1.5"
              >
                <span>{sc.email}</span>
                <span className={`text-[10px] font-sans font-semibold ${
                  sc.expectedRisk === 'CRITICAL' ? 'text-rose-400' : sc.expectedRisk === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  ({sc.expectedRisk})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

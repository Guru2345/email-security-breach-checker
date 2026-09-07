import React, { useState } from 'react';
import { Key, ShieldCheck, AlertCircle, Loader2, CheckCircle2, ExternalLink, HelpCircle, DollarSign, Sparkles } from 'lucide-react';
import { KeyValidationResult } from '../types';
import { apiValidateKey } from '../utils/apiClient';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyConfigured: boolean;
  onKeyApplied?: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKeyConfigured,
  onKeyApplied,
}) => {
  const [testKey, setTestKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<KeyValidationResult | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testKey.trim()) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const data = await apiValidateKey(testKey.trim());
      setTestResult(data);

      if (data.valid && onKeyApplied) {
        onKeyApplied(testKey.trim());
      }
    } catch (err: any) {
      setTestResult({
        valid: false,
        status: 'NETWORK_ERROR',
        message: 'Could not communicate with key validation service.',
        tierInfo: 'Free mode is fully functional without this check.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      id="api-key-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="api-key-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 text-slate-300 text-sm my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="text-cyan-400" size={20} />
            <h3 className="font-bold text-slate-100 text-base">
              HIBP API &amp; Free Project Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Level & Free Tier Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <Sparkles size={14} />
              <span>100% Free Mode (Active & Ready)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Zero payment or credit cards required. Your project is upgraded with real-world defensive intelligence:
            </p>
            <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
              <li><strong className="text-white">Live Email Lookups:</strong> Real, live breach searches for any user email via Free Open Breach Intelligence.</li>
              <li><strong className="text-white">Pwned Passwords API:</strong> Unlimited k-Anonymity SHA-1 password checks via Cloudflare.</li>
              <li><strong className="text-white">Public Breaches Catalog:</strong> Live search across all 800+ documented global breaches.</li>
              <li><strong className="text-white">Sample Audit Scenarios:</strong> Authentic multi-breach presets for quick demonstration.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wide">
              <DollarSign size={14} />
              <span>Paid HIBP API Key (Optional)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have I Been Pwned charges ~$3.50/mo for their direct personal email endpoint (<code className="text-slate-300">/breachedaccount</code>) to prevent bulk spamming.
            </p>
            <p className="text-xs text-slate-400">
              <strong className="text-emerald-400">You do not need to buy it.</strong> Our platform automatically uses the free open breach engine when no HIBP key is provided, so all features work for free.
            </p>
          </div>
        </div>

        {/* Live Key Tester Form */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Test an HIBP API Key
            </span>
            <span className="text-[11px] text-slate-400">
              Status:{' '}
              {apiKeyConfigured ? (
                <span className="text-emerald-400 font-semibold">Active in .env</span>
              ) : (
                <span className="text-amber-400 font-semibold">Running in Free Mode</span>
              )}
            </span>
          </div>

          <form onSubmit={handleTestKey} className="flex flex-col sm:flex-row gap-2">
            <input
              id="test-key-input"
              type="password"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
              placeholder="Paste 32-character HIBP API Key to test..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isTesting || !testKey.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isTesting ? <Loader2 size={13} className="animate-spin" /> : <Key size={13} />}
              <span>Test Key</span>
            </button>
          </form>

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                testResult.valid
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.valid ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <span>{testResult.message}</span>
              </div>
              <p className="opacity-80 pl-6 text-[11px]">{testResult.tierInfo}</p>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <a
            href="https://haveibeenpwned.com/API/Key"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Have I Been Pwned Official Key Portal</span>
            <ExternalLink size={12} />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

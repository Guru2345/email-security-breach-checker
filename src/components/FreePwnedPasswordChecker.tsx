import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ShieldCheck, Loader2, Sparkles, Lock, Eye, EyeOff, Info } from 'lucide-react';
import { PasswordCheckResponse } from '../types';
import { apiCheckPasswordPwned } from '../utils/apiClient';

export const FreePwnedPasswordChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PasswordCheckResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password) {
      setErrorMsg('Please enter a password to audit.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      // Compute SHA-1 using browser's native SubtleCrypto for k-Anonymity privacy
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      const prefix = hashHex.slice(0, 5);
      const suffix = hashHex.slice(5);

      // Call free API endpoint (proxied through backend or direct to pwnedpasswords)
      const dataRes = await apiCheckPasswordPwned({ prefix, suffix });
      setResult(dataRes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to check password at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  const setSample = (sample: string) => {
    setPassword(sample);
    setErrorMsg(null);
  };

  return (
    <div
      id="free-password-checker-container"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound size={20} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Free HIBP Pwned Passwords Audit (k-Anonymity)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              100% Free • No Key Required
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Uses Troy Hunt's official free Pwned Passwords API. Powered by k-Anonymity: your plaintext password is never sent over the network—only the first 5 characters of its SHA-1 hash.
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock size={16} />
            </div>
            <input
              id="free-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Test a password for breach exposure..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            id="check-password-submit-btn"
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Checking Hash...</span>
              </>
            ) : (
              <>
                <KeyRound size={16} />
                <span>Audit Password</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Passwords for instant testing */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-cyan-400" />
            <span>Try sample known passwords:</span>
          </span>
          <button
            type="button"
            onClick={() => setSample('password123')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] cursor-pointer"
          >
            password123 (High Exposure)
          </button>
          <button
            type="button"
            onClick={() => setSample('correcthorsebatterystaple')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] cursor-pointer"
          >
            correcthorsebatterystaple
          </button>
          <button
            type="button"
            onClick={() => setSample('X#9qL$7mZ!wK2@vR')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] cursor-pointer"
          >
            X#9qL$7mZ!wK2@vR (Clean)
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {result && (
        <div
          id="password-audit-result"
          className={`mt-4 p-4 rounded-xl border animate-fadeIn ${
            result.pwned
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.pwned ? (
              <ShieldAlert size={22} className="text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck size={22} className="text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs">
              <div className="font-bold text-sm">
                {result.pwned
                  ? `Compromised: Seen ${result.count.toLocaleString()} times in data breaches`
                  : 'Clean: No documented breach records for this password'}
              </div>
              <p className="leading-relaxed">{result.recommendation}</p>
              <div className="text-[11px] opacity-75 font-mono pt-1">
                k-Anonymity SHA-1 Prefix: {result.hashPrefix} • Suffix matched locally
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
        <Info size={13} className="text-slate-400 shrink-0" />
        <span>
          Educational note: This API is completely free and maintained by Troy Hunt for global credential hygiene.
        </span>
      </div>
    </div>
  );
};

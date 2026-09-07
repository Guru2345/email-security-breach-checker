import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sliders,
  Type,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

const MEMORABLE_WORDS = [
  'anchor', 'beacon', 'breeze', 'canyon', 'castle', 'cedar', 'cliff', 'comet',
  'cosmic', 'crater', 'crystal', 'delta', 'drift', 'eagle', 'echo', 'ember',
  'falcon', 'fjord', 'forest', 'galaxy', 'glacier', 'granite', 'harbor', 'haven',
  'horizon', 'island', 'jasper', 'jungle', 'jupiter', 'lagoon', 'lantern', 'laser',
  'lunar', 'magnet', 'meadow', 'meteor', 'mirage', 'monarch', 'nebula', 'nexus',
  'nomad', 'oasis', 'ocean', 'orbit', 'origin', 'pathway', 'peak', 'phoenix',
  'pillar', 'planet', 'plasma', 'polar', 'prism', 'pulsar', 'pyramid', 'quantum',
  'radar', 'ranger', 'ravine', 'reef', 'rhino', 'ripple', 'river', 'rocket',
  'saddle', 'safari', 'sahara', 'sailor', 'saturn', 'shadow', 'shield', 'sierra',
  'signal', 'silver', 'solaris', 'spark', 'sphere', 'spiral', 'spring', 'star',
  'stellar', 'storm', 'stride', 'summit', 'sunset', 'surge', 'timber', 'titan',
  'torch', 'tracker', 'transit', 'tsunami', 'tundra', 'valley', 'vector', 'vertex',
  'vessel', 'vortex', 'voyage', 'vulcan', 'walnut', 'willow', 'zenith', 'zephyr'
];

interface PasswordGeneratorProps {
  onClose?: () => void;
  compact?: boolean;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onClose,
  compact = false,
}) => {
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  const [length, setLength] = useState<number>(20);
  const [wordCount, setWordCount] = useState<number>(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState<string>('-');
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  // Generate strong cryptographic random password or passphrase
  const generatePassword = useCallback(() => {
    if (mode === 'passphrase') {
      const words: string[] = [];
      const cryptoArray = new Uint32Array(wordCount);
      window.crypto.getRandomValues(cryptoArray);

      for (let i = 0; i < wordCount; i++) {
        const wordIndex = cryptoArray[i] % MEMORABLE_WORDS.length;
        let word = MEMORABLE_WORDS[wordIndex];
        if (includeUppercase) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        words.push(word);
      }

      let result = words.join(passphraseSeparator);
      if (includeNumbers) {
        const numArr = new Uint32Array(1);
        window.crypto.getRandomValues(numArr);
        result += passphraseSeparator + (numArr[0] % 100);
      }
      setPassword(result);
    } else {
      let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let lowercase = 'abcdefghijklmnopqrstuvwxyz';
      let numbers = '0123456789';
      let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (avoidAmbiguous) {
        uppercase = uppercase.replace(/[IO]/g, '');
        lowercase = lowercase.replace(/[lo]/g, '');
        numbers = numbers.replace(/[01]/g, '');
        symbols = symbols.replace(/[|;:]/g, '');
      }

      let charset = '';
      const guaranteed: string[] = [];

      if (includeUppercase) {
        charset += uppercase;
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        guaranteed.push(uppercase[arr[0] % uppercase.length]);
      }
      if (includeLowercase) {
        charset += lowercase;
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        guaranteed.push(lowercase[arr[0] % lowercase.length]);
      }
      if (includeNumbers) {
        charset += numbers;
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        guaranteed.push(numbers[arr[0] % numbers.length]);
      }
      if (includeSymbols) {
        charset += symbols;
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        guaranteed.push(symbols[arr[0] % symbols.length]);
      }

      if (!charset) {
        charset = lowercase;
        guaranteed.push(lowercase[0]);
      }

      const randomBytes = new Uint32Array(length);
      window.crypto.getRandomValues(randomBytes);

      const generatedChars: string[] = [...guaranteed];
      for (let i = guaranteed.length; i < length; i++) {
        generatedChars.push(charset[randomBytes[i] % charset.length]);
      }

      // Fisher-Yates shuffle
      for (let i = generatedChars.length - 1; i > 0; i--) {
        const j = randomBytes[i] % (i + 1);
        [generatedChars[i], generatedChars[j]] = [generatedChars[j], generatedChars[i]];
      }

      setPassword(generatedChars.join(''));
    }
  }, [
    mode,
    length,
    wordCount,
    passphraseSeparator,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    avoidAmbiguous,
  ]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Calculate Entropy
  const calculateEntropy = () => {
    if (mode === 'passphrase') {
      const bitsPerWord = Math.log2(MEMORABLE_WORDS.length);
      const totalBits = wordCount * bitsPerWord + (includeNumbers ? Math.log2(100) : 0);
      return Math.round(totalBits);
    } else {
      let pool = 0;
      if (includeUppercase) pool += avoidAmbiguous ? 24 : 26;
      if (includeLowercase) pool += avoidAmbiguous ? 24 : 26;
      if (includeNumbers) pool += avoidAmbiguous ? 8 : 10;
      if (includeSymbols) pool += avoidAmbiguous ? 24 : 27;
      if (pool === 0) pool = 26;
      return Math.round(length * Math.log2(pool));
    }
  };

  const entropy = calculateEntropy();
  const getEntropyBadge = () => {
    if (entropy < 60) return { label: 'Moderate', color: 'text-amber-400 bg-amber-950/70 border-amber-800' };
    if (entropy < 90) return { label: 'Strong (NIST Grade)', color: 'text-cyan-400 bg-cyan-950/70 border-cyan-800' };
    return { label: 'Maximum Defense (100+ bits)', color: 'text-emerald-400 bg-emerald-950/70 border-emerald-800' };
  };

  const badge = getEntropyBadge();

  return (
    <div
      id="offline-password-generator"
      className={`rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl ${
        compact ? 'p-4' : 'p-6 sm:p-7'
      } space-y-5`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <KeyRound size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Cryptographic Password Generator</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                NIST 800-63B
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              100% Client-Side &bull; Generated in memory via <code className="text-cyan-300 font-mono">crypto.getRandomValues</code>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            Close
          </button>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'password'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock size={13} />
          <span>Random Complex Password</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('passphrase')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'passphrase'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type size={13} />
          <span>Diceware Passphrase</span>
        </button>
      </div>

      {/* Generated Display Box */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-base sm:text-lg font-bold text-cyan-300 break-all select-all tracking-wide">
            {showPassword ? password : '•'.repeat(password.length)}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              type="button"
              onClick={generatePassword}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer group"
              title="Generate new password"
            >
              <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Entropy Status */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
          <span className="text-slate-400 font-mono">
            Entropy: <strong className="text-slate-200">{entropy} bits</strong>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${badge.color}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      {mode === 'password' ? (
        <div className="space-y-4 text-xs">
          {/* Length Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Password Length:</span>
              <span className="font-mono text-cyan-300 text-sm">{length} characters</span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>12 (Standard)</span>
              <span>20 (Recommended)</span>
              <span>32+ (High Security)</span>
            </div>
          </div>

          {/* Checkbox Grid */}
          <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Symbols (!@#$%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none col-span-2 text-slate-400">
              <input
                type="checkbox"
                checked={avoidAmbiguous}
                onChange={(e) => setAvoidAmbiguous(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Exclude ambiguous chars (e.g. 0/O, 1/l/I)</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Passphrase Word Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Number of Words:</span>
              <span className="font-mono text-cyan-300 text-sm">{wordCount} words</span>
            </div>
            <input
              type="range"
              min="3"
              max="6"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3 (Fast)</span>
              <span>4 (Recommended)</span>
              <span>6 (Paranoid)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <span>Separator:</span>
              <select
                value={passphraseSeparator}
                onChange={(e) => setPassphraseSeparator(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-cyan-300 text-xs focus:outline-hidden"
              >
                <option value="-">Hyphen (-)</option>
                <option value=".">Dot (.)</option>
                <option value="_">Underscore (_)</option>
                <option value=" ">Space ( )</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Capitalize words</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Append number</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

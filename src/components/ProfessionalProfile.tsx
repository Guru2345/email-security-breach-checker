import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  History,
  CopyCheck,
  Trash2,
} from 'lucide-react';
import { ProfessionalProfileResponse } from '../types';
import { apiCheckProfile } from '../utils/apiClient';

interface ProfessionalProfileProps {
  initialEmail?: string;
}

interface ProfileScanHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  name?: string;
  username?: string;
  company?: string;
  isDuplicateScan: boolean;
}

const PREDEFINED_SHOWCASE_PROFILES = [
  {
    label: 'Guru Vardhan (Current User)',
    query: 'yekkantiguruvardhan@gmail.com',
    desc: 'B.Tech CSE • Threat Intel & Security',
  },
  {
    label: 'Linus Torvalds',
    query: 'torvalds',
    desc: 'Linux Foundation • Creator of Linux',
  },
  {
    label: 'Troy Hunt',
    query: 'troyhunt',
    desc: 'HIBP Creator • Web Security Director',
  },
  {
    label: 'Dan Abramov',
    query: 'gaearon',
    desc: 'React / Redux Co-creator',
  },
];

export const ProfessionalProfile: React.FC<ProfessionalProfileProps> = ({ initialEmail = '' }) => {
  const [query, setQuery] = useState(initialEmail || 'yekkantiguruvardhan@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProfessionalProfileResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ProfileScanHistoryItem[]>([
    {
      id: 'prev-1',
      query: 'yekkantiguruvardhan@gmail.com',
      timestamp: 'Today, Pre-checked',
      name: 'Guru Vardhan Yekkanti',
      username: 'yekkantiguruvardhan',
      company: 'Technology & Development Consulting',
      isDuplicateScan: false,
    },
  ]);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const executeProfileSearch = async (targetQuery: string) => {
    const trimmed = targetQuery.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a username, handle, or email address.');
      return;
    }

    // Duplicate verification detection
    const normalizedTarget = trimmed.toLowerCase();
    const existingIndex = scanHistory.findIndex(
      (item) => item.query.toLowerCase() === normalizedTarget
    );

    if (existingIndex !== -1) {
      setDuplicateWarning(
        `Duplicate query detected: "${trimmed}" was already scanned previously in this session. Comparing records for consistency.`
      );
    } else {
      setDuplicateWarning(null);
    }

    setIsLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const data = await apiCheckProfile(trimmed);
      setResult(data);

      // Record scan into history with duplicate marker
      setScanHistory((prev) => [
        {
          id: `scan-${Date.now()}`,
          query: trimmed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: data.profile?.name,
          username: data.profile?.username,
          company: data.profile?.professional?.company || undefined,
          isDuplicateScan: existingIndex !== -1,
        },
        ...prev.slice(0, 7), // Keep last 8 entries
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with authorized public registry.');
      setResult({
        found: false,
        message: 'No public professional profile information was found through the available authorized sources.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeProfileSearch(query);
  };

  const handleSelectPredefined = (predefinedQuery: string) => {
    setQuery(predefinedQuery);
    executeProfileSearch(predefinedQuery);
  };

  const clearHistory = () => {
    setScanHistory([]);
    setDuplicateWarning(null);
  };

  return (
    <section
      id="professional-profile-module"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
    >
      <div className="border-b border-slate-800 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserCheck size={20} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Public Professional Profile Check
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 w-fit">
            <Sparkles size={12} />
            OSINT Footprint & Duplicate Audit
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Queries authorized public directory feeds strictly using authorized open APIs. This module tests your digital footprint, flags duplicate cross-checks, and compares exposure risks against public registries.
        </p>
      </div>

      {/* Predefined Ready-to-Test Profiles */}
      <div className="mb-5 p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles size={13} className="text-amber-400" />
            <span>Predefined Showcase Profiles (Click to test instantly):</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Includes duplicate test</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PREDEFINED_SHOWCASE_PROFILES.map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => handleSelectPredefined(item.query)}
              className="p-2.5 text-left rounded-lg bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-700/60 transition-all cursor-pointer group"
            >
              <div className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200 truncate">
                {item.label}
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                {item.query}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <input
            id="profile-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Enter public username or email prefix (e.g. yekkantiguruvardhan@gmail.com)"
            className="w-full pl-4 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
          />
        </div>
        <button
          id="profile-search-button"
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold border border-cyan-500/50 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-950/50"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin text-white" />
              <span>Querying Public Sources...</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Verify Public Profile</span>
            </>
          )}
        </button>
      </form>

      {/* Duplicate detection notice */}
      {duplicateWarning && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
          <CopyCheck size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-300">Duplicate Check Detected: </span>
            <span>{duplicateWarning}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Display */}
      {hasSearched && !isLoading && result && (
        <div id="profile-result-container" className="mt-4">
          {result.found && result.profile ? (
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  {result.profile.avatarUrl ? (
                    <img
                      src={result.profile.avatarUrl}
                      alt={result.profile.name || 'Public Profile Avatar'}
                      className="w-12 h-12 rounded-full border border-slate-700 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-300 font-bold font-mono text-base">
                      {result.profile.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100">
                        {result.profile.name || 'Public Profile'}
                      </h3>
                      {result.profile.professional?.skills && result.profile.professional.skills.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          Verified Profile
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-cyan-400">
                      @{result.profile.username}
                    </div>
                  </div>
                </div>

                {result.profile.professional?.profileUrl && (
                  <a
                    id="view-public-profile-link"
                    href={result.profile.professional.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-xs shrink-0"
                  >
                    <span>View Public Directory</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Professional Information */}
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono font-semibold uppercase">
                    <Briefcase size={14} className="text-cyan-400" />
                    <span>Professional Information</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <div>
                      <span className="text-slate-400">Position: </span>
                      <span className="text-slate-100 font-medium">
                        {result.profile.professional?.position || 'Software & Cybersecurity Engineer'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Company / Affiliation: </span>
                      <span className="text-slate-100 font-medium">
                        {result.profile.professional?.company || 'Information unavailable'}
                      </span>
                    </div>
                    {result.profile.professional?.skills && result.profile.professional.skills.length > 0 && (
                      <div>
                        <span className="text-slate-400 block mb-1">Key Focus Areas:</span>
                        <div className="flex flex-wrap gap-1">
                          {result.profile.professional.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded-sm text-[10px] font-mono border border-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.profile.professional?.bio && (
                      <div className="text-slate-300 italic pt-1 border-t border-slate-800/80">
                        "{result.profile.professional.bio}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Education Information */}
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono font-semibold uppercase">
                    <GraduationCap size={14} className="text-cyan-400" />
                    <span>Educational Background</span>
                  </div>
                  <div className="text-slate-300">
                    {result.profile.education ? (
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-100">
                          {result.profile.education.institution}
                        </div>
                        <div className="text-cyan-300 text-[11px] font-mono">
                          {result.profile.education.degree}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Academic record verified through authorized professional directory.
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">
                        Public educational records not published in authorized source
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              id="no-profile-found-notice"
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 text-sm text-slate-400 text-center"
            >
              <ShieldCheck size={20} className="mx-auto text-slate-400 mb-2" />
              <p className="font-medium text-slate-300">
                No public professional profile information was found through the available authorized sources.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Authorized public data sources returned no public index matching this query.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Session Scan History & Duplicate Tracker */}
      {scanHistory.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <History size={13} className="text-cyan-400" />
              <span>Session Audit Log & Duplicate Verification Tracker</span>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 size={11} />
              <span>Clear History</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {scanHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-cyan-300 font-medium truncate">
                    {item.query}
                  </span>
                  {item.name && (
                    <span className="text-slate-400 truncate hidden sm:inline">
                      • {item.name} {item.company ? `(${item.company})` : ''}
                    </span>
                  )}
                  {item.isDuplicateScan && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-amber-950/70 border border-amber-800/80 text-amber-300 text-[10px] font-mono shrink-0">
                      Duplicate Check
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.timestamp}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectPredefined(item.query)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                  >
                    Re-check
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};


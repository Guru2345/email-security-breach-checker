import React, { useState } from 'react';
import { Database, Search, Loader2, ExternalLink, Calendar, Users, AlertTriangle } from 'lucide-react';
import { NormalizedBreach } from '../types';
import { apiSearchBreaches } from '../utils/apiClient';

export const FreeBreachCatalogSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<NormalizedBreach[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await apiSearchBreaches(query);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTag = (tag: string) => {
    setQuery(tag);
    setIsLoading(true);
    setHasSearched(true);
    apiSearchBreaches(tag)
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      id="free-breach-catalog-search-container"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database size={20} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Free HIBP Breach Catalog Explorer
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              800+ Breaches • 100% Free
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Search all officially documented historical breaches in the public Have I Been Pwned catalog by service name, company, or domain without any API key or subscription.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search size={16} />
            </div>
            <input
              id="catalog-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies or domains (e.g. adobe.com, canva, twitter, uber, snapchat)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            id="catalog-search-submit-btn"
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin text-cyan-400" />
                <span>Searching Database...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Search Catalog</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>Popular incidents:</span>
          {['Adobe', 'Canva', 'Dropbox', 'LinkedIn', 'Twitter', 'Zynga'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleQuickTag(term)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
      {hasSearched && !isLoading && results && (
        <div className="mt-5 space-y-3">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Found {results.length} documented breach record{results.length !== 1 ? 's' : ''}</span>
          </div>

          {results.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
              No documented breach incidents found matching "{query}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {results.map((b) => (
                <div
                  key={b.website}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 space-y-2 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{b.website}</h4>
                      <div className="text-[11px] text-cyan-400 font-mono">{b.domain}</div>
                    </div>
                    {b.pwnCount ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1 shrink-0">
                        <Users size={11} className="text-cyan-400" />
                        {b.pwnCount.toLocaleString()} accounts
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-500" />
                      {b.breachDate}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300 truncate">{b.company}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {b.dataExposed.slice(0, 4).map((d) => (
                      <span
                        key={d}
                        className={`px-1.5 py-0.5 rounded text-[10px] border ${
                          d.toLowerCase().includes('password')
                            ? 'bg-rose-950/60 text-rose-300 border-rose-900/60 font-semibold'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                    {b.dataExposed.length > 4 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{b.dataExposed.length - 4} more
                      </span>
                    )}
                  </div>

                  {b.passwordResetUrl && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                      <a
                        href={b.passwordResetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <span>Official Security Page</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Search,
  KeyRound,
  Database,
  Key,
  Sparkles,
  AlertTriangle,
  Bookmark,
  Presentation,
  Clock,
  CheckSquare,
  User,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  ChevronRight,
  Layers,
  Globe,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { EmailSearch } from './components/EmailSearch';
import { SecuritySummary } from './components/SecuritySummary';
import { CompromisedWebsitesDirectory } from './components/CompromisedWebsitesDirectory';
import { PiiThreatMatrix } from './components/PiiThreatMatrix';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { BreachList } from './components/BreachList';
import { BreachTimeline } from './components/BreachTimeline';
import { SecurityActionCenter } from './components/SecurityActionCenter';
import { ProfessionalProfile } from './components/ProfessionalProfile';
import { FreePwnedPasswordChecker } from './components/FreePwnedPasswordChecker';
import { PasswordGenerator } from './components/PasswordGenerator';
import { FreeBreachCatalogSearch } from './components/FreeBreachCatalogSearch';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SavedReportsModal } from './components/SavedReportsModal';
import { DemoShowcase } from './components/DemoShowcase';
import { HaveIBeenPwnedPortal } from './components/HaveIBeenPwnedPortal';
import { UpiFraudDetector } from './components/UpiFraudDetector';
import { SecurityReportResponse, ConfigStatus, SavedReportItem } from './types';
import {
  apiCheckEmail,
  apiGet30Breaches,
  apiImportHibpBreaches,
  apiGetConfig,
} from './utils/apiClient';

export type AppPageKey =
  | 'overview'
  | 'remediation'
  | 'timeline'
  | 'action'
  | 'password'
  | 'catalog'
  | 'profile'
  | 'demo'
  | 'hibp'
  | 'upi';

interface PageDefinition {
  id: AppPageKey;
  stepNumber: number;
  label: string;
  shortLabel: string;
  subLabel: string;
  icon: any;
  badge?: string;
  badgeType?: 'danger' | 'info' | 'success' | 'warning';
}

const PAGE_DEFINITIONS: PageDefinition[] = [
  {
    id: 'overview',
    stepNumber: 1,
    label: 'Email Breach Overview',
    shortLabel: 'Overview',
    subLabel: 'Risk Score & Threat Summary',
    icon: Search,
  },
  {
    id: 'remediation',
    stepNumber: 2,
    label: 'Where Data Leaked & Fix Links',
    shortLabel: 'Direct Fix Links',
    subLabel: 'Change Passwords on Breached Sites',
    icon: KeyRound,
  },
  {
    id: 'timeline',
    stepNumber: 3,
    label: 'Forensics & Timeline',
    shortLabel: 'Timeline',
    subLabel: 'Chronological Incident Log',
    icon: Clock,
  },
  {
    id: 'action',
    stepNumber: 4,
    label: 'Remediation Action Checklist',
    shortLabel: 'Action Plan',
    subLabel: 'Prioritized Steps & Defenses',
    icon: CheckSquare,
  },
  {
    id: 'password',
    stepNumber: 5,
    label: 'Pwned Passwords Audit',
    shortLabel: 'Passwords',
    subLabel: 'Free k-Anonymity Leak Check',
    icon: ShieldCheck,
    badge: 'Free',
    badgeType: 'success',
  },
  {
    id: 'catalog',
    stepNumber: 6,
    label: 'Breach Catalog Explorer',
    shortLabel: 'Catalog',
    subLabel: 'Search 800+ Global Breaches',
    icon: Database,
    badge: '800+',
    badgeType: 'info',
  },
  {
    id: 'profile',
    stepNumber: 7,
    label: 'Professional Profile Notice',
    shortLabel: 'Profile',
    subLabel: 'Public Footprint & Executive Audit',
    icon: User,
  },
  {
    id: 'demo',
    stepNumber: 8,
    label: 'Demo Showcase',
    shortLabel: 'Showcase',
    subLabel: 'Evaluator & Presentation Test Accounts',
    icon: Presentation,
    badge: 'Demo',
    badgeType: 'warning',
  },
  {
    id: 'hibp',
    stepNumber: 9,
    label: 'Have I Been Pwned Official Portal',
    shortLabel: 'HIBP Website',
    subLabel: 'Direct Link to haveibeenpwned.com',
    icon: Globe,
    badge: 'Direct Open',
    badgeType: 'info',
  },
  {
    id: 'upi',
    stepNumber: 10,
    label: 'AI UPI & SMS Fraud Detector',
    shortLabel: 'UPI Fraud AI',
    subLabel: 'Smishing, Link Forensics & Risk Scoring',
    icon: Smartphone,
    badge: 'AI Gemini',
    badgeType: 'warning',
  },
];

const PAGE_KEYS: AppPageKey[] = PAGE_DEFINITIONS.map((p) => p.id);

export default function App() {
  const [report, setReport] = useState<SecurityReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSavedReportsModal, setShowSavedReportsModal] = useState(false);
  const [showExecutiveReportModal, setShowExecutiveReportModal] = useState(false);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<AppPageKey>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [savedReports, setSavedReports] = useState<SavedReportItem[]>(() => {
    try {
      const raw = localStorage.getItem('user_saved_security_reports');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Fetch initial configuration on mount
  useEffect(() => {
    apiGetConfig()
      .then((data) => setConfig(data))
      .catch((err) => console.warn('[App] Config fetch notice:', err?.message));
  }, []);

  const handleToggleSaveReport = (rep: SecurityReportResponse) => {
    const exists = savedReports.find((s) => s.email.toLowerCase() === rep.email.toLowerCase());
    let updated: SavedReportItem[];
    if (exists) {
      updated = savedReports.filter((s) => s.email.toLowerCase() !== rep.email.toLowerCase());
    } else {
      const newItem: SavedReportItem = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        email: rep.email,
        savedAt: new Date().toISOString(),
        riskLevel: rep.riskLevel,
        breachCount: rep.breachCount,
        report: rep,
      };
      updated = [newItem, ...savedReports];
    }
    setSavedReports(updated);
    try {
      localStorage.setItem('user_saved_security_reports', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteSavedReport = (id: string) => {
    const updated = savedReports.filter((s) => s.id !== id);
    setSavedReports(updated);
    try {
      localStorage.setItem('user_saved_security_reports', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearAllSavedReports = () => {
    setSavedReports([]);
    try {
      localStorage.removeItem('user_saved_security_reports');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSelectSavedReport = (selectedReport: SecurityReportResponse) => {
    setReport(selectedReport);
    setCurrentPage('remediation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentReportSaved = Boolean(
    report && savedReports.some((s) => s.email.toLowerCase() === report.email.toLowerCase())
  );

  const handleSearch = async (email: string, customApiKey?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const keyToUse = customApiKey || activeKey;

    try {
      const data = await apiCheckEmail(email, keyToUse);
      setReport(data);
      // Immediately navigate to the direct fix links page
      setCurrentPage('remediation');
    } catch (err: any) {
      console.error('[App] Search error:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while communicating with the breach database.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad30Breaches = async (emailToAudit?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    const targetEmail = (emailToAudit || report?.email || 'yekkantiguruvardhan@gmail.com').trim();

    try {
      const data = await apiGet30Breaches(targetEmail);
      setReport(data);
      setCurrentPage('remediation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('[App] Load 30 breaches error:', err);
      setErrorMessage(
        err.message || 'Failed to retrieve 30 breaches from Have I Been Pwned intelligence.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportHibpBreaches = async (emailToAudit: string, rawTextOrNames: string | string[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    const targetEmail = (emailToAudit || report?.email || 'yekkantiguruvardhan@gmail.com').trim();

    try {
      const data = await apiImportHibpBreaches(targetEmail, rawTextOrNames);
      setReport(data);
      setCurrentPage('remediation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('[App] Import HIBP error:', err);
      setErrorMessage(err.message || 'Failed to import breaches.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentIndex = PAGE_KEYS.indexOf(currentPage);
  const currentPageDef = PAGE_DEFINITIONS[currentIndex] || PAGE_DEFINITIONS[0];
  const prevPageDef = currentIndex > 0 ? PAGE_DEFINITIONS[currentIndex - 1] : null;
  const nextPageDef = currentIndex < PAGE_KEYS.length - 1 ? PAGE_DEFINITIONS[currentIndex + 1] : null;

  const goToPage = (pageKey: AppPageKey) => {
    setCurrentPage(pageKey);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (nextPageDef) {
      goToPage(nextPageDef.id);
    }
  };

  const goToPrevPage = () => {
    if (prevPageDef) {
      goToPage(prevPageDef.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle button */}
            <button
              id="mobile-nav-toggle"
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Email Breach &amp; Security Intelligence
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {config?.apiKeyConfigured || activeKey ? 'HIBP Live Key' : '100% Free Level'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Authorized breach exposure analysis &amp; direct account remediation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="saved-reports-header-btn"
              type="button"
              onClick={() => setShowSavedReportsModal(true)}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="View your saved answers and security audits"
            >
              <Bookmark size={13} className="text-cyan-400" />
              <span className="hidden sm:inline">Saved Answers</span>
              {savedReports.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-900 text-cyan-200 border border-cyan-700 font-bold">
                  {savedReports.length}
                </span>
              )}
            </button>

            <button
              id="api-key-guide-btn"
              type="button"
              onClick={() => setShowApiKeyModal(true)}
              className="text-xs font-medium text-cyan-300 hover:text-white px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Key size={13} className="text-cyan-400" />
              <span className="hidden md:inline">Free API Guide</span>
            </button>

            <button
              id="privacy-policy-modal-toggle"
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock size={13} className="text-emerald-400" />
              <span className="hidden sm:inline">Security Pledge</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout: Left-Side Navigation Buttons + Right Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT-SIDE BUTTONS PANEL (Sticky on desktop, expandable on mobile) */}
        <aside
          id="left-side-navigation-panel"
          className={`w-full lg:w-72 shrink-0 space-y-4 ${
            isMobileNavOpen ? 'block' : 'hidden lg:block'
          } lg:sticky lg:top-20`}
        >
          {/* Active Email Security Status Pill */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
              <span>Audit Target</span>
              <span className={`w-2 h-2 rounded-full ${report ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
            </div>
            {report ? (
              <>
                <div className="text-xs font-mono font-bold text-cyan-300 truncate" title={report.email}>
                  {report.email}
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[11px]">
                  <span className="px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-800/60 font-mono">
                    {report.riskLevel}
                  </span>
                  <span className="text-slate-400">
                    {report.breachCount} Leaked Sources
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400 italic">
                Awaiting email input on Page 1...
              </div>
            )}
          </div>

          {/* Left Buttons Group */}
          <div className="p-3 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-1.5">
            <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Security Pages</span>
              <span className="text-[10px] text-cyan-400">Page {currentIndex + 1} of {PAGE_DEFINITIONS.length}</span>
            </div>

            <nav className="space-y-1">
              {PAGE_DEFINITIONS.map((page) => {
                const IconComponent = page.icon;
                const isActive = currentPage === page.id;
                const badgeText =
                  page.id === 'remediation' && report?.breaches?.length
                    ? `${report.breaches.length} Sites`
                    : page.badge;

                return (
                  <button
                    key={page.id}
                    id={`left-nav-btn-${page.id}`}
                    type="button"
                    onClick={() => goToPage(page.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md ring-1 ring-cyan-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-black/30 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {page.stepNumber < 10 ? `0${page.stepNumber}` : page.stepNumber}
                      </span>
                      <IconComponent
                        size={16}
                        className={`shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <div className="truncate">
                        <div className="leading-tight truncate">{page.label}</div>
                        <div
                          className={`text-[10px] font-normal truncate ${
                            isActive ? 'text-cyan-100' : 'text-slate-400'
                          }`}
                        >
                          {page.subLabel}
                        </div>
                      </div>
                    </div>

                    {badgeText && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-black/40 text-white'
                            : page.badgeType === 'danger'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                            : page.badgeType === 'success'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {badgeText}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Left Quick Navigation Hint */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Sparkles size={13} className="text-amber-400" />
              <span>Step-by-Step Flow:</span>
            </div>
            <p className="leading-relaxed">
              Click any button on the left to jump directly, or use the <strong>Next Page</strong> button to progress through the full defensive audit.
            </p>
          </div>
        </aside>

        {/* RIGHT MAIN WORKSPACE */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Top Page Stepper Header Bar */}
          <div
            id="page-header-stepper-bar"
            className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 text-xs font-bold font-mono">
                {currentPageDef.stepNumber}/{PAGE_DEFINITIONS.length}
              </div>
              <div>
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Page {currentPageDef.stepNumber} of {PAGE_DEFINITIONS.length}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {currentPageDef.label}
                </h2>
              </div>
            </div>

            {/* Previous and Next Page Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {prevPageDef && (
                <button
                  id="top-prev-page-btn"
                  type="button"
                  onClick={goToPrevPage}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={`Go back to ${prevPageDef.label}`}
                >
                  <ArrowLeft size={14} />
                  <span>Previous Page</span>
                </button>
              )}

              {nextPageDef ? (
                <button
                  id="top-next-page-btn"
                  type="button"
                  onClick={goToNextPage}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title={`Proceed to ${nextPageDef.label}`}
                >
                  <span>Next Page: {nextPageDef.shortLabel}</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goToPage('overview')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Start from Page 1</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* PAGE CONTENT SWITCHER */}
          <div className="animate-fadeIn space-y-6">
            {/* PAGE 1: Email Breach Overview & Search */}
            {currentPage === 'overview' && (
              <div className="space-y-6">
                <EmailSearch
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                  testScenarios={config?.testScenarios || []}
                  apiKeyConfigured={Boolean(config?.apiKeyConfigured || activeKey)}
                  savedReportsCount={savedReports.length}
                  onOpenSavedReports={() => setShowSavedReportsModal(true)}
                  currentEmail={report?.email || ''}
                  onGoToNextPage={report && report.breaches.length > 0 ? () => goToPage('remediation') : undefined}
                  onLoad30Breaches={handleLoad30Breaches}
                  onOpenHibpPortalPage={() => goToPage('hibp')}
                />

                {report && (
                  <>
                    <SecuritySummary
                      report={report}
                      isSaved={isCurrentReportSaved}
                      onToggleSave={() => handleToggleSaveReport(report)}
                      onOpenExecutiveReport={() => setShowExecutiveReportModal(true)}
                      onLoad30Breaches={handleLoad30Breaches}
                    />

                    {report.breaches.length > 0 && (
                      <PiiThreatMatrix breaches={report.breaches} />
                    )}
                  </>
                )}

                {/* Next Page Prompt Card - Only shown when report has breaches */}
                {report && report.breaches.length > 0 && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <KeyRound size={16} className="text-rose-400" />
                        <span>Ready to inspect where your credentials leaked?</span>
                      </h4>
                      <p className="text-xs text-slate-300">
                        Open Page 2 to get verified direct links to change passwords across all {report.breaches.length} compromised platforms.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToPage('remediation')}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer shrink-0 transition-all"
                    >
                      <span>Go to Page 2: Where Data Leaked</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PAGE 2: Where Data Leaked & Direct Fix Links */}
            {currentPage === 'remediation' && (
              <div className="space-y-6">
                {report && report.breaches.length > 0 ? (
                  <CompromisedWebsitesDirectory
                    breaches={report.breaches}
                    userEmail={report.email}
                    onNextPage={() => goToPage('timeline')}
                  />
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 mx-auto flex items-center justify-center text-cyan-400">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      No Breaches Detected or Audit Pending
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Run an email breach search on Page 1 or load a pre-configured scenario to see compromised websites with direct fix links.
                    </p>
                    <button
                      type="button"
                      onClick={() => goToPage('overview')}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Go to Page 1: Email Breach Overview
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PAGE 3: Forensics & Incident Timeline */}
            {currentPage === 'timeline' && (
              <div className="space-y-6">
                {report && report.breaches.length > 0 ? (
                  <>
                    <BreachTimeline breaches={report.breaches} />
                    <BreachList breaches={report.breaches} email={report.email} />
                  </>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
                    <Clock size={24} className="text-cyan-400 mx-auto" />
                    <h3 className="text-base font-bold text-white">Timeline Pending</h3>
                    <p className="text-xs text-slate-400">
                      Run an email search on Page 1 to render the historical breach timeline.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PAGE 4: Remediation Action Checklist */}
            {currentPage === 'action' && (
              <div className="space-y-6">
                {report ? (
                  <SecurityActionCenter breaches={report.breaches} />
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
                    <CheckSquare size={24} className="text-cyan-400 mx-auto" />
                    <h3 className="text-base font-bold text-white">Action Plan Ready</h3>
                    <p className="text-xs text-slate-400">
                      Run an email search to generate customized defense steps.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PAGE 5: Pwned Passwords Audit */}
            {currentPage === 'password' && (
              <div className="space-y-6">
                <FreePwnedPasswordChecker />
                <PasswordGenerator />
              </div>
            )}

            {/* PAGE 6: Free Breach Catalog Explorer */}
            {currentPage === 'catalog' && (
              <div className="space-y-6">
                <FreeBreachCatalogSearch />
              </div>
            )}

            {/* PAGE 7: Professional Profile Scan */}
            {currentPage === 'profile' && (
              <div className="space-y-6">
                <ProfessionalProfile initialEmail={report?.email || 'yekkantiguruvardhan@gmail.com'} />
              </div>
            )}

            {/* PAGE 8: Demo Showcase for Presentations */}
            {currentPage === 'demo' && (
              <div className="space-y-6">
                <DemoShowcase
                  onAuditEmail={(email) => {
                    handleSearch(email);
                    goToPage('remediation');
                  }}
                  onSaveReport={(rep) => handleToggleSaveReport(rep)}
                  savedReports={savedReports}
                  onOpenSavedModal={() => setShowSavedReportsModal(true)}
                />
              </div>
            )}

            {/* PAGE 9: Have I Been Pwned Official Website & Direct Open Portal */}
            {currentPage === 'hibp' && (
              <div className="space-y-6">
                <HaveIBeenPwnedPortal
                  currentEmail={report?.email}
                  onLoad30Breaches={handleLoad30Breaches}
                  onImportHibpBreaches={handleImportHibpBreaches}
                />
              </div>
            )}

            {/* PAGE 10: AI-Based UPI & SMS Fraud Detection System */}
            {currentPage === 'upi' && (
              <div className="space-y-6">
                <UpiFraudDetector />
              </div>
            )}
          </div>

          {/* Bottom Page Navigation Controls (Previous Page & Next Page) */}
          <div
            id="page-footer-navigation"
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              {prevPageDef ? (
                <button
                  id="bottom-prev-page-btn"
                  type="button"
                  onClick={goToPrevPage}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={15} />
                  <span>Previous: Page {prevPageDef.stepNumber} ({prevPageDef.shortLabel})</span>
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">First Page</span>
              )}
            </div>

            {/* Quick Step Indicators */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {PAGE_DEFINITIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goToPage(p.id)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentPage === p.id
                      ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={`Go to Page ${p.stepNumber}: ${p.label}`}
                >
                  {p.stepNumber}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {nextPageDef ? (
                <button
                  id="bottom-next-page-btn"
                  type="button"
                  onClick={goToNextPage}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Next: Page {nextPageDef.stepNumber} ({nextPageDef.shortLabel})</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goToPage('overview')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Return to Page 1: Overview</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer & Defensive Guidelines */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span className="font-semibold text-slate-300">
                Defensive Cybersecurity Architecture Notice
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>RFC 5322 Email Validation</span>
              <span>•</span>
              <span>k-Anonymity Hashing</span>
              <span>•</span>
              <span>Free Community Mode Ready</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            This platform is strictly an authorized defensive cybersecurity tool designed for incident awareness, threat minimization, and security remediation. It never stores, reconstructs, or displays actual stolen plaintext or hashed passwords. All external security links direct exclusively to legitimate official domain endpoints.
          </p>
        </div>
      </footer>

      {/* API Key Guide & Tester Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKeyConfigured={Boolean(config?.apiKeyConfigured || activeKey)}
        onKeyApplied={(key) => {
          setActiveKey(key);
        }}
      />

      {/* Saved Reports & Answers Modal */}
      <SavedReportsModal
        isOpen={showSavedReportsModal}
        onClose={() => setShowSavedReportsModal(false)}
        savedReports={savedReports}
        onSelectReport={handleSelectSavedReport}
        onDeleteReport={handleDeleteSavedReport}
        onClearAll={handleClearAllSavedReports}
      />

      {/* Executive Security Incident & PDF Report Modal */}
      {showExecutiveReportModal && report && (
        <ExecutiveReportModal
          report={report}
          onClose={() => setShowExecutiveReportModal(false)}
        />
      )}

      {/* Security & Privacy Pledge Modal */}
      {showPrivacyModal && (
        <div
          id="privacy-pledge-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div
            id="privacy-pledge-modal"
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-slate-300 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20} />
                <h3 className="font-bold text-slate-100 text-base">
                  Privacy &amp; Security Principles
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 leading-relaxed text-xs">
              <p>
                In strict adherence to ethical and defensive cybersecurity standards (Section 20):
              </p>
              <ul className="space-y-2 list-disc list-inside text-slate-200">
                <li><strong className="text-white">Never asks for passwords:</strong> You should never type your real secret password into an untrusted third-party tool.</li>
                <li><strong className="text-white">Zero credential retention:</strong> We do not download, store, or display actual stolen credentials or compromised hashes.</li>
                <li><strong className="text-white">k-Anonymity Protection:</strong> Password exposure audits send only a 5-character SHA-1 hash prefix.</li>
                <li><strong className="text-white">Authorized data sources only:</strong> We communicate only with legitimate breach repositories (such as Have I Been Pwned) and public domain registries.</li>
                <li><strong className="text-white">Verified official links:</strong> All password reset, 2FA, and security links point directly to official corporate domains.</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

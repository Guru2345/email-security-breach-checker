import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  PhoneCall,
  Flame,
  KeyRound,
  FileWarning,
  Sparkles,
  RefreshCw,
  Search,
  Globe,
  Radio,
  Share2,
} from 'lucide-react';
import { UpiFraudAnalysisResult } from '../types';
import { apiAnalyzeUpiSms } from '../utils/apiClient';

interface UpiFraudDetectorProps {
  initialMessage?: string;
}

interface TestScenario {
  id: string;
  name: string;
  tag: string;
  category: 'Critical Scam' | 'Phishing' | 'Task Scam' | 'Legitimate';
  message: string;
}

const SAMPLE_SCENARIOS: TestScenario[] = [
  {
    id: 'upi-collect',
    name: 'UPI PIN Collect Scam',
    tag: 'PhonePe Reward',
    category: 'Critical Scam',
    message:
      'Dear Customer, Congratulations! You have won ₹4,500 Cash Reward in PhonePe Scratch Card. Click to deposit directly into your bank account: upi://pay?pa=rewardsdesk99@ybl&pn=PhonePeCashback&am=4500&tn=CashbackDeposit. Enter your UPI PIN to approve receipt.',
  },
  {
    id: 'electricity-bill',
    name: 'Power Disconnection Scam',
    tag: 'Electricity Board',
    category: 'Critical Scam',
    message:
      'Dear Consumer, your electricity power will be DISCONNECTED tonight at 9:30 PM from the power station because your previous month bill was not updated. Immediately contact our electricity verification officer Mr. Sharma at 9876543210 or update bill: http://bijli-update-bill.online/pay',
  },
  {
    id: 'sbi-yono-kyc',
    name: 'Bank KYC / PAN Suspension',
    tag: 'SBI YONO Phishing',
    category: 'Phishing',
    message:
      'URGENT NOTICE: Dear SBI User, your YONO NetBanking account has been blocked today due to pending PAN card & KYC verification. Please click here to complete verification within 24 hours to prevent permanent account freeze: https://bit.ly/sbi-pan-kyc-verify',
  },
  {
    id: 'work-from-home',
    name: 'Part-Time Video Like Scam',
    tag: 'Telegram Task',
    category: 'Task Scam',
    message:
      'Earn ₹3,000 to ₹8,000 daily from home! Just like YouTube videos and write reviews for 30 minutes. No investment needed. Instant UPI payout daily. Contact our HR manager on WhatsApp to join: https://wa.me/919876543210?text=I-want-to-join-task-job',
  },
  {
    id: 'courier-customs',
    name: 'India Post Delivery Fee',
    tag: 'Postal Parcel',
    category: 'Phishing',
    message:
      'Your India Post parcel #IN9841289 could not be delivered due to incomplete house number and address. Please update your address and pay re-delivery fee of ₹25 immediately: https://indiapost-redelivery.top/tracking',
  },
  {
    id: 'safe-bank-alert',
    name: 'Legitimate Bank Alert',
    tag: 'Verified Bank Credit',
    category: 'Legitimate',
    message:
      'Dear SBI User, your A/c ending with XX4589 is credited with INR 7,500.00 on 07-Sep-26 by UPI/ref no 425109876543. Available Bal: INR 32,450.00 - State Bank of India',
  },
];

export const UpiFraudDetector: React.FC<UpiFraudDetectorProps> = ({ initialMessage = '' }) => {
  const [messageInput, setMessageInput] = useState(initialMessage || SAMPLE_SCENARIOS[0].message);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<UpiFraudAnalysisResult | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze !== undefined ? textToAnalyze : messageInput).trim();
    if (!text) {
      setError('Please paste or type an SMS message to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await apiAnalyzeUpiSms(text);
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Error analyzing message:', err);
      setError(err.message || 'Failed to analyze SMS. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectScenario = (scenario: TestScenario) => {
    setMessageInput(scenario.message);
    setError(null);
    handleAnalyze(scenario.message);
  };

  const handleCopyReport = () => {
    if (!analysisResult) return;
    const reportText = `[CYBER DEFENSE AUDIT] UPI & SMS Fraud Analysis Report
--------------------------------------------------
Risk Level: ${analysisResult.riskLevel} (Score: ${analysisResult.riskScore}/100)
Category: ${analysisResult.scamCategory}
Analyzed By: ${analysisResult.analyzedBy === 'GEMINI_AI' ? 'Gemini 3.8 Flash AI' : 'Heuristic Security Engine'}
Timestamp: ${new Date(analysisResult.timestamp).toLocaleString()}

Summary:
${analysisResult.summary}

${analysisResult.upiCollectTrickDetected ? '⚠️ CRITICAL ALERT: "Enter UPI PIN to receive money" collect scam detected! Never enter PIN to receive funds.\n' : ''}
Detected Red Flags:
${analysisResult.redFlags.map((rf, i) => `${i + 1}. ${rf}`).join('\n')}

Extracted Links (${analysisResult.extractedLinks.length}):
${analysisResult.extractedLinks.map((l) => `- ${l.url} (${l.domain})`).join('\n')}

Defensive Recommendations:
${analysisResult.defensiveRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

Emergency Helplines:
- National Cyber Crime Helpline: ${analysisResult.helplineNotice.indiaCyberHelpline}
- Reporting Portal: ${analysisResult.helplineNotice.portal}
- Chakshu SMS Fraud Portal: ${analysisResult.helplineNotice.chakshuPortal}
--------------------------------------------------`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6" id="upi-fraud-detector-view">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-700/60 flex items-center gap-1">
                <Sparkles size={12} className="text-indigo-400" />
                Page 10 • AI Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Gemini 3.8 Flash
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-rose-950 text-rose-300 border border-rose-800/60">
                UPI Collect Defense
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                1930 Cyber Helpline
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Smartphone className="text-indigo-400" size={24} />
              <span>AI-Based UPI &amp; Smishing Fraud Detection</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Analyze incoming text messages, payment links, and fake bank notifications received on any phone.
              Identifies deceptive UPI collect requests, power disconnection threats, phishing domains, and provides immediate cybercrime defense protocols.
            </p>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">National Cyber Helpline</div>
              <div className="text-lg font-bold font-mono text-rose-400 flex items-center gap-1.5 justify-end">
                <PhoneCall size={14} />
                <span>1930</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Workspace Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label htmlFor="sms-message-input" className="text-sm font-bold text-white flex items-center gap-2">
              <Radio size={16} className="text-cyan-400" />
              <span>Paste Received SMS or Message with Link</span>
            </label>
            <p className="text-xs text-slate-400">
              Include full message text with any embedded URLs, shortened links, or UPI payment intents.
            </p>
          </div>
          {messageInput && (
            <button
              type="button"
              onClick={() => {
                setMessageInput('');
                setAnalysisResult(null);
                setError(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer self-start"
            >
              Clear
            </button>
          )}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="sms-message-input"
            rows={4}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            placeholder="Paste suspicious SMS text message here... (e.g. 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM...')"
            className="w-full rounded-xl bg-slate-950 border border-slate-700 p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-sans resize-y leading-relaxed"
          />
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 px-1">
            <span>Press Ctrl + Enter to analyze</span>
            <span>{messageInput.length} characters</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <button
            id="analyze-upi-btn"
            type="button"
            disabled={isAnalyzing || !messageInput.trim()}
            onClick={() => handleAnalyze()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Running AI &amp; Link Forensics...</span>
              </>
            ) : (
              <>
                <Zap size={15} className="text-yellow-300" />
                <span>Analyze Message with AI</span>
              </>
            )}
          </button>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Client-safe evaluation • Real-time link parsing &amp; heuristic detection</span>
          </div>
        </div>

        {/* Quick Sample Test Scenarios */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Flame size={14} className="text-amber-400" />
              <span>Real-World Fraud Test Scenarios (Click to test instantly):</span>
            </span>
            <span className="text-[11px] text-slate-500">6 pre-built scenarios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {SAMPLE_SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                type="button"
                onClick={() => handleSelectScenario(scen)}
                className={`text-left p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                  messageInput === scen.message
                    ? 'bg-indigo-950/60 border-indigo-600 ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-slate-200 truncate">{scen.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase shrink-0 ${
                      scen.category === 'Critical Scam'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : scen.category === 'Phishing'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : scen.category === 'Task Scam'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {scen.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {scen.message}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-300" id="upi-analysis-results-card">
          {/* Executive Risk Gauge Card */}
          <div
            className={`p-6 rounded-2xl border shadow-xl ${
              analysisResult.riskLevel === 'CRITICAL'
                ? 'bg-gradient-to-b from-rose-950/60 via-slate-900 to-slate-950 border-rose-700/80 shadow-rose-950/30'
                : analysisResult.riskLevel === 'HIGH'
                ? 'bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-amber-700/80 shadow-amber-950/30'
                : analysisResult.riskLevel === 'MEDIUM'
                ? 'bg-gradient-to-b from-yellow-950/40 via-slate-900 to-slate-950 border-yellow-700/80'
                : 'bg-gradient-to-b from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-700/80 shadow-emerald-950/30'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Left Details */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider uppercase border flex items-center gap-1.5 ${
                      analysisResult.riskLevel === 'CRITICAL'
                        ? 'bg-rose-900 text-rose-100 border-rose-500 animate-pulse'
                        : analysisResult.riskLevel === 'HIGH'
                        ? 'bg-amber-900 text-amber-100 border-amber-500'
                        : analysisResult.riskLevel === 'MEDIUM'
                        ? 'bg-yellow-900 text-yellow-100 border-yellow-500'
                        : 'bg-emerald-900 text-emerald-100 border-emerald-500'
                    }`}
                  >
                    {analysisResult.riskLevel === 'CRITICAL' && <ShieldAlert size={14} />}
                    {analysisResult.riskLevel === 'HIGH' && <AlertTriangle size={14} />}
                    {analysisResult.riskLevel === 'SAFE' && <ShieldCheck size={14} />}
                    <span>Risk Level: {analysisResult.riskLevel}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    Category: {analysisResult.scamCategory}
                  </span>

                  {analysisResult.impersonatedEntity && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      Impersonated: {analysisResult.impersonatedEntity}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {analysisResult.summary}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>
                    Engine:{' '}
                    <strong className="text-slate-200">
                      {analysisResult.analyzedBy === 'GEMINI_AI' ? 'Gemini 3.8 Flash AI' : 'Heuristic Engine'}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>Links Identified: {analysisResult.extractedLinks.length}</span>
                  <span>•</span>
                  <span>{new Date(analysisResult.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Right Score Gauge */}
              <div className="flex md:flex-col items-center justify-between md:justify-center p-4 rounded-2xl bg-black/40 border border-white/10 shrink-0 min-w-[160px] text-center gap-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Fraud Risk Score
                </div>
                <div
                  className={`text-4xl sm:text-5xl font-extrabold font-mono ${
                    analysisResult.riskScore >= 70
                      ? 'text-rose-400'
                      : analysisResult.riskScore >= 45
                      ? 'text-amber-400'
                      : analysisResult.riskScore >= 20
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {analysisResult.riskScore}
                  <span className="text-base text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {analysisResult.riskScore >= 70
                    ? 'Active Attack Likely'
                    : analysisResult.riskScore >= 45
                    ? 'Elevated Phishing Vector'
                    : analysisResult.riskScore >= 20
                    ? 'Suspicious Elements'
                    : 'Safe Informational Alert'}
                </div>
              </div>
            </div>

            {/* Critical UPI PIN Collect Warning Banner */}
            {analysisResult.upiCollectTrickDetected && (
              <div className="mt-5 p-4 rounded-xl bg-rose-900/90 border-2 border-rose-500 text-white flex items-start gap-3 shadow-lg">
                <KeyRound size={22} className="text-yellow-300 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-yellow-300 text-sm sm:text-base flex items-center gap-2">
                    <span>GOLDEN RULE OF UPI: NEVER ENTER YOUR PIN TO RECEIVE MONEY</span>
                  </div>
                  <p className="text-rose-100 leading-relaxed">
                    This message attempts a classic <strong>UPI Collect Request scam</strong>. Scammers send a payment request disguised as a cash reward or deposit. In UPI architecture, you <strong>only</strong> enter your 4-digit or 6-digit PIN when <strong>paying</strong> or transferring money out of your account. You <em>never</em> enter your PIN to receive funds.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Extracted Links & Domain Forensics */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe size={16} className="text-cyan-400" />
                <span>Extracted Links &amp; Domain Forensics ({analysisResult.extractedLinks.length})</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {analysisResult.extractedLinks.length > 0 ? 'URL and protocol inspection' : 'No URLs detected'}
              </span>
            </div>

            {analysisResult.extractedLinks.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 text-center">
                No external links or payment URIs were detected in this message.
              </div>
            ) : (
              <div className="space-y-3">
                {analysisResult.extractedLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                            link.isUpiScheme
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : link.isShortenedUrl
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          }`}
                        >
                          {link.isUpiScheme ? 'UPI Payment Intent' : link.isShortenedUrl ? 'Shortened Link' : 'Web Link'}
                        </span>
                        <code className="text-xs font-mono text-cyan-300 break-all">{link.url}</code>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(link.url)}
                          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedLink === link.url ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Extracted UPI Protocol Parameters */}
                    {link.upiParams && (
                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {link.upiParams.payeeVpa && (
                          <div>
                            <span className="text-slate-500 block text-[10px]">Payee VPA (pa):</span>
                            <span className="text-rose-300 font-bold">{link.upiParams.payeeVpa}</span>
                          </div>
                        )}
                        {link.upiParams.payeeName && (
                          <div>
                            <span className="text-slate-500 block text-[10px]">Payee Name (pn):</span>
                            <span className="text-slate-200">{link.upiParams.payeeName}</span>
                          </div>
                        )}
                        {link.upiParams.amount && (
                          <div>
                            <span className="text-slate-500 block text-[10px]">Amount to Debit (am):</span>
                            <span className="text-yellow-300 font-bold">₹{link.upiParams.amount}</span>
                          </div>
                        )}
                        {link.upiParams.transactionNote && (
                          <div className="sm:col-span-3">
                            <span className="text-slate-500 block text-[10px]">Note (tn):</span>
                            <span className="text-slate-300">{link.upiParams.transactionNote}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Suspicious Indicators */}
                    {link.suspiciousIndicators.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-rose-400">Forensic Flags:</div>
                        <ul className="space-y-1">
                          {link.suspiciousIndicators.map((flag, fIdx) => (
                            <li key={fIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-rose-400 mt-0.5">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Red Flags & Behavioral Attack Vectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Red Flags Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileWarning size={16} className="text-rose-400" />
                <span>Detected Red Flags &amp; Triggers ({analysisResult.redFlags.length})</span>
              </h4>

              {analysisResult.redFlags.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>No behavioral scam triggers or red flags detected in this message text.</span>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {analysisResult.redFlags.map((flag, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-rose-950 text-xs text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{flag}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Defensive Actions Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                <span>Immediate Defensive Recommendations</span>
              </h4>

              <ul className="space-y-2.5">
                {analysisResult.defensiveRecommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>

              {/* Official Helplines Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <PhoneCall size={14} className="text-cyan-400" />
                  <span>Official Cybercrime Incident Reporting</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block">National Cyber Helpline:</span>
                    <strong className="text-rose-400 font-mono text-xs">Dial 1930 (Immediate)</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block">Reporting Portal:</span>
                    <a
                      href={analysisResult.helplineNotice.portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      cybercrime.gov.in <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800 sm:col-span-2">
                    <span className="text-slate-400 block">Chakshu (Telecom SMS Fraud Reporting):</span>
                    <a
                      href={analysisResult.helplineNotice.chakshuPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline flex items-center gap-1 font-mono"
                    >
                      sancharsaathi.gov.in/sfc <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Share & Copy Report Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">
              Generated forensic report is ready to export for family awareness or filing official cybercrime reports.
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyReport}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedReport ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>Report Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Full Audit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Bookmark, ShieldAlert, ShieldCheck, Trash2, ExternalLink, Calendar, KeyRound, Check, Download, ArrowRight } from 'lucide-react';
import { SavedReportItem, SecurityReportResponse } from '../types';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReports: SavedReportItem[];
  onSelectReport: (report: SecurityReportResponse) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  isOpen,
  onClose,
  savedReports,
  onSelectReport,
  onDeleteReport,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedReports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `security-audit-reports-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      id="saved-reports-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="saved-reports-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-300 text-sm my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Bookmark size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Saved Security Reports &amp; Answers</h3>
              <p className="text-xs text-slate-400">
                {savedReports.length} {savedReports.length === 1 ? 'report' : 'reports'} saved in your local audit history
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {savedReports.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
              <Bookmark size={22} />
            </div>
            <div className="text-slate-200 font-semibold text-sm">No Saved Reports Yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Whenever you audit an email, click the <strong className="text-slate-300">"Save This Answer"</strong> button to bookmark the full threat report for instant future reference.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {savedReports.map((item) => {
              const isClean = item.breachCount === 0;
              const formattedDate = new Date(item.savedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 bg-slate-950/70 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-100 text-sm">{item.email}</span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                          item.riskLevel === 'CRITICAL'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : item.riskLevel === 'HIGH'
                            ? 'bg-orange-950/80 text-orange-300 border-orange-800'
                            : item.riskLevel === 'MEDIUM'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {item.riskLevel} RISK
                      </span>
                      {item.label && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                          {item.label}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-500" />
                        <span>Saved {formattedDate}</span>
                      </span>
                      <span>•</span>
                      <span>
                        {item.breachCount} {item.breachCount === 1 ? 'incident' : 'incidents'}
                      </span>
                      {item.report.passwordRelatedCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 flex items-center gap-1">
                            <KeyRound size={12} />
                            <span>{item.report.passwordRelatedCount} password exposures</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectReport(item.report);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View Answer</span>
                      <ArrowRight size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteReport(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete saved report"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          {savedReports.length > 0 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>Export All Reports (JSON)</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onClearAll}
                className="text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

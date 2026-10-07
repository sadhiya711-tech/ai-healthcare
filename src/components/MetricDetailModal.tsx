import React from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { MetricItem } from '../types';

interface MetricDetailModalProps {
  metric: MetricItem | null;
  onClose: () => void;
  onAskDoctorQuestion?: (question: string) => void;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  metric,
  onClose,
  onAskDoctorQuestion,
}) => {
  if (!metric) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="metric-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Lab Biomarker Guide
            </span>
            <h2 id="metric-modal-title" className="text-xl font-bold text-slate-900">
              {metric.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Result summary card */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/70">
            <div>
              <p className="text-xs text-slate-700 font-medium uppercase tracking-wide">Reported Result</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {metric.value} <span className="text-sm font-medium text-slate-700">{metric.unit}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-700 font-medium uppercase tracking-wide">Standard Reference</p>
              <p className="text-sm font-semibold text-slate-700 tabular-nums">
                {metric.referenceRange}
              </p>
              <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium">
                {metric.status === 'normal' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {metric.statusLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {metric.statusLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Simple Explanation */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              What does this mean in simple words?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
              {metric.simpleExplanation}
            </p>
          </div>

          {/* Why It Matters */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              Why do doctors test this?
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {metric.whyItMatters}
            </p>
          </div>

          {/* Clinical Description */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clinical / Medical Terminology
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {metric.technicalDescription}
            </p>
          </div>

          {/* Questions to ask doctor */}
          {metric.questionsToAsk && metric.questionsToAsk.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                Good questions to ask your doctor about this:
              </h3>
              <ul className="space-y-2">
                {metric.questionsToAsk.map((q, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 flex items-start justify-between gap-2"
                  >
                    <span>"{q}"</span>
                    {onAskDoctorQuestion && (
                      <button
                        onClick={() => {
                          onAskDoctorQuestion(q);
                          onClose();
                        }}
                        className="text-teal-700 hover:text-teal-800 font-semibold shrink-0 text-xs inline-flex items-center gap-0.5"
                      >
                        Ask AI <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-700 leading-normal">
            🛡️ Reference ranges vary slightly between different laboratories, testing machines, and individual patient profiles. Always discuss lab values with your healthcare provider.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

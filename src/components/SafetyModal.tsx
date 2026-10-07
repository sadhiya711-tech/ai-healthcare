import React from 'react';
import { X, ShieldCheck, Check, AlertTriangle, PhoneCall } from 'lucide-react';

interface SafetyModalProps {
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Patient Safety & Standards
              </span>
              <h2 id="safety-modal-title" className="text-lg font-bold text-slate-900">
                Responsible Healthcare AI
              </h2>
            </div>
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Emergency Alert Banner */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-900">Experiencing an emergency?</h3>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                If you are experiencing severe chest pain, shortness of breath, sudden numbness, heavy bleeding, or any life-threatening situation, call your local emergency service (like 911 or local emergency room) immediately.
              </p>
            </div>
          </div>

          {/* Core mission */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Our Core Promise: Educational Clarity, Not Diagnosis
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              MediGuide AI is designed to bridge the communication gap between complex medical lab sheets and everyday patients. We translate dense scientific jargon into clear, straightforward English so you can walk into your doctor’s appointment feeling confident and well-prepared.
            </p>
          </div>

          {/* Grid of Can vs Cannot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wide mb-3">
                <Check className="w-4 h-4 text-emerald-600" />
                MediGuide AI CAN:
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Explain what lab markers test for</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Translate medical terms into plain words</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Summarize routine lab sheets clearly</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Generate smart questions for your doctor</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs uppercase tracking-wide mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                MediGuide AI CANNOT:
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Diagnose diseases or conditions</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Prescribe or adjust medications</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Replace your licensed doctor</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Provide emergency or critical care</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Privacy statement */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">Privacy Notice</span>
            Medical reports contain sensitive personal information. We encourage removing or blurring identifying details (such as Social Security or exact street address) before uploading documents online.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

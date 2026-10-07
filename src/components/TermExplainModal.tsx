import React, { useState } from 'react';
import { X, Search, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { MedicalTerm } from '../types';
import { explainTerm } from '../services/aiService';

interface TermExplainModalProps {
  initialTerm?: MedicalTerm | null;
  onClose: () => void;
}

export const TermExplainModal: React.FC<TermExplainModalProps> = ({
  initialTerm,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTerm, setCurrentTerm] = useState<MedicalTerm | null>(initialTerm || null);
  const [isLoading, setIsLoading] = useState(false);

  const quickTerms = [
    'Hemoglobin',
    'Platelets',
    'WBC (Leukocytes)',
    'Fasting Glucose',
    'Creatinine',
    'Cholesterol'
  ];

  const handleSearch = async (termToLookup?: string) => {
    const query = termToLookup || searchTerm;
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await explainTerm(query);
      setCurrentTerm(result);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="term-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Medical Dictionary
              </span>
              <h2 id="term-modal-title" className="text-lg font-bold text-slate-900">
                Explain Medical Term
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

        {/* Search input */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type any medical word (e.g. Hemoglobin, Platelets, eGFR)..."
              className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900"
            />
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Thinking...' : 'Explain'}
            </button>
          </form>

          {/* Quick chips */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-600 font-medium">Quick ideas:</span>
            {quickTerms.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  handleSearch(term);
                }}
                className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-slate-500 font-medium">Translating into plain English...</p>
            </div>
          ) : currentTerm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">{currentTerm.term}</h3>
                <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  {currentTerm.category}
                </span>
              </div>

              {/* Simple explanation */}
              <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-100">
                <div className="flex items-center gap-2 mb-1.5 text-teal-900 font-semibold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  In Plain English
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {currentTerm.simple}
                </p>
              </div>

              {/* Everyday analogy */}
              {currentTerm.analogy && (
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-900 font-semibold text-xs uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-amber-700" />
                    Everyday Analogy
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed italic">
                    "{currentTerm.analogy}"
                  </p>
                </div>
              )}

              {/* Technical description */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <p className="text-xs text-slate-700 font-medium uppercase tracking-wider mb-1">
                  Technical Medical Definition
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentTerm.technical}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-600 text-sm">
              Search for any word above or pick a quick suggestion to see a friendly, non-medical breakdown.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-700">
          <span>🛡️ Educational explanation only</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

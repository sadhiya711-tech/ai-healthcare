import React from 'react';
import {
  FileText,
  Brain,
  BarChart3,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Clock,
  ArrowDown
} from 'lucide-react';

interface LandingPageProps {
  onAnalyzeReport: () => void;
  onTryDemo: () => void;
  onOpenSafetyModal: () => void;
  easyRead?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeReport,
  onTryDemo,
  onOpenSafetyModal,
  easyRead = false,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background ambient tint */}
        <div className="absolute inset-0 bg-radial from-sky-100/40 via-transparent to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left copy column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100/80 text-sky-900 rounded-full text-xs font-semibold tracking-wide border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI-Powered Medical Education</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Understand Your Health Information,{' '}
                <span className="text-teal-700 underline decoration-teal-300 decoration-wavy decoration-2 underline-offset-8">
                  Simply.
                </span>
              </h1>

              <p className={`text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed ${easyRead ? 'text-lg sm:text-xl text-slate-700' : 'text-base sm:text-lg'}`}>
                Turn complex medical reports and confusing laboratory sheets into clear, easy-to-understand explanations with AI. No jargon, no anxiety.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  onClick={onAnalyzeReport}
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-900 to-teal-800 text-white font-semibold rounded-xl hover:from-blue-950 hover:to-teal-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base"
                >
                  <span>Analyze My Report</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onTryDemo}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <span>See How It Works (Demo)</span>
                </button>
              </div>

              {/* Quick confidence points */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Free Hackathon Demo
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Instant Plain English
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  Doctor-Ready Questions
                </span>
              </div>
            </div>

            {/* Right visual column: Mock Medical Dashboard */}
            <div className="lg:col-span-5 relative">
              {/* Floating UI cards */}
              <div className="absolute -top-5 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-emerald-100 flex items-center gap-2 animate-bounce [animation-duration:4s]">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  Report analyzed ✓
                </span>
              </div>

              <div className="absolute top-1/2 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-teal-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-slate-800">
                  3 important values found
                </span>
              </div>

              <div className="absolute -bottom-4 left-6 sm:left-10 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-blue-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">
                  5 questions for your doctor
                </span>
              </div>

              {/* Central Mock Visual flow */}
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 sm:p-6 space-y-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block"></span>
                    <span className="text-xs font-semibold text-slate-700 ml-1">
                      MediGuide Transform Flow
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-700">cbc_routine_oct.pdf</span>
                </div>

                {/* Step 1: Medical Report */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      1. Medical Report (Raw Data)
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Complex</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-700 space-y-0.5 bg-white p-2 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span>HEMOGLOBIN</span>
                      <span className="font-semibold text-slate-900">13.8 g/dL (12-16)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GLUCOSE, FASTING</span>
                      <span className="font-semibold text-amber-900">108 mg/dL [H]</span>
                    </div>
                  </div>
                </div>

                {/* Down Arrow / Flow indicator */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    <Brain className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                    <span>AI Analysis & Term Simplification</span>
                    <ArrowDown className="w-3 h-3 text-teal-600" />
                  </div>
                </div>

                {/* Step 2: Simple Explanation Result */}
                <div className="bg-gradient-to-br from-teal-50/90 to-blue-50/70 p-4 rounded-xl border border-teal-200/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-teal-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      2. Simple Plain-English Explanation
                    </span>
                    <span className="text-[10px] bg-teal-200/70 text-teal-900 px-1.5 py-0.5 rounded font-semibold">Easy</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    "Your blood tests are largely within healthy expectations. Your hemoglobin delivery trucks are running well, and your slightly higher fasting sugar gives you a great talking point for your doctor."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MESSAGE BANNER */}
      <section className="bg-white border-y border-slate-200/80 py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center text-center gap-3">
          <span className="text-2xl shrink-0">🛡️</span>
          <div className="text-xs sm:text-sm text-slate-600">
            <strong className="text-slate-900">Healthcare information, explained responsibly.</strong>{' '}
            MediGuide AI provides general educational information and does not replace professional medical advice.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Clear 4-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              From confusing laboratory paperwork to empowered doctor visits in four straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative group">
              <span className="text-3xl font-extrabold text-slate-300 group-hover:text-teal-600 transition-colors font-mono">
                01
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">Upload</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Upload your medical report as a PDF or image, or test with our one-click sample report.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative group">
              <span className="text-3xl font-extrabold text-slate-300 group-hover:text-teal-600 transition-colors font-mono">
                02
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">Analyze</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                AI safely identifies key laboratory biomarkers, standard ranges, and important findings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative group">
              <span className="text-3xl font-extrabold text-slate-300 group-hover:text-teal-600 transition-colors font-mono">
                03
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">Understand</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Get clear, friendly everyday translations and everyday analogies without frightening medical jargon.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative group">
              <span className="text-3xl font-extrabold text-slate-300 group-hover:text-teal-600 transition-colors font-mono">
                04
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">Prepare</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate personalized questions to discuss productively with your physician at your next visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 sm:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Designed For Patients & Families
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need To Stay Informed
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A gentle, trustworthy interface engineered to reduce medical anxiety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:border-teal-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                📄 Report Analyzer
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Understand your medical report in simple language. We break down the clinical overview into conversational, human sentences that anyone can digest.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:border-teal-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                🧠 Simple Explanations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Convert complex medical terminology into everyday language. Learn what enzymes, platelets, and leukocytes actually do using relatable analogies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:border-teal-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-100/80 text-sky-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                📊 Important Values
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                See important report values clearly with standard reference brackets. Clear status indicators show what is typical and what deserves a quick conversation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:border-teal-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                👨‍⚕️ Doctor Questions
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate high-quality questions tailored to your specific results to discuss with your doctor, ensuring you make the most of every clinic consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY SECTION */}
      <section id="safety" className="py-20 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
              <span>Ethical AI Commitment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              AI That Knows Its Limits
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              We believe artificial intelligence in healthcare should empower communication, never replace medical professionals.
            </p>
          </div>

          {/* Calm, trustworthy side-by-side card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {/* What MediGuide Can Do */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-base font-bold text-slate-900">
                  MediGuide AI Can:
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Explain medical information in everyday words</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Summarize routine lab test sheets clearly</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Explain complex medical terminology and units</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Help prepare constructive questions for your doctor</span>
                </li>
              </ul>
            </div>

            {/* What MediGuide Cannot Do */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <h3 className="text-base font-bold text-slate-900">
                  MediGuide AI Cannot:
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Diagnose diseases or medical conditions</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Prescribe or adjust medication dosages</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Replace your licensed doctor or nurse</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Provide emergency or critical trauma treatment</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onOpenSafetyModal}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Read our complete Safety Standards & Disclaimers
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA CALLOUT */}
      <section className="py-16 bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to make sense of your medical report?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Test the live interactive demo or upload your own lab findings to receive a simple, stress-free explanation in seconds.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onAnalyzeReport}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-colors cursor-pointer text-sm sm:text-base"
            >
              Try MediGuide AI Now
            </button>
            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer text-sm sm:text-base"
            >
              Load Demo Report
            </button>
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">🩺 MediGuide AI</span>
            <span>·</span>
            <span>Understand your health information, simply.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSafetyModal}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Medical Disclaimer
            </button>
            <span>·</span>
            <span>Built for AI Health Hackathon 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

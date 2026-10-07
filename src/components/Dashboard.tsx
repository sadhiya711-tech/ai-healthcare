import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  FileText,
  MessageSquare,
  HelpCircle,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  ChevronRight,
  Send,
  Shield,
  FileCheck,
  Search,
  PlusCircle,
  ExternalLink,
  Download,
  LogOut,
  User,
  ArrowUp
} from 'lucide-react';
import { ReportData, MetricItem, MedicalTerm, DoctorQuestion, ChatMessage, UserProfile } from '../types';
import { DEMO_REPORT_CBC } from '../data/demoReport';
import {
  analyzeReport,
  generateDoctorQuestions,
  askAssistant,
  AI_SAFETY_DISCLAIMER
} from '../services/aiService';
import { MetricDetailModal } from './MetricDetailModal';
import { TermExplainModal } from './TermExplainModal';

interface DashboardProps {
  user: UserProfile | null;
  onSignOut: () => void;
  onBackToLanding: () => void;
  easyRead: boolean;
  onOpenSafetyModal: () => void;
  initialTab?: 'home' | 'upload' | 'results' | 'chat' | 'questions';
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onSignOut,
  onBackToLanding,
  easyRead,
  onOpenSafetyModal,
  initialTab = 'home',
}) => {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'home' | 'upload' | 'results' | 'chat' | 'questions'>(
    initialTab
  );

  // Report state
  const [report, setReport] = useState<ReportData | null>(DEMO_REPORT_CBC);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Modals state
  const [selectedMetric, setSelectedMetric] = useState<MetricItem | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

  // Audio Text-to-Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Copy questions state
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [isGeneratingMoreQuestions, setIsGeneratingMoreQuestions] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hi! I can help explain your report and medical terms in simple language. Feel free to ask about any test value, or pick a suggested topic below.',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Processing animation steps
  const steps = [
    'Reading report & scanning lab values',
    'Identifying medical biomarkers & units',
    'Simplifying clinical terminology',
    'Preparing simple explanation & doctor questions',
  ];

  // Run simulated report processing flow
  const triggerProcessingFlow = async (customText?: string, fileName?: string) => {
    setIsProcessing(true);
    setProcessingStep(0);
    setProcessingProgress(15);
    setActiveTab('upload');

    // Smooth step animations
    const step1Timer = setTimeout(() => {
      setProcessingStep(1);
      setProcessingProgress(45);
    }, 500);

    const step2Timer = setTimeout(() => {
      setProcessingStep(2);
      setProcessingProgress(75);
    }, 1100);

    const step3Timer = setTimeout(() => {
      setProcessingStep(3);
      setProcessingProgress(92);
    }, 1600);

    try {
      const result = await analyzeReport(customText, fileName);
      setTimeout(() => {
        setProcessingProgress(100);
        setTimeout(() => {
          setReport(result);
          setIsProcessing(false);
          setActiveTab('results');
        }, 400);
      }, 2000);
    } catch {
      setIsProcessing(false);
      setReport(DEMO_REPORT_CBC);
      setActiveTab('results');
    }

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
    };
  };

  const handleUseDemoReport = () => {
    setUploadedFileName(null);
    triggerProcessingFlow();
  };

  const handleFileUpload = (file: File) => {
    setUploadedFileName(file.name);
    triggerProcessingFlow(file.name, file.name);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Text to Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!report) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(report.simpleSummary);
      utterance.rate = 0.95; // Slightly slower, gentle pace
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Stop speech if unmounting or changing tab
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTab]);

  // Copy Doctor Questions to Clipboard
  const handleCopyQuestions = () => {
    if (!report) return;
    const text = report.doctorQuestions.map((q, idx) => `${idx + 1}. ${q.question}`).join('\n\n');
    navigator.clipboard.writeText(
      `Questions for My Doctor (Generated by MediGuide AI):\n\n${text}\n\nNote: For personal reference to guide your physician consultation.`
    );
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2500);
  };

  // Generate More Questions
  const handleGenerateMoreQuestions = async () => {
    if (!report) return;
    setIsGeneratingMoreQuestions(true);
    try {
      const more = await generateDoctorQuestions(report);
      setReport({ ...report, doctorQuestions: more });
    } finally {
      setIsGeneratingMoreQuestions(false);
    }
  };

  // Send Chat message
  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim() || isChatSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatInput('');
    setIsChatSending(true);

    try {
      const replyText = await askAssistant(textToSend, report || undefined);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Just now',
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I am here to help you understand your medical reports. Feel free to rephrase or ask about a specific test result.',
        timestamp: 'Just now',
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row pb-20 md:pb-0 ${easyRead ? 'text-base sm:text-lg' : 'text-sm'}`}>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 min-h-screen p-5 justify-between select-none">
        <div className="space-y-6">
          {/* Logo & Portal title */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                  MEDIGUIDE AI
                </h2>
                <span className="text-[10px] font-semibold text-teal-700 tracking-wide block mt-1">
                  Patient Portal
                </span>
              </div>
            </div>
            <button
              onClick={onBackToLanding}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 px-1.5 rounded hover:bg-slate-100 cursor-pointer"
              title="View Public App Tour"
            >
              Tour
            </button>
          </div>

          {/* Compact Modern Patient Profile Card */}
          <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                {(user?.name || 'Alex').charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {user?.name || 'Alex Morgan'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {user?.patientId || 'PT-35047'}
                  </span>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Active Patient
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-medium">
                {user?.age || '42 years'}
              </span>
              <button
                onClick={onSignOut}
                className="text-[10px] text-rose-700 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Sign out"
              >
                <LogOut className="w-2.5 h-2.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: report ? 'results' : 'upload', label: 'Analyze Report', icon: FileText, altId: 'upload' },
              { id: 'chat', label: 'Ask AI', icon: MessageSquare },
              { id: 'questions', label: 'Doctor Questions', icon: HelpCircle },
            ].map((item) => {
              const isSelected = activeTab === item.id || (item.altId && activeTab === item.altId);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/90 text-teal-900 border border-teal-200/70 shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-4 rounded-full bg-teal-600 block shadow-2xs" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Responsible AI Card */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>Responsible AI</span>
            </div>
            <p className="leading-snug text-slate-500">
              Educational information only. Does not replace your doctor.
            </p>
          </div>

          <button
            onClick={onOpenSafetyModal}
            className="w-full text-center text-xs text-teal-700 hover:text-teal-800 font-semibold cursor-pointer underline underline-offset-2 transition-colors"
          >
            Safety Guidelines
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto min-h-screen flex flex-col">
        {/* Clean, Compact Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="md:hidden text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 rounded-lg"
            >
              Tour
            </button>
            <div>
              {activeTab === 'chat' ? (
                <>
                  <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Ask MediGuide AI
                  </h1>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    Your personal healthcare information assistant
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    MediGuide AI Portal
                  </h1>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    Welcome, {user?.name || 'Alex'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Quick actions in top bar */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center text-[11px] text-slate-600 font-mono bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg font-medium">
              ID: {user?.patientId || 'PT-35047'}
            </span>

            {report && (
              <button
                onClick={handleUseDemoReport}
                className="text-xs px-2.5 py-1 text-teal-800 bg-teal-50 border border-teal-200/80 rounded-lg hover:bg-teal-100 font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Reload demo CBC report"
              >
                <RotateCcw className="w-3 h-3 text-teal-700" />
                <span className="hidden sm:inline">Reload Demo</span>
              </button>
            )}

            <button
              onClick={() => {
                setSelectedTerm(null);
                setIsTermModalOpen(true);
              }}
              className="text-xs px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Search className="w-3 h-3 text-slate-500" />
              <span>Dictionary</span>
            </button>

            {/* Top Bar Sign Out */}
            <button
              onClick={onSignOut}
              className="text-xs px-2.5 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3 text-rose-600" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* ================= VIEW: DASHBOARD HOME ================= */}
          {activeTab === 'home' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Understand your health information, {user?.name?.split(' ')[0] || 'Alex'} 👋
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  "Let's make your medical information easier to understand."
                </p>
              </div>

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Large Primary Card */}
                <div className="bg-gradient-to-br from-blue-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-3 z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-xs font-semibold text-teal-200 border border-white/10">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Ready to scan</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Analyze a Medical Report
                    </h2>
                    <p className="text-teal-100/90 text-sm leading-relaxed max-w-md">
                      Upload a report and get a simple AI explanation in everyday words. Works with blood work, metabolic panels, and routine clinic test sheets.
                    </p>
                  </div>

                  <div className="pt-6 z-10">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-teal-50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <Upload className="w-4 h-4 text-teal-700" />
                      <span>Upload Report</span>
                    </button>
                  </div>

                  {/* Decorative background circle */}
                  <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-teal-500/10 pointer-events-none" />
                </div>

                {/* Try Demo Report Card (Extremely Important for Hackathon) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-colors">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-semibold border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Instant 2-Minute Walkthrough</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      Try Demo Report
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      "Want to see how MediGuide works?" Experience the complete flow instantly using our realistic Complete Blood Count (CBC) test dataset.
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleUseDemoReport}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <span>View Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fictional Sample Overview / Health Literacy callout */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-teal-600" />
                    How to read medical reports with confidence
                  </h3>
                  <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                    Educational Tip
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 mb-1">1. Reference Ranges</p>
                    <p>Numbers outside reference brackets are very common and don't automatically indicate illness.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 mb-1">2. Fasting Context</p>
                    <p>What you ate or drank the evening prior can temporarily shift glucose and triglyceride levels.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 mb-1">3. Doctor Partnership</p>
                    <p>Always bring prepared questions so you and your doctor can review results together calmly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: UPLOAD & PROCESSING ================= */}
          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
              {isProcessing ? (
                /* Beautiful AI Processing Animation */
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="w-20 h-20 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
                    <Sparkles className="w-8 h-8 text-teal-600 absolute inset-0 m-auto" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      Analyzing Medical Report
                    </h2>
                    <p className="text-sm text-slate-500">
                      Applying safe health-literacy models to translate your report...
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-900 to-teal-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>

                  {/* Animated steps checklist */}
                  <div className="space-y-3 text-left max-w-md mx-auto pt-4">
                    {steps.map((s, idx) => {
                      const isDone = processingStep > idx;
                      const isCurrent = processingStep === idx;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 text-xs sm:text-sm transition-colors ${
                            isDone
                              ? 'text-emerald-700 font-semibold'
                              : isCurrent
                              ? 'text-teal-900 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-700 font-bold'
                                : isCurrent
                                ? 'bg-teal-100 text-teal-700 animate-pulse'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Upload Interface */
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Upload Your Medical Report
                    </h1>
                    <p className="text-sm text-slate-500">
                      Get a clear, plain-language breakdown of your test results.
                    </p>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-teal-500 bg-teal-50/50'
                        : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <input
                      type="file"
                      id="report-file-input"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <label
                      htmlFor="report-file-input"
                      className="cursor-pointer space-y-4 block"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto hover:scale-105 transition-transform">
                        <FileText className="w-8 h-8 text-slate-500" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-base font-bold text-slate-900">
                          Drop your medical report here
                        </p>
                        <p className="text-xs text-slate-500">
                          or <span className="text-teal-700 font-semibold underline">choose a file</span> from your computer or phone
                        </p>
                      </div>

                      <p className="text-[11px] font-mono text-slate-600">
                        Supported formats: PDF • JPG • PNG
                      </p>
                    </label>

                    {/* Privacy notice banner inside upload */}
                    <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-700 max-w-md mx-auto leading-normal">
                      🛡️ <strong>Your privacy matters:</strong> Your information should be handled carefully. Do not upload information you are uncomfortable sharing.
                    </div>
                  </div>

                  {/* Or Use Demo Report Option */}
                  <div className="text-center pt-2 space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#F8FAFC] px-3 text-slate-600 font-semibold">
                          Quick Hackathon Demo
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleUseDemoReport}
                      className="w-full py-3.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Use Demo Report (Complete Blood Count)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: REPORT RESULTS ================= */}
          {activeTab === 'results' && report && (
            <div className="space-y-8 animate-fadeIn">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Your Report, Explained
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base mt-0.5">
                    "Here's a simpler way to understand the information in your report."
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="text-xs px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Another</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="text-xs px-3 py-2 bg-gradient-to-r from-blue-900 to-teal-800 text-white rounded-lg font-semibold hover:from-blue-950 hover:to-teal-900 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI Questions</span>
                  </button>
                </div>
              </div>

              {/* Demo Notice Banner (Required by prompt) */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold uppercase tracking-wide px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded text-[10px]">
                    DEMO DATA — NOT A REAL MEDICAL REPORT
                  </span>
                  <span className="hidden sm:inline">
                    Patient: {report.patientName} · {report.title}
                  </span>
                </div>
                <span className="text-[11px] text-amber-700 font-mono hidden md:inline">
                  {report.date}
                </span>
              </div>

              {/* ================= SECTION 1 — SIMPLE SUMMARY ================= */}
              <section className="bg-gradient-to-br from-teal-50/90 via-sky-50/50 to-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-900 font-bold text-sm uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <span>In Simple Words</span>
                  </div>

                  {/* Audio Read-Aloud Accessibility Button */}
                  <button
                    onClick={toggleSpeech}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSpeaking
                        ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Listen to summary read aloud"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        <span>Stop Listening</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Listen to Summary</span>
                      </>
                    )}
                  </button>
                </div>

                <p className={`text-slate-800 leading-relaxed font-medium ${easyRead ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                  "{report.simpleSummary}"
                </p>

                <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Summary prepared automatically for patient education. Always consult your physician.</span>
                </div>
              </section>

              {/* ================= SECTION 2 — IMPORTANT VALUES ================= */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Important Values
                    </h2>
                    <p className="text-xs text-slate-500">
                      Key measurements identified in your lab report
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {report.metrics.length} biomarkers detected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        {/* Title and Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-base">
                            {metric.name}
                          </h3>
                          {metric.status === 'normal' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {metric.statusLabel}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md shrink-0 border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              {metric.statusLabel}
                            </span>
                          )}
                        </div>

                        {/* Value and Reference Range */}
                        <div className="flex items-baseline gap-3 pt-1">
                          <span className="text-2xl font-bold text-slate-900 tabular-nums">
                            {metric.value}{' '}
                            <span className="text-xs font-normal text-slate-700">
                              {metric.unit}
                            </span>
                          </span>
                          <span className="text-xs text-slate-700 tabular-nums">
                            Reference: {metric.referenceRange}
                          </span>
                        </div>

                        {/* Simple Explanation */}
                        <p className="text-xs text-slate-600 leading-relaxed pt-1">
                          {metric.simpleExplanation}
                        </p>
                      </div>

                      {/* Learn More Action */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedMetric(metric)}
                          className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Learn More</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] text-slate-600 font-mono">
                          {metric.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= SECTION 3 — MEDICAL TERMS ================= */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Medical Terms Made Simple
                    </h2>
                    <p className="text-xs text-slate-500">
                      Complex clinical vocabulary translated into everyday concepts
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTerm(null);
                      setIsTermModalOpen(true);
                    }}
                    className="text-xs px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg hover:bg-teal-100 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Explain with AI</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.terms.map((term, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-sm">
                            {term.term}
                          </h3>
                          <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {term.category}
                          </span>
                        </div>

                        {/* Technical definition */}
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700 block text-[10px] uppercase">
                            Technical
                          </span>
                          <span>"{term.technical}"</span>
                        </div>

                        {/* Simple definition */}
                        <div className="text-xs text-slate-800 font-medium">
                          <span className="font-bold text-teal-800 block text-[10px] uppercase mb-0.5">
                            Simple
                          </span>
                          <span>{term.simple}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTerm(term);
                          setIsTermModalOpen(true);
                        }}
                        className="text-xs text-teal-700 hover:text-teal-800 font-semibold text-left pt-2 border-t border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <span>Deep Dive & Analogy</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= SECTION 4 — DOCTOR QUESTIONS ================= */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Questions You May Want to Ask Your Doctor
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Personalized conversation starters based on this report's findings
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateMoreQuestions}
                      disabled={isGeneratingMoreQuestions}
                      className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{isGeneratingMoreQuestions ? 'Thinking...' : 'Generate More Questions'}</span>
                    </button>

                    <button
                      onClick={handleCopyQuestions}
                      className="text-xs px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      {copiedQuestions ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-100" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Questions</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* List of questions */}
                <div className="space-y-3">
                  {report.doctorQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            "{q.question}"
                          </p>
                          <p className="text-xs text-slate-500">
                            Context: {q.context}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleSendChat(q.question);
                          setActiveTab('chat');
                        }}
                        className="text-xs text-teal-700 hover:text-teal-800 font-semibold shrink-0 hidden sm:inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ask AI</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Patient Preparation Reminder */}
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-950 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Appointment Tip:</strong> Take these questions with you on your phone or write them on a notepad. Clear questions help your doctor understand what matters most to you!
                  </span>
                </div>
              </section>
            </div>
          )}

          {/* ================= VIEW: ASK AI (MODERN HEALTHCARE ASSISTANT) ================= */}
          {activeTab === 'chat' && (
            <div className="max-w-3xl lg:max-w-4xl mx-auto flex flex-col h-[calc(100vh-7.5rem)] min-h-[550px] animate-fadeIn pb-2">
              {/* Chat Container Card */}
              <div className="flex-1 flex flex-col bg-slate-50/50 rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                {/* Scrollable Conversation Viewport */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
                  {/* Beautiful Welcome State when only the default greeting exists */}
                  {chatMessages.length === 1 && (
                    <div className="py-6 sm:py-10 px-2 max-w-xl mx-auto text-center space-y-6 animate-fadeIn">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center shadow-2xs">
                        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                          How can MediGuide help you today?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                          Ask about your medical report, lab results, symptoms, or healthcare terms in everyday language.
                        </p>
                      </div>

                      <div className="pt-2 text-left space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                          Try asking
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { icon: '🩺', text: 'Explain my report simply' },
                            { icon: '🧪', text: 'What does hemoglobin mean?' },
                            { icon: '📋', text: 'What should I ask my doctor?' },
                            { icon: '📊', text: 'Why was fasting glucose 108?' },
                            { icon: '🌡️', text: 'What should I know about fever?' },
                          ].map((chip) => (
                            <button
                              key={chip.text}
                              type="button"
                              onClick={() => handleSendChat(chip.text)}
                              className="p-3 bg-white hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 rounded-xl text-left text-xs font-semibold text-slate-700 hover:text-teal-900 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2.5 group"
                            >
                              <span className="text-base group-hover:scale-110 transition-transform">{chip.icon}</span>
                              <span className="flex-1 truncate">{chip.text}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render Chat Messages (Skip initial welcome greeting if user has sent messages, or show it cleanly) */}
                  {chatMessages.map((msg) => {
                    if (msg.id === 'welcome' && chatMessages.length === 1) {
                      return null; // Shown as the richer welcome screen above
                    }

                    if (msg.sender === 'user') {
                      return (
                        <div key={msg.id} className="flex justify-end animate-fadeIn">
                          <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                            <div className="bg-slate-900 text-white rounded-2xl rounded-tr-xs shadow-2xs p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed">
                              <p className="whitespace-pre-line">{msg.text}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 block text-right pr-2">
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className="flex items-start gap-3 animate-fadeIn">
                        {/* MediGuide AI Avatar */}
                        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 border border-teal-200/70 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="max-w-[85%] sm:max-w-[78%] space-y-1">
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-bold text-slate-800">MediGuide AI</span>
                            <span className="text-[10px] font-medium text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                              Healthcare Assistant
                            </span>
                          </div>
                          <div className="bg-white border border-slate-200/80 text-slate-800 shadow-2xs rounded-2xl rounded-tl-xs p-4 sm:p-5 text-xs sm:text-sm leading-relaxed">
                            <p className="whitespace-pre-line text-slate-800">{msg.text}</p>
                            <span className="text-[10px] text-slate-400 mt-2.5 block">
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Thinking State */}
                  {isChatSending && (
                    <div className="flex items-start gap-3 animate-fadeIn">
                      <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 border border-teal-200/70 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">MediGuide AI</span>
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-medium border border-teal-100">
                            Thinking...
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 py-1 px-1">
                          <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Prompts Chips during active conversation */}
                {chatMessages.length > 1 && (
                  <div className="px-4 sm:px-6 py-2.5 bg-slate-50/90 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                      Try asking:
                    </span>
                    {[
                      { icon: '🩺', text: 'Explain my report simply' },
                      { icon: '🧪', text: 'What does hemoglobin mean?' },
                      { icon: '📋', text: 'What should I ask my doctor?' },
                      { icon: '📊', text: 'Why was fasting glucose 108?' },
                      { icon: '🌡️', text: 'What should I know about fever?' },
                    ].map((chip) => (
                      <button
                        key={chip.text}
                        type="button"
                        onClick={() => handleSendChat(chip.text)}
                        className="text-xs px-2.5 py-1.5 bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 hover:text-teal-900 border border-slate-200/80 rounded-lg shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                      >
                        <span>{chip.icon}</span>
                        <span className="font-medium">{chip.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Docked Premium Input Area */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChat();
                    }}
                    className="relative bg-slate-50/80 hover:bg-white focus-within:bg-white border border-slate-200/90 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 rounded-2xl shadow-2xs transition-all p-1.5 sm:p-2 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChat();
                        }
                      }}
                      placeholder="Ask MediGuide anything about your health or report..."
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isChatSending}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed bg-teal-700 hover:bg-teal-800 text-white shadow-2xs hover:shadow-xs active:scale-95"
                      title="Send message"
                    >
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </form>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    MediGuide AI provides educational information and does not replace your doctor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: DOCTOR QUESTIONS (FULL VIEW) ================= */}
          {activeTab === 'questions' && report && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Questions For Your Doctor
                  </h1>
                  <p className="text-sm text-slate-600">
                    Be ready for your appointment with clear, structured questions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateMoreQuestions}
                    disabled={isGeneratingMoreQuestions}
                    className="text-xs px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                    <span>Generate More</span>
                  </button>

                  <button
                    onClick={handleCopyQuestions}
                    className="text-xs px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedQuestions ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Questions list cards */}
              <div className="space-y-4">
                {report.doctorQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-base font-bold text-slate-900">
                            "{q.question}"
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            <strong>Why this is helpful:</strong> {q.context}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-teal-900 font-bold bg-teal-50 border border-teal-200/60 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab(report ? 'results' : 'upload')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'results' || activeTab === 'upload' ? 'text-teal-900 font-bold bg-teal-50 border border-teal-200/60 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Report</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'chat' ? 'text-teal-900 font-bold bg-teal-50 border border-teal-200/60 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>Ask AI</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'questions' ? 'text-teal-900 font-bold bg-teal-50 border border-teal-200/60 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          <span>Questions</span>
        </button>
      </nav>

      {/* MODALS */}
      {selectedMetric && (
        <MetricDetailModal
          metric={selectedMetric}
          onClose={() => setSelectedMetric(null)}
          onAskDoctorQuestion={(q) => {
            handleSendChat(q);
            setActiveTab('chat');
          }}
        />
      )}

      {isTermModalOpen && (
        <TermExplainModal
          initialTerm={selectedTerm}
          onClose={() => {
            setIsTermModalOpen(false);
            setSelectedTerm(null);
          }}
        />
      )}
    </div>
  );
};

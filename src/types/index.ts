export interface MetricItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'attention' | 'neutral';
  statusLabel: string;
  simpleExplanation: string;
  technicalDescription: string;
  whyItMatters: string;
  questionsToAsk: string[];
}

export interface MedicalTerm {
  term: string;
  technical: string;
  simple: string;
  category: string;
  analogy?: string;
}

export interface DoctorQuestion {
  id: string;
  question: string;
  category: 'general' | 'lifestyle' | 'followup' | 'monitoring';
  context: string;
}

export interface ReportData {
  id: string;
  title: string;
  date: string;
  patientName: string;
  patientAge: string;
  doctorOrLab: string;
  isDemo: boolean;
  simpleSummary: string;
  metrics: MetricItem[];
  terms: MedicalTerm[];
  doctorQuestions: DoctorQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  disclaimer?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  patientId: string;
  age?: string;
  isDemo?: boolean;
}

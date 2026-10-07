import { ReportData, MedicalTerm, DoctorQuestion, ChatMessage } from '../types';
import { DEMO_REPORT_CBC } from '../data/demoReport';

/**
 * MediGuide AI Service Layer
 * Designed with modular interfaces so an LLM API (e.g. Gemini via backend proxy)
 * can be plugged in seamlessly while providing instant, reliable, hackathon-tested demo responses.
 */

export const AI_SAFETY_DISCLAIMER =
  'MediGuide AI provides general educational information and does not replace professional medical advice, diagnosis, or treatment. If you think you may be experiencing a medical emergency, seek immediate professional medical care or call your local emergency service.';

export async function analyzeReport(
  fileText?: string,
  fileName?: string
): Promise<ReportData> {
  // Simulate AI parsing latency for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 1800));

  if (!fileText || fileText.trim().length === 0) {
    return DEMO_REPORT_CBC;
  }

  // If custom user text/file is supplied, create a structured response tailored to it
  const isLipid = fileText.toLowerCase().includes('lipid') || fileText.toLowerCase().includes('cholesterol');
  const isThyroid = fileText.toLowerCase().includes('tsh') || fileText.toLowerCase().includes('thyroid');

  if (isLipid) {
    return {
      id: 'custom-lipid-01',
      title: fileName || 'Lipid Panel & Cardiovascular Baseline',
      date: 'Recent Laboratory Upload',
      patientName: 'Demo Patient',
      patientAge: '45 years',
      doctorOrLab: 'Cardiovascular Diagnostic Services',
      isDemo: true,
      simpleSummary:
        'This lipid panel measures fats (lipids) in your bloodstream. Your Total Cholesterol and HDL (often known as "good cholesterol") are in favorable territory, while LDL is slightly elevated. This report provides a great starting foundation to discuss heart-healthy dietary habits and exercise with your physician.',
      metrics: [
        {
          id: 'total-chol',
          name: 'Total Cholesterol',
          value: '198',
          unit: 'mg/dL',
          referenceRange: '< 200 mg/dL',
          status: 'normal',
          statusLabel: 'Within reported range',
          simpleExplanation: 'The overall amount of cholesterol compounds circulating through your bloodstream.',
          technicalDescription: 'Combined measurement of HDL, LDL, and VLDL lipoprotein concentrations.',
          whyItMatters: 'Keeping total cholesterol below 200 mg/dL is generally considered favorable for arterial health.',
          questionsToAsk: ['Is my total cholesterol stable compared to my last annual exam?']
        },
        {
          id: 'ldl',
          name: 'LDL Cholesterol',
          value: '118',
          unit: 'mg/dL',
          referenceRange: '< 100 mg/dL',
          status: 'attention',
          statusLabel: 'Slightly above reference range',
          simpleExplanation: 'Often referred to as "LDL" or bad cholesterol because elevated amounts can form plaques over years.',
          technicalDescription: 'Low-density lipoprotein calculated via Friedewald equation.',
          whyItMatters: 'This result is outside the reference range shown on the report. There can be many possible reasons. Discuss this result with a qualified healthcare professional who can interpret it in context.',
          questionsToAsk: [
            'What target LDL range is appropriate for my individual cardiovascular profile?',
            'What lifestyle or dietary modifications do you recommend first?'
          ]
        },
        {
          id: 'hdl',
          name: 'HDL Cholesterol',
          value: '58',
          unit: 'mg/dL',
          referenceRange: '> 40 mg/dL',
          status: 'normal',
          statusLabel: 'Within reported range',
          simpleExplanation: 'Known as "good" cholesterol because it scavenges excess cholesterol and carries it back to the liver.',
          technicalDescription: 'High-density lipoprotein functioning as reverse cholesterol transport.',
          whyItMatters: 'Higher HDL levels are generally linked to cardiovascular protection.',
          questionsToAsk: ['How can I sustain or increase my protective HDL level?']
        }
      ],
      terms: [
        {
          term: 'Lipoproteins',
          technical: 'Biochemical assemblies that transport hydrophobic lipid molecules in water or bloodstream.',
          simple: 'Small carrier shuttles that transport fat and cholesterol through your water-based blood.',
          category: 'Cardiovascular'
        },
        {
          term: 'LDL vs HDL',
          technical: 'Low-density vs High-density lipoproteins differing in lipid-to-protein ratio.',
          simple: 'LDL leaves cholesterol in blood vessels if too high; HDL cleans it up and takes it away.',
          category: 'Cardiovascular'
        }
      ],
      doctorQuestions: [
        {
          id: 'lq1',
          question: 'What is my overall cardiovascular risk calculation based on these cholesterol figures?',
          category: 'general',
          context: 'Doctors look at the full ratio alongside blood pressure and family history.'
        },
        {
          id: 'lq2',
          question: 'Do you recommend any changes to my diet, such as increasing soluble fiber?',
          category: 'lifestyle',
          context: 'Nutrition can have a meaningful impact on LDL levels.'
        }
      ]
    };
  }

  // Default CBC fallback with patient details adapted
  return {
    ...DEMO_REPORT_CBC,
    title: fileName ? `Uploaded: ${fileName}` : DEMO_REPORT_CBC.title
  };
}

export async function explainTerm(termName: string): Promise<MedicalTerm> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const normalized = termName.toLowerCase().trim();

  const dictionary: Record<string, MedicalTerm> = {
    hemoglobin: {
      term: 'Hemoglobin',
      technical: 'Iron-rich metalloprotein in erythrocytes responsible for oxygen delivery.',
      simple: 'A protein that acts like tiny delivery vans, carrying fresh oxygen from your lungs to your muscles and brain.',
      category: 'Blood Protein',
      analogy: 'Imagine delivery trucks filled with oxygen canisters making drop-offs at every street corner of your body.'
    },
    wbc: {
      term: 'White Blood Cells (WBC / Leukocytes)',
      technical: 'Immune system cells that defend against pathogens, allergens, and cellular debris.',
      simple: 'Your body’s personal security force that identifies and removes unwanted germs or viruses.',
      category: 'Immune Defense',
      analogy: 'Like protective guards patrolling a secure neighborhood gate.'
    },
    platelets: {
      term: 'Platelets (Thrombocytes)',
      technical: 'Enucleated cell fragments essential for hemostasis and fibrin clot mesh formation.',
      simple: 'Microscopic patches that rush to seal up any small cut or bleed so you heal quickly.',
      category: 'Blood Clotting',
      analogy: 'Instant waterproof sealant patches used to stop a leaky pipe immediately.'
    },
    glucose: {
      term: 'Fasting Blood Glucose',
      technical: 'Serum carbohydrate concentration following an overnight fast without calorie intake.',
      simple: 'The concentration of basic sugar in your bloodstream ready to provide clean fuel for your body cells.',
      category: 'Metabolism',
      analogy: 'The steady fuel line pressure in a parked car before you step on the gas pedal.'
    },
    creatinine: {
      term: 'Serum Creatinine',
      technical: 'Byproduct of muscle metabolism filtered out almost entirely by renal glomeruli.',
      simple: 'A natural muscle waste product that your kidneys normally filter out into urine. It indicates how well your kidneys are filtering.',
      category: 'Kidney Health',
      analogy: 'The amount of coffee grounds left over in a filter basket.'
    },
    cholesterol: {
      term: 'Cholesterol',
      technical: 'Waxy, fat-like steroid molecule essential for building cell membranes and hormones.',
      simple: 'A waxy substance your body needs to build strong cell walls. When there is too much of the wrong kind, it can coat blood vessels.',
      category: 'Cardiovascular',
      analogy: 'Wax that keeps your house pipes insulated, but troublesome if it accumulates on inside walls.'
    }
  };

  for (const [key, val] of Object.entries(dictionary)) {
    if (normalized.includes(key)) {
      return val;
    }
  }

  return {
    term: termName,
    technical: `Clinical biomarker or terminology referenced in routine diagnostic evaluations.`,
    simple: `A medical measurement used by clinicians to assess how your body organs are functioning. Always interpret within your overall health profile.`,
    category: 'General Clinical Lab',
    analogy: 'One of the dashboard gauges on a modern vehicle that helps your mechanic understand overall engine health.'
  };
}

export async function generateDoctorQuestions(report: ReportData): Promise<DoctorQuestion[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const questions: DoctorQuestion[] = [
    ...report.doctorQuestions,
    {
      id: `gen-${Date.now()}-1`,
      question: 'Are there any specific medication or vitamin interactions that could influence these values?',
      category: 'general',
      context: 'Supplements like biotin or common over-the-counter pain relievers can occasionally influence lab measurements.'
    },
    {
      id: `gen-${Date.now()}-2`,
      question: 'Would you suggest checking any complementary biomarkers, such as ferritin or kidney filtration markers?',
      category: 'followup',
      context: 'Helps provide a fuller 360-degree picture of internal balance.'
    },
    {
      id: `gen-${Date.now()}-3`,
      question: 'What symptoms or warning signs should prompt me to reach back out before our next routine appointment?',
      category: 'monitoring',
      context: 'Gives you clear parameters for when to seek prompt medical attention.'
    }
  ];

  return questions;
}

export async function askAssistant(
  userQuery: string,
  reportContext?: ReportData
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const lower = userQuery.toLowerCase().trim();

  // Emergency detection
  if (
    lower.includes('chest pain') ||
    lower.includes('emergency') ||
    lower.includes('heart attack') ||
    lower.includes('stroke') ||
    lower.includes('cant breathe') ||
    lower.includes("can't breathe") ||
    lower.includes('difficulty breathing') ||
    lower.includes('severe bleeding')
  ) {
    return '⚠️ IMPORTANT MEDICAL SAFETY NOTICE: If you think you may be experiencing a medical emergency, seek immediate professional medical care or contact your local emergency service (such as 911 or your local emergency department). MediGuide AI cannot provide emergency treatment, diagnoses, or triage.';
  }

  // Medication or prescription questions
  if (
    lower.includes('take') && lower.includes('pill') ||
    lower.includes('dosage') ||
    lower.includes('prescribe') ||
    lower.includes('stop taking') ||
    lower.includes('should i take')
  ) {
    return 'MediGuide AI cannot prescribe medication or advise on dosages. Only a licensed physician or pharmacist who knows your complete medical history can prescribe, adjust, or discontinue medications. Please consult your healthcare provider directly before changing any treatment plan.';
  }

  // Diagnosis questions
  if (
    lower.includes('do i have diabetes') ||
    lower.includes('do i have cancer') ||
    lower.includes('do i have anemia') ||
    lower.includes('diagnose')
  ) {
    return 'MediGuide AI cannot diagnose diseases or medical conditions. A single lab report is just one piece of a puzzle; clinical diagnosis requires a physical exam, clinical context, and professional medical review. For abnormal results: This result is outside the reference range shown on the report. There can be many possible reasons. Discuss this result with a qualified healthcare professional who can interpret it in context.';
  }

  // Hemoglobin question
  if (lower.includes('hemoglobin')) {
    return `Hemoglobin is a protein found inside red blood cells. Think of it as a fleet of delivery vehicles carrying fresh oxygen from your lungs to your muscles, brain, and other vital organs. In this report, the level is 13.8 g/dL, which falls neatly within the standard reference range of 12.0 to 16.0 g/dL.`;
  }

  // Glucose question
  if (lower.includes('glucose') || lower.includes('sugar') || lower.includes('108')) {
    return `In this report, the Fasting Blood Glucose is 108 mg/dL, while the typical resting reference cutoff is 70 to 99 mg/dL. This is slightly above the standard fasting range. There can be many possible reasons, including what you ate the evening before, how long you fasted, morning stress, or individual metabolic variation. A great question to ask your doctor is: "Should we repeat this test or check an HbA1c to see my longer-term 3-month average?"`;
  }

  // WBC question
  if (lower.includes('wbc') || lower.includes('white blood')) {
    return `White blood cells are your body's immune defense patrol. They protect you against bacteria, seasonal colds, and infections. Here, the count is 7,200 cells/µL, well within the usual 4,000 to 11,000 reference bracket.`;
  }

  // Doctor question suggestions
  if (lower.includes('doctor') || lower.includes('ask') || lower.includes('questions')) {
    return `Here are 3 great questions you can bring to your appointment:\n1. "What does this slightly elevated glucose result mean in my personal health context?"\n2. "Are there simple nutritional or exercise tweaks you recommend first?"\n3. "Would it be helpful to retest or check an HbA1c in 3 months?"`;
  }

  // General summary request
  if (lower.includes('explain') || lower.includes('summary') || lower.includes('report')) {
    return `Overall, this routine Complete Blood Count (CBC) report shows that your oxygen-carrying hemoglobin (13.8 g/dL), immune white blood cells (7,200 cells/µL), and clot-forming platelets (245,000/µL) are all within standard reference ranges. The only item flagged for attention is the Fasting Glucose at 108 mg/dL, which is slightly above 99 mg/dL. It's a wonderful talking point for a quick check-in with your doctor!`;
  }

  // Friendly default
  return `I'm happy to help explain that in simple terms! Remember, MediGuide AI provides educational explanations to make medical reports easier to read, but does not diagnose or replace your physician. Would you like to explore what a specific lab biomarker means, or generate custom questions for your next doctor's visit?`;
}

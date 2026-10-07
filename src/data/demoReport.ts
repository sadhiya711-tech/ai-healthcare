import { ReportData } from '../types';

export const DEMO_REPORT_CBC: ReportData = {
  id: 'demo-cbc-01',
  title: 'Complete Blood Count (CBC) with Fasting Glucose',
  date: 'October 14, 2026',
  patientName: 'Alex Morgan (Sample Patient)',
  patientAge: '42 years',
  doctorOrLab: 'MetroHealth Diagnostic Labs (Demo Facility)',
  isDemo: true,
  simpleSummary:
    'This report contains several routine blood test results. Most values shown are within the standard reference ranges listed on this fictional report. One value (Fasting Glucose) is slightly above the typical resting range, which is a common item to review with your doctor alongside your everyday diet and recent meals. Overall, this is an informative baseline test.',
  metrics: [
    {
      id: 'hemoglobin',
      name: 'Hemoglobin',
      value: '13.8',
      unit: 'g/dL',
      referenceRange: '12.0 – 16.0 g/dL',
      status: 'normal',
      statusLabel: 'Within reported range',
      simpleExplanation:
        'Hemoglobin is a protein in red blood cells that acts like delivery trucks, carrying oxygen from your lungs to the rest of your body.',
      technicalDescription:
        'Iron-containing oxygen-transport metalloprotein in red blood cells that carries O2 from respiratory organs to tissues.',
      whyItMatters:
        'Healthy hemoglobin levels help ensure your organs and muscles receive the steady oxygen supply they need to stay energized.',
      questionsToAsk: [
        'Is my hemoglobin level steady compared to previous blood tests?',
        'Are there any iron-rich foods or dietary habits that support maintaining this level?'
      ]
    },
    {
      id: 'wbc',
      name: 'White Blood Cell (WBC) Count',
      value: '7,200',
      unit: 'cells/µL',
      referenceRange: '4,000 – 11,000 cells/µL',
      status: 'normal',
      statusLabel: 'Within reported range',
      simpleExplanation:
        'White blood cells are your body’s defense team. They help protect you against bacteria, viruses, and other everyday infections.',
      technicalDescription:
        'Total leukocyte count in circulating blood responsible for innate and adaptive immune response.',
      whyItMatters:
        'Being well within the reference window indicates your immune defense system is operating normally without signs of acute stress or active infection on this sample.',
      questionsToAsk: [
        'Does this count look consistent with my usual baseline?',
        'How do routine seasonal allergies or minor colds temporarily affect this count?'
      ]
    },
    {
      id: 'platelets',
      name: 'Platelets',
      value: '245,000',
      unit: '/µL',
      referenceRange: '150,000 – 450,000 /µL',
      status: 'normal',
      statusLabel: 'Within reported range',
      simpleExplanation:
        'Platelets are tiny cellular helpers that form small plugs and clots whenever you get a papercut or bruise, stopping bleeding quickly.',
      technicalDescription:
        'Thrombocytes involved in hemostasis, forming primary platelet plugs at sites of vascular endothelial disruption.',
      whyItMatters:
        'Proper platelet counts ensure your blood clots normally when you have minor injuries while preventing unnecessary clotting inside blood vessels.',
      questionsToAsk: [
        'Do routine medications (like aspirin or ibuprofen) interact with my platelet function?',
        'Is there any need to re-check this count in my routine annual checkup?'
      ]
    },
    {
      id: 'glucose',
      name: 'Fasting Blood Glucose',
      value: '108',
      unit: 'mg/dL',
      referenceRange: '70 – 99 mg/dL',
      status: 'attention',
      statusLabel: 'Slightly above reference range',
      simpleExplanation:
        'Fasting glucose measures the amount of sugar in your bloodstream after not eating overnight. Your level is slightly higher than the standard resting cutoff.',
      technicalDescription:
        'Concentration of free serum glucose measured after an overnight fast (typically minimum 8–12 hours).',
      whyItMatters:
        'Values between 100 and 125 mg/dL can sometimes be influenced by what you ate the evening before, how long you fasted, stress, or mild changes in metabolic processing. It is a helpful conversation starter for your doctor.',
      questionsToAsk: [
        'Should we repeat this fasting glucose test or look into an HbA1c test to see a 3-month average?',
        'Could the timing of my last meal or morning coffee have influenced this number?',
        'Are there simple daily nutrition or walking habits you recommend to keep this in the optimal range?'
      ]
    }
  ],
  terms: [
    {
      term: 'Hemoglobin',
      technical: 'A protein found in red blood cells that binds oxygen molecules.',
      simple: 'It acts like an oxygen delivery vehicle carrying air from your lungs to your muscles.',
      category: 'Blood Protein',
      analogy: 'Imagine a fleet of delivery vans constantly driving fresh air to every cell in your body.'
    },
    {
      term: 'WBC (Leukocytes)',
      technical: 'Cellular components of the immune system that defend against infectious diseases and foreign invaders.',
      simple: 'Your body’s natural security patrol that fights off bugs and viruses.',
      category: 'Immune System',
      analogy: 'The neighborhood watch team keeping guards at all doors.'
    },
    {
      term: 'Platelets (Thrombocytes)',
      technical: 'Cytoplasmic fragments derived from megakaryocytes that trigger blood coagulation.',
      simple: 'Tiny natural bandages that stick together to stop you from bleeding when cut.',
      category: 'Blood Clotting',
      analogy: 'Like instant patching tape that seals up any small pipe leak right away.'
    },
    {
      term: 'Fasting Glucose',
      technical: 'Serum concentration of monosaccharide glucose following overnight caloric abstinence.',
      simple: 'The amount of sugar circulating in your blood before having your morning breakfast.',
      category: 'Metabolic Energy',
      analogy: 'The baseline amount of fuel sitting in the gas tank before you start the car for the day.'
    },
    {
      term: 'Reference Range',
      technical: 'The set of values that 95% of a healthy population falls within for a specific laboratory test.',
      simple: 'The expected bracket where most healthy people usually fall. Being slightly outside does not automatically mean an illness.',
      category: 'Lab Methodology',
      analogy: 'The normal speed limit bracket on a smooth highway.'
    }
  ],
  doctorQuestions: [
    {
      id: 'q1',
      question: 'What does this fasting glucose of 108 mg/dL mean in the context of my overall health?',
      category: 'general',
      context: 'Helpful for understanding if this is a temporary spike or something to monitor.'
    },
    {
      id: 'q2',
      question: 'Should I repeat this test or schedule an HbA1c test to review my longer-term average?',
      category: 'followup',
      context: 'An HbA1c test reflects your average blood sugar over the past 2–3 months.'
    },
    {
      id: 'q3',
      question: 'Could routine lifestyle factors, stress, or my meal the night before have affected these results?',
      category: 'lifestyle',
      context: 'Fasting duration and meal composition frequently nudge early morning lab numbers.'
    },
    {
      id: 'q4',
      question: 'Are there any dietary changes or physical activity habits you suggest based on these findings?',
      category: 'lifestyle',
      context: 'Gentle preventative measures often help maintain normal metabolic balance.'
    },
    {
      id: 'q5',
      question: 'When would you like to do my next routine screening check?',
      category: 'monitoring',
      context: 'Clarifies when your doctor recommends scheduling follow-up blood work.'
    }
  ]
};

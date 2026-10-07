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
  _reportContext?: ReportData
): Promise<string> {
  // Short simulated response delay (600ms) for realistic feel and clear loading state
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = userQuery.toLowerCase().trim();

  // 1. Emergency detection
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

  // 2. High Fever / Fever ("I am getting high fever. What can I do?")
  if (
    lower.includes('fever') ||
    lower.includes('temperature') ||
    lower.includes('chills') ||
    lower.includes('pyrexia')
  ) {
    return `🌡️ High Fever Guidance & Safe Next Steps:

A fever is your body's natural defense mechanism fighting off an infection (such as a viral or bacterial illness). Here are basic, safe steps you can take:

1. Hydration & Fluid Intake:
• Drink plenty of fluids (water, oral electrolytes, clear broth, or herbal tea) to avoid dehydration caused by increased body heat and sweating.

2. Rest & Comfort Measures:
• Get plenty of bed rest to allow your immune system to recover.
• Wear lightweight, breathable cotton clothing and keep your room at a comfortable temperature.
• You can apply a lukewarm, damp cloth to your forehead or the back of your neck for comfort (avoid ice-cold water or cold baths, as shivering can raise your internal body temperature).

3. Over-the-Counter Options:
• Common over-the-counter fever reducers (such as acetaminophen/paracetamol or ibuprofen) are frequently used by adults to ease discomfort. Please follow package directions carefully or consult a doctor or pharmacist for appropriate dosing.

🚨 When to Seek Prompt Medical Attention:
• Your temperature reaches 103°F (39.4°C) or higher, or does not come down after 48–72 hours.
• You experience warning signs such as a stiff neck, severe headache, confusion, shortness of breath, or persistent vomiting.
• For infants or very young children, contact a pediatrician promptly.`;
  }

  // 3. Headache / Migraine
  if (
    lower.includes('headache') ||
    lower.includes('migraine') ||
    lower.includes('head ache') ||
    lower.includes('head hurts') ||
    lower.includes('head pain')
  ) {
    return `🤕 Headache Information & Relief Guidance:

Headaches are very common and most often triggered by tension, dehydration, eye strain, lack of sleep, or missed meals.

1. Helpful Self-Care Steps:
• Rest in a quiet, dimly lit, and peaceful room with your eyes closed.
• Drink a large glass of water—mild dehydration is a very frequent cause of head throbbing.
• Place a cool gel pack or a warm washcloth across your forehead or back of your neck.
• Take deep breaths and gently relax your neck and shoulder muscles.

2. Common Triggers to Monitor:
• Check if prolonged screen time, caffeine withdrawal, stress, or lack of sleep triggered it.

🚨 Warning Signs to Seek Immediate Medical Attention:
• A sudden, explosive, severe pain ("worst headache of your life" or thunderclap onset).
• Headache accompanied by high fever, stiff neck, confusion, numbness, or visual disturbances.
• Headaches that steadily worsen or occur following a head injury.`;
  }

  // 4. Hemoglobin / Hgb / Red blood cells
  if (
    lower.includes('hemoglobin') ||
    lower.includes('hgb') ||
    lower.includes('hb') ||
    lower.includes('red blood cell') ||
    lower.includes('anemia')
  ) {
    return `🩸 What is Hemoglobin?

• Simple Explanation: Hemoglobin is an iron-rich protein packed inside your red blood cells. Think of it as a fleet of microscopic delivery vehicles carrying fresh oxygen from your lungs to your muscles, brain, and all vital organs.
• Standard Range: Typically 13.8–17.2 g/dL for adult men and 12.1–15.1 g/dL for adult women.
• In This Report: The hemoglobin level is 13.8 g/dL, which falls neatly within the standard reference range.
• Why It Matters:
  - Low hemoglobin (anemia) can make you feel fatigued, weak, or short of breath.
  - High hemoglobin can occur from dehydration or living at high altitudes.

Discuss your overall complete blood count with your doctor for comprehensive interpretation.`;
  }

  // 5. Blood Sugar / Glucose / Fasting Glucose / Diabetes
  if (
    lower.includes('glucose') ||
    lower.includes('blood sugar') ||
    lower.includes('sugar') ||
    lower.includes('fasting glucose') ||
    lower.includes('108') ||
    lower.includes('diabetes')
  ) {
    return `🍬 Understanding Blood Sugar (Glucose):

• What It Is: Glucose is the primary sugar in your bloodstream. It serves as the immediate fuel powering your body cells, brain, and muscles.
• Standard Reference Range: A normal fasting blood glucose (tested after not eating for 8–12 hours) is between 70 and 99 mg/dL.
• In This Report: The fasting glucose result is 108 mg/dL, which is slightly above the standard fasting reference cutoff (100–125 mg/dL is often classified as impaired fasting glucose or pre-diabetes range).
• What Influences It: Prior evening meals, carbohydrate intake, stress, sleep, or individual metabolism can cause temporary fluctuations.
• Recommended Next Step: Ask your doctor if they recommend testing an HbA1c (a 3-month blood sugar average) or repeating the fasting test.`;
  }

  // 6. Explain Report / Report Summary / Explain This Result
  if (
    lower.includes('explain my report') ||
    lower.includes('explain the report') ||
    lower.includes('explain this report') ||
    lower.includes('explain report') ||
    lower.includes('explain this result') ||
    lower.includes('summary') ||
    lower.includes('review my report') ||
    lower.includes('what does my report say')
  ) {
    return `📋 Simple Breakdown of Your Lab Report:

Here is an easy-to-read overview of your Complete Blood Count (CBC) and Metabolic Panel:

✅ What Looks Healthy (Within Range):
• Hemoglobin (13.8 g/dL): Healthy red blood cells delivering oxygen efficiently.
• White Blood Cells (7,200 cells/µL): Your immune system defense patrol is balanced with no signs of acute infection.
• Platelets (245,000 /µL): Clotting cells are right in the target zone to protect against bleeding.

⚠️ What Deserves Brief Attention:
• Fasting Blood Glucose (108 mg/dL): Slightly above the standard 99 mg/dL cutoff. Not an emergency, but an ideal talking point with your doctor to review your diet and check your 3-month HbA1c.

💡 Overall Takeaway: Most vital blood indicators are in excellent shape! The slightly elevated fasting glucose is a great starting point for a routine conversation with your doctor.`;
  }

  // 7. Questions to ask doctor / Doctor questions
  if (
    lower.includes('doctor') ||
    lower.includes('ask') ||
    lower.includes('question') ||
    lower.includes('appointment')
  ) {
    return `🩺 Great Questions to Bring to Your Next Appointment:

1. "My fasting glucose was slightly elevated at 108 mg/dL. Would you suggest an HbA1c test to check my 3-month average?"
2. "Are there simple dietary or lifestyle adjustments (like increasing fiber or walking) you recommend for me?"
3. "Are my other complete blood count numbers (hemoglobin, WBC, platelets) completely stable?"
4. "When would you like to schedule my next routine check-up or follow-up blood test?"

Tip: You can also use the 'Questions' tab in the left sidebar to generate and copy additional tailored questions!`;
  }

  // 8. White Blood Cells (WBC)
  if (
    lower.includes('wbc') ||
    lower.includes('white blood') ||
    lower.includes('leukocyte')
  ) {
    return `🛡️ What Are White Blood Cells (WBC)?

• Simple Analogy: White blood cells are your body’s personal security and immune defense team. They patrol your bloodstream to fend off bacteria, viruses, and foreign invaders.
• In This Report: 7,200 cells/µL (Standard reference range is 4,000 to 11,000 cells/µL).
• Meaning: Your count is in the normal reference bracket, indicating no active acute infection or immune suppression in this sample.`;
  }

  // 9. Platelets
  if (
    lower.includes('platelet') ||
    lower.includes('thrombocyte')
  ) {
    return `🩹 What Are Platelets?

• Simple Analogy: Platelets are like tiny self-sealing patches. When you get a cut or scrape, platelets rush to stick together and create a clot to stop bleeding.
• In This Report: 245,000 /µL (Standard reference range is 150,000 to 450,000 /µL).
• Meaning: Your platelet count is safely in the ideal zone, showing proper blood clotting ability.`;
  }

  // 10. Cholesterol / Lipid Panel
  if (
    lower.includes('cholesterol') ||
    lower.includes('lipid') ||
    lower.includes('ldl') ||
    lower.includes('hdl') ||
    lower.includes('triglyceride')
  ) {
    return `🫀 Understanding Cholesterol & Lipids:

• Total Cholesterol: The overall amount of fatty compounds in your blood. Ideal is generally below 200 mg/dL.
• LDL ("Bad" Cholesterol): Carries cholesterol to tissues; if elevated (> 100 mg/dL), it can gradually form plaque in arteries.
• HDL ("Good" Cholesterol): Acts like a clean-up truck, removing excess cholesterol and returning it to the liver for clearance. Higher (> 40–50 mg/dL) is protective.
• Lifestyle Tips: Soluble fiber (oats, beans), healthy fats (olive oil, nuts), and regular brisk walking support healthy lipid profiles.`;
  }

  // 11. Blood Pressure / BP
  if (
    lower.includes('blood pressure') ||
    lower.includes('hypertension') ||
    lower.includes('bp ') ||
    lower.includes('bp?')
  ) {
    return `💓 Understanding Blood Pressure:

• Systolic (Top Number): The pressure in blood vessels when the heart contracts (Ideal: under 120 mm Hg).
• Diastolic (Bottom Number): The pressure when the heart rests between beats (Ideal: under 80 mm Hg).
• Healthy Tips: Staying hydrated, reducing excess sodium, managing stress, and regular light cardio exercise help keep blood pressure in a healthy range.`;
  }

  // 12. Stomach pain / Digestion / Nausea
  if (
    lower.includes('stomach') ||
    lower.includes('nausea') ||
    lower.includes('vomit') ||
    lower.includes('tummy') ||
    lower.includes('belly') ||
    lower.includes('digestion') ||
    lower.includes('acid') ||
    lower.includes('cramp')
  ) {
    return `🥣 Digestive & Stomach Discomfort Information:

Stomach upset is frequently caused by indigestion, food sensitivity, mild viral gastroenteritis, or stress.

1. Safe Self-Care:
• Sip fluids slowly (water, clear broths, oral electrolytes, or ginger/peppermint tea) to stay hydrated.
• Stick to bland, easily digestible foods (such as rice, toast, oatmeal, or bananas) once nausea subsides.
• Avoid heavy, spicy, or fried foods.

🚨 When to Seek Medical Attention:
• Severe, sudden abdominal pain.
• High fever, inability to keep liquids down for 24 hours, or blood in stool or vomit.`;
  }

  // 13. Cough / Cold / Sore Throat
  if (
    lower.includes('cough') ||
    lower.includes('cold') ||
    lower.includes('sore throat') ||
    lower.includes('flu') ||
    lower.includes('sneez') ||
    lower.includes('congestion')
  ) {
    return `🍵 Cold, Cough & Sore Throat Care:

Most common upper respiratory symptoms are caused by seasonal viruses that resolve with supportive care:

• Hydration: Drink plenty of warm liquids (warm water, herbal teas with honey, or broths).
• Throat Relief: Gargle with warm salt water (1/2 teaspoon of salt in warm water) several times a day.
• Air Moisture: Use a cool-mist humidifier or breathe in steam from a warm shower to relieve nasal irritation.
• Rest: Give your body time to sleep and recover.

🚨 Seek Medical Attention If:
• You experience shortness of breath, wheezing, high fever lasting more than 3 days, or severe difficulty swallowing fluids.`;
  }

  // 14. Friendly, Helpful Healthcare General Fallback
  return `💬 MediGuide AI Health Information:

I'm here to help explain your lab results, health symptoms, and medical terminology in clear, everyday language!

Here are common topics you can ask me about:
• "I am getting high fever, what can I do?"
• "I have a headache, what could be the cause?"
• "Explain my report simply"
• "What does hemoglobin mean?"
• "Why was my fasting glucose 108?"
• "What questions should I ask my doctor?"

Feel free to ask any specific question about your health or report!`;
}

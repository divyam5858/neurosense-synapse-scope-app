import { User, Patient, Doctor, Assessment, RiskScore, HealthEvent, ClinicalNote, Medication } from "@/types";

// Demo users
export const demoUsers: (Patient | Doctor)[] = [
  {
    id: "patient-1",
    email: "john@example.com",
    role: "patient",
    firstName: "John",
    lastName: "Smith",
    phone: "+1-555-0101",
    age: 68,
    gender: "Male",
    bloodType: "A+",
  },
  {
    id: "patient-2",
    email: "jane@example.com",
    role: "patient",
    firstName: "Jane",
    lastName: "Doe",
    phone: "+1-555-0102",
    age: 72,
    gender: "Female",
    bloodType: "O+",
  },
  {
    id: "patient-3",
    email: "robert@example.com",
    role: "patient",
    firstName: "Robert",
    lastName: "Johnson",
    phone: "+1-555-0103",
    age: 65,
    gender: "Male",
    bloodType: "B+",
  },
  {
    id: "doctor-1",
    email: "alice@hospital.com",
    role: "doctor",
    firstName: "Dr. Alice",
    lastName: "Williams",
    phone: "+1-555-0201",
    specialty: "Neurology",
  } as Doctor,
  {
    id: "doctor-2",
    email: "bob@hospital.com",
    role: "doctor",
    firstName: "Dr. Bob",
    lastName: "Martinez",
    phone: "+1-555-0202",
    specialty: "Geriatric Medicine",
  } as Doctor,
];

// Mock assessments
export const mockAssessments: Assessment[] = [
  {
    id: "assessment-1",
    patientId: "patient-1",
    date: "2024-01-15",
    status: "completed",
    riskScores: [
      {
        disease: "Alzheimer's",
        score: 72,
        confidence: 85,
        level: "high",
        lastUpdated: "2024-01-15",
      },
      {
        disease: "Parkinson's",
        score: 35,
        confidence: 78,
        level: "moderate",
        lastUpdated: "2024-01-15",
      },
      {
        disease: "Dementia",
        score: 68,
        confidence: 82,
        level: "high",
        lastUpdated: "2024-01-15",
      },
    ],
    aiInterpretation:
      "The assessment indicates elevated risk for Alzheimer's disease and general dementia. Key contributing factors include family history, age, and reported cognitive symptoms. Immediate medical consultation is recommended.",
    doctorNotes: "Patient showing early signs of memory impairment. Recommend cognitive testing and MRI scan.",
    recommendations: [
      "Schedule comprehensive neurological evaluation",
      "Consider MRI brain scan",
      "Implement cognitive exercises daily",
      "Monitor medication compliance",
      "Follow Mediterranean diet",
    ],
    topRiskFactors: [
      { factor: "Family History of Alzheimer's", impact: 95 },
      { factor: "Age (68 years)", impact: 88 },
      { factor: "Memory Complaints", impact: 82 },
      { factor: "APOE ε4 Carrier", impact: 78 },
      { factor: "Low Physical Activity", impact: 65 },
    ],
  },
  {
    id: "assessment-2",
    patientId: "patient-2",
    date: "2024-01-10",
    status: "completed",
    riskScores: [
      {
        disease: "Alzheimer's",
        score: 45,
        confidence: 80,
        level: "moderate",
        lastUpdated: "2024-01-10",
      },
      {
        disease: "Parkinson's",
        score: 25,
        confidence: 75,
        level: "low",
        lastUpdated: "2024-01-10",
      },
      {
        disease: "Dementia",
        score: 38,
        confidence: 77,
        level: "moderate",
        lastUpdated: "2024-01-10",
      },
    ],
    aiInterpretation:
      "Moderate risk profile with manageable factors. Lifestyle modifications and regular monitoring recommended.",
    recommendations: [
      "Continue regular physical activity",
      "Maintain social engagement",
      "Annual cognitive screening",
      "Heart-healthy diet",
    ],
    topRiskFactors: [
      { factor: "Age (72 years)", impact: 85 },
      { factor: "Hypertension", impact: 62 },
      { factor: "Occasional Memory Lapses", impact: 58 },
      { factor: "Sleep Quality", impact: 45 },
      { factor: "Stress Level", impact: 42 },
    ],
  },
  {
    id: "assessment-3",
    patientId: "patient-3",
    date: "2024-01-20",
    status: "completed",
    riskScores: [
      {
        disease: "Alzheimer's",
        score: 28,
        confidence: 83,
        level: "low",
        lastUpdated: "2024-01-20",
      },
      {
        disease: "Parkinson's",
        score: 52,
        confidence: 79,
        level: "moderate",
        lastUpdated: "2024-01-20",
      },
      {
        disease: "Dementia",
        score: 30,
        confidence: 81,
        level: "low",
        lastUpdated: "2024-01-20",
      },
    ],
    aiInterpretation:
      "Overall low-to-moderate risk profile. Motor symptoms warrant monitoring for Parkinson's progression. Continue preventive care.",
    recommendations: [
      "Physical therapy for mobility",
      "Regular exercise program",
      "Medication review",
      "Stress management techniques",
    ],
    topRiskFactors: [
      { factor: "Tremor Symptoms", impact: 78 },
      { factor: "Family History", impact: 55 },
      { factor: "Age (65 years)", impact: 72 },
      { factor: "Reduced Mobility", impact: 48 },
      { factor: "Medication Interactions", impact: 38 },
    ],
  },
];

// Mock health events
export const mockHealthEvents: HealthEvent[] = [
  {
    id: "event-1",
    patientId: "patient-1",
    date: "2024-01-15",
    type: "assessment",
    title: "Neurological Risk Assessment Completed",
    description: "Comprehensive assessment showing elevated Alzheimer's risk",
    severity: "high",
    disease: "Alzheimer's",
  },
  {
    id: "event-2",
    patientId: "patient-1",
    date: "2024-01-10",
    type: "note",
    title: "Doctor's Note Added",
    description: "Recommended MRI scan and cognitive testing",
    severity: "moderate",
  },
  {
    id: "event-3",
    patientId: "patient-1",
    date: "2023-12-20",
    type: "medication",
    title: "Medication Updated",
    description: "Started Donepezil 5mg daily",
    severity: "low",
  },
  {
    id: "event-4",
    patientId: "patient-1",
    date: "2023-12-01",
    type: "assessment",
    title: "Initial Screening",
    description: "Baseline cognitive assessment completed",
    severity: "moderate",
  },
  {
    id: "event-5",
    patientId: "patient-1",
    date: "2023-11-15",
    type: "follow-up",
    title: "Follow-up Appointment",
    description: "Regular check-up with neurologist",
    severity: "low",
  },
];

// Mock clinical notes
export const mockClinicalNotes: ClinicalNote[] = [
  {
    id: "note-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Alice Williams",
    date: "2024-01-15",
    content:
      "Patient presents with increasing memory difficulties over the past 6 months. Family reports difficulty with word-finding and occasional confusion with familiar tasks. Physical exam unremarkable. Recommend comprehensive neuropsychological testing and brain MRI. Will discuss treatment options at next visit.",
    noteType: "assessment",
  },
  {
    id: "note-2",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Alice Williams",
    date: "2024-01-10",
    content:
      "Reviewed latest assessment results with patient and family. Discussed lifestyle modifications including increased physical activity, Mediterranean diet, and cognitive exercises. Patient is motivated and understands the importance of early intervention.",
    noteType: "follow-up",
  },
  {
    id: "note-3",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Alice Williams",
    date: "2023-12-20",
    content:
      "Initiated pharmacological intervention with Donepezil 5mg daily. Explained potential side effects and importance of medication compliance. Will monitor response over next 3 months. Family support system appears strong.",
    noteType: "intervention",
  },
];

// Mock medications
export const mockMedications: Medication[] = [
  {
    id: "med-1",
    name: "Donepezil",
    dosage: "5mg",
    frequency: "Once daily",
    startDate: "2023-12-20",
    status: "active",
    prescribedBy: "Dr. Alice Williams",
  },
  {
    id: "med-2",
    name: "Memantine",
    dosage: "10mg",
    frequency: "Twice daily",
    startDate: "2024-01-05",
    status: "active",
    prescribedBy: "Dr. Alice Williams",
  },
  {
    id: "med-3",
    name: "Vitamin D",
    dosage: "1000 IU",
    frequency: "Once daily",
    startDate: "2023-11-01",
    status: "active",
    prescribedBy: "Dr. Alice Williams",
  },
  {
    id: "med-4",
    name: "Omega-3 Fatty Acids",
    dosage: "1200mg",
    frequency: "Once daily",
    startDate: "2023-11-01",
    status: "active",
  },
];

// Get user by credentials
export const getUserByCredentials = (email: string, password: string): Patient | Doctor | null => {
  // For demo purposes, accept any user with password "Demo123!"
  if (password === "Demo123!") {
    return demoUsers.find((u) => u.email === email) || null;
  }
  return null;
};

// Get assessments by patient ID
export const getAssessmentsByPatientId = (patientId: string): Assessment[] => {
  return mockAssessments.filter((a) => a.patientId === patientId);
};

// Get health events by patient ID
export const getHealthEventsByPatientId = (patientId: string): HealthEvent[] => {
  return mockHealthEvents.filter((e) => e.patientId === patientId);
};

// Get clinical notes by patient ID
export const getClinicalNotesByPatientId = (patientId: string): ClinicalNote[] => {
  return mockClinicalNotes.filter((n) => n.patientId === patientId);
};

// Get medications by patient ID
export const getMedicationsByPatientId = (patientId: string): Medication[] => {
  return mockMedications.filter((m) => m.id.includes("med"));
};

// Get all patients (for doctors)
export const getAllPatients = (): Patient[] => {
  return demoUsers.filter((u) => u.role === "patient") as Patient[];
};

// Get patient by ID
export const getPatientById = (patientId: string): Patient | null => {
  const patient = demoUsers.find((u) => u.id === patientId && u.role === "patient");
  return (patient as Patient) || null;
};

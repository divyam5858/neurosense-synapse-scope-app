export type UserRole = "patient" | "doctor";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  bloodType?: string;
}

export interface Patient extends User {
  role: "patient";
  doctorId?: string;
}

export interface Doctor extends User {
  role: "doctor";
  specialty?: string;
  patients?: string[];
}

export type RiskLevel = "high" | "moderate" | "low";

export interface RiskScore {
  disease: "Alzheimer's" | "Parkinson's" | "Dementia";
  score: number;
  confidence: number;
  level: RiskLevel;
  lastUpdated: string;
}

export interface Assessment {
  id: string;
  patientId: string;
  date: string;
  status: "completed" | "pending" | "in-progress";
  riskScores: RiskScore[];
  aiInterpretation?: string;
  doctorNotes?: string;
  recommendations?: string[];
  topRiskFactors?: { factor: string; impact: number }[];
}

export interface AssessmentFormData {
  // Page 1: Demographics
  age: number;
  gender: string;
  weight: number;
  height: number;
  education: string;
  occupation: string;
  languagePreference: string;
  
  // Page 2: Medical & Family History
  familyHistory: string[];
  medicalConditions: string[];
  medications: string[];
  allergies: string;
  
  // Page 3: Lifestyle Factors
  physicalActivity: string;
  sleepQuality: string;
  alcoholConsumption: number;
  smokingStatus: string;
  dietType: string;
  coffeeConsumption: string;
  socialEngagement: string;
  
  // Page 4: Cognitive & Neurological Symptoms
  memoryComplaints: string;
  speechIssues: string;
  neurologicalSymptoms: string[];
  moodChanges: string;
}

export interface HealthEvent {
  id: string;
  patientId: string;
  date: string;
  type: "assessment" | "diagnosis" | "medication" | "note" | "follow-up";
  title: string;
  description: string;
  severity?: RiskLevel;
  disease?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  content: string;
  noteType: "assessment" | "follow-up" | "intervention" | "general";
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: "active" | "stopped" | "completed";
  prescribedBy?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

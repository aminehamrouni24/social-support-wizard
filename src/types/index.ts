export interface PersonalInfo {
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  email: string;
}

export interface FamilyFinancialInfo {
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | '';
  dependents: number;
  employmentStatus: 'employed' | 'unemployed' | 'self-employed' | 'retired' | 'student' | '';
  monthlyIncome: number;
  housingStatus: 'owned' | 'rented' | 'government' | 'other' | '';
}

export interface SituationInfo {
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface AIHistoryItem {
  id: string;
  field: keyof SituationInfo;
  prompt: string;
  generatedText: string;
  timestamp: string;
}

export interface WizardState {
  step: number;
  personalInfo: PersonalInfo;
  familyFinancialInfo: FamilyFinancialInfo;
  situationInfo: SituationInfo;
  aiHistory: AIHistoryItem[];
  themeMode: 'light' | 'dark';
  language: 'en' | 'ar';
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}

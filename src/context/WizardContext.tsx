import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { WizardState, PersonalInfo, FamilyFinancialInfo, SituationInfo, AIHistoryItem } from '../types';
import i18n from '../i18n';

interface WizardContextType {
  state: WizardState;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateFamilyFinancialInfo: (data: Partial<FamilyFinancialInfo>) => void;
  updateSituationInfo: (data: Partial<SituationInfo>) => void;
  setStep: (step: number) => void;
  toggleTheme: () => void;
  changeLanguage: (lang: 'en' | 'ar') => void;
  addAIHistory: (item: Omit<AIHistoryItem, 'id' | 'timestamp'>) => void;
  clearAIHistory: () => void;
  resetWizard: () => void;
  autosaveStatus: 'idle' | 'saving' | 'saved';
  draftRecovered: boolean;
  setDraftRecovered: (val: boolean) => void;
  isDirty: boolean;
  setIsDirty: (val: boolean) => void;
}

const SCHEMA_VERSION = 'v1';
const STORAGE_KEY = `social_support_portal_draft_${SCHEMA_VERSION}`;

const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phoneNumber: '',
  email: '',
};

const initialFamilyFinancialInfo: FamilyFinancialInfo = {
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: 0,
  housingStatus: '',
};

const initialSituationInfo: SituationInfo = {
  financialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
};

const defaultState: WizardState = {
  step: 1,
  personalInfo: initialPersonalInfo,
  familyFinancialInfo: initialFamilyFinancialInfo,
  situationInfo: initialSituationInfo,
  aiHistory: [],
  themeMode: 'light',
  language: 'en',
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WizardState>(defaultState);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [draftRecovered, setDraftRecovered] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize state from localstorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedLang = localStorage.getItem('wizardLanguage') as 'en' | 'ar';
      
      if (stored) {
        const parsed = JSON.parse(stored) as WizardState;
        // Make sure language aligns with i18n
        if (storedLang) {
          parsed.language = storedLang;
          i18n.changeLanguage(storedLang);
        }
        setState(parsed);
        // Show draft recovery toast if there is actual input data
        if (
          parsed.personalInfo?.fullName ||
          parsed.familyFinancialInfo?.monthlyIncome ||
          parsed.situationInfo?.reasonForApplying
        ) {
          setDraftRecovered(true);
        }
      } else if (storedLang) {
        setState((prev) => ({ ...prev, language: storedLang }));
        i18n.changeLanguage(storedLang);
      }
    } catch (e) {
      console.error('Error recovering draft state:', e);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Autosave and persist state
  useEffect(() => {
    if (!initialized) return;

    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem('wizardLanguage', state.language);
        setAutosaveStatus('saved');
        setTimeout(() => setAutosaveStatus('idle'), 1500);
      } catch (e) {
        console.error('Autosave failed:', e);
        setAutosaveStatus('idle');
      }
    }, 800); // Debounce write to storage

    return () => clearTimeout(timer);
  }, [state, initialized]);

  // Alert user before closing tab if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = i18n.t('app.unsavedChanges');
        return i18n.t('app.unsavedChanges');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const updatePersonalInfo = (data: Partial<PersonalInfo>) => {
    setIsDirty(true);
    setState((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }));
  };

  const updateFamilyFinancialInfo = (data: Partial<FamilyFinancialInfo>) => {
    setIsDirty(true);
    setState((prev) => ({
      ...prev,
      familyFinancialInfo: { ...prev.familyFinancialInfo, ...data },
    }));
  };

  const updateSituationInfo = (data: Partial<SituationInfo>) => {
    setIsDirty(true);
    setState((prev) => ({
      ...prev,
      situationInfo: { ...prev.situationInfo, ...data },
    }));
  };

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const toggleTheme = () => {
    setState((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'light' ? 'dark' : 'light',
    }));
  };

  const changeLanguage = (lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
    setState((prev) => ({ ...prev, language: lang }));
  };

  const addAIHistory = (item: Omit<AIHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: AIHistoryItem = {
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(state.language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setState((prev) => ({
      ...prev,
      aiHistory: [newItem, ...prev.aiHistory],
    }));
  };

  const clearAIHistory = () => {
    setState((prev) => ({ ...prev, aiHistory: [] }));
  };

  const resetWizard = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsDirty(false);
    setDraftRecovered(false);
    setState({
      ...defaultState,
      themeMode: state.themeMode,
      language: state.language,
    });
  };

  return (
    <WizardContext.Provider
      value={{
        state,
        updatePersonalInfo,
        updateFamilyFinancialInfo,
        updateSituationInfo,
        setStep,
        toggleTheme,
        changeLanguage,
        addAIHistory,
        clearAIHistory,
        resetWizard,
        autosaveStatus,
        draftRecovered,
        setDraftRecovered,
        isDirty,
        setIsDirty,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

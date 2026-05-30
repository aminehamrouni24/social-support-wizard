import { useState, useRef, useCallback } from 'react';
import { generateProfessionalStatement } from '../services/aiService';
import type { AIGenerationOptions } from '../services/aiService';
import { useWizard } from '../context/WizardContext';

export interface UseAIGenerationResult {
  loading: boolean;
  error: string | null;
  generatedText: string | null;
  generateText: (field: AIGenerationOptions['field'], prompt?: string) => Promise<string | null>;
  cancelGeneration: () => void;
  resetGeneration: () => void;
  retry: () => Promise<string | null>;
}

export const useAIGeneration = (): UseAIGenerationResult => {
  const { state, addAIHistory } = useWizard();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastParamsRef = useRef<{ field: AIGenerationOptions['field']; prompt?: string } | null>(null);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  }, []);

  const resetGeneration = useCallback(() => {
    setError(null);
    setGeneratedText(null);
    setLoading(false);
  }, []);

  const generateText = useCallback(
    async (field: AIGenerationOptions['field'], prompt?: string): Promise<string | null> => {
      cancelGeneration(); // Cancel any ongoing generation first

      const controller = new AbortController();
      abortControllerRef.current = controller;
      lastParamsRef.current = { field, prompt };

      setLoading(true);
      setError(null);

      try {
        const text = await generateProfessionalStatement({
          field,
          prompt,
          language: state.language,
          contextData: {
            fullName: state.personalInfo.fullName,
            monthlyIncome: state.familyFinancialInfo.monthlyIncome,
            dependents: state.familyFinancialInfo.dependents,
            employmentStatus: state.familyFinancialInfo.employmentStatus,
          },
          signal: controller.signal,
        });

        setGeneratedText(text);
        setLoading(false);

        // Add this item to global AI History
        addAIHistory({
          field,
          prompt: prompt || 'Auto generated prompt',
          generatedText: text,
        });

        return text;
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          return null; // Silent return if canceled
        }
        const errMsg = err.message || 'Error occurred';
        setError(errMsg);
        setLoading(false);
        return null;
      }
    },
    [state.language, state.personalInfo, state.familyFinancialInfo, addAIHistory, cancelGeneration]
  );

  const retry = useCallback(async (): Promise<string | null> => {
    if (lastParamsRef.current) {
      return generateText(lastParamsRef.current.field, lastParamsRef.current.prompt);
    }
    return null;
  }, [generateText]);

  return {
    loading,
    error,
    generatedText,
    generateText,
    cancelGeneration,
    resetGeneration,
    retry,
  };
};

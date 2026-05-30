import { useEffect, useRef } from 'react';

export const useFormAnalytics = (stepName: string) => {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    console.log(`[Analytics] Started tracking step: ${stepName}`);

    return () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      console.log(`[Analytics] Left step: ${stepName}. Time spent: ${timeSpent} seconds.`);
    };
  }, [stepName]);

  const logFieldFocus = (fieldName: string) => {
    console.log(`[Analytics] Field focused: "${fieldName}" inside ${stepName}`);
  };

  const logFieldInteraction = (fieldName: string, length?: number) => {
    console.log(`[Analytics] Field interaction: "${fieldName}" in ${stepName} ${length !== undefined ? `(length: ${length})` : ''}`);
  };

  return {
    logFieldFocus,
    logFieldInteraction,
  };
};

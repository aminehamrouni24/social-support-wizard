import React, { Suspense, lazy } from 'react';
import { useWizard } from '../context/WizardContext';
import WizardLayout from '../components/layout/WizardLayout';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load step components
const PersonalInfoStep = lazy(() => import('../steps/PersonalInfoStep'));
const FamilyFinancialStep = lazy(() => import('../steps/FamilyFinancialStep'));
const SituationStep = lazy(() => import('../steps/SituationStep'));
const ReviewStep = lazy(() => import('../steps/ReviewStep'));

const AppRoutes: React.FC = () => {
  const { state, setStep } = useWizard();

  const handleNextStep = () => {
    setStep(state.step + 1);
  };

  const handleBackStep = () => {
    if (state.step > 1) {
      setStep(state.step - 1);
    }
  };

  const renderActiveStep = () => {
    switch (state.step) {
      case 1:
        return <PersonalInfoStep onNext={handleNextStep} />;
      case 2:
        return <FamilyFinancialStep onNext={handleNextStep} onBack={handleBackStep} />;
      case 3:
        return <SituationStep onNext={handleNextStep} onBack={handleBackStep} />;
      case 4:
        return <ReviewStep onBack={handleBackStep} />;
      default:
        return <PersonalInfoStep onNext={handleNextStep} />;
    }
  };

  return (
    <ErrorBoundary>
      <WizardLayout>
        <Suspense fallback={<LoadingSkeleton />}>
          {renderActiveStep()}
        </Suspense>
      </WizardLayout>
    </ErrorBoundary>
  );
};

export default AppRoutes;

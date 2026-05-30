// src/components/common/Stepper.tsx
import React from 'react';
import { Stepper, Step, StepLabel, Box, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWizard } from '../../context/WizardContext';
import { useTranslation } from 'react-i18next';
import { Check, Person, AccountBalanceWallet, Description } from '@mui/icons-material';

const steps = ['steps.personal', 'steps.financial', 'steps.circumstances'];

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 24,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
    transition: 'background-color 0.4s ease',
  },
}));

const CustomStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 4px 10px 0 ${theme.palette.primary.main}40`,
    transform: 'scale(1.1)',
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary.main,
  }),
}));

function CustomStepIcon(props: any) {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Person />,
    2: <AccountBalanceWallet />,
    3: <Description />,
  };

  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <Check /> : icons[String(icon)]}
    </CustomStepIconRoot>
  );
}

const WizardStepper: React.FC = () => {
  const { state } = useWizard();
  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper 
        activeStep={state.step - 1} 
        alternativeLabel 
        connector={<CustomConnector />}
      >
        {steps.map((labelKey, index) => {
          const isActive = state.step === index + 1;
          const isCompleted = state.step > index + 1;
          return (
            <Step key={labelKey} completed={isCompleted}>
              <StepLabel icon={<CustomStepIcon active={isActive} completed={isCompleted} icon={index + 1} />}>
                <Box 
                  sx={{ 
                    fontWeight: isActive || isCompleted ? 'bold' : 'normal', 
                    color: isActive || isCompleted ? 'primary.main' : 'text.secondary',
                    mt: 1,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {t(labelKey)}
                </Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default WizardStepper;

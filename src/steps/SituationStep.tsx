import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { ArrowForward, ArrowBack, AutoAwesome } from '@mui/icons-material';
import { useWizard } from '../context/WizardContext';
import { situationSchema } from '../constants/schemas';
import { useFormAnalytics } from '../hooks/useFormAnalytics';
import type { SituationInfo } from '../types';
import AIModal from '../components/ai/AIModal';

interface SituationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const SituationStep: React.FC<SituationStepProps> = ({ onNext, onBack }) => {
  const { t, i18n } = useTranslation();
  const { state, updateSituationInfo } = useWizard();
  const { logFieldFocus, logFieldInteraction } = useFormAnalytics('Situation');

  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [activeAIField, setActiveAIField] = useState<'financialSituation' | 'employmentCircumstances' | 'reasonForApplying' | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
    watch,
  } = useForm<SituationInfo>({
    resolver: zodResolver(situationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      financialSituation: state.situationInfo.financialSituation || '',
      employmentCircumstances: state.situationInfo.employmentCircumstances || '',
      reasonForApplying: state.situationInfo.reasonForApplying || '',
    },
  });

  const isRtl = i18n.language === 'ar';

  // Watch fields and autosave — stabilize with JSON.stringify to avoid infinite loop
  const watchedFields = watch();
  const watchedSerialized = JSON.stringify(watchedFields);
  useEffect(() => {
    const current = JSON.stringify(state.situationInfo || {});
    if (current !== watchedSerialized) {
      updateSituationInfo(watchedFields);
    }
  }, [watchedSerialized]);

  const onSubmit = () => {
    onNext();
  };

  const handleOpenAI = (field: 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying') => {
    setActiveAIField(field);
    setAiModalOpen(true);
  };

  const handleAcceptAI = (generatedText: string) => {
    if (activeAIField) {
      setValue(activeAIField, generatedText, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      trigger(activeAIField);
      logFieldInteraction(activeAIField, generatedText.length);
    }
  };

  const renderTextareaField = (
    fieldName: keyof SituationInfo,
    labelKey: string,
    placeholderKey: string
  ) => {
    const value = watchedFields[fieldName] || '';
    const error = errors[fieldName];

    return (
      <Grid size={12} key={fieldName}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t(labelKey)} <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AutoAwesome />}
            onClick={() => handleOpenAI(fieldName)}
            sx={{ borderRadius: 4, textTransform: 'none' }}
          >
            {t('ai.helpMeWrite')}
          </Button>
        </Box>

        <Controller
          name={fieldName}
          control={control}
          render={({ field: controllerField }) => (
            <TextField
              {...(controllerField as any)}
              placeholder={t(placeholderKey)}
              fullWidth
              multiline
              rows={4}
              error={!!error}
              helperText={error ? t(error.message as string) : ''}
              onFocus={() => logFieldFocus(fieldName)}
              onChange={(e) => {
                controllerField.onChange(e);
                logFieldInteraction(fieldName, e.target.value.length);
              }}
              slotProps={{
                htmlInput: {
                  maxLength: 2000,
                  'aria-required': 'true',
                }
              }}
            />
          )}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Typography variant="caption" color={value.length > 2000 ? 'error' : 'text.secondary'}>
            {t('situation.charCounter', { count: value.length, max: 2000 })}
          </Typography>
        </Box>
      </Grid>
    );
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          {t('steps.circumstances')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('app.subtitle')}
        </Typography>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }} role="alert">
            {t('validation.minChar').includes('character') ? 'Please ensure all paragraphs are at least 15 characters long.' : 'يرجى التأكد من أن جميع الحقول لا تقل عن 15 حرفاً.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {renderTextareaField(
              'financialSituation',
              'situation.financialSituation',
              'situation.financialSituationPlaceholder'
            )}
            {renderTextareaField(
              'employmentCircumstances',
              'situation.employmentCircumstances',
              'situation.employmentCircumstancesPlaceholder'
            )}
            {renderTextareaField(
              'reasonForApplying',
              'situation.reasonForApplying',
              'situation.reasonForApplyingPlaceholder'
            )}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="large"
              onClick={onBack}
              startIcon={isRtl ? <ArrowForward /> : <ArrowBack />}
              endIcon={isRtl ? <ArrowBack /> : <ArrowForward />}
              sx={{ px: 4, py: 1.2, fontWeight: 'bold' }}
            >
              {t('buttons.back')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!isValid}
              endIcon={isRtl ? <ArrowBack /> : <ArrowForward />}
              startIcon={isRtl ? <ArrowForward /> : <ArrowBack />}
              sx={{ px: 4, py: 1.2, fontWeight: 'bold' }}
            >
              {t('buttons.next')}
            </Button>
          </Box>
        </form>

        {/* AI Helper Modal */}
        {activeAIField && (
          <AIModal
            open={aiModalOpen}
            onClose={() => setAiModalOpen(false)}
            field={activeAIField}
            onAccept={handleAcceptAI}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SituationStep;

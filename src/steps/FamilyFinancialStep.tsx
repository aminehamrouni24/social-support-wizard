import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { useWizard } from '../context/WizardContext';
import { familyFinancialSchema } from '../constants/schemas';
import { useFormAnalytics } from '../hooks/useFormAnalytics';
import type { FamilyFinancialInfo } from '../types';

interface FamilyFinancialStepProps {
  onNext: () => void;
  onBack: () => void;
}

const FamilyFinancialStep: React.FC<FamilyFinancialStepProps> = ({ onNext, onBack }) => {
  const { t, i18n } = useTranslation();
  const { state, updateFamilyFinancialInfo } = useWizard();
  const { logFieldFocus, logFieldInteraction } = useFormAnalytics('FamilyFinancial');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FamilyFinancialInfo>({
    resolver: zodResolver(familyFinancialSchema) as any,
    mode: 'onChange',
    defaultValues: {
      maritalStatus: state.familyFinancialInfo.maritalStatus || '',
      dependents: state.familyFinancialInfo.dependents || 0,
      employmentStatus: state.familyFinancialInfo.employmentStatus || '',
      monthlyIncome: state.familyFinancialInfo.monthlyIncome || 0,
      housingStatus: state.familyFinancialInfo.housingStatus || '',
    },
  });

  const isRtl = i18n.language === 'ar';

  // Autosave to context in real-time, but avoid infinite loop by checking for actual changes
  const watchedFields = watch();
  useEffect(() => {
    // Compare current context values with the watched form values
    const current = state.familyFinancialInfo || {};
    const isDifferent = JSON.stringify(current) !== JSON.stringify(watchedFields);
    if (isDifferent) {
      updateFamilyFinancialInfo(watchedFields);
    }
  }, [JSON.stringify(watchedFields)]);

  const onSubmit = () => {
    onNext();
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          {t('steps.financial')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('app.subtitle')}
        </Typography>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }} role="alert">
            {t('validation.minChar').includes('character') ? 'Please correct the highlighted validation errors.' : 'يرجى تصحيح الأخطاء المحددة باللون الأحمر.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Marital Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
                    label={t('financial.maritalStatus')}
                    fullWidth
                    required
                    error={!!errors.maritalStatus}
                    helperText={errors.maritalStatus ? t(errors.maritalStatus.message as string) : ''}
                    onFocus={() => logFieldFocus('maritalStatus')}
                  >
                    <MenuItem value="">
                      <em>{t('financial.maritalStatusPlaceholder')}</em>
                    </MenuItem>
                    <MenuItem value="single">{t('financial.single')}</MenuItem>
                    <MenuItem value="married">{t('financial.married')}</MenuItem>
                    <MenuItem value="divorced">{t('financial.divorced')}</MenuItem>
                    <MenuItem value="widowed">{t('financial.widowed')}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Number of Dependents */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="dependents"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label={t('financial.dependents')}
                    placeholder={t('financial.dependentsPlaceholder')}
                    fullWidth
                    required
                    error={!!errors.dependents}
                    helperText={errors.dependents ? t(errors.dependents.message as string) : ''}
                    onFocus={() => logFieldFocus('dependents')}
                    onChange={(e) => {
                      field.onChange(e);
                      logFieldInteraction('dependents', Number(e.target.value));
                    }}
                    slotProps={{
                      htmlInput: {
                        'aria-required': 'true',
                        min: 0,
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Employment Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="employmentStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
                    label={t('financial.employmentStatus')}
                    fullWidth
                    required
                    error={!!errors.employmentStatus}
                    helperText={errors.employmentStatus ? t(errors.employmentStatus.message as string) : ''}
                    onFocus={() => logFieldFocus('employmentStatus')}
                  >
                    <MenuItem value="">
                      <em>{t('financial.employmentStatusPlaceholder')}</em>
                    </MenuItem>
                    <MenuItem value="employed">{t('financial.employed')}</MenuItem>
                    <MenuItem value="unemployed">{t('financial.unemployed')}</MenuItem>
                    <MenuItem value="self-employed">{t('financial.selfEmployed')}</MenuItem>
                    <MenuItem value="retired">{t('financial.retired')}</MenuItem>
                    <MenuItem value="student">{t('financial.student')}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Monthly Income */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="monthlyIncome"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label={t('financial.monthlyIncome')}
                    placeholder={t('financial.monthlyIncomePlaceholder')}
                    fullWidth
                    required
                    error={!!errors.monthlyIncome}
                    helperText={errors.monthlyIncome ? t(errors.monthlyIncome.message as string) : ''}
                    onFocus={() => logFieldFocus('monthlyIncome')}
                    onChange={(e) => {
                      field.onChange(e);
                      logFieldInteraction('monthlyIncome', Number(e.target.value));
                    }}
                    slotProps={{
                      htmlInput: {
                        'aria-required': 'true',
                        min: 0,
                        step: 'any',
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Housing Status */}
            <Grid size={12}>
              <Controller
                name="housingStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
                    label={t('financial.housingStatus')}
                    fullWidth
                    required
                    error={!!errors.housingStatus}
                    helperText={errors.housingStatus ? t(errors.housingStatus.message as string) : ''}
                    onFocus={() => logFieldFocus('housingStatus')}
                  >
                    <MenuItem value="">
                      <em>{t('financial.housingStatusPlaceholder')}</em>
                    </MenuItem>
                    <MenuItem value="owned">{t('financial.owned')}</MenuItem>
                    <MenuItem value="rented">{t('financial.rented')}</MenuItem>
                    <MenuItem value="government">{t('financial.government')}</MenuItem>
                    <MenuItem value="other">{t('financial.other')}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
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
      </CardContent>
    </Card>
  );
};

export default FamilyFinancialStep;

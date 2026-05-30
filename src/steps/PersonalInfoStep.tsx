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
import { personalInfoSchema } from '../constants/schemas';
import { useFormAnalytics } from '../hooks/useFormAnalytics';
import type { PersonalInfo } from '../types';

interface PersonalInfoStepProps {
  onNext: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ onNext }) => {
  const { t, i18n } = useTranslation();
  const { state, updatePersonalInfo } = useWizard();
  const { logFieldFocus, logFieldInteraction } = useFormAnalytics('PersonalInfo');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema) as any,
    mode: 'onChange',
    defaultValues: {
      fullName: state.personalInfo.fullName || '',
      nationalId: state.personalInfo.nationalId || '',
      dateOfBirth: state.personalInfo.dateOfBirth || '',
      gender: state.personalInfo.gender || '',
      address: state.personalInfo.address || '',
      city: state.personalInfo.city || '',
      state: state.personalInfo.state || '',
      country: state.personalInfo.country || '',
      phoneNumber: state.personalInfo.phoneNumber || '',
      email: state.personalInfo.email || '',
    },
  });

  const isRtl = i18n.language === 'ar';

  // Real-time autosave as user types
  const watchedFields = watch();
  useEffect(() => {
    updatePersonalInfo(watchedFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedFields)]);
  const onSubmit = () => {
    onNext();
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          {t('steps.personal')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('app.subtitle')}
        </Typography>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }} role="alert" aria-live="assertive">
            {t('validation.minChar').includes('character') ? 'Please correct the highlighted validation errors.' : 'يرجى تصحيح الأخطاء المحددة باللون الأحمر.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('personal.fullName')}
                    placeholder={t('personal.fullNamePlaceholder')}
                    fullWidth
                    required
                    error={!!errors.fullName}
                    helperText={errors.fullName ? t(errors.fullName.message as string) : ''}
                    onFocus={() => logFieldFocus('fullName')}
                    onChange={(e) => {
                      field.onChange(e);
                      logFieldInteraction('fullName', e.target.value.length);
                    }}
                    slotProps={{
                      htmlInput: {
                        'aria-required': 'true',
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* National ID */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="nationalId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('personal.nationalId')}
                    placeholder={t('personal.nationalIdPlaceholder')}
                    fullWidth
                    required
                    error={!!errors.nationalId}
                    helperText={errors.nationalId ? t(errors.nationalId.message as string) : ''}
                    onFocus={() => logFieldFocus('nationalId')}
                    onChange={(e) => {
                      field.onChange(e);
                      logFieldInteraction('nationalId', e.target.value.length);
                    }}
                    slotProps={{
                      htmlInput: {
                        'aria-required': 'true',
                        maxLength: 10,
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label={t('personal.dateOfBirth')}
                    fullWidth
                    required
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: {
                        'aria-required': 'true',
                      }
                    }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth ? t(errors.dateOfBirth.message as string) : ''}
                    onFocus={() => logFieldFocus('dateOfBirth')}
                  />
                )}
              />
            </Grid>

            {/* Gender */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
                    label={t('personal.gender')}
                    fullWidth
                    required
                    error={!!errors.gender}
                    helperText={errors.gender ? t(errors.gender.message as string) : ''}
                    onFocus={() => logFieldFocus('gender')}
                  >
                    <MenuItem value="">
                      <em>{t('personal.genderPlaceholder')}</em>
                    </MenuItem>
                    <MenuItem value="male">{t('personal.male')}</MenuItem>
                    <MenuItem value="female">{t('personal.female')}</MenuItem>
                    <MenuItem value="other">{t('personal.other')}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Residential Address */}
            <Grid size={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('personal.address')}
                    placeholder={t('personal.addressPlaceholder')}
                    fullWidth
                    required
                    error={!!errors.address}
                    helperText={errors.address ? t(errors.address.message as string) : ''}
                    onFocus={() => logFieldFocus('address')}
                    slotProps={{
                      htmlInput: {
                        'aria-required': 'true',
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* City */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('personal.city')}
                    placeholder={t('personal.cityPlaceholder')}
                    fullWidth
                    required
                    error={!!errors.city}
                    helperText={errors.city ? t(errors.city.message as string) : ''}
                    onFocus={() => logFieldFocus('city')}
                  />
                )}
              />
            </Grid>

            {/* State */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('personal.state')}
                    placeholder={t('personal.statePlaceholder')}
                    fullWidth
                    required
                    error={!!errors.state}
                    helperText={errors.state ? t(errors.state.message as string) : ''}
                    onFocus={() => logFieldFocus('state')}
                  />
                )}
              />
            </Grid>

            {/* Country */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('personal.country')}
                    placeholder={t('personal.countryPlaceholder')}
                    fullWidth
                    required
                    error={!!errors.country}
                    helperText={errors.country ? t(errors.country.message as string) : ''}
                    onFocus={() => logFieldFocus('country')}
                  />
                )}
              />
            </Grid>

            {/* Phone Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('personal.phoneNumber')}
                    placeholder={t('personal.phoneNumberPlaceholder')}
                    fullWidth
                    required
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber ? t(errors.phoneNumber.message as string) : ''}
                    onFocus={() => logFieldFocus('phoneNumber')}
                    slotProps={{
                      htmlInput: {
                        'aria-required': 'true',
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Email Address */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    label={t('personal.email')}
                    placeholder={t('personal.emailPlaceholder')}
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email ? t(errors.email.message as string) : ''}
                    onFocus={() => logFieldFocus('email')}
                    slotProps={{
                      htmlInput: {
                        'aria-required': 'true',
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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

export default PersonalInfoStep;

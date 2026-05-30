import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { ArrowForward, ArrowBack, CheckCircle } from '@mui/icons-material';
import { useWizard } from '../context/WizardContext';
import { submitSocialSupportApplication } from '../services/apiService';
import type { SubmitResponse } from '../types';

interface ReviewStepProps {
  onBack: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const { state, resetWizard, setIsDirty } = useWizard();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isRtl = i18n.language === 'ar';

  const handleSubmitApplication = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await submitSocialSupportApplication(state);
      if (response.success) {
        setResult(response);
        setIsDirty(false); // Form submitted, no longer warning before unloading
      } else {
        setErrorMsg(response.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    resetWizard();
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {t('app.submitting')}
        </Typography>
      </Paper>
    );
  }

  if (result?.success) {
    return (
      <Paper elevation={4} sx={{ p: 6, textAlign: 'center', borderRadius: 3, borderTop: '6px solid green' }}>
        <CheckCircle color="success" sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          {t('app.submitSuccess')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          {t('app.submitSuccessDesc')}
          <span style={{ fontWeight: 'bold', color: '#1976d2', display: 'block', fontSize: '1.25rem', marginTop: '8px' }}>
            {result.applicationId}
          </span>
        </Typography>
        <Button variant="contained" size="large" onClick={handleStartNew} sx={{ px: 4, fontWeight: 'bold' }}>
          {t('app.resetBtn')}
        </Button>
      </Paper>
    );
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          {t('steps.review')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('app.submitConfirm')}
        </Typography>

        {errorMsg && (
          <Alert
            severity="error"
            sx={{ mb: 4 }}
            action={
              <Button color="inherit" size="small" onClick={handleSubmitApplication}>
                {t('app.retryBtn')}
              </Button>
            }
          >
            <strong>{t('app.submitError')}: </strong> {t(errorMsg)}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Section 1: Personal Details */}
          <Grid size={12}>
            <Typography variant="subtitle1" color="secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
              1. {t('steps.personal')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('personal.fullName')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.personalInfo.fullName}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('personal.nationalId')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.personalInfo.nationalId}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('personal.dateOfBirth')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.personalInfo.dateOfBirth}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('personal.gender')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.personalInfo.gender ? t(`personal.${state.personalInfo.gender}`) : ''}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('personal.phoneNumber')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.personalInfo.phoneNumber}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('personal.email')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.personalInfo.email}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">{t('personal.address')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {state.personalInfo.address}, {state.personalInfo.city}, {state.personalInfo.state}, {state.personalInfo.country}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Section 2: Family & Financial Info */}
          <Grid size={12}>
            <Typography variant="subtitle1" color="secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
              2. {t('steps.financial')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('financial.maritalStatus')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.familyFinancialInfo.maritalStatus ? t(`financial.${state.familyFinancialInfo.maritalStatus}`) : ''}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('financial.dependents')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.familyFinancialInfo.dependents}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('financial.employmentStatus')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.familyFinancialInfo.employmentStatus ? t(`financial.${state.familyFinancialInfo.employmentStatus}`) : ''}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('financial.monthlyIncome')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>${state.familyFinancialInfo.monthlyIncome}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">{t('financial.housingStatus')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>{state.familyFinancialInfo.housingStatus ? t(`financial.${state.familyFinancialInfo.housingStatus}`) : ''}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Section 3: Situations */}
          <Grid size={12}>
            <Typography variant="subtitle1" color="secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
              3. {t('steps.circumstances')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t('situation.financialSituation')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line', p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                  {state.situationInfo.financialSituation}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t('situation.employmentCircumstances')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line', p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                  {state.situationInfo.employmentCircumstances}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {t('situation.reasonForApplying')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line', p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                  {state.situationInfo.reasonForApplying}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={onBack}
            startIcon={isRtl ? <ArrowForward /> : <ArrowBack />}
            endIcon={isRtl ? <ArrowBack /> : <ArrowForward />}
            sx={{ px: 4, fontWeight: 'bold' }}
          >
            {t('buttons.back')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmitApplication}
            endIcon={isRtl ? <ArrowBack /> : <ArrowForward />}
            startIcon={isRtl ? <ArrowForward /> : <ArrowBack />}
            sx={{ px: 4, fontWeight: 'bold', bgcolor: 'primary.main' }}
          >
            {t('buttons.submit')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewStep;

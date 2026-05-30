import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { Brightness4, Brightness7, History, CloudDone, Autorenew } from '@mui/icons-material';
import { useWizard } from '../../context/WizardContext';
import WizardStepper from '../common/Stepper';
import AIHistoryPanel from '../ai/AIHistoryPanel';

interface WizardLayoutProps {
  children: ReactNode;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { state, toggleTheme, changeLanguage, autosaveStatus, draftRecovered, setDraftRecovered } =
    useWizard();

  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);

  const isRtl = i18n.language === 'ar';

  // Toggle toast when draft is recovered
  useEffect(() => {
    if (draftRecovered) {
      setToastOpen(true);
    }
  }, [draftRecovered]);

  const handleLanguageToggle = () => {
    const nextLang = state.language === 'en' ? 'ar' : 'en';
    changeLanguage(nextLang);
  };

  const handleToastClose = () => {
    setToastOpen(false);
    setDraftRecovered(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'all 0.3s ease',
        pb: 8,
      }}
    >
      {/* Header bar */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 0,
          borderBottom: '4px solid',
          borderColor: 'primary.main',
          py: 2,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Government Logo / Branding */}
            <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: 'center', sm: isRtl ? 'right' : 'left' } }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {t('app.title')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: '500' }}>
                {t('app.subtitle')}
              </Typography>
            </Grid>

            {/* Header Controls */}
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: { xs: 'center', sm: 'flex-end' },
                alignItems: 'center',
              }}
            >
              {/* Language switcher */}
              <Button
                variant="outlined"
                size="small"
                onClick={handleLanguageToggle}
                sx={{ borderRadius: 2, fontWeight: 'bold' }}
              >
                {state.language === 'en' ? 'العربية (AR)' : 'English (EN)'}
              </Button>

              {/* AI History Button */}
              <Tooltip title={t('ai.viewHistory')}>
                <IconButton onClick={() => setHistoryOpen(true)} color="primary">
                  <History />
                </IconButton>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip title={state.themeMode === 'light' ? t('app.dark') : t('app.light')}>
                <IconButton onClick={toggleTheme} color="primary">
                  {state.themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Main wizard section */}
      <Container maxWidth="md">
        {/* Autosave status indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            mb: 2,
            height: 24,
            opacity: autosaveStatus === 'idle' ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          {autosaveStatus === 'saving' ? (
            <>
              <Autorenew sx={{ mr: 1, fontSize: 16, animation: 'spin 1.5s linear infinite' }} />
              <Typography variant="caption" color="text.secondary">
                {t('app.saving')}
              </Typography>
            </>
          ) : (
            <>
              <CloudDone color="success" sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="caption" color="success.main">
                {t('app.autosave')}
              </Typography>
            </>
          )}
        </Box>

        {/* Professional Step Progress Stepper */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <WizardStepper />
        </Paper>

        {/* Step Component Content */}
        <Box sx={{ mt: 2 }}>{children}</Box>
      </Container>

      {/* AI History Panel drawer component */}
      <AIHistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />

      {/* Draft recovery notifier toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleToastClose} severity="info" sx={{ width: '100%', fontWeight: 'bold' }}>
          {t('app.draftRecovered')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WizardLayout;

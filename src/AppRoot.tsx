import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { WizardProvider, useWizard } from './context/WizardContext';
import AppRoutes from './pages/AppRoutes';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
});
// ***********************
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useWizard();
  const isRtl = state.language === 'ar';

  React.useEffect(() => {
    document.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
  }, [state.language, isRtl]);

  const theme = React.useMemo(() => {
    const isDark = state.themeMode === 'dark';
    return createTheme({
      direction: isRtl ? 'rtl' : 'ltr',
      palette: {
        mode: state.themeMode,
        primary: { main: isDark ? '#64b5f6' : '#1565c0', contrastText: '#ffffff' },
        secondary: { main: isDark ? '#ffd54f' : '#f57f17' },
        background: {
          default: isDark ? '#121212' : '#f4f6f9',
          paper: isDark ? '#1e1e1e' : '#ffffff',
        },
        success: { main: '#2e7d32' },
      },
      typography: {
        fontFamily: isRtl
          ? '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif'
          : '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: { fontWeight: 700, letterSpacing: isRtl ? 0 : '0.02em' },
        h6: { fontWeight: 600, letterSpacing: isRtl ? 0 : '0.01em' },
        button: { textTransform: 'none', fontWeight: 600 },
      },
      shape: { borderRadius: 8 },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              boxShadow: 'none',
              '&:hover': { boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)' },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
              border: isDark ? '1px solid #333333' : '1px solid #e0e0e0',
            },
          },
        },
        MuiSelect: {
          defaultProps: {
            MenuProps: {
              disableScrollLock: true,
            },
          },
        },
        MuiDialog: {
          defaultProps: {
            disableScrollLock: true,
          },
        },
        MuiMenu: {
          defaultProps: {
            disableScrollLock: true,
          },
        },
        MuiPopover: {
          defaultProps: {
            disableScrollLock: true,
          },
        },
        MuiModal: {
          defaultProps: {
            disableScrollLock: true,
          },
        },
      },
    });
  }, [state.themeMode, isRtl]);

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

const AppRoot: React.FC = () => {
  return (
    <WizardProvider>
      <ThemeWrapper>
        <AppRoutes />
      </ThemeWrapper>
    </WizardProvider>
  );
};

export default AppRoot;
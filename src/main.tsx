import React from 'react';
import './index.css';
import './i18n'; // ✅ Add this — must initialize before app renders
import AppRoot from './AppRoot';
import { createRoot } from 'react-dom/client';
// ****************************
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
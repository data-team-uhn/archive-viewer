import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import ArchiveApp from './components/ArchiveApp';
import { appTheme } from "./appTheme";

import { LicenseInfo } from '@mui/x-license-pro';
import DevConfig from './config/devConfig.json';
LicenseInfo.setLicenseKey(DevConfig.licenseKey);

const container = document.getElementById('app');
const root = ReactDOMClient.createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ArchiveApp />
    </ThemeProvider>
  </StyledEngineProvider>
);

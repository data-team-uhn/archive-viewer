import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Paper } from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import ArchiveApp from './components/ArchiveApp';
import { appTheme } from "./appTheme";

const container = document.getElementById('app');
const root = ReactDOMClient.createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Paper elevation={0} sx={{ px: 4, py: 8, minHeight: "100vh"}}>
        <ArchiveApp />
      </Paper>
    </ThemeProvider>
  </StyledEngineProvider>
);

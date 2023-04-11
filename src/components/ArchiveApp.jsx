//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//

import React, { useEffect, useMemo } from "react";

import useMediaQuery from '@mui/material/useMediaQuery';
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  Navigate,
} from 'react-router-dom';

import {
  AppBar,
  Link,
  Paper,
  Toolbar,
  Tooltip,
} from "@mui/material";

import Logo from "./media/Logo";
import UserMenu from "./user/UserMenu";
import ArchiveViewer from "./ArchiveViewer";
import InfoPage from "./pages/InfoPage";

import { getAppTheme } from "./appTheme";

import AppConfig from "../config/appConfig.json";

let ArchiveApp = (props) => {
  // Todo:
  // - authentication logic
  // - user menu in the top app bar

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const appTheme = useMemo(() => createTheme(getAppTheme(prefersDarkMode)), [prefersDarkMode]);

  useEffect(() => {
    document.title = AppConfig.appName;
  }, []);

  let embeddedWrapper = (content) => (
    <>
      <Paper sx={{
         width: "fit-content",
         height: 0,
         overflow: "visible",
         margin: "auto",
         opacity: .1,
         zoom: 3
      }}>
        <Logo width="64" full/>
      </Paper>
      { content }
    </>
  );

  // Renders the following:
  // 1. Top appbar with logo, appname, user menu placeholder (user menu not yet implemented)
  // 2. ArchiveViewer component (query form and results)
  // 3. Bottom appbar with information links
  let appWrapper = (content) => (
    <Paper sx={{py: 6}}>
      <AppBar>
        <Toolbar sx={{justifyContent: "space-between"}}>
          <Link component={RouterLink} underline="none" to={`${AppConfig.pathBase}Home`} color="inherit">
            <Logo width="64px" full />
          </Link>
          <UserMenu />
        </Toolbar>
      </AppBar>
      { content }
      <AppBar sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar variant="dense">
          { AppConfig?.footerLinks?.map(l =>
              <Tooltip title={l.title || l.label} key={l.label}>
                <Link
                  component={RouterLink}
                  variant="button"
                  size="small"
                  underline="none"
                  to={`${AppConfig.pathBase}${l.label}`}
                >
                  {l.label}
                </Link>
              </Tooltip>
            )
          }
        </Toolbar>
      </AppBar>
    </Paper>
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper sx={{px: 4, py: 2, minHeight: "100vh"}}>
            <Router>
              <Routes>
                <Route path={AppConfig.pathBase} element={appWrapper(<ArchiveViewer />)} />
                  { AppConfig?.footerLinks?.filter(l => l.source).map(l =>
                    <Route key={l.label} path={`${AppConfig.pathBase}${l.label}`} element={
                      appWrapper(<InfoPage {...l} />)
                    } />
                  ) }
                <Route path={`${AppConfig.pathBase}embedded`} element={embeddedWrapper(<ArchiveViewer />)} />
                <Route path={`${AppConfig.pathBase}*`} element={<Navigate to={AppConfig.pathBase} replace />} />
              </Routes>
            </Router>
          </Paper>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ArchiveApp;
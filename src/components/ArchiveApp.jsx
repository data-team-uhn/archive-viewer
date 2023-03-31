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

import React, { useState, useEffect } from "react";

import {
  AppBar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import Logo from "./media/Logo";
import UserMenu from "./user/UserMenu";
import ArchiveViewer from "./ArchiveViewer";
import InfoDisplay from "./utils/InfoDisplay";

import AppConfig from "../config/appConfig.json";

let ArchiveApp = (props) => {
  // Todo:
  // - authentication logic
  // - user menu in the top app bar

  // A map fileName -> fileContents holding the documents configured in AppConfig.footerLinks
  // to be displayed when the user clicks a footer link 
  const [docs, setDocs] = useState({});

  // Lazy loads the document contents on click
  let loadDoc = (docName) => {
    if (!docs[docName]) {
      import(`../docs/${docName}`)
        .then(module => setDocs(old => ({...old, [docName] : module.default})))
        .catch(err => console.log(err));
    }
  }

  useEffect(() => {
    document.title = AppConfig.appName;
  }, []);

  // Renders the following:
  // 1. Top appbar with logo, appname, user menu placeholder (user menu not yet implemented)
  // 2. ArchiveViewer component (query form and results)
  // 3. Bottom appbar with information links
  return (
    <Stack spacing={8}>
      <AppBar>
        <Toolbar sx={{justifyContent: "space-between", mx: 1}}>
          <Logo width="64px" full />
          <UserMenu />
        </Toolbar>
      </AppBar>
      <ArchiveViewer />
      <AppBar sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar variant="dense">
          { AppConfig?.footerLinks?.map(footerLinkConfig => (
            <InfoDisplay
              key={footerLinkConfig.source}
              variant="text"
              size="small"
              color="secondary"
              label={footerLinkConfig.label}
              title={footerLinkConfig.title}
              dynamic
              onClick={event => loadDoc(footerLinkConfig.source)}
            >
              { docs[footerLinkConfig.source] }
            </InfoDisplay>
          ))}
        </Toolbar>
      </AppBar>
    </Stack>
  );
};

export default ArchiveApp;
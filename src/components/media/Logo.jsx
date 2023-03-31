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

import React from "react";
import { Stack, Typography, lighten } from '@mui/material';
import PropTypes from 'prop-types';

import AppConfig from "../../config/appConfig.json";

export default function Logo (props) {
  const { full, ...rest } = props;
  const COVER_COLOR = AppConfig.logoColor ?? "rgb(0,0,0)";
  const PAPER_COLOR = lighten(COVER_COLOR, 0.6);
  const EDGE_COLOR = "rgb(255,255,255)";

  const logoImg = (
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 41 27"
      {...rest}
      >
        <path
          d="M 1,26 l 7,-22 a 3.6, 3.6, 0, 0, 1, 7, 0, l7,22 m -3,-24.7 l 7, 22 a 3.6, 3.6, 0, 0, 0, 7, 0 l 7 -22"
          stroke={COVER_COLOR}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill={PAPER_COLOR}
        />
        <path
          d="M 6.5, 26 l 3 -20 M 11.5,26 v -21 M 16.5, 26 l -3 -20 M 24.5 1.5 l 3 20 M 29.5 1.5 v 20 M 34.5 1.5 l -3 20"
          stroke={PAPER_COLOR}
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M 6.5, 26 l 3 -22 M 11.5,26 v -22 M 16.5, 26 l -3 -22 M 24.5 1.5 l 3 22 M 29.5 1.5 v 22 M 34.5 1.5 l -3 22"
          stroke={EDGE_COLOR}
          strokeLinecap="round"
          strokeWidth=".5"
        />
    </svg>
  );

  return (full ?
    <Stack spacing={2} direction="row" alignItems="center">
      { logoImg }
      <Typography variant="overline" sx={{fontSize: "1em", fontWeight: "bold", lineHeight: 1.1}}>
        { AppConfig.appName }
      </Typography>
    </Stack>
    : logoImg
  );
};

Logo.propTypes = {
  full: PropTypes.bool,
};
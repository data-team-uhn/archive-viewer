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
import React from 'react';
import { createTheme } from '@mui/material/styles';

const primaryColor = "#106DB5"; // "#0bf" for dark mode
const secondaryColor = "#c6934b";

const appTheme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: "default",
      },
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: "center",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: primaryColor,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      styleOverrides: {
        colorInfo: {
          fontWeight: "bold",
          backgroundColor: "rgba(0,0,0,.04)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingRight: "40px",
        },
      },
    },
  },
});

export { appTheme };
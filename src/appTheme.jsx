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
import { createTheme } from '@mui/material/styles';
import { lighten } from '@mui/material';

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
    MuiChip: {
      styleOverrides: {
        root: {
          margin: "4px",
        },
        filledPrimary: {
          color: primaryColor,
          backgroundColor: lighten(primaryColor, .8),
          fontWeight: "500",
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
    MuiButtonBase: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          whiteSpace: "noWrap",
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
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiCardHeader: {
      defaultProps: {
        disableTypography: true,
      },
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          justifyContent: "end",
          paddingTop: 0,
          paddingRight: "16px",
        },
      },
    },
  },
});

export { appTheme };
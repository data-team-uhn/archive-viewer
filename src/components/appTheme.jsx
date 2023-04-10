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

function addAlpha(color, opacity) {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

const lightPalette = {
  mode: "light",
  primary: {
    main: "#106DB5",
  },
  secondary: {
    main: "#c6934b",
  },
  background: {
    default: "#ffffff",
    paper: "#ffffff",
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#00bbff",
  },
  secondary: {
    main: "#c6934b",
  },
  background: {
    default: "#121212",
    paper: "#121212",
  },
};


const getAppTheme = (prefersDarkMode) => ((palette => ({
  palette: palette,
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
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
          backgroundColor: palette.primary.main,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          margin: "4px",
        },
        filledPrimary: {
          color: palette.primary.main,
          backgroundColor: addAlpha(palette.primary.main, .25),
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
        root: {
          backgroundColor: addAlpha(palette.background.paper, .7),
        },
        colorInfo: {
          fontWeight: "bold",
          backgroundColor: addAlpha(palette.primary.main, .1),
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        size: "small",
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
    MuiTypography: {
      styleOverrides: {
        button: {
          textTransform: "none",
          padding: "4px 12px",
          borderRadius: "2px",
          "&:hover": {
            background: addAlpha(palette.primary.main, .1),
          },
        }
      }
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          paddingTop: "12px",
          "&.Mui-expanded": {
            paddingTop: 0,
            background: addAlpha(palette.primary.main, .1),
          },
        },
      },
    },
  },
}))(prefersDarkMode ? darkPalette : lightPalette));

export { getAppTheme, addAlpha };
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
import React, { useRef, useMemo } from 'react';
import PropTypes from "prop-types";

import {
  Button,
  Paper,
} from "@mui/material";

import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';

import ReactToPrint from 'react-to-print';

import { getAppTheme } from "../appTheme";

function PrintButton(props) {
  const { title, content, trigger, buttonProps } = props;

  const ref = useRef(null);
  const printTheme = useMemo(() => createTheme(getAppTheme()), []);

  return(
    <>
      <ReactToPrint
        trigger={() => trigger || <Button {...buttonProps}>Print</Button>}
        content={() => ref.current}
      />
      <ThemeProvider theme={printTheme}>
        <Paper ref={ref} elevation={0} sx={{
          display: "none",
          "@media print" : {
            display: "block",
            p: 4,
            "& table" : {
              width: "100%",
            },
            "& th" : {
              py: 2,
              opacity: .3,
              textAlign: "center",
            },
            "& ul:not(:first-of-type)" : {
              breakBefore: "page",
            },
          }
        }}>
          <table>
            <thead><tr><th>{ title }<hr/></th></tr></thead>
            <tbody><tr><td>{ content }</td></tr></tbody>
          </table>
        </Paper>
      </ThemeProvider>
    </>
  )
};

PrintButton.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node,
  trigger: PropTypes.node,
  buttonProps: PropTypes.object,
  onClick: PropTypes.func,
};

PrintButton.defaultProps = {
  buttonProps: {
    variant: "contained",
    color: "primary",
  },
};

export default PrintButton;

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
import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

import {
  Button,
  CircularProgress,
  DialogContent,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";

import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';

import ResponsiveDialog from "./ResponsiveDialog";
import FormattedText from "./FormattedText";

/**
 * A component that renders an icon or button to open a dialog with information
 */
function InfoDisplay(props) {
  const { label, icon, title, variant, dynamic, onClick, children, ...buttonProps } = props;

  const [ open, setOpen ] = useState(false);

  return(dynamic || children ?
    <React.Fragment>
      <ResponsiveDialog
        title={title}
        open={open}
        width="md"
        withCloseButton
        onClose={() => setOpen(false)}
      >
        <DialogContent dividers>
          { children ?
            <FormattedText>
              { children }
            </FormattedText>
            :
            <CircularProgress />
           }
        </DialogContent>
      </ResponsiveDialog>
      <Tooltip title={title}>
        { variant == "icon" ?
          <IconButton
            {...buttonProps}
            component="span"
            onClick={event => { onClick?.(event); setOpen(true) }}
          >
            { icon }
          </IconButton>
          :
          <Button
            {...buttonProps}
            onClick={event => { onClick?.(); setOpen(true) }}
            startIcon={variant == "extended" ? { icon } : undefined}
            sx={{textTransform: "none"}}
          >
            {label}
          </Button>
        }
      </Tooltip>
    </React.Fragment>
  : null)
}

InfoDisplay.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  variant: PropTypes.oneOf(["icon", "text", "extended"]), // "extended" means both icon and text
  dynamic: PropTypes.bool,
  children: PropTypes.string,
}

InfoDisplay.defaultProps = {
  label: "More...",
  icon: <HelpIcon />,
  title: "Information",
  variant: "icon",
  size: "medium",
}

export default InfoDisplay;

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
  Chip,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";

import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';

import ResponsiveDialog from "../utils/ResponsiveDialog";
import FormattedText from "../utils/FormattedText";

import QueryConfig from "../../config/queryConfig.json";

/**
 * A component that renders a dialog with the data associated with a specific record
 */
function RecordViewer(props) {
  const { dataSource, id, data, fieldsDefinition, query, open, onClose } = props;

  const requiredFields = QueryConfig.defaultQueryFields.filter(f => f.required);

  const title = <>
   { dataSource } { id }
   { requiredFields?.length && 
     <Typography color="textSecondary" variant="body2">
       { requiredFields.map(f => `${f.label || f.name} : ${query[f.name]}`).join(", ") }
     </Typography>
   }
  </>;

  return(
    <ResponsiveDialog
      title={title}
      open={open}
      width="sm"
      withCloseButton
      onClose={onClose}
    >
      <DialogContent dividers>
        <Grid container spacing={2} direction="column">
          { fieldsDefinition.map(f => <Grid item key={f.field}>
            <Typography variant="subtitle2">{f.headerName}:</Typography>
            <Typography color="textSecondary">{ data?.[f.field] }</Typography>
          </Grid>) }
        </Grid>
      </DialogContent>
    </ResponsiveDialog>
  )
}

export default RecordViewer;

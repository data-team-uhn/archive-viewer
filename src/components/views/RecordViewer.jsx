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
import PropTypes from "prop-types";

import {
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";

import ResponsiveDialog from "../utils/ResponsiveDialog";

import QueryConfig from "../../config/queryConfig.json";

/**
 * A component that renders a dialog with the data associated with a specific record
 */
function RecordViewer(props) {
  const { dataSource, id, data, fieldsDefinition, query, open, onClose } = props;

  const requiredFields = QueryConfig.requiredFields.map(group => group.fields).flat();

  const title = <>
   { dataSource } { id }
   { requiredFields?.length && 
     <Typography color="textSecondary" variant="body2">
       { requiredFields.filter(f => query[f.name])
           .map(f => `${f.label || f.name} : ${query[f.name]}`).join(", ")
       }
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

// dataSource, id, data, fieldsDefinition, query, open, onClose

RecordViewer.propTypes = {
  dataSource: PropTypes.string,
  id: PropTypes.string,
  data: PropTypes.object,
  fieldsDefinition: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
}

export default RecordViewer;

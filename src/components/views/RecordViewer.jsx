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
  Button,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";

import ResponsiveDialog from "../utils/ResponsiveDialog";
import PrintButton from "../utils/PrintButton";

import QueryConfig from "../../config/queryConfig.json";

/**
 * A component that renders a dialog with the data associated with a specific record
 */
function RecordViewer(props) {
  const { dataSource, data, fieldsDefinition, highlightedField, query, open, onClose } = props;

  const requiredFields = QueryConfig.requiredFields.map(group => group.fields).flat();

  const title = (
    requiredFields.filter(f => query[f.name])
      .map(f => `${f.label || f.name} : ${query[f.name]}`)
      .join(", ")
  );

  const renderRecord = (recordData) => (
    <List disablePadding dense key={recordData.id}>
      <ListSubheader color="primary" sx={{borderBottom: "1px solid"}}>
        <ListItemText
          primary={`${dataSource || ''} ${recordData.id || ''}`}
          secondary={`Created at: ${recordData.createdAt}`}
          primaryTypographyProps={{variant: "body1", sx: {fontWeight: "bold"}}}
        />
      </ListSubheader>
      { fieldsDefinition
          .filter(f => !['id', 'actions', 'createdAt'].includes(f.field) && recordData?.[f.field])
          .map((f, index) =>
            <ListItem key={f.field} selected={f.field === highlightedField}>
              <ListItemText
                sx={{display: "flex"}}
                primary={`${f.headerName}:`}
                secondary={`${recordData?.[f.field]}`}
                primaryTypographyProps={{variant: "body1", sx: {fontWeight: "bold", width: "40%"}}}
                secondaryTypographyProps={{variant: "body1", color: "textPrimary", width: "60%"}}
              />
            </ListItem>
            )
      }
    </List>
  );

  const content = (
    Array.isArray(data) ?
      <Stack spacing={3}>
        { data.map(renderRecord) }
      </Stack>
    : renderRecord(data)
  );

  return(
    <ResponsiveDialog
      title={title}
      open={open}
      width="md"
      onClose={onClose}
    >
      <DialogContent sx={{pt: 0, px: 1}}>
        { content }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <PrintButton title={title} content={content} />
      </DialogActions>
    </ResponsiveDialog>
  )
}

RecordViewer.propTypes = {
  dataSource: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  fieldsDefinition: PropTypes.arrayOf(PropTypes.object),
  highlightedField: PropTypes.string,
  query: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
}

export default RecordViewer;

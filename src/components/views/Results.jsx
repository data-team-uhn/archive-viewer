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

import React, { useEffect, useState } from "react";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
} from "@mui/material";

import ClearIcon from '@mui/icons-material/PlaylistRemove';

import FormattedText from "../utils/FormattedText";
import RecordViewer from "./RecordViewer";
import SectionDivider from "../utils/SectionDivider";
import { serializeGraphQLQuery, GRAPHQL_QUERY_ARGUMENT, camelCaseToWords } from "../utils/utils";

import QueryConfig from "../../config/queryConfig.json";
import AppConfig from "../../config/appConfig.json";

import resultsIntro from "../../docs/results.md";

const GridToolbarExport = ({ csvOptions, printOptions, ...other }) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem options={csvOptions} />
  </GridToolbarExportContainer>
);

function DataGridToolbar(params) {
  return (
    <GridToolbarContainer sx={{p:2}}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport csvOptions={params?.csvOptions}/>
      <GridToolbarQuickFilter sx={{ml: 'auto'}}/>
    </GridToolbarContainer>
  );
}

// Type mapping between GraphQL and DataGrid
const GRAPHQL_TO_DATAGRID_TYPE = {
  'Int' : 'number',
  'Int64': 'number',
  'Float': 'number',
  'Float64': 'number',
  'String': 'string',
  'Boolean': 'boolean',
  'Date': 'date',
  'Time': 'dateTime',
};

export default function Results (props) {
  const { queryDefinition, query, onClear } = props;

  const [ rows, setRows ] = useState();
  const [ columns, setColumns ] = useState();
  const [ crtRecordId, setCrtRecordId ] = useState();
  const [ crtField, setCrtField ] = useState();

  const QUERY_FIELD = GRAPHQL_QUERY_ARGUMENT.name;

  // When we know the query definition, build the column definitions
  useEffect(() => {
    const fieldDefs = queryDefinition?.type?.fields;
    setColumns(fieldDefs?.map(f => ({
      field: f.name,
      headerName: camelCaseToWords(f.name),
      type: GRAPHQL_TO_DATAGRID_TYPE[f.type.name] || (f.type.enumValues && 'singleSelect'),
      valueOptions: f.type.enumValues?.map(v => v.name),
      width: ['String', 'Time'].includes(f.type.name) ? 180 : 100,
      valueGetter: (
        ['Date', 'Time'].includes(f.type.name) ?
          ({ value }) => value && new Date(value)
        : undefined
      )
    })));
  }, [queryDefinition]);

  // When the query is built, serialize it and launch the search
  useEffect(() => {
    setRows();
    query && fetch(QueryConfig.url + serializeGraphQLQuery(query, queryDefinition))
      .then(response => response.json())
      .then(json => {
        processResults(json);
      });
  }, [query, queryDefinition]);

  // -------------------------------------------------------------------------
  // Process the results of a query - record the rows
  const processResults = (resultsJson) => {
    const data = resultsJson?.data?.[queryDefinition?.name];
    setRows(data?.map((line, index) => ({id: index, ...line})) || []);
  }

  // -------------------------------------------------------------------------
  // Rendering
  //

  const requiredFields = QueryConfig.requiredFields.map(group => group.fields).flat();
  const exportFileName = AppConfig.exportFileNamePrefix +
    requiredFields.map(f => query?.[QUERY_FIELD][f.name]).filter(v=>v).join("_");

  return (columns && <>
    <Card>
      <CardActions sx={{pb: 0}}>
        <Button color="error" startIcon={<ClearIcon/>}
          sx={{display: {xs: "none", sm: "inline-flex"}, mb:-2}}
          onClick={onClear}
        >
          Clear results
        </Button>
        <Tooltip title="Clear results">
          <IconButton color="error" onClick={onClear} sx={{display: {sm: "none"}, mb:-2}}>
            <ClearIcon/>
          </IconButton>
        </Tooltip>
      </CardActions>
      <CardHeader sx={{pt:0}} title={
        <SectionDivider
          color={rows ? rows.length ? undefined : "error" : "secondary"}
          title={`${rows ? rows.length || "No" : "Fetching"} result${rows?.length === 1 ? '' : 's'}`}
        />
      } />
      <CardContent>
      { rows?.length ?
        <Stack spacing={3}>
          { resultsIntro && <FormattedText variant="body2">{ resultsIntro }</FormattedText> }
          <div style={{ height: 600, width: '100%'}}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSize={rows.length}
              rowsPerPageOptions={[rows.length]}
              onRowClick={(params, event) => {
                event?.preventDefault();
                setCrtRecordId(params.id);
              }}
              onCellClick={(params, event) => {
                if (params.field != '__check__') {
                  event.preventDefault();
                  setCrtRecordId(params.id);
                  setCrtField(params.field);
                }
              }}
              slots={{
                toolbar: DataGridToolbar,
              }}
              slotProps={{
                toolbar: { csvOptions: { fileName: exportFileName } }
              }}
            />
          </div>
        </Stack>
        : !rows && <LinearProgress color="secondary" />
      }
      </CardContent>
    </Card>
    { typeof(crtRecordId) != "undefined" &&
      <RecordViewer
        open={typeof(crtRecordId) != "undefined"}
        onClose={() => setCrtRecordId()}
        dataSource={camelCaseToWords(queryDefinition?.name)}
        id={`${crtRecordId + 1}`}
        data={rows?.[crtRecordId]}
        highlightedField={crtField}
        fieldsDefinition={columns}
        query={query?.[QUERY_FIELD]}
      />
    }
  </>);
};


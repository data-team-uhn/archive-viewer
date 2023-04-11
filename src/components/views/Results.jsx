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
  DataGridPro,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';

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
import ViewIcon from '@mui/icons-material/FindInPage';

import FormattedText from "../utils/FormattedText";
import RecordViewer from "./RecordViewer";
import SectionDivider from "../utils/SectionDivider";
import {
  loadResource,
  serializeGraphQLQuery,
  GRAPHQL_QUERY_ARGUMENT,
  camelCaseToWords
} from "../utils/utils";

import CustomDataGridToolbar from "./Toolbar";

import ResultsConfig from "../../config/resultsConfig";
import QueryConfig from "../../config/queryConfig.json";
import AppConfig from "../../config/appConfig.json";

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

  const [ resultsIntro, setResultsIntro ] = useState();
  const [ rows, setRows ] = useState();
  const [ columns, setColumns ] = useState();
  const [ crtRow, setCrtRow ] = useState();
  const [ crtField, setCrtField ] = useState();
  const [ selected, setSelected ] = useState();

  const QUERY_FIELD = GRAPHQL_QUERY_ARGUMENT.name;

  // Load the intro
  useEffect(() => {loadResource('results.md', setResultsIntro)}, []);

  // When we know the query definition, build the column definitions
  useEffect(() => {
    const fieldDefs = queryDefinition?.type?.fields;
    setColumns([
      {
        field: 'actions',
        headerName: "",
        type: 'actions',
        width: 30,
        getActions: (params) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="View record">
                <ViewIcon/>
              </Tooltip>
            }
            onClick={() => setCrtRow(params.row)}
            label="View record"
          />,
        ]
      },
      ...(
        fieldDefs?.map(f => ({
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
        }))
        || []
      )
    ]);
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

  const identifierFields = ResultsConfig?.[queryDefinition?.name]?.id;

  const processResults = (resultsJson) => {
    const data = resultsJson?.data?.[queryDefinition?.name];
    setRows(data?.map((line, index) => ({
      id: identifierFields?.map(fieldName => line?.[fieldName]).join(" / ") ?? index,
      ...line
    })) || []);
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
            <DataGridPro
              initialState={{ pinnedColumns: { left: ['__check__'], right: ['actions'] } }}
              rows={rows}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelected(newRowSelectionModel);
              }}
              rowSelectionModel={selected}
              pageSize={rows.length}
              rowsPerPageOptions={[rows.length]}
              onRowClick={(params, event) => {
                event?.preventDefault();
                setCrtRow(params.row);
              }}
              onCellClick={(params, event) => {
                if (params.field !== '__check__') {
                  event.preventDefault();
                  setCrtRow(params.row);
                  setCrtField(params.field);
                }
              }}
              slots={{
                toolbar: CustomDataGridToolbar,
              }}
              slotProps={{
                toolbar: {
                  csvOptions: { fileName: exportFileName },
                  dataGridMeta: {
                    columns: columns,
                    selected: selected,
                    query: query?.[QUERY_FIELD],
                    dataSource: camelCaseToWords(queryDefinition?.name)
                  }
                }
              }}
            />
          </div>
        </Stack>
        : !rows && <LinearProgress color="secondary" />
      }
      </CardContent>
    </Card>
    { typeof(crtRow) != "undefined" &&
      <RecordViewer
        open={typeof(crtRow) != "undefined"}
        onClose={() => setCrtRow()}
        dataSource={camelCaseToWords(queryDefinition?.name)}
        data={crtRow}
        highlightedField={crtField}
        fieldsDefinition={columns}
        query={query?.[QUERY_FIELD]}
      />
    }
  </>);
};


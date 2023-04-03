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
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Stack,
} from "@mui/material";

import FormattedText from "../utils/FormattedText";
import RecordViewer from "./RecordViewer";
import SectionDivider from "../utils/SectionDivider";
import { serializeGraphQLQuery, GRAPHQL_QUERY_ARGUMENT, camelCaseToWords } from "../utils/utils";

import QueryConfig from "../../config/queryConfig.json";

import resultsIntro from "../../docs/results.md";

const GridToolbarExport = ({ csvOptions, printOptions, ...other }) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem options={csvOptions} />
  </GridToolbarExportContainer>
);

function DataGridToolbar() {
  return (
    <GridToolbarContainer sx={{p:2}}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport
        printOptions={{
          hideFooter: true,
          hideToolbar: true,
        }}
      />
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
  const { queryDefinition, query } = props;

  const [ rows, setRows ] = useState();
  const [ columns, setColumns ] = useState();
  const [ crtRecordId, setCrtRecordId ] = useState();

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

  return (columns && <>
    <Card>
      <CardHeader title={
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
              onRowClick={params => setCrtRecordId(params.id)}
              slots={{
                toolbar: DataGridToolbar,
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
        fieldsDefinition={columns}
        query={query?.[QUERY_FIELD]}
      />
    }
  </>);
};


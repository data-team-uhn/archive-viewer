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
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridExportMenuItemProps,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridApi,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-pro';

import {
  MenuItem,
} from "@mui/material";

import RecordViewer from "./RecordViewer";

function CustomPrintMenuItem(props) {
  const apiRef = useGridApiContext();

  const { hideMenu, dataGridMeta } = props;

  const [ data, setData ] = useState();
  const [ columns, setColumns ] = useState();

  const isDisabled = !(dataGridMeta?.selected?.length);

  const getSelection = (apiRef: React.MutableRefObject<GridApi>) => {
    // Select rows and columns
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);

    // Update the columns
    setColumns(visibleColumnFields
      .map(vf => dataGridMeta.columns?.find(c => c.field === vf))
      .filter(c => c)
    );

    // Format the data
    const entries = filteredSortedRowIds.map((id) => {
      if (!apiRef.current.getCellParams(id, "__check__").value) {
        return null;
      }
      const row: Record<string, any> = {};
      visibleColumnFields.forEach((field) => {
        row[field] = apiRef.current.getCellParams(id, field).row[field]
          ?? apiRef.current.getCellParams(id, field).value;
      });
      return {id: id, ...row};
    }).filter(r => r);

    setData(entries?.length ? entries : undefined);
  }

  let launchPreview = () => {
    getSelection(apiRef);
  }

  return (<>
    <MenuItem
      disabled={isDisabled}
      onClick={() => {
        // Launch the print preview with the selection
        launchPreview();
      }}
    >
      View / Print selection
    </MenuItem>
    { !!data &&
      <RecordViewer
        open={!!data}
        onClose={() => { hideMenu?.(); setData()}}
        dataSource={dataGridMeta.dataSource}
        data={data}
        fieldsDefinition={columns}
        query={dataGridMeta.query}
      />
    }
  </>);
}

const GridToolbarExport = ({ csvOptions, printOptions, dataGridMeta, ...other }) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem options={csvOptions} />
    <CustomPrintMenuItem options={printOptions} dataGridMeta={dataGridMeta} />
  </GridToolbarExportContainer>
);

export default function CustomDataGridToolbar(params) {
  return (
    <GridToolbarContainer sx={{p:2}}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport {...params}/>
      <GridToolbarQuickFilter sx={{ml: 'auto'}}/>
    </GridToolbarContainer>
  );
};

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

import React from "react";

import {
  Autocomplete,
  InputAdornment,
  TextField,
} from "@mui/material";

import InfoDisplay from "../utils/InfoDisplay";
import { camelCaseToWords } from "../utils/utils";

// Layout helpers
import {
  QueryFieldset,
  QuerySection,
  QueryFormContainer,
} from "./QueryFormLayout";

// Import the QueryComponentManager
import QueryComponentManager from "./QueryComponentManager";
// Register all the available query field components to the manager
import "./QueryComponents";

import queryIntro from "../../docs/query.md";

export default function QueryForm (props) {
  const { requiredFields, optionalFields,
    dataSources, dataSource, onDataSourceChange,
    query, defaultQueryArg, onQueryInputValueChange,
    onSubmit, submitDisabled, lastSearchQuery, onReset, resetDisabled
  } = props;

  const displayDefaultQueryField = (field) => displayQueryField(field, defaultQueryArg, true);

  const displayQueryField = (f, arg, includeDefaultFields) => {
    const matchingDefaultField = [
      ...requiredFields.map(r => r.fields).flat(),
      ...optionalFields
    ].find(df => df.name === f.name);

    // if we've displayed this field elsewhere in the default fields group, skip
    if (!includeDefaultFields && matchingDefaultField) {
      return null;
    }

    // Obtain the right input type, based on the field type
    const InputDisplay = QueryComponentManager.getComponent(f);

    const disabled = !!matchingDefaultField?.value;

    return (
      <InputDisplay
        key={f?.name}
        autoFocus={f.autoFocus}
        label={f.label || camelCaseToWords(f?.name)}
        value={matchingDefaultField?.value || query?.[arg.name]?.[f?.name] || ''}
        disabled={disabled}
        color={disabled ? "info" : undefined}
        onChange={value => onQueryInputValueChange(value, f, arg)}
        {...f?.type}
      />
    );
  }

  const dataSourceHasAutoFocus = () => (
    !requiredFields.map(r => r.fields).flat().some(f => f.autoFocus)
  );

  // Render fields in this order:
  // 1. required default query fields as specified by queryConfig
  // 2. optional default query fields as specified by queryConfig
  // 3. the data source dropdown
  // 4. all other fields supported by the selected data source
  // 5. search button, which is disabled if either:
  //    * none of the required query fields have a value specified
  //    * the data source, which is also required for now, hasn't been selected yet
  //    * the search has been just launched, and the results currently reflect the query
  return (
    <QueryFormContainer
      intro={queryIntro}
      onSubmit={onSubmit}
      submitDisabled={submitDisabled}
      onReset={onReset}
      resetDisabled={resetDisabled}
      query={lastSearchQuery}
      requiredFields={requiredFields?.map(group => group.fields).flat()}
    >
      <QuerySection maxWidth="sm" divider="or" title="Required" color="primary">
        { requiredFields.map((subset, index) =>
          <QueryFieldset
            key={index}
            fieldset={subset}
            displayField={displayDefaultQueryField}
          />
        ) }
      </QuerySection>
      <QuerySection title="Optional" direction="column">
        <QueryFieldset
          fieldset={{label: "Refine your search", fields: optionalFields}}
          displayField={displayDefaultQueryField}
        />
        <Autocomplete
          sx={{
            minWidth: "240px",
            "&:hover .MuiInputAdornment-root": {
              visibility: "visible"
            },
            "&.Mui-focused .MuiInputAdornment-root": {
              visibility: "visible"
            }
          }}
          autoComplete
          autoHighlight
          autoSelect
          openOnFocus={!dataSourceHasAutoFocus()}
          loading={!dataSources?.length}
          options={dataSources || []}
          value={dataSource}
          onChange={(event, value) => onDataSourceChange(value)}
          renderInput={(params) =>
             <TextField
                {...params}
                autoFocus={dataSourceHasAutoFocus()}
                label="Data source"
                placeholder="Select the data source to query"
                InputProps = {{
                  ...params.InputProps,
                  endAdornment: <>
                    {params.InputProps.endAdornment}
                    {dataSource &&
                      <InputAdornment position="end" sx={{visibility: "hidden"}}>
                        <InfoDisplay color="primary" title={`About ${dataSource.label}`} size="small">
                          { `TO DO ${dataSource?.type?.description}` }
                        </InfoDisplay>
                      </InputAdornment>
                    }
                  </>
                }}
              />
          }
        />
        { dataSource?.args?.filter(arg => arg?.inputFields).map(arg => arg.inputFields.map(f =>
          <QueryFieldset key={`${arg.name}-${f.name}`}
            fieldset={{fields: arg.inputFields}}
            displayField={f => displayQueryField(f, arg)}
          />
        )) }
      </QuerySection>
    </QueryFormContainer>
  );
};

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

import React, { useState, useEffect } from "react";

import {
  Autocomplete,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import InfoDisplay from "../utils/InfoDisplay";
import { loadResource, camelCaseToWords } from "../utils/utils";

// Layout helpers
import {
  QueryFieldset,
  QueryOptionalFields,
  QuerySection,
  QueryFormContainer,
} from "./QueryFormLayout";

// Import the QueryComponentManager
import QueryComponentManager from "./QueryComponentManager";
// Register all the available query field components to the manager
import "./QueryComponents";

export default function QueryForm (props) {
  const { requiredFields, optionalFields,
    requireDataSource, dataSources, dataSource, onDataSourceChange,
    query, defaultQueryArg, onQueryInputValueChange,
    onSubmit, submitDisabled, lastSearchQuery, onReset, resetDisabled
  } = props;

  const [ queryIntro, setQueryIntro ] = useState();
  const [ defaultFields, setDefaultFields ] = useState();
  const [ satisfiedRequiredGroup, setSatisfiedRequiredGroup ] = useState();
  const [ dataSourceFields, setDataSourceFields ] = useState();
  const [ disableFieldsetLabels, setDisableFieldsetLabels ] = useState();

  useEffect(() => {loadResource('query.md', setQueryIntro)}, []);

  // Get all default fields in one list
  useEffect(() => {
    setDefaultFields([
      ...requiredFields.map(r => r.fields).flat(),
      ...optionalFields.map(o => o?.type?.fields ?? o).flat(),
    ]);
  }, [requiredFields, optionalFields]);

  // When requiredFields arrive, check if any of the required groups already has enough values
  useEffect(() => {
    setSatisfiedRequiredGroup(getSatisfiedRequiredGroup());
  }, [requiredFields]);

  // Display a compact version of the form without fieldset labels when
  // we don't have to fill in the "Required" section
  useEffect(() => {
    setDisableFieldsetLabels(!!satisfiedRequiredGroup);
  }, [satisfiedRequiredGroup]);

  // When the data source changes, update the optional fields supported by it
  useEffect(() => {
    setDataSourceFields(() => {
      if (!defaultFields) return;
      return (
        dataSource?.args?.find(
          arg => arg.name === defaultQueryArg.name
        )?.inputFields?.filter(
          f => !defaultFields.some(df => df.name === f.name)
        )
      )
    });
  }, [defaultFields, dataSource, defaultQueryArg.name]);

  const getFieldValueFromQuery = (f) => {
    if (f?.type?.fields) {
      let val = [];
      f.type.fields.forEach(subField => {
        val.push(query?.[defaultQueryArg.name]?.[subField?.name] || '');
      });
      return val;
    } else {
      return query?.[defaultQueryArg.name]?.[f?.name] || '';
    }
  }

  const displayQueryField = (f, excludeDefaultFields) => {
    if (!f) return null;
    const matchingDefaultField = defaultFields?.find(df => df.name === f.name);

    // if we've displayed this field elsewhere in the default fields group, skip
    if (excludeDefaultFields && matchingDefaultField) {
      return null;
    }

    // Obtain the right input type, based on the field type
    const InputDisplay = QueryComponentManager.getComponent(f);

    const disabled = !!matchingDefaultField?.value;

    return (
      <InputDisplay
        key={f.name}
        autoFocus={f.autoFocus}
        label={f.label || camelCaseToWords(f?.name)}
        value={getFieldValueFromQuery(f)}
        disabled={disabled}
        color={disabled ? "info" : undefined}
        onChange={value => {
          f?.type?.fields ?
            f.type.fields.forEach((subField, index) => {
              onQueryInputValueChange(value[index], subField)
            })
          : onQueryInputValueChange(value, f)
        }}
        {...f?.type}
      />
    );
  }

  const getSatisfiedRequiredGroup = () => {
    let result = requiredFields.find(group =>
      group.fields.filter(f => f.value).length >= group.min
    );
    return result && {fields: result.fields.filter(f => f.value)};
  }

  const dataSourceHasAutoFocus = () => (
    !!getSatisfiedRequiredGroup() ||
    !requiredFields.map(r => r.fields).flat().some(f => f.autoFocus)
  );

  const hasNarrowRequiredFields = () => (!!satisfiedRequiredGroup || requiredFields?.length === 1);
  const hasNarrowRequiredSection = () => (hasNarrowRequiredFields() && !requireDataSource);
  const hadRequiredDataSourceFieldset = () => (hasNarrowRequiredFields() && requireDataSource);
  const hasDataSourceSection = () => (!hasNarrowRequiredFields() && requireDataSource);
  const hasOptionalFields = () => (
    optionalFields?.length > 0 ||
    !requireDataSource ||
    dataSourceFields?.length > 0
  );

  const renderDataSourceSection = () => (
    <QuerySection title="Legacy system" color={requireDataSource ? "primary" : undefined}>
      <Stack spacing={2} sx={{width: "100%"}}>
        { !disableFieldsetLabels && <Typography variant="subtitle2">Select an archived record type:</Typography> }
        { renderDataSource() }
      </Stack>
    </QuerySection>
  );

  const renderDataSource = () => (
        <Autocomplete
          sx={{
            width: "100%",
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
      intro={satisfiedRequiredGroup ? '' : queryIntro}
      onSubmit={onSubmit}
      submitDisabled={submitDisabled}
      onReset={onReset}
      resetDisabled={resetDisabled}
      query={lastSearchQuery}
      requiredFields={[
        ...(requiredFields?.map(group => group.fields).flat()),
        ...(requireDataSource ? [{name: "dataSource"}] : [])
      ]}
      childrenSizes={
        hasNarrowRequiredSection() ?
          /* optional section exists and includes dataSource */
          [{sm: 12, md: 4}, {sm: 12, md: 8}]
        : hasDataSourceSection() ?
          /* wide required section and separate required data source */
            hasOptionalFields() ?
              [{lg: 5}, {lg: 3}, {lg: 4}]
            : [{lg: 5}, {lg: 7}]
          : hasOptionalFields() ?
            /* wide required section, NO separate required data source */
              [{lg: 6}, {lg: 6}]
            : [{}] /* one section, always xs:12 */
      }
    >
      <QuerySection
        divider={hadRequiredDataSourceFieldset() ? undefined : "or"}
        title="Required"
        color="primary"
      >
        { satisfiedRequiredGroup ?
          <QueryFieldset
            fieldset={satisfiedRequiredGroup}
            displayField={displayQueryField}
          />
        : requiredFields.map((subset, index) =>
          <QueryFieldset
            key={index}
            fieldset={subset}
            displayField={displayQueryField}
          />
        ) }
        { hadRequiredDataSourceFieldset() && renderDataSource() }
      </QuerySection>
      { hasDataSourceSection() && renderDataSourceSection() }
      { hasOptionalFields() &&
        <QuerySection title="Optional" maxWidth="xl" spacing={6}>
          { /* If the data souce is optional, we display two groups in the optional section:
               * data source dropdown and its fields
               * predefined optional fields
               Otherwise we display both data source specific and predefined in one group
             */ }
          { !requireDataSource ? <>
            { /* List here any fields that are supported by the selected data source and not
                 already listed in the 'required' or `optional` section: */ }
            <QueryOptionalFields
              fields={dataSourceFields}
              displayField={f => displayQueryField(f, true)}
              disableLabel={disableFieldsetLabels}
            >
              { renderDataSource() }
            </QueryOptionalFields>
            { /* List predefined optional fields */ }
            { optionalFields?.length > 0 &&
              <QueryOptionalFields withBlankLabel
                fields={optionalFields}
                displayField={displayQueryField}
                disableLabel={disableFieldsetLabels}
              />
            }
            </>
            :
            <QueryOptionalFields
              fields={[...(dataSourceFields || []), ...(optionalFields || [])]}
              displayField={displayQueryField}
              disableLabel={disableFieldsetLabels}
            />
          }
        </QuerySection>
      }
    </QueryFormContainer>
  );
};

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

import { DataGrid } from '@mui/x-data-grid';

import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import FormattedText from "../utils/FormattedText";
import InfoDisplay from "../utils/InfoDisplay";
import SectionDivider from "../utils/SectionDivider";

// Import the QueryComponentManager and the supported input components
import QueryComponentManager from "./QueryComponentManager";
import * as QueryComponents from "./QueryComponents";

import QueryConfig from "../../config/queryConfig.json";
import dbDescriptions from "../../config/dbDescriptions.json";
// Todo: remove dbDescriptions.json ^ once we start receiving them from the server

import queryIntro from "../../docs/query.md";

export default function QueryForm (props) {
  const { queryDefinitions, onQueryDefinitionSelected, onSearch } = props;

  const [ defaultQueryFields, setDefaultQueryFields ] = useState();
  const [ queryDefinition, setQueryDefinition ] = useState(null);
  const [ query, setQuery ] = useState({});
  const [ searchLaunched, setSearchLaunched ] = useState(false);

  // First, load the default query fields from the config and their values (if any) from the URL
  // Also find which of the default query fields has the autofocus - it should be the first required field without a URL value, if any matches these criteria
  useEffect(() => {
    let urlSearchParams = new URLSearchParams(window.location.search);
    setDefaultQueryFields(() => {
      let fields = QueryConfig.defaultQueryFields.slice() || [];
      let autoFocusedField;
      fields.forEach(f => {
        f.value = urlSearchParams.get(f?.name) || null;
        if (f.value) {
          onQueryInputValueChange(f.value, f);
        } else if (f.required && !autoFocusedField) {
          f.autoFocus = true;
          autoFocusedField = f.name;
        }
      });
      return fields;
    });
  }, []);

  // When the data source changes, reset searchLaunched to mark that the displayed (if any) data no longer matches the query
  useEffect(() => {
    setSearchLaunched(false);
    onQueryDefinitionSelected(queryDefinition);
  }, [queryDefinition?.name]);

  // When an input value changes, update the query object
  // Also reset searchLaunched to mark that the displayed (if any) data no longer matches the query
  const onQueryInputValueChange = (newValue, field, arg={name: "query"}) => {
    // Update the query object
    setQuery(q => ({
      ...q,
      [arg.name] : {
        ...q[arg.name],
        [field.name]: newValue
      }
    }));
    // The results no longer reflect the query
    setSearchLaunched(false);
  }

  // When the search form is submitted, launch the search
  const handleSearch = (event) => {
    event?.preventDefault();
    setSearchLaunched(true);
    onSearch(query);
  };

  // ---------------------------------------------------------------
  // Rendering

  const displayDefaultQueryField = (field) => displayQueryField(field, {name: "query"}, true);

  const displayQueryField = (f, arg, includeDefaultFields) => {
    const matchingDefaultField = defaultQueryFields.find(df => df.name == f.name);

    // if we've displayed this field elsewhere in the default fields group, skip
    if (!includeDefaultFields && matchingDefaultField) {
      return null;
    }

    // Obtain the right input type, based on the field type
    const InputDisplay = QueryComponentManager.getComponent(f);

    const disabled = !!matchingDefaultField.value;

    return (
      <Grid item key={`${arg.name}-${f.name}`} xs="auto" sx={{maxWidth: "100%"}}>
        <InputDisplay
          autoFocus={f.autoFocus}
          label={f.label || f.name}
          value={matchingDefaultField?.value || query?.[arg.name]?.[f?.name] || ''}
          disabled={disabled}
          color={disabled ? "info" : undefined}
          onChange={value => onQueryInputValueChange(value, f, arg)}
        />
      </Grid>
    );
  }

  // Don't render the form until we know which input has the autofocus
  if (!defaultQueryFields) {
    return (
      <Grid container justifyContent="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  // Render fields in this order:
  // 1. required default query fields as specified by queryConfig
  // 2. the datasource dropdown
  // 3. optional default query fields as specified by queryConfig
  // 4. all other fields supported by the data source
  // 5. search button, which is disabled if either:
  //    * none of the required query fields have a value specified
  //    * the data source, which is also required, hasn't been selected yet
  //    * the search has been just launched, and the results reflect the query
  return (
    <form onSubmit={handleSearch}>
      <Grid container spacing={2} direction="row" alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          { queryIntro && <FormattedText>{ queryIntro }</FormattedText> }
        </Grid>
        { defaultQueryFields.filter(f => f.required).map(displayDefaultQueryField) }
        <Grid item xs={true}>
          <Autocomplete
            sx={{minWidth: "240px"}}
            autoComplete
            autoHighlight
            autoSelect
            disableClearable
            loading={!queryDefinitions?.length}
            options={queryDefinitions || []}
            value={queryDefinition}
            onChange={(event, value) => setQueryDefinition(value)}
            renderInput={(params) =>
              <TextField
                {...params}
                autoFocus={!defaultQueryFields.some(f => f.autoFocus)}
                label="Data to query"
                placeholder="Select the data to query"
                InputProps = {{
                  ...params.InputProps,
                  endAdornment: <>
                    {params.InputProps.endAdornment}
                    {queryDefinition &&
                      <InputAdornment position="end">
                        <InfoDisplay color="primary" title={`About ${queryDefinition.label}`} size="small">
                          { dbDescriptions[queryDefinition.name] }
                        </InfoDisplay>
                       </InputAdornment>
                     }
                  </>
                }}
              />
            }
          />
        </Grid>
        { defaultQueryFields.filter(f => !f.required).map(displayDefaultQueryField) }
        { queryDefinition?.args?.map(arg => arg?.inputFields.map(f => displayQueryField(f, arg))) }
        <Grid item xs="auto">
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon/>}
            disabled={
              !!(Object.values(query)
                  .map(a => Object.entries(a)).flat()
                  .filter(([k,v]) => v && defaultQueryFields.some(f => f.name == k && f.required))
                  .length == 0)
              || !queryDefinition
              || searchLaunched
            }
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

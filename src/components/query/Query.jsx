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
  CircularProgress,
  Grid,
} from "@mui/material";
import deepEqual from 'deep-equal';

import QueryForm from "./QueryForm";
import { GRAPHQL_QUERY_ARGUMENT } from "../utils/utils";
import QueryConfig from "../../config/queryConfig.json";

export default function Query (props) {
  const { dataSources, onSearch, resultsVisible } = props;

  const [ requiredFields, setRequiredFields ] = useState();
  const [ optionalFields, setOptionalFields ] = useState();
  const [ dataSource, setDataSource ] = useState(null);
  const [ query, setQuery ] = useState({});
  const [ queryFromURL, setQueryFromURL ] = useState({});
  const [ searchLaunched, setSearchLaunched ] = useState(false);
  const [ lastSearchQuery, setLastSearchQuery ] = useState();

  const defaultQueryArg = GRAPHQL_QUERY_ARGUMENT;

  // First, load the default query fields from the config and their values (if any) from the URL
  // Also find which of the default query fields has the autofocus - it should be the first required field without a URL value, if any matches these criteria
  useEffect(() => {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let autoFocus = {};
    setRequiredFields(() => {
      let def = [...QueryConfig.requiredFields];
      def.forEach(subset => subset.fields = loadFieldsConfig(
        subset.fields, urlSearchParams, autoFocus
      ));
      return def;
    });
    setOptionalFields(() => loadFieldsConfig(
      QueryConfig.optionalFields, urlSearchParams, autoFocus
    ));
  }, []);

  const loadFieldsConfig = (config, urlSearchParams, autoFocus) => {
    let fields = config?.slice() || [];
    fields.forEach(f => {
      f.value = urlSearchParams.get(f?.name) || null;
      if (f.value) {
        onQueryInputValueChange(f.value, f);
        setQueryFromURL(q => ({...q, [f.name] : f.value}));
      } else if (!autoFocus.field) {
        f.autoFocus = true;
        autoFocus.field = f.name;
      }
    });
    return fields;
  }

  // Erase the last search query when the results should not be displayed
  useEffect(() => {
    if (!resultsVisible) {
      setLastSearchQuery();
      setSearchLaunched(false);
    }
  }, [resultsVisible]);

  // When an input value changes, update the query object
  // Also reset searchLaunched to mark that the displayed (if any) data no longer matches the query
  const onQueryInputValueChange = (newValue, field, arg=defaultQueryArg) => {
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

  // When the data source changes, reset searchLaunched to mark that the displayed (if any) data no longer matches the query
  useEffect(() => {
    setSearchLaunched(false);
  }, [dataSource?.name]);

  // Check if enough required fields are provided for launching the search
  const canLaunchSearch = () => (
    dataSource &&
    requiredFields.some(group => (
      group.fields?.filter(rf => query?.[defaultQueryArg.name]?.[rf.name]).length >= group.min
    ))
  );

  // When the search form is submitted, launch the search
  const handleSearch = (event) => {
    event?.preventDefault();
    setSearchLaunched(true);
    setLastSearchQuery({...query?.[defaultQueryArg?.name], "dataSource": dataSource?.label});
    onSearch(dataSource, query);
  };

  const isFormClear = () => (
    !dataSource && deepEqual(query, {[defaultQueryArg.name]: queryFromURL})
  );
  const clearForm = (event) => {
    setQuery({[defaultQueryArg.name] : queryFromURL});
    setDataSource(null);
  };

  // Don't render the form until we know which input has the autofocus
  if (!requiredFields || !optionalFields || !dataSources) {
    return (
      <Grid container justifyContent="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  // A. Render form fields in this order:
  //    1. required default query fields as specified by queryConfig
  //    2. optional default query fields as specified by queryConfig
  //    3. the data source dropdown
  //    4. all other fields supported by the selected data source
  //    5. search button, which is disabled if either:
  //       * none of the required query fields have a value specified
  //       * the data source, which is also required for now, hasn't been selected yet
  //       * the search has been just launched, and the results currently reflect the query
  // B. Once a search is launched, render the query used
  return (<>
    <QueryForm
      requiredFields={requiredFields}
      optionalFields={optionalFields}
      dataSources={dataSources}
      dataSource={dataSource}
      onDataSourceChange={setDataSource}
      query={query}
      defaultQueryArg={defaultQueryArg}
      onQueryInputValueChange={onQueryInputValueChange}
      onSubmit={handleSearch}
      submitDisabled={!canLaunchSearch() || searchLaunched}
      lastSearchQuery={lastSearchQuery}
      onReset={clearForm}
      resetDisabled={isFormClear()}
    />
  </>);
};

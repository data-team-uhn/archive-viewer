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
  Stack,
} from "@mui/material";

import { GRAPHQL_INTROSPECTION_QUERY, camelCaseToWords } from "./utils/utils";
import Query from "./query/Query";
import Results from "./views/Results";

import QueryConfig from "../config/queryConfig.json";

export default function ArchiveViewer (props) {
  const [ queryDefinitions, setQueryDefinitions ] = useState([]);
  const [ crtQueryDefinition, setCrtQueryDefinition ] = useState();
  const [ crtQuery, setCrtQuery ] = useState();

  useEffect(() => {
    fetch(QueryConfig.url + GRAPHQL_INTROSPECTION_QUERY)
      .then(response => response.json())
      .then(json => processSchema(json?.data?.__schema));
  }, []);

  const processSchema = (schemaJson) => {
    if (!schemaJson) return;
    // All the defined types:
    let allTypes = schemaJson.types;

    // Get the query type:
    let queryType = schemaJson.queryType;

    // Retain only certain fields:
    let qDefs = (queryType.fields || [])
      // that support a user query
      .filter(f => !!(f?.args?.length))
      // that return the full list of results
      .filter(f => f.type.name.match(/^\[.+\]$/));
      // // that return a cursor (not a list with all results)
      // .filter(f => !f.type.name.match(/^\[.+\]$/));

    // Reformat for easier processing downstream:
    qDefs.forEach(q => {
      // Add a human-readable label
      q.label = camelCaseToWords(q.name);
      // For each argument, swap the 'type' reference for the inputFields specified by that type
      q.args.forEach(arg => {
        arg.inputFields = allTypes.find(type => type.name === arg.type.name).inputFields;
      });
      // Expand the return type definitions
      expandType(q.type, allTypes);
    });

    setQueryDefinitions(qDefs);
  }

  const expandType = (typeDef, allTypes) => {
    // Remove list markers "[" and "]", non-null marker "!" to obtain the type name, e.g. "[MyType!]" -> "MyType"
    let typeName = typeDef.name.replaceAll(/[[\]!]/g, '');
    // Check the list of all types if that type has any fields
    let type = allTypes.find(t => t.name === typeName);
    let fields = type?.fields;
    // If fields exist, expand their types as well, then add them to the type's definition
    if (fields) {
      fields.forEach(f => expandType(f.type, allTypes));
      typeDef.fields = fields;
    }
    // Add enumValues if any are defined for that type
    typeDef.enumValues = type.enumValues;
  }

  return (
    <Stack spacing={2} direction="column">
      <Query
        dataSources={queryDefinitions}
        onSearch={(dataSource, query) => {
          setCrtQueryDefinition(dataSource);
          setCrtQuery(query);
        }}
      />
      { crtQueryDefinition && crtQuery &&
        <Results queryDefinition={crtQueryDefinition} query={crtQuery} />
      }
    </Stack>
  );
};

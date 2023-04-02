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

// -------------------------------------------------------------------------
// Label formatting from field name
const camelCaseToWords = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).replace( /([A-Z])/g, " $1" ).toLowerCase();
}

// -------------------------------------------------------------------------
// Serialize a query object as a GraphQL query

// Format the query object as a string of this shape:
// (field_1: {subfield_1_1: "value_1_1", subfield_1_2: "value_1_2", ...}, field_2: {...}, ...)
const getQueryAsString = (q) => (
  "(" + Object.entries(q).map(([k,v]) => (k + ":" + JSON.stringify(v))).join(", ") + ") "
);

// Format the fields as a string of this shape:
// { field_1 { subfield_1_1 { ... } subfield_1_2 ... } field_2 { ... } ... }
// If there are no fields, return an empty string
const getFieldsAsString = (typeDef) => (
  typeDef.fields ?
    "{ " + typeDef.fields.map(f => f.name + ' ' + getFieldsAsString(f.type)).join(' ') + " }"
  : ""
);

// Build the query string
const serializeGraphQLQuery = (query, queryDefinition) => (
  "{ " +
     queryDefinition.name +
     getQueryAsString(query) +
     getFieldsAsString(queryDefinition.type) +
  " }"
);

// ---------------------------------------------------------------------------
// GraphQL introspection query
const GRAPHQL_INTROSPECTION_QUERY = `
{
  __schema {
    queryType {
      name
      fields {
        name
        args { name type { name } }
        type { name description }
      }
    }
    types {
      name
      inputFields { name type { name } }
      fields { name type { name } }
      enumValues {name}
    }
  }
}
`;
// ---------------------------------------------------------------------------
// The parameter pa
const GRAPHQL_QUERY_ARGUMENT = {name: 'query'};

// ---------------------------------------------------------------------------
// All exports:
export {
  camelCaseToWords,
  serializeGraphQLQuery,
  GRAPHQL_INTROSPECTION_QUERY,
  GRAPHQL_QUERY_ARGUMENT,
}
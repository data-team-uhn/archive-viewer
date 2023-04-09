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
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from "@mui/material";

import { loadResource } from "../utils/utils";
import ResourceComponentManager from "./ResourceComponentManager";
// Register all the available respurce displayer components to the manager
import "./ResourceDisplayComponents";

let InfoPage = (props) => {
  const { title, source } = props;

  const [ content, setContent ] = useState('');

  // Load the document contents when the source is known
  useEffect(() => {
    setContent('');
    loadResource(source, setContent);
  }, [source]);

  const ResourceDisplayer = ResourceComponentManager.getComponent(content);

  return (
    <Card sx={{mt: 2}}>
      <CardHeader
         titleTypographyProps={{variant: "h4", gutterBottom: true}}
         title={title}
      />
      <CardContent>
        { content ?
            <ResourceDisplayer>{ content }</ResourceDisplayer>
          : <CircularProgress />
        }
      </CardContent>
    </Card>
  );
};

export default InfoPage;
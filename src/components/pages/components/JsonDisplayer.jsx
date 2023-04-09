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

import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ResourceComponentManager from "../ResourceComponentManager";
import FormattedText from "../../utils/FormattedText";

// Json displayer used via the ResourceComponentManager
// Renders key: value pairs in an Accordion
let JsonDisplayer = (props) => {
  const { children } = props;

  return (
    <Stack spacing={2}>
      { Object.entries(children).map(([k,v]) =>
        <Accordion key={k} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormattedText>{`**${k}**`}</FormattedText>
          </AccordionSummary>
          <AccordionDetails>
            <FormattedText color="textSecondary">{ v }</FormattedText>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}

JsonDisplayer.propTypes = {
  children: PropTypes.object.isRequired,
};

export default JsonDisplayer;

ResourceComponentManager.registerComponent((resource) => {
  if (typeof(resource) === "object") {
    return [JsonDisplayer, 50];
  }
});

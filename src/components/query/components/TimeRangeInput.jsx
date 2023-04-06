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

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import DateTimeRangeInput from "./DateTimeRangeInput";
import QueryComponentManager from "../QueryComponentManager";

// Time range input field used via the QueryComponentManager in QueryForm
let TimeRangeInput = (props) => (
  <DateTimeRangeInput
     pickerComponent={DateTimePicker}
     dateFormat="YYYY-MM-DD hh:mm a"
     toString={date => (date ? date.format().substring(0,16) : undefined)}
     {...props}
  />
);

TimeRangeInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeRangeInput;

QueryComponentManager.registerComponent((definition) => {
  if (["TimeRange"].includes(definition?.type?.name)
    && definition.type.fields?.length === 2
  ) {
    return [TimeRangeInput, 50];
  }
});

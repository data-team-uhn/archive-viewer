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

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import DateTimeRangeInput from "./DateTimeRangeInput";
import QueryComponentManager from "../QueryComponentManager";

// Date range input field used via the QueryComponentManager in QueryForm
let DateRangeInput = (props) => (
  <DateTimeRangeInput
     pickerComponent={DatePicker}
     dateFormat="YYYY-MM-DD"
     toString={date => (date ? date.format().substring(0,10) : '')}
     {...props}
  />
);

DateRangeInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateRangeInput;

QueryComponentManager.registerComponent((definition) => {
  if (["DateRange"].includes(definition?.type?.name)) {
    return [DateRangeInput, 50];
  }
});

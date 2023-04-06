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

import React, {useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Grid,
} from "@mui/material";
import dayjs from 'dayjs';

import { camelCaseToWords } from "../../utils/utils";

// Internal, generic Date/Time range input field
// Customized by the DateRangeInput and TimeRangeInput components
// to be called via the QueryComponentManager in the QueryForm
let DateTimeRangeInput = (props) => {
  let { pickerComponent, dateFormat, toString, label, onChange, fields } = props;

  const [ start, setStart ] = useState(null);
  const [ end, setEnd ] = useState(null);

  const PickerComponent = pickerComponent;

  // Load initial values, if any are provided
  useEffect(() => {
    loadValue(fields?.[0]?.value, setStart);
    loadValue(fields?.[1]?.value, setEnd);
  }, [fields]);

  const loadValue = (value, setter) => {
    value && dayjs(value).isValid() && setter(dayjs(value));
  }

  // Propagate any date change to the parent component
  const handleChange = (value, setter, getRangeLimits) => {
    let newValue = value.isValid() ? value : null;
    setter(newValue);
    onChange(getRangeLimits(newValue).map(toString));
  }

  const commonProps = {
    sx: {width: 150, minWidth: "100%"},
    format: dateFormat,
    disableFuture: true,
  };

  // Wrap the Grid container a div to make sure the Grid layout is not messed up
  // when rendered as a child of a Stack
  return (
    <div>
      <Grid container alignItems="center" direction="row" spacing={1} rowSpacing={2} wrap="wrap">
        <Grid item xs={true}>
          <PickerComponent
            label={camelCaseToWords(fields[0].name)}
            value={start}
            onChange={(value) => handleChange(value, setStart, (v) => ([v, end]))}
            maxDate={end}
            {...commonProps}
          />
        </Grid>
        <Grid item>—</Grid>
        <Grid item xs={true}>
          <PickerComponent
            label={camelCaseToWords(fields[1].name)}
            value={end}
            onChange={(value) => handleChange(value, setEnd, (v) => ([start, v]))}
            minDate={start}
            {...commonProps}
          />
        </Grid>
      </Grid>
    </div>
  )
}

DateTimeRangeInput.propTypes = {
  pickerComponent: PropTypes.object.isRequired,
  dateFormat: PropTypes.string.isRequired,
  toString: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DateTimeRangeInput;

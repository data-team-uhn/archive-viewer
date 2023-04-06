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

// Internal, generic Date/Time range input field
// Customized by the DateRangeInput and TimeRangeInput components
// to be called via the QueryComponentManager in the QueryForm
let DateTimeRangeInput = (props) => {
  let { pickerComponent, dateFormat, toString, label, onChange, value, ...rest } = props;

  const [ start, setStart ] = useState(null);
  const [ end, setEnd ] = useState(null);

  const PickerComponent = pickerComponent;
  const RANGE_SEPARATOR = "...";

  // Load initial values, if any are provided
  useEffect(() => {
    const range = value?.split(RANGE_SEPARATOR);
    setStart(range?.[0] ? dayjs(range[0]) : null);
    setEnd(range?.[1] ? dayjs(range[1]) : null);
  }, [value]);

  // Propagate any date change to the parent component
  const handleChange = (value, setter, getRangeLimits) => {
    let newValue = dayjs(value, dateFormat, true).isValid() ? value : null;
    setter(newValue);
    let range = getRangeLimits(newValue);
    if (range.some(v => v)) {
      onChange(`${toString(range[0])}${RANGE_SEPARATOR}${toString(range[1])}`)
    } else {
      onChange();
    }
  }

  const commonProps = {
    sx: {width: 210, minWidth: "100%"},
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
            label={`${label} after`}
            value={start}
            onChange={(value) => handleChange(value, setStart, (v) => ([v, end]))}
            maxDate={end}
            {...commonProps}
            {...rest}
          />
        </Grid>
        <Grid item>—</Grid>
        <Grid item xs={true}>
          <PickerComponent
            label={`${label} before`}
            value={end}
            onChange={(value) => handleChange(value, setEnd, (v) => ([start, v]))}
            minDate={start}
            {...commonProps}
            {...rest}
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
  sx: PropTypes.object,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateTimeRangeInput;

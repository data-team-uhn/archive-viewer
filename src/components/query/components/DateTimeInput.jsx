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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Internal, generic Date/Time input field
// Customized by the DateInput and TimeInput components
// to be called via the QueryComponentManager in QueryForm
let DateTimeInput = (props) => {
  const { pickerComponent, value, format, toString, onChange, ...rest } = props;

  const [ date, setDate ] = useState(null);
  useEffect(() => {
    if (value && dayjs(value).isValid()) {
      setDate(dayjs(value));
    }
  }, [value]);

  const handleChange = (val) => {
    if (val.isValid()) {
      setDate(val);
      onChange(toString(val));
    } else {
      onChange('');
    }
  }

  const PickerComponent = pickerComponent;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PickerComponent
        value={date}
        format={format}
        onChange={handleChange}
        disableFuture
        {...rest}
      />
    </LocalizationProvider>
  );
}

DateTimeInput.propTypes = {
  pickerComponent: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
  toString: PropTypes.func.isRequired,
  sx: PropTypes.object,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateTimeInput;

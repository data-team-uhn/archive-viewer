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

// Exposes the query field input components that should be available via the QueryComponentManager.
// importing * from this module will register the components in the component manager.
const TextInput = require("./components/TextInput");
const DateInput = require("./components/DateInput");
const TimeInput = require("./components/TimeInput");
const DateRangeInput = require("./components/DateRangeInput");
const TimeRangeInput = require("./components/TimeRangeInput");
const EnumInput = require("./components/EnumInput");

module.exports = [
  TextInput,
  DateInput,
  TimeInput,
  DateRangeInput,
  TimeRangeInput,
  EnumInput
];

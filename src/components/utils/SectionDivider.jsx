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
import { Chip, Divider, Typography } from "@mui/material";

let SectionDivider = (props) => {
  let { title, tags, color, ...dividerProps } = props;

  const titlePieces = (title || '').split("@{tags}");

  return (
    <Divider {...dividerProps}>
       <Typography variant="overline" color={color} sx={{fontWeight: "bold"}}>
       { titlePieces[0] } { tags?.map(
           t => <Chip key={t} label={t} size="small" color={color}/>)
       } { titlePieces.slice(1).join('') }
       </Typography>
    </Divider>
  );
}

SectionDivider.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  color: PropTypes.string,
}

SectionDivider.defaultProps = {
  color: "primary",
};

export default SectionDivider;

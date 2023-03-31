//0
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
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Chip,
  Collapse,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import UpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';

import SectionDivider from '../utils/SectionDivider';
import FormattedText from '../utils/FormattedText';
import { camelCaseToWords } from '../utils/utils';

// ----------------------------------------------------------------------
// QueryFieldset displays a list of fields grouped under an optional label
//
let QueryFieldset =  (props) => {
  const { fieldset, displayField, direction, spacing } = props;

  const label = fieldset.label ?? (
    !(fieldset?.min) ? '' :
      fieldset.min === 1 ? "One of"
      : `Minimum ${fieldset.min} of`
  );

  return (fieldset?.fields?.length > 0 ?
    <Stack direction={direction} spacing={spacing} sx={{width: "100%"}}>
      { label && <Typography variant="subtitle2">{ label }:</Typography> }
      { fieldset.fields?.map(displayField) }
    </Stack>
  : null);
};

QueryFieldset.propTypes = {
  fieldset: PropTypes.object.isRequired,
  displayField: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(["row", "column"]),
  spacing: PropTypes.number,
};

QueryFieldset.defaultProps = {
  direction: "column",
  spacing: 2,
};

// ----------------------------------------------------------------------
// QuerySection displays a list of fields grouped under an optional label
//
let QuerySection = (props) => {
  const { title, color, direction, maxWidth, outlined, divider, spacing, children } = props;

  const theme = useTheme();
  const verticalLayout = useMediaQuery(theme.breakpoints.down(maxWidth));

  let sectionContents = (
    <Stack
      spacing={spacing}
      justifyContent="space-between"
      direction={ direction ?? (verticalLayout ? "column" : "row") }
      divider={ divider &&
        <Divider flexItem orientation={verticalLayout ? "horizontal" : "vertical"}>
          { typeof(divider) === "string" &&
            <Typography variant="overline">{ divider }</Typography>
          }
        </Divider>
      }
    >
      { children }
    </Stack>
  );

  return (
    <Card {...(outlined ? {variant: "outlined"} : {})}>
      { title &&
        <CardHeader title={
          <Divider light>
            <Chip label={title} color={color}/>
          </Divider>
         }/> }
      <CardContent>{ sectionContents }</CardContent>
    </Card>
  );
};

QuerySection.propTypes = {
  direction: PropTypes.oneOf(["column", "row"]),
  maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  outlined: PropTypes.bool,
  divider: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  color: PropTypes.string,
  spacing: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

QuerySection.defaultProps = {
  maxWidth: "sm",
  spacing: 2,
};

// -------------------------------------------------------------------------
// QuerySummary display the required and optional query values in a easy to
// read form
let QuerySummary = (props) => {
  let { requiredFields, query } = props;

  let queryFields = [
      requiredFields.filter(f => query?.[f.name])
        .map(f => `${f.label || camelCaseToWords(f.name)} : ${query?.[f.name]}`)
        .map(label => <Chip label={label} color="primary" />),
      Object.entries(query || {})
        .filter(([k,v]) => v && !requiredFields.some(rf => rf.name === k))
        .map(([k,v]) => `${camelCaseToWords(k)} : ${v}`)
        .map(label => <Chip label={label}/>)
    ].flat();

  return (
    <Grid container justifyContent="center" spacing={1}>
      { queryFields.map((f, index) =>
        <Grid item key={index}>{f}</Grid>
      )}
    </Grid>
  );
}

QuerySummary.propTypes = {
  requiredFields: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.object,
};

// -------------------------------------------------------------------------
// QueryFormContainer handles is the wrapper inside which the form controls
// are displayed
//
let QueryFormContainer = (props) => {
  const { intro, onSubmit, submitDisabled, onReset, resetDisabled, children, query, requiredFields } = props;

  const [ expanded, setExpanded ] = useState(true);

  useEffect(() => {
    query && setExpanded(false);
  }, [query]);

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <Collapse in={expanded}>
          { intro && <CardHeader title={<FormattedText variant="body2">{ intro }</FormattedText>} /> }
          <Grid container direction="row" spacing={2}>
            { children.map((c, i) => <Grid item xs={12} md={6} key={i}>{ c }</Grid>) }
          </Grid>
          <CardActions>
            { query &&
              <Button startIcon={<UpIcon />} onClick={() => setExpanded(false)}>
                Hide
              </Button>
            }
            <Button
              color="error"
              startIcon={<ClearIcon/>}
              onClick={onReset}
              disabled={resetDisabled}
            >
              Clear
           </Button>
            <Button
              type="submit"
              variant={submitDisabled ? "text" : "contained"}
              startIcon={<SearchIcon />}
              disabled={submitDisabled}
            >
              Search
            </Button>
          </CardActions>
        </Collapse>
        { query && <>
          <Collapse in={!expanded}>
            <CardActions sx={{mt:2,mb:-5}}>
              <Button startIcon={<DownIcon />} onClick={() => setExpanded(true)}>
                Show search form
              </Button>
            </CardActions>
          </Collapse>
          <CardHeader title={<SectionDivider title="Your last search:"/>} />
          <CardContent>
            <QuerySummary query={query} requiredFields={requiredFields} />
          </CardContent>
        </>}
      </Card>
    </form>
  );
}

QueryFormContainer.propTypes = {
  intro: PropTypes.string,
  onSubmit: PropTypes.func,
  submitDisabled: PropTypes.bool,
  onReset: PropTypes.func,
  resetDisabled: PropTypes.bool,
  query: PropTypes.object,
  requiredFields: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

// -------------------------------------------------------------------------

export { QueryFieldset, QuerySection, QueryFormContainer, QuerySummary };

/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import queryString from 'query-string';
import config from '../config';

const getQuery = (ltiData, item) => {
  const query = {
    url: `http://host.docker.internal:3000/lti/article-iframe/nb/article/${
      item.id
    }?removeRelatedContent=true`,
    title: item.title,
    text: item.title,
    return_type: 'lti_launch_url',
  };
  console.log(query, ltiData);
  return `${ltiData.launch_presentation_return_url}?${queryString.stringify(
    query,
  )}`;
};

const LtiEmbed = ({ ltiData, item }) => {
  const isValidLTI =
    ltiData.launch_presentation_document_target === 'iframe' &&
    ltiData.launch_presentation_return_url;
  if (isValidLTI) {
    return <a href={getQuery(ltiData, item)}>Embed</a>;
  }

  return <Button>Embed</Button>;
};

LtiEmbed.propTypes = {
  ltiData: PropTypes.object,
  item: PropTypes.object,
};

export default LtiEmbed;

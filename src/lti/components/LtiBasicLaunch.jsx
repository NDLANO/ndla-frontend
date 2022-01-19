/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import config from '../../config';
import { LtiDataShape } from '../../shapes';

const StyledLinkAsButton = styled('a')`
  display: inline-block;
  color: white;
  background-color: #20588f;
  border: 2px solid #20588f;
  border-radius: 4px;
  padding: 4px 13px;
  outline-width: 0;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  font-size: 0.88889rem;
  line-height: 1.625;
  font-weight: 700;
  transition: all 0.2s cubic-bezier(0.17, 0.04, 0.03, 0.94);
  box-shadow: none;
  margin-right: 13px;
  &:hover,
  &:focus {
    color: white;
    background-color: #184673;
    border: 2px solid rgba(32, 88, 143, 0);
    transform: translateY(1px) translateX(1px);
  }
`;

const getReturnType = ltiData => {
  if (!ltiData.ext_content_return_types) {
    return 'iframe';
  }
  if (ltiData.ext_content_return_types === 'lti_launch_url') {
    return 'lti_launch_url';
  }
  if (
    ltiData.ext_content_return_types.includes('iframe') ||
    ltiData.ext_content_return_types.includes('oembed')
  ) {
    return 'iframe';
  }
  return 'lti_launch_url';
};
const getQuery = (ltiData, item) => {
  const baseUrl =
    config.ndlaEnvironment === 'dev'
      ? 'http://localhost:3000'
      : config.ndlaFrontendDomain;
  const query = {
    url: `${baseUrl}/article-iframe/article/${item.id}`,
    title: item.title,
    return_type: getReturnType(ltiData),
    width: ltiData.launch_presentation_width,
    height: ltiData.launch_presentation_height,
  };
  return `${ltiData.launch_presentation_return_url}?${queryString.stringify({
    ...query,
    text: query.return_type === 'lti_launch_url' ? item.title : undefined,
  })}`;
};

const LtiBasicLaunch = ({ ltiData, item, t }) => (
  <StyledLinkAsButton href={getQuery(ltiData, item)}>
    {t('lti.embed')}
  </StyledLinkAsButton>
);

LtiBasicLaunch.propTypes = {
  ltiData: LtiDataShape,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }),
};

export default withTranslation()(LtiBasicLaunch);

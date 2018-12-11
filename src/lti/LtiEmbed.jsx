/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import styled, { css } from 'react-emotion';
import queryString from 'query-string';
import config from '../config';
import LtiEmbedCode from './LtiEmbedCode';
import { fetchArticleOembed } from '../containers/ArticlePage/articleApi';
import { searchResultItemShape } from './LtiSearchResultList';

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

const MarginRight = css`
  margin-right: 13px;
`;

const getQuery = (ltiData, item) => {
  const baseUrl =
    config.ndlaEnvironment === 'dev'
      ? 'http://host.docker.internal:3000'
      : config.ndlaFrontendDomain;
  const query = {
    url: `${baseUrl}/lti/article-iframe/nb/article/${
      item.id
    }?removeRelatedContent=true`,
    title: item.title,
    return_type:
      ltiData.ext_content_return_types === 'lti_launch_url'
        ? 'lti_launch_url'
        : 'iframe',
    width: ltiData.launch_presentation_width,
    height: ltiData.launch_presentation_height,
  };
  return `${ltiData.launch_presentation_return_url}?${queryString.stringify({
    ...query,
    text: query.return_type === 'lti_launch_url' ? item.title : undefined,
  })}`;
};

class LtiEmbed extends Component {
  constructor() {
    super();
    this.state = { isOpen: false, embedCode: '' };
    this.showEmbedCode = this.showEmbedCode.bind(this);
    this.hideEmbedCode = this.hideEmbedCode.bind(this);
  }

  async showEmbedCode(item) {
    if (item.url.href) {
      this.setState({
        isOpen: true,
        embedCode: `<iframe src="${
          item.url.href
        }" frameborder="0" allowFullscreen=""/>`,
      });
    } else {
      const oembed = await fetchArticleOembed(item.url);
      this.setState({ isOpen: true, embedCode: oembed.html });
    }
  }

  hideEmbedCode() {
    this.setState({ isOpen: false, embedCode: '' });
  }

  render() {
    const { ltiData, item, t } = this.props;
    const isValidLTI =
      ltiData &&
      ltiData.launch_presentation_document_target === 'iframe' &&
      ltiData.launch_presentation_return_url;

    if (isValidLTI) {
      return (
        <StyledLinkAsButton href={getQuery(ltiData, item)}>
          {t('lti.embed')}
        </StyledLinkAsButton>
      );
    }
    const { isOpen, embedCode } = this.state;
    return (
      <Fragment>
        <LtiEmbedCode
          isOpen={isOpen}
          code={embedCode}
          onClose={this.hideEmbedCode}
        />
        <Button
          className={MarginRight}
          onClick={() => this.showEmbedCode(item)}>
          {t('lti.embed')}
        </Button>
      </Fragment>
    );
  }
}

LtiEmbed.propTypes = {
  ltiData: PropTypes.shape({
    launch_presentation_return_url: PropTypes.string,
    launch_presentation_document_target: PropTypes.string,
    launch_presentation_width: PropTypes.string,
    launch_presentation_height: PropTypes.string,
    ext_content_return_types: PropTypes.string,
  }),
  item: searchResultItemShape,
};

export default injectT(LtiEmbed);

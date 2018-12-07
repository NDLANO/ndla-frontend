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
import { css } from 'react-emotion';
import queryString from 'query-string';
import config from '../config';
import LtiEmbedCode from './LtiEmbedCode';
import { fetchArticleOembed } from '../containers/ArticlePage/articleApi';
import { searchResultItemShape } from './LtiSearchResultList';

const FloatRight = css`
  float: right;
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
    text: item.title,
    return_type: 'lti_launch_url',
  };
  return `${ltiData.launch_presentation_return_url}?${queryString.stringify(
    query,
  )}`;
};

class LtiEmbed extends Component {
  constructor() {
    super();
    this.state = { isOpen: false, embedCode: '' };
    this.showEmbedCode = this.showEmbedCode.bind(this);
    this.hideEmbedCode = this.hideEmbedCode.bind(this);
  }

  async showEmbedCode(item) {
    const oembed = await fetchArticleOembed(item.url);
    this.setState({ isOpen: true, embedCode: oembed.html });
  }

  hideEmbedCode() {
    this.setState({ isOpen: false, embedCode: '' });
  }

  render() {
    const { ltiData, item } = this.props;
    const isValidLTI =
      ltiData &&
      ltiData.launch_presentation_document_target === 'iframe' &&
      ltiData.launch_presentation_return_url;
    if (isValidLTI) {
      return <a href={getQuery(ltiData, item)}>Embed</a>;
    }
    const { isOpen, embedCode } = this.state;
    return (
      <Fragment>
        <LtiEmbedCode
          isOpen={isOpen}
          code={embedCode}
          onClose={this.hideEmbedCode}
        />
        <Button className={FloatRight} onClick={() => this.showEmbedCode(item)}>
          Embed
        </Button>
      </Fragment>
    );
  }
}

LtiEmbed.propTypes = {
  ltiData: PropTypes.shape({
    launch_presentation_return_url: PropTypes.string,
    launch_presentation_document_target: PropTypes.string,
  }),
  item: searchResultItemShape,
  showEmbedCode: PropTypes.func.isRequired,
};

export default LtiEmbed;

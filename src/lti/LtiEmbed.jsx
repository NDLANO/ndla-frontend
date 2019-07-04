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
import oauthSignature from 'oauth-signature';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import queryString from 'query-string';
import config from '../config';
import { LtiDataShape } from '../shapes';
import LtiEmbedCode from './LtiEmbedCode';
import { fetchArticleOembed } from '../containers/ArticlePage/articleApi';
import { getSign } from './oauth';
import { resolveJsonOrRejectWithError } from '../util/apiHelpers';

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
var htmlEscaper = /[&<>"'\/]/g;
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};
// Escape a string for HTML interpolation.
const encoder = string => {
  return ('' + string).replace(htmlEscaper, function(match) {
    return htmlEscapes[match];
  });
};

const getSignature = (url, postData) => {
  const data = {
    ...postData,
    content_items: JSON.stringify(postData.content_items),
  };
  console.log(data);
  const httpMethod = 'POST',
    consumerSecret = '';
  // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
  const signature = oauthSignature.generate(
    httpMethod,
    url,
    data,
    consumerSecret,
    '',
    { encodeSignature: false },
  );
  return signature;
};

const getLtiPostData = async (ltiData, item = {}) => {
  const baseUrl =
    config.ndlaEnvironment === 'dev'
      ? 'http://localhost:3000'
      : config.ndlaFrontendDomain;
  const iframeurl = `https://chr.natten.it/article-iframe/nb/article/${
    item.id
  }?removeRelatedContent=true`;
  const postData = {
    oauth_callback: ltiData.oauth_callback || '',
    oauth_consumer_key: ltiData.oauth_consumer_key || 'key',
    oauth_nonce: ltiData.oauth_nonce || '',
    oauth_signature_method: ltiData.oauth_signature_method || '',
    oauth_timestamp: ltiData.oauth_timestamp || '',
    oauth_version: ltiData.oauth_version || '',
    data: ltiData.data || '',
    lti_message_type: 'ContentItemSelection',
    lti_version: 'LTI-1p0',
    content_items: {
      '@context': 'http://purl.imsglobal.org/ctx/lti/v1/ContentItem',
      '@graph': [
        {
          '@type': 'LtiLinkItem',
          '@id:': item.id,
          url: iframeurl,
          mediaType: 'application/vnd.ims.lti.v1.ltilink',
          title: item.title,
          text: 'test',
          placementAdvice: {
            presentationDocumentTarget: 'iframe',
            displayWidth: 1000,
            displayHeight: 2000,
          },
          custom: { content_item_id: '5a5f1418-b553-4f3b-9e9a-ab9d015868eb' },
        },
      ],
    },
  };

  console.log('lelel', postData);
  const sig = await fetch(
    `/lti/oauth?url=${encodeURIComponent(ltiData.content_item_return_url)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        ...postData,
        content_items: JSON.stringify(postData.content_items),
      }),
    },
  ).then(resolveJsonOrRejectWithError);
  console.log(
    'getsginature',
    getSignature(ltiData.content_item_return_url, postData),
    sig,
  );
  //console.log('sig', sig);
  //console.log('getSign', getSign(ltiData.content_item_return_url, postData));
  return {
    ...postData,
    oauth_signature: getSignature(ltiData.content_item_return_url, postData),
  };
};

const getQuery = (ltiData, item) => {
  const baseUrl =
    config.ndlaEnvironment === 'dev'
      ? 'http://localhost:3000'
      : config.ndlaFrontendDomain;
  const query = {
    url: `${baseUrl}/article-iframe/nb/article/${item.id}`,
    context_title: item.title,
    title: item.title,
    return_type: getReturnType(ltiData),
    width: ltiData.launch_presentation_width,
    height: ltiData.launch_presentation_height,
    context_id: ltiData.context_id,
    launch_presentation_document_target: 'iframe',
    lti_message_type: ltiData.lti_message_type,
    lti_version: ltiData.lti_version,
    oauth_callback: ltiData.oauth_callbackm,
    oauth_consumer_key: ltiData.oauth_consumer_key,
    oauth_nonce: ltiData.oauth_nonce,
    oauth_signature: ltiData.oauth_signature,
    oauth_signature_method: ltiData.oauth_signature_method,
    oauth_timestamp: ltiData.oauth_timestamp,
    oauth_version: ltiData.oauth_version,
  };
  const returnUrlParams = queryString.parse(
    ltiData.launch_presentation_return_url,
  );
  return `${ltiData.launch_presentation_return_url}${
    returnUrlParams ? '&' : '?'
  }${queryString.stringify({
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
        }" frameborder="0" allowFullscreen="" aria-label="${item.url.href}" />`,
      });
    } else {
      const oembed = await fetchArticleOembed(item.url);
      this.setState({ isOpen: true, embedCode: oembed.html });
    }
  }

  hideEmbedCode() {
    this.setState({ isOpen: false, embedCode: '' });
  }
  postLtiData = () => {
    const { ltiData, item } = this.props;

    fetch(
      `/lti/deeplinking?launch_presentation_return_url=${encodeURIComponent(
        ltiData.content_item_return_url,
      )}`,
      {
        method: 'POST',
        body: JSON.stringify(getLtiPostData(ltiData, item)),
      },
    );

    //location.href =
  };

  render() {
    const { ltiData, item, t } = this.props;
    console.log(ltiData);
    const isValidLTI =
      ltiData &&
      ltiData.launch_presentation_document_target === 'iframe' &&
      ltiData.launch_presentation_return_url;

    if (isValidLTI) {
      return (
        <div>
          <StyledLinkAsButton href={getQuery(ltiData, item)}>
            {t('lti.embed')}
          </StyledLinkAsButton>
        </div>
      );
    }
    const { isOpen, embedCode } = this.state;
    const postData = getLtiPostData(ltiData, item);
    return (
      <Fragment>
        <form
          method="POST"
          action={ltiData.content_item_return_url}
          encType="application/x-www-form-urlencoded">
          {Object.keys(postData).map(key => {
            if (key === 'content_items') {
              return (
                <input
                  type="hidden"
                  key={key}
                  name={key}
                  value={JSON.stringify(postData[key])}
                />
              );
            }
            return (
              <input
                type="hidden"
                key={key}
                name={key}
                value={`${postData[key] || ''}`}
              />
            );
          })}
          <input type="submit" value="submit" />
        </form>
        <Button onClick={() => this.showEmbedCode(item)}>
          {t('lti.embed')}
        </Button>

        <Button onClick={this.postLtiData}>{t('lti.embed')}</Button>
        <LtiEmbedCode
          isOpen={isOpen}
          code={embedCode}
          onClose={this.hideEmbedCode}
        />
      </Fragment>
    );
  }
}

LtiEmbed.defaultProps = {
  ltiData: {
    accept_copy_advice: 'false',
    accept_media_types: '*/*',
    accept_multiple: 'false',
    accept_presentation_document_targets:
      'embed,frame,iframe,window,popup,overlay,none',
    accept_unsigned: 'false',
    auto_create: 'true',
    can_confirm: 'false',
    data: '',
    content_item_return_url: 'https://ltiapps.net/test/tc-content.php',
    context_id: 'S3294476',
    context_label: 'ST101',
    context_title: 'Telecommuncations 101',
    context_type: 'CourseSection',
    custom_context_memberships_url:
      'https://ltiapps.net/test/tc-memberships.php/context/dab25a70d735ef98b322ca2e266177db',
    custom_context_setting_url:
      'https://ltiapps.net/test/tc-settings.php/context/dab25a70d735ef98b322ca2e266177db',
    custom_lineitem_url:
      'https://ltiapps.net/test/tc-outcomes2.php/dab25a70d735ef98b322ca2e266177db/S3294476/lineitems/dyJ86SiwwA9',
    custom_lineitems_url:
      'https://ltiapps.net/test/tc-outcomes2.php/dab25a70d735ef98b322ca2e266177db/S3294476/lineitems',
    custom_link_memberships_url:
      'https://ltiapps.net/test/tc-memberships.php/link/dab25a70d735ef98b322ca2e266177db',
    custom_link_setting_url:
      'https://ltiapps.net/test/tc-settings.php/link/dab25a70d735ef98b322ca2e266177db',
    custom_result_url:
      'https://ltiapps.net/test/tc-outcomes2.php/dab25a70d735ef98b322ca2e266177db/S3294476/lineitems/dyJ86SiwwA9/results/29123',
    custom_results_url:
      'https://ltiapps.net/test/tc-outcomes2.php/dab25a70d735ef98b322ca2e266177db/S3294476/lineitems/dyJ86SiwwA9/results',
    custom_system_setting_url:
      'https://ltiapps.net/test/tc-settings.php/system/dab25a70d735ef98b322ca2e266177db',
    custom_tc_profile_url:
      'https://ltiapps.net/test/tc-profile.php/dab25a70d735ef98b322ca2e266177db',
    launch_presentation_css_url: 'https://ltiapps.net/test/css/tc.css',
    launch_presentation_document_target: 'frame',
    launch_presentation_locale: 'en-GB',
    lis_course_offering_sourcedid: 'DD-ST101',
    lis_course_section_sourcedid: 'DD-ST101:C1',
    lis_outcome_service_url: 'https://ltiapps.net/test/tc-outcomes.php',
    lis_person_contact_email_primary: 'jbaird@uni.ac.uk',
    lis_person_name_family: 'Baird',
    lis_person_name_full: 'John Logie Baird',
    lis_person_name_given: 'John',
    lis_person_sourcedid: 'sis:942a8dd9',
    lti_message_type: 'ContentItemSelectionRequest',
    lti_version: 'LTI-1p0',
    oauth_callback: 'about:blank',
    oauth_consumer_key: 'jonas',
    oauth_nonce: '43a00854c3ea94eff0d0623e1015f19d',
    oauth_signature: 'P451GzpOVTgH4CR9NnEYYCTYwH8=',
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: '1562159880',
    oauth_version: '1.0',
    roles: 'Instructor',
    tool_consumer_info_product_family_code: 'jisc',
    tool_consumer_info_version: '1.2',
    tool_consumer_instance_contact_email: 'vle@uni.ac.uk',
    tool_consumer_instance_description:
      'A Higher Education establishment in a land far, far away.',
    tool_consumer_instance_guid: 'vle.uni.ac.uk',
    tool_consumer_instance_name: 'University of JISC',
    tool_consumer_instance_url: 'https://vle.uni.ac.uk/',
    user_id: '29123',
    user_image: 'https://ltiapps.net/test/images/lti.gif',
  },
};

LtiEmbed.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }),
  ltiData: LtiDataShape,
};

export default injectT(LtiEmbed);
/*const d = [
  {
    mediaType: 'application/vnd.ims.lti.v1.ltilink',
    '@type': 'LtiLinkItem',
    lineItem: {
      reportingMethod:
        'http://purl.imsglobal.org/ctx/lis/v2p1/Result#totalScore',
      '@type': 'LineItem',
      label: 'Rating (evaluation)',
      assignedActivity: { activityId: 'sdo4tgdr4' },
      scoreConstraints: {
        '@type': 'NumericLimits',
        normalMaximum: 100,
        totalMaximum: 100,
      },
    },
    url: 'http://eval.ltiapps.net/rating/connect.php',
    title: 'Rating (evaluation)',
    text:
      '<p><em>Rating</em> is a simple application developed as a way to demonstrate how to build an IMS LTI tool provider. The application allows teachers to create items which can be rated by students. A separate list of items is maintained for each link from which the tool is launched. If the link has the Outcomes service enabled, then the associated gradebook column will be populated with the proportion of the visible items which each student has rated.</p>',
    icon: {
      '@id': 'http://eval.ltiapps.net/rating/images/icon50.png',
      height: 50,
      width: 50,
    },
    custom: { content_item_id: '5a5f1418-b553-4f3b-9e9a-ab9d015868eb' },
  },
];*/

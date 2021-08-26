/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import config from '../../config';
import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';
import { LtiDataShape } from '../../shapes';

const getSignature = async (contentItemReturnUrl, postData) => {
  const oauthData = await fetch(
    `/lti/oauth?url=${encodeURIComponent(contentItemReturnUrl)}`,
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
  return oauthData;
};

const getLtiPostData = async (ltiData, item = {}) => {
  const baseUrl =
    config.ndlaEnvironment === 'dev'
      ? 'http://localhost:3000'
      : config.ndlaFrontendDomain;
  const iframeurl = `${baseUrl}/article-iframe/article/${item.id}`;
  const postData = {
    oauth_callback: ltiData.oauth_callback || '',
    oauth_consumer_key: ltiData.oauth_consumer_key || 'key',
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
          placementAdvice: {
            presentationDocumentTarget: 'iframe',
            displayWidth: 900,
            displayHeight: 2000,
          },
        },
      ],
    },
  };

  const oauthData = await getSignature(
    ltiData.content_item_return_url,
    postData,
  );
  return {
    ...postData,
    oauth_signature: oauthData.oauth_signature,
    oauth_nonce: oauthData.oauth_nonce,
  };
};

const LtiDeepLinking = ({ ltiData, item }) => {
  const [postData, setPostData] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    updatePostData();
  }, [ltiData]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePostData = async () => {
    const data = await getLtiPostData(ltiData, item);
    setPostData(data);
  };

  return (
    <form
      method="POST"
      action={ltiData.content_item_return_url}
      encType="application/x-www-form-urlencoded">
      {Object.keys(postData).map(key => (
        <input
          type="hidden"
          key={key}
          name={key}
          value={
            postData[key] instanceof Object
              ? JSON.stringify(postData[key])
              : postData[key]
          }
        />
      ))}
      <Button type="submit">{t('lti.embed')}</Button>
    </form>
  );
};

LtiDeepLinking.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }),
  ltiData: LtiDataShape,
};

export default LtiDeepLinking;

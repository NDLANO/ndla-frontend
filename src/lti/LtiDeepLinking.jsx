/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const getLtiPostData = (ltiData, item = {}) => {
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
  console.log(
    'getsginature',
    getSignature(ltiData.content_item_return_url, postData),
  );

  console.log('getSign', getSign(ltiData.content_item_return_url, postData));
  return {
    ...postData,
    oauth_signature: getSignature(ltiData.content_item_return_url, postData),
  };
};

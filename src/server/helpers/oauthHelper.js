import oauthSignature from 'oauth-signature';
import { getEnvironmentVariabel } from '../../config';

export const generateOauthSignature = (url, body) => {
  const data = {
    oauth_callback: body.oauth_callback || '',
    oauth_consumer_key: body.oauth_consumer_key || 'key',
    oauth_nonce: body.oauth_nonce || '',
    oauth_signature_method: body.oauth_signature_method || '',
    oauth_timestamp: body.oauth_timestamp || '',
    oauth_version: body.oauth_version || '',
    data: body.data || '',
    lti_message_type: 'ContentItemSelection',
    lti_version: 'LTI-1p0',
    content_items: body.content_items || '',
  };
  const HTTPMethod = 'POST';
  const consumerSecret = getEnvironmentVariabel(
    'NDLA_LTI_OAUTH_SECRET_KEY',
    '',
  );
  return oauthSignature.generate(
    HTTPMethod,
    decodeURIComponent(url),
    data,
    consumerSecret,
    '',
    { encodeSignature: false },
  );
};

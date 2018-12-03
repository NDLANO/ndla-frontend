/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import handleError from '../../util/handleError';
import { fetchArticleOembed } from '../../containers/ArticlePage/articleApi';

const bodyFields = {
  lti_message_type: { required: true, value: 'basic-lti-launch-request' },
  lti_version: { required: true, value: 'LTI-1p0' },
  resource_link_id: { required: true },
  launch_presentation_return_url: { required: true },
  launch_presentation_height: { required: false },
  launch_presentation_width: { required: false },
};

export function parseAndValidateParameters(body) {
  let validBody = true;
  const errorMessages = [];
  Object.keys(bodyFields).forEach(key => {
    const bodyValue = body[key];
    if (bodyFields[key].required && !bodyValue) {
      validBody = false;
      errorMessages.push({ field: key, message: 'Missing required field' });
      return;
    }
    if (bodyFields[key].value && bodyFields[key].value !== bodyValue) {
      errorMessages.push({
        field: key,
        message: `Value should be ${bodyFields[key].value}`,
      });
      validBody = false;
    }
  });
  return validBody
    ? { valid: true }
    : { valid: false, messages: errorMessages };
}

export async function ltiPostRoute(req) {
  const { body } = req;

  const validParameters = parseAndValidateParameters(body);
  if (!validParameters.valid) {
    return {
      status: BAD_REQUEST,
      data: `Bad request. ${validParameters.messages
        .map(
          message => `Field ${message.field} with error: ${message.message}.`,
        )
        .join(', ')}`,
    };
  }

  try {
    const oembedArticle = await fetchArticleOembed(body.url);
    return oembedArticle;
  } catch (error) {
    handleError(error);
    const status = error.status || INTERNAL_SERVER_ERROR;
    return {
      status,
      data: 'Internal server error',
    };
  }
}

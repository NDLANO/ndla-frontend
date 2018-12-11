/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import Helmet from 'react-helmet';
import { BAD_REQUEST, OK } from 'http-status';
import { getHtmlLang, getLocaleObject } from '../../i18n';
import { renderPage, renderHtml } from '../helpers/render';

const bodyFields = {
  lti_message_type: { required: true, value: 'basic-lti-launch-request' },
  lti_version: { required: true, value: 'LTI-1p0' },
  launch_presentation_return_url: { required: false },
  launch_presentation_document_target: { required: false },
  launch_presentation_height: { required: false },
  launch_presentation_width: { required: false },
};

const assets =
  process.env.NODE_ENV !== 'unittest'
    ? require(process.env.RAZZLE_ASSETS_MANIFEST) //eslint-disable-line
    : {
        client: { css: 'mock.css' },
        ltiEmbed: { js: 'mock.js' },
        mathJaxConfig: { js: 'mock.js' },
      };

if (process.env.NODE_ENV === 'unittest') {
  Helmet.canUseDOM = false;
}

const getAssets = () => ({
  css: assets.client.css,
  js: [assets.ltiEmbed.js],
  mathJaxConfig: { js: assets.mathJaxConfig.js },
});

function doRenderPage(initialProps) {
  const Page = '';
  const { html, ...docProps } = renderPage(Page, getAssets(), {
    initialProps,
  });
  return { html, docProps: { ...docProps, useZendesk: false } };
}

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
    ? {
        valid: true,
        ltiData: {
          ...body,
        },
      }
    : { valid: false, messages: errorMessages };
}

export function ltiRoute(req) {
  const isPostRequest = req.method === 'POST';
  const validParameters = isPostRequest
    ? parseAndValidateParameters(req.body)
    : {};
  console.log(isPostRequest);
  if (isPostRequest) {
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
  }

  const lang = getHtmlLang(defined(req.params.lang, ''));
  const locale = getLocaleObject(lang);

  const { html, docProps } = doRenderPage({
    locale,
    ltiData: validParameters.ltiData,
  });

  return renderHtml(req, html, { status: OK }, docProps);
}

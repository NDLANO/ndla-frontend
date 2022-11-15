/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetProvider } from 'react-helmet-async';
import { BAD_REQUEST, OK } from '../../statusCodes';
import { getHtmlLang, getLocaleObject } from '../../i18n';
import { renderPage, renderHtml } from '../helpers/render';

const bodyFields = {
  lti_message_type: {
    required: true,
    value: [
      'basic-lti-launch-request',
      'ToolProxyRegistrationRequest',
      'ContentItemSelectionRequest',
    ],
  },
  lti_version: { required: true, value: ['LTI-1p0', 'LTI-2p0'] },
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
        lti: { js: 'mock.js' },
        polyfill: { js: 'polyfill.js' },
        mathJaxConfig: { js: 'mock.js' },
      };

if (process.env.NODE_ENV === 'unittest') {
  HelmetProvider.canUseDOM = false;
}

const getAssets = () => ({
  css: assets['client.css'],
  js: [{ src: assets['lti.js'] }],
  polyfill: { src: assets['polyfill.js'] },
  mathJaxConfig: { js: assets['mathJaxConfig.js'] },
});

function doRenderPage(initialProps) {
  const helmetContext = {};
  const Page = <HelmetProvider context={helmetContext}>{''}</HelmetProvider>;
  const { html, ...docProps } = renderPage(Page, getAssets(), {
    initialProps,
  });
  return { html, docProps, helmetContext };
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
    if (bodyFields[key].value && !bodyFields[key].value.includes(bodyValue)) {
      errorMessages.push({
        field: key,
        message: `Value should be one of ${bodyFields[key].value}`,
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

  const lang = getHtmlLang(req.params.lang ?? '');
  const locale = getLocaleObject(lang);

  const { html, docProps, helmetContext } = doRenderPage({
    locale,
    ltiData: validParameters.ltiData,
  });

  return renderHtml(req, html, { status: OK }, docProps, helmetContext);
}

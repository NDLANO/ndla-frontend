/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request } from "express";
import { FilledContext, HelmetProvider } from "react-helmet-async";
import { getHtmlLang, getLocaleObject } from "../../i18n";
import { BAD_REQUEST, OK } from "../../statusCodes";
import { Assets } from "../helpers/Document";
import { renderPage, renderHtml } from "../helpers/render";

const bodyFields: Record<string, { required: boolean; value?: any }> = {
  lti_message_type: {
    required: true,
    value: ["basic-lti-launch-request", "ToolProxyRegistrationRequest", "ContentItemSelectionRequest"],
  },
  lti_version: { required: true, value: ["LTI-1p0", "LTI-2p0"] },
  launch_presentation_return_url: { required: false },
  launch_presentation_document_target: { required: false },
  launch_presentation_height: { required: false },
  launch_presentation_width: { required: false },
};

//@ts-ignore
const assets = require(process.env.ASSETS_MANIFEST);

if (process.env.NODE_ENV === "unittest") {
  HelmetProvider.canUseDOM = false;
}

const getAssets = (): Assets => ({
  css: assets["client.css"],
  js: [{ src: assets["lti.js"]! }],
  mathJaxConfig: { js: assets["mathJaxConfig.js"]! },
});

function doRenderPage<T extends object>(initialProps: T) {
  //@ts-ignore
  const helmetContext: FilledContext = {};
  const Page = <HelmetProvider context={helmetContext}>{""}</HelmetProvider>;
  const { html, ...docProps } = renderPage(Page, getAssets(), {
    initialProps,
  });
  return { html, docProps, helmetContext };
}

export function parseAndValidateParameters(body: any) {
  let validBody = true;
  const errorMessages: { field: string; message: string }[] = [];
  Object.keys(bodyFields).forEach((key) => {
    const bodyValue = body[key];
    if (bodyFields[key]?.required && !bodyValue) {
      validBody = false;
      errorMessages.push({ field: key, message: "Missing required field" });
      return;
    }
    if (bodyFields[key]?.value && !bodyFields[key]?.value.includes(bodyValue)) {
      errorMessages.push({
        field: key,
        message: `Value should be one of ${bodyFields[key]?.value}`,
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

export function ltiRoute(req: Request) {
  const isPostRequest = req.method === "POST";
  const validParameters = isPostRequest ? parseAndValidateParameters(req.body) : undefined;
  if (isPostRequest) {
    if (!validParameters?.valid) {
      const messages = validParameters?.messages
        ?.map((msg) => `Field ${msg.field} with error: ${msg.message}.`)
        .join(",");
      return {
        status: BAD_REQUEST,
        data: `Bad request. ${messages}`,
      };
    }
  }

  const lang = getHtmlLang(req.params.lang ?? "");
  const locale = getLocaleObject(lang).abbreviation;

  const { html, docProps, helmetContext } = doRenderPage({
    locale,
    ltiData: validParameters?.ltiData,
  });

  return renderHtml(html, { status: OK }, docProps, helmetContext);
}

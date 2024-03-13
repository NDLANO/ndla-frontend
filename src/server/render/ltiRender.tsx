/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";
import { getHtmlLang, getLocaleObject } from "../../i18n";
import { BAD_REQUEST, OK } from "../../statusCodes";
import { RenderFunc } from "../serverHelpers";

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

export const ltiRender: RenderFunc = async (req) => {
  const isPostRequest = req.method === "POST";
  const validParameters = isPostRequest ? parseAndValidateParameters(req.body) : undefined;
  if (isPostRequest) {
    if (!validParameters?.valid) {
      const messages = validParameters?.messages
        ?.map((msg) => `Field ${msg.field} with error: ${msg.message}.`)
        .join(",");
      return {
        status: BAD_REQUEST,
        data: { htmlContent: `Bad request. ${messages}` },
      };
    }
  }

  const lang = getHtmlLang(req.params.lang ?? "");
  const locale = getLocaleObject(lang).abbreviation;

  return {
    status: OK,
    data: {
      htmlContent: "",
      data: {
        initialProps: {
          ltiData: validParameters?.ltiData,
          locale,
        },
        config: config,
      },
    },
  };
};

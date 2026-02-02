/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { LtiData, LtiItem } from "../../interfaces";

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    position: "relative",
    width: "100%",
  },
});

const getReturnType = (ltiData: LtiData) => {
  if (!ltiData.ext_content_return_types) {
    return "iframe";
  }
  if (ltiData.ext_content_return_types === "lti_launch_url") {
    return "lti_launch_url";
  }
  if (ltiData.ext_content_return_types.includes("iframe") || ltiData.ext_content_return_types.includes("oembed")) {
    return "iframe";
  }
  return "lti_launch_url";
};
const getQuery = (ltiData: LtiData, item: LtiItem) => {
  const baseUrl = config.ndlaEnvironment === "dev" ? "http://localhost:3000" : config.ndlaFrontendDomain;
  const returnType = getReturnType(ltiData);
  const params = new URLSearchParams({
    url: `${baseUrl}/article-iframe/article/${item.id}`,
    return_type: returnType,
  });
  if (item.title) {
    params.append("title", item.title);
  }
  if (ltiData.launch_presentation_width) {
    params.append("width", ltiData.launch_presentation_width);
  }
  if (ltiData.launch_presentation_height) {
    params.append("height", ltiData.launch_presentation_height);
  }
  if (returnType === "lti_launch_url" && item.title) {
    params.append("text", item.title);
  }

  return `${ltiData.launch_presentation_return_url}?${params.toString()}`;
};

interface Props {
  ltiData: LtiData;
  item: LtiItem;
}
export const LtiBasicLaunch = ({ ltiData, item }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledSafeLinkButton asAnchor to={getQuery(ltiData, item)}>
      {t("lti.embed")}
    </StyledSafeLinkButton>
  );
};

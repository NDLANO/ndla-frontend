/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import config from "../../config";
import { LtiData, LtiItem } from "../../interfaces";

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
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
  const query = {
    url: `${baseUrl}/article-iframe/article/${item.id}`,
    title: item.title,
    return_type: getReturnType(ltiData),
    width: ltiData.launch_presentation_width,
    height: ltiData.launch_presentation_height,
  };
  return `${ltiData.launch_presentation_return_url}?${queryString.stringify({
    ...query,
    text: query.return_type === "lti_launch_url" ? item.title : undefined,
  })}`;
};

interface Props {
  ltiData: LtiData;
  item: LtiItem;
}
const LtiBasicLaunch = ({ ltiData, item }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledSafeLinkButton asAnchor to={getQuery(ltiData, item)}>
      {t("lti.embed")}
    </StyledSafeLinkButton>
  );
};

export default LtiBasicLaunch;

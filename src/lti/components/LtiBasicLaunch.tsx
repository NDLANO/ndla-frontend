/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { fonts, misc, spacing } from "@ndla/core";
import config from "../../config";
import { LtiData, LtiItem } from "../../interfaces";

const StyledLinkAsButton = styled("a")`
  display: inline-block;
  color: white;
  background-color: #20588f;
  border: 2px solid #20588f;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xxsmall} 13px;
  outline-width: 0;
  cursor: pointer;
  text-decoration: none;
  ${fonts.size.text.metaText.small};
  font-weight: ${fonts.weight.bold};
  transition: all 0.2s cubic-bezier(0.17, 0.04, 0.03, 0.94);
  box-shadow: none;
  margin-right: 13px;
  &:hover,
  &:focus {
    color: white;
    background-color: #184673;
    border: 2px solid rgba(32, 88, 143, 0);
    transform: translateY(1px) translateX(1px);
  }
`;

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
  return <StyledLinkAsButton href={getQuery(ltiData, item)}>{t("lti.embed")}</StyledLinkAsButton>;
};

export default LtiBasicLaunch;

/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { ChevronDown } from "@ndla/icons/common";
import { useIsNdlaFilm } from "../../routeHelpers";

interface Props {
  children?: ReactNode;
}

const ToggleButton = styled(ButtonV2)`
  margin-left: ${spacing.normal};
  &:hover,
  &:focus-within {
    background-color: inherit;
  }
  &[aria-expanded="true"] {
    svg {
      transform: rotate(180deg);
    }
  }
`;

const ExpandContent = styled.div`
  display: none;
  width: 100%;
  &[aria-hidden="false"] {
    display: block;
  }
  article {
    margin-bottom: 0px;
  }
`;

const TopicArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  border-left: ${spacing.xsmall} solid ${colors.brand.light};
  padding-top: ${spacing.xsmall};
  &:has(div[aria-hidden="true"]) {
    padding-bottom: ${spacing.xsmall};
  }
  align-items: flex-start;
`;

const TopicArticle = ({ children }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const id = useId();
  const ndlaFilm = useIsNdlaFilm();
  return (
    <TopicArticleWrapper>
      <ToggleButton
        variant="link"
        onClick={() => setExpanded((val) => !val)}
        aria-expanded={expanded}
        aria-controls={id}
        inverted={ndlaFilm}
      >
        {t(`navigation.${expanded ? "showShorterDescription" : "showLongerDescription"}`)}
        <ChevronDown />
      </ToggleButton>
      <ExpandContent id={id} aria-hidden={!expanded}>
        {children}
      </ExpandContent>
    </TopicArticleWrapper>
  );
};

export default TopicArticle;

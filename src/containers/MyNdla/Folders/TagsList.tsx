/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { HashTag } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import { routes } from "../../../routeHelpers";
import { getAllTags } from "../../../util/folderHelpers";
import { useFolders } from "../folderMutations";

const StyledUl = styled.ul`
  padding: 0px;
  margin: ${spacing.small} 0;
  list-style: none;
  display: flex;
  gap: ${spacing.small};
  flex-wrap: wrap;
`;

const StyledLi = styled.li`
  padding: 0;
`;

const MyTagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  flex: 1;
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  width: fit-content;
  display: flex;
  align-items: center;
`;

const TagsList = () => {
  const { folders } = useFolders();
  const { t } = useTranslation();
  const tags = useMemo(() => getAllTags(folders), [folders]);

  return (
    <MyTagsContainer>
      {tags.length ? (
        <nav aria-label={t("myNdla.myTags")}>
          <StyledUl>
            {tags.map((tag) => (
              <StyledLi key={tag}>
                <StyledSafeLinkButton colorTheme="greyLighter" shape="pill" key={tag} to={routes.myNdla.tag(tag)}>
                  <HashTag />
                  {tag}
                </StyledSafeLinkButton>
              </StyledLi>
            ))}
          </StyledUl>
        </nav>
      ) : null}
    </MyTagsContainer>
  );
};

export default TagsList;

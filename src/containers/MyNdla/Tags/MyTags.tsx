/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { HashTag } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import { AuthContext } from "../../../components/AuthenticationContext";
import { routes } from "../../../routeHelpers";
import { getAllTags, getResourcesForTag } from "../../../util/folderHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import { usePrevious } from "../../../util/utilityHooks";
import NotFoundPage from "../../NotFoundPage/NotFoundPage";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import TitleWrapper from "../components/TitleWrapper";
import { useFolders } from "../folderMutations";

const StyledUl = styled.ul`
  padding: 0px;
  margin: ${spacing.small} 0;
  list-style: none;
  display: flex;
  gap: ${spacing.small};
  flex-wrap: wrap;
`;

const StyledTitleWrapper = styled(TitleWrapper)`
  padding-top: 0;
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

const MyTags = () => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const { folders } = useFolders();
  const { tag } = useParams();
  const { t } = useTranslation();
  const title = useMemo(() => (tag ? t("htmlTitles.myTagPage", { tag }) : t("htmlTitles.myTagsPage")), [t, tag]);
  const tags = useMemo(() => getAllTags(folders), [folders]);
  const resources = useMemo(() => (tag ? getResourcesForTag(folders, tag) : []), [tag, folders]);
  const previousResources = usePrevious(resources);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({ title: title, dimensions: getAllDimensions({ user }) });
  }, [authContextLoaded, title, trackPageView, user]);

  useEffect(() => {
    if (tag && !!previousResources?.length && resources.length === 0) {
      navigate(routes.myNdla.tags);
    }
  }, [resources, previousResources, tag, navigate]);

  if (tag && tags && !tags.includes(tag)) {
    return <NotFoundPage />;
  }

  return (
    <MyTagsContainer>
      <HelmetWithTracker title={title} />
      <StyledTitleWrapper>
        <MyNdlaBreadcrumb page="folders" breadcrumbs={tag ? [{ name: tag, id: tag }] : []} />
        {tags.length > 0 && (
          <Heading element="h2" headingStyle="h2" margin="none">
            {tag ? tag : t("myNdla.myTags")}
          </Heading>
        )}
      </StyledTitleWrapper>
      {!tag && tags.length ? <Tags tags={tags} /> : null}
    </MyTagsContainer>
  );
};

interface TagsProps {
  tags: string[];
}

const Tags = ({ tags }: TagsProps) => {
  const { t } = useTranslation();
  return (
    <>
      <nav aria-label={t("myNdla.myTags")}>
        <StyledUl>
          {tags.map((tag) => (
            <StyledLi key={tag}>
              <StyledSafeLinkButton
                colorTheme="greyLighter"
                shape="pill"
                key={tag}
                to={routes.myNdla.tag(tag)}
              >
                <HashTag />
                {tag}
              </StyledSafeLinkButton>
            </StyledLi>
          ))}
        </StyledUl>
      </nav>
    </>
  );
};
export default MyTags;

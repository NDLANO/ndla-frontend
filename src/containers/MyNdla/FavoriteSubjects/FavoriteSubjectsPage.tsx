/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Forward } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import { getAllDimensions } from "../../../util/trackingUtil";
import SubjectLink from "../../AllSubjectsPage/SubjectLink";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import MyNdlaTitle from "../components/MyNdlaTitle";
import SettingsMenu from "../components/SettingsMenu";
import { buttonCss } from "../components/toolbarStyles";
import { useFavouriteSubjects } from "../folderMutations";
import { sortSubjectsByRecentlyFavourited } from "../myNdlaUtils";

const StyledSubjectLink = styled(SubjectLink)`
  border: 1px solid ${colors.brand.neutral7};
  padding: ${spacing.small};
  border-radius: 2px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.large};
  margin-top: ${spacing.normal};
`;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 100%;
  gap: ${spacing.small};
`;

const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
`;

const FavoriteSubjectsPage = () => {
  const { t } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const favouriteSubjectsQuery = useFavouriteSubjects(user?.favoriteSubjects ?? [], {
    skip: !user?.favoriteSubjects.length,
  });
  const { trackPageView } = useTracker();
  const navigate = useNavigate();

  const sortedSubjects = useMemo(() => {
    return sortSubjectsByRecentlyFavourited(favouriteSubjectsQuery.data?.subjects ?? [], user?.favoriteSubjects ?? []);
  }, [favouriteSubjectsQuery.data?.subjects, user?.favoriteSubjects]);

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({
      title: t("myNdla.favoriteSubjects.title"),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  const allSubjects = useMemo(
    () => (
      <StyledListItem key="allSubjects">
        <SafeLinkButton css={buttonCss} variant="ghost" colorTheme="lighter" to="/subjects">
          {t("subjectsPage.allSubjects")}
          <Forward size="nsmall" />
        </SafeLinkButton>
      </StyledListItem>
    ),
    [t],
  );

  const dropDown = useMemo(
    () => (
      <SettingsMenu
        menuItems={[
          {
            text: t("subjectsPage.allSubjects"),
            icon: <Forward size="nsmall" />,
            onClick: () => navigate("/subjects"),
          },
        ]}
        modalHeader={t("myNdla.tools")}
      />
    ),
    [t, navigate],
  );

  if (favouriteSubjectsQuery.loading) {
    return <Spinner />;
  }

  return (
    <MyNdlaPageWrapper buttons={allSubjects} dropDownMenu={dropDown}>
      <Wrapper>
        <HelmetWithTracker title={t("myNdla.favoriteSubjects.title")} />
        <MyNdlaTitle title={t("myNdla.favoriteSubjects.title")} />
        {favouriteSubjectsQuery.loading ? (
          <Spinner />
        ) : !favouriteSubjectsQuery.data?.subjects?.length ? (
          <p>{t("myNdla.favoriteSubjects.noFavorites")}</p>
        ) : (
          <StyledUl>
            {sortedSubjects.map((subject) => (
              <StyledSubjectLink key={subject.id} favorites={user?.favoriteSubjects} subject={subject} />
            ))}
          </StyledUl>
        )}
      </Wrapper>
    </MyNdlaPageWrapper>
  );
};

export default FavoriteSubjectsPage;

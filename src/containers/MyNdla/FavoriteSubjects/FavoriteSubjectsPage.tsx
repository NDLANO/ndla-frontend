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
import { ArrowRightLine } from "@ndla/icons/common";
import { Skeleton, Spinner } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import { getAllDimensions } from "../../../util/trackingUtil";
import { GridList } from "../../AllSubjectsPage/SubjectCategory";
import SubjectLink from "../../AllSubjectsPage/SubjectLink";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import MyNdlaTitle from "../components/MyNdlaTitle";
import SettingsMenu from "../components/SettingsMenu";
import { useFavouriteSubjects } from "../folderMutations";
import { sortSubjectsByRecentlyFavourited } from "../myNdlaUtils";

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
  base: {
    gap: "xxlarge",
  },
});

const LoadingGrid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr",
    columnGap: "xxlarge",
    gap: "xsmall",
    tablet: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
});

const LoadingItem = styled(Skeleton, {
  base: {
    height: "xxlarge",
    width: "100%",
  },
});

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
      <li key="allSubjects">
        <SafeLinkButton variant="tertiary" to="/subjects">
          {t("subjectsPage.allSubjects")}
          <ArrowRightLine size="small" />
        </SafeLinkButton>
      </li>
    ),
    [t],
  );

  const dropDown = useMemo(
    () => (
      <SettingsMenu
        menuItems={[
          {
            type: "action",
            value: "allSubjects",
            text: t("subjectsPage.allSubjects"),
            icon: <ArrowRightLine size="small" />,
            onClick: () => navigate("/subjects"),
          },
        ]}
        modalHeader={t("myNdla.tools")}
      />
    ),
    [t, navigate],
  );

  return (
    <StyledMyNdlaPageWrapper buttons={allSubjects} dropDownMenu={dropDown}>
      <HelmetWithTracker title={t("myNdla.favoriteSubjects.title")} />
      <MyNdlaTitle title={t("myNdla.favoriteSubjects.title")} />
      {favouriteSubjectsQuery.loading || true ? (
        <LoadingGrid>
          <LoadingItem />
          <LoadingItem />
          <LoadingItem />
          <LoadingItem />
        </LoadingGrid>
      ) : !favouriteSubjectsQuery.data?.subjects?.length ? (
        <p>{t("myNdla.favoriteSubjects.noFavorites")}</p>
      ) : (
        <GridList>
          {sortedSubjects.map((subject) => (
            <SubjectLink subject={subject} key={subject.id} favorites={user?.favoriteSubjects ?? []} />
          ))}
        </GridList>
      )}
    </StyledMyNdlaPageWrapper>
  );
};

export default FavoriteSubjectsPage;

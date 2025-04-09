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
import { ArrowRightLine } from "@ndla/icons";
import { Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import MyNdlaTitle from "../../../components/MyNdla/MyNdlaTitle";
import { useFavouriteSubjects } from "../../../mutations/folderMutations";
import { getAllDimensions } from "../../../util/trackingUtil";
import { GridList } from "../../AllSubjectsPage/SubjectCategory";
import SubjectLink from "../../AllSubjectsPage/SubjectLink";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { MenuItemProps } from "../components/SettingsMenu";
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

  const menuItems: MenuItemProps[] = [
    {
      type: "link",
      value: "allSubjects",
      icon: <ArrowRightLine size="small" />,
      text: t("subjectsPage.allSubjects"),
      link: "/subjects",
      onClick: () => navigate("/subjects"),
    },
  ];

  return (
    <StyledMyNdlaPageWrapper menuItems={menuItems}>
      <HelmetWithTracker title={t("myNdla.favoriteSubjects.title")} />
      <MyNdlaTitle title={t("myNdla.favoriteSubjects.title")} />
      {favouriteSubjectsQuery.loading ? (
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

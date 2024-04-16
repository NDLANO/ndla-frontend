/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Heading } from "@ndla/typography";
import { Subject } from "./interfaces";
import { GridList } from "./SubjectCategory";
import SubjectLink from "./SubjectLink";
import { sortSubjectsByRecentlyFavourited } from "../MyNdla/myNdlaUtils";

interface Props {
  subjects: Subject[];
  favorites: string[];
}

const FavoriteSubjects = ({ favorites, subjects }: Props) => {
  const { t } = useTranslation();

  const mappedFavorites = useMemo(() => {
    return sortSubjectsByRecentlyFavourited(subjects, favorites);
  }, [favorites, subjects]);

  return (
    <div>
      <Heading element="h2" headingStyle="list-title">
        {t("subjectsPage.myFavoriteSubjects")}
      </Heading>
      <GridList>
        {mappedFavorites.map((subject) => (
          <SubjectLink favorites={favorites} key={subject.id} subject={subject} />
        ))}
      </GridList>
    </div>
  );
};

export default FavoriteSubjects;

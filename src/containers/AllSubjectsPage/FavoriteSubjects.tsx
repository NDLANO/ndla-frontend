/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading } from "@ndla/primitives";
import { keyBy } from "@ndla/util";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GQLTaxBase } from "../../graphqlTypes";
import { GridList } from "./SubjectCategory";
import { SubjectLink } from "./SubjectLink";

interface Props {
  subjects: GQLTaxBase[];
  favorites: string[];
}

export const FavoriteSubjects = ({ favorites, subjects }: Props) => {
  const { t } = useTranslation();

  const mappedFavorites = useMemo(() => {
    const keyed = keyBy(subjects, (sub) => sub.id);
    return favorites.map((id) => keyed[id]).filter((sub): sub is GQLTaxBase => !!sub);
  }, [favorites, subjects]);

  return (
    <div>
      <Heading textStyle="title.medium" consumeCss asChild>
        <h2>{t("subjectsPage.myFavoriteSubjects")}</h2>
      </Heading>
      <GridList>
        {mappedFavorites.map((subject) => (
          <SubjectLink favorites={favorites} key={subject.id} subject={subject} />
        ))}
      </GridList>
    </div>
  );
};

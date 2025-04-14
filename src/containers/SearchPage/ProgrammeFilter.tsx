/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { CheckLine } from "@ndla/icons";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Heading,
  Spinner,
} from "@ndla/primitives";
import { FilterContainer } from "./FilterContainer";
import { GQLProgrammesQuery, GQLProgrammesQueryVariables } from "../../graphqlTypes";

export const ProgrammeFilter = () => {
  const { t } = useTranslation();

  const { data, loading } = useQuery<GQLProgrammesQuery, GQLProgrammesQueryVariables>(programmesQuery);

  // TODO: Implement once we have search-api support
  const onValueChange = useCallback(() => {}, []);

  return (
    <FilterContainer>
      <Heading textStyle="label.medium" fontWeight="bold" asChild consumeCss>
        <h3>{t("searchPage.programmeFilter.title")}</h3>
      </Heading>
      <CheckboxGroup value={[]} onValueChange={onValueChange}>
        {loading ? (
          <Spinner />
        ) : (
          data?.programmes?.map((programme) => (
            <CheckboxRoot key={programme.id} value={programme.id}>
              <CheckboxControl>
                <CheckboxIndicator asChild>
                  <CheckLine />
                </CheckboxIndicator>
              </CheckboxControl>
              <CheckboxLabel>{programme.title.title}</CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
          ))
        )}
      </CheckboxGroup>
    </FilterContainer>
  );
};

const programmesQuery = gql`
  query programmes {
    programmes {
      id
      title {
        title
      }
    }
  }
`;

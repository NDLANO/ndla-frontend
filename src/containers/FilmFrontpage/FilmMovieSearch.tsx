/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing, mq, breakpoints, colors } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Option, Select, SingleValue } from "@ndla/select";
import { Heading } from "@ndla/typography";
import { OneColumn } from "@ndla/ui";
import { MovieResourceType } from "./resourceTypes";

const StyledHeading = styled(Heading)`
  color: ${colors.white};
  flex: 1;
  text-align: center;
`;

const TopicNavigation = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} ${spacing.small};
  ${mq.range({ from: breakpoints.tablet })} {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  column-gap: ${spacing.normal};
  row-gap: ${spacing.small};
  margin: 0px;
  padding: 0px;
  ${mq.range({ from: breakpoints.tablet })} {
    display: grid;
    grid-template-rows: repeat(4, auto);
    grid-template-columns: 1fr;
    grid-auto-flow: column;
  }
`;

const StyledListItem = styled.li`
  margin: 0px;
  padding: 0px;
  a {
    color: ${colors.white};
    &:hover,
    &:focus-within {
      color: ${colors.brand.light};
    }
  }
`;

const StyledNav = styled.nav`
  flex: 1;
`;

interface Props {
  topics?: { id: string; path: string; name: string }[];
  onChangeResourceType: (resourceType?: string) => void;
  resourceTypeSelected?: MovieResourceType;
  resourceTypes: MovieResourceType[];
  skipToContentId?: string;
}

const FilmMovieSearch = ({
  topics = [],
  onChangeResourceType,
  resourceTypes,
  resourceTypeSelected,
  skipToContentId,
}: Props) => {
  const { t } = useTranslation();
  const selectedOption = useMemo(() => {
    if (resourceTypeSelected) {
      return {
        value: resourceTypeSelected.id,
        label: resourceTypeSelected.name,
      };
    }
    return { value: "fromNdla", label: t("ndlaFilm.search.categoryFromNdla") };
  }, [resourceTypeSelected, t]);

  const options: Option[] = useMemo(() => {
    const fromNdla = {
      value: "fromNdla",
      label: t("ndlaFilm.search.categoryFromNdla"),
    };
    return [fromNdla].concat(resourceTypes.map((rt) => ({ value: rt.id, label: rt.name })));
  }, [resourceTypes, t]);

  const onChange = useCallback(
    (value: SingleValue) => {
      if (value?.value === "fromNdla") {
        onChangeResourceType();
      } else {
        onChangeResourceType(value?.value);
      }
    },
    [onChangeResourceType],
  );

  return (
    <OneColumn>
      <TopicNavigation>
        <StyledHeading element="h2" headingStyle="list-title" margin="none" id={skipToContentId}>
          {`${t("ndlaFilm.subjectsInMovies")}:`}
        </StyledHeading>
        <StyledNav aria-labelledby={skipToContentId}>
          <StyledUl>
            {topics.map((topic) => (
              <StyledListItem key={topic.id}>
                <SafeLink to={topic.path} key={topic.id}>
                  <span>{topic.name}</span>
                </SafeLink>
              </StyledListItem>
            ))}
          </StyledUl>
        </StyledNav>
      </TopicNavigation>
      <Select<false>
        options={options}
        value={selectedOption}
        onChange={onChange}
        colorTheme="white"
        placeholder={t("ndlaFilm.search.chooseCategory")}
        prefix={`${t("ndlaFilm.search.chooseCategory")} `}
      />
    </OneColumn>
  );
};

export default FilmMovieSearch;

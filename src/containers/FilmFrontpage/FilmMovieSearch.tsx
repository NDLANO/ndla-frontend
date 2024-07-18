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
import { ChevronDown } from "@ndla/icons/common";
import { Done } from "@ndla/icons/editor";
import {
  Button,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { Heading } from "@ndla/typography";
import { OneColumn } from "@ndla/ui";
import { MovieResourceType } from "./resourceTypes";

const StyledHeading = styled(Heading)`
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
  color: ${colors.black};

  a,
  a:hover {
    color: ${colors.text.light};
  }
`;

const StyledNav = styled.nav`
  flex: 1;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
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

  const options = useMemo(() => {
    const fromNdla = {
      value: "fromNdla",
      label: t("ndlaFilm.search.categoryFromNdla"),
    };
    return [fromNdla].concat(resourceTypes.map((rt) => ({ value: rt.id, label: rt.name })));
  }, [resourceTypes, t]);

  const onChange = useCallback(
    (value) => {
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
                  {topic.name}
                </SafeLink>
              </StyledListItem>
            ))}
          </StyledUl>
        </StyledNav>
      </TopicNavigation>
      <SelectRoot
        items={options}
        onValueChange={onChange}
        defaultValue={[selectedOption.value]}
        positioning={{
          sameWidth: true,
        }}
      >
        <SelectLabel>{t("ndlaFilm.search.chooseCategory")}</SelectLabel>
        <SelectControl>
          <SelectTrigger asChild>
            <FullWidthButton variant="secondary">
              <SelectValueText />
              <SelectIndicator asChild>
                <ChevronDown />
              </SelectIndicator>
            </FullWidthButton>
          </SelectTrigger>
        </SelectControl>
        <SelectPositioner>
          <SelectContent>
            {options.map((option) => (
              <SelectItem item={option} key={option.value}>
                <SelectItemText>{option.label}</SelectItemText>
                <SelectItemIndicator asChild>
                  <Done />
                </SelectItemIndicator>
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>
    </OneColumn>
  );
};

export default FilmMovieSearch;

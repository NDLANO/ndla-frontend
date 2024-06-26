/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionContent } from "@ndla/accordion";
import { spacing, breakpoints, mq, colors } from "@ndla/core";
import { Heading, Text } from "@ndla/typography";
import { ContentLoader, ProgrammeCard, ProgrammeV2 } from "@ndla/ui";
import { useUserAgent } from "../../../UserAgentContext";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding-top: ${spacing.xxsmall};
  ${mq.range({ from: breakpoints.desktop })} {
    padding-top: ${spacing.nsmall};
  }
`;

const Desktop = styled.ul`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: ${spacing.normal};
`;

const Mobile = styled.div`
  display: block;
  width: 100%;
`;

const AllSubjectsPersonIllustration = styled.div`
  background-image: url("/static/illustrations/all_subjects_person.svg");
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 100% 100%;
  height: 175px;
  width: 208px;
`;

const StyledAccordionRoot = styled(AccordionRoot)`
  gap: 0;
`;

const StyledAccordionContent = styled(AccordionContent)`
  background-color: ${colors.white};
  a {
    margin-top: ${spacing.normal};
  }
`;

const StyledAccordionHeader = styled(AccordionHeader)`
  background-color: ${colors.white};
  :hover {
    text-decoration: none;
  }
  :active {
    text-decoration: underline;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const StyledNav = styled.nav`
  ul {
    margin: unset;
    padding: unset;
  }
`;

const StyledLi = styled.li`
  list-style: none;
  padding: 0;
  line-height: unset;
  &[data-mobile="false"] {
    min-height: 350px;
    min-width: 250px;
    max-height: 350px;
    width: 250px;
  }
`;
interface Props {
  programmes: ProgrammeV2[];
  loading: boolean;
}

const placeholder = (
  <ContentLoader width={1150} height={350}>
    <rect x="0" y="10" rx="3" ry="3" width="250" height="350" key="rect-1-1" />
    <rect x="274" y="10" rx="3" ry="3" width="250" height="350" key="rect-1-2" />
    <rect x="548" y="10" rx="3" ry="3" width="250" height="350" key="rect-1-3" />
    <rect x="812" y="10" rx="3" ry="3" width="250" height="350" key="rect-1-4" />
  </ContentLoader>
);

const Description = styled(Text)`
  margin-top: ${spacing.xsmall};
  margin-bottom: ${spacing.large};
`;

const Programmes = ({ programmes, loading }: Props) => {
  const { t } = useTranslation();
  const selectors = useUserAgent();

  const programmeCards = useMemo(() => {
    return programmes.map((programme) => (
      <StyledLi key={programme.id} data-mobile={!!selectors?.isMobile}>
        <ProgrammeCard
          id={programme.id}
          title={programme.title}
          wideImage={selectors?.isMobile ? programme.wideImage : undefined}
          narrowImage={selectors?.isMobile ? undefined : programme.narrowImage}
          url={programme.url}
        />
      </StyledLi>
    ));
  }, [selectors?.isMobile, programmes]);

  return (
    <StyledWrapper>
      <Heading element="h2" headingStyle="h1" serif id="programmes-heading">
        {t("programmes.header")}
      </Heading>
      <Description textStyle="content-alt" margin="none">
        {t("programmes.description")}
      </Description>
      {selectors?.isMobile ? (
        <Mobile>
          <StyledAccordionRoot type="single" collapsible>
            <ImageWrapper>
              <AllSubjectsPersonIllustration />
            </ImageWrapper>
            <AccordionItem value="1">
              <StyledAccordionHeader id="accordionHeader">
                <Text element="span" textStyle="button" margin="none">
                  {t("programmes.accordionHeader")}
                </Text>
              </StyledAccordionHeader>
              <StyledAccordionContent>
                <StyledNav aria-labelledby="accordionHeader">
                  <ul>{programmeCards}</ul>
                </StyledNav>
              </StyledAccordionContent>
            </AccordionItem>
          </StyledAccordionRoot>
        </Mobile>
      ) : (
        <StyledNav aria-labelledby="programmes-heading">
          <Desktop>{loading ? placeholder : programmeCards}</Desktop>
        </StyledNav>
      )}
    </StyledWrapper>
  );
};

export default Programmes;

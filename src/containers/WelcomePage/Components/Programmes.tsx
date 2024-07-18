/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "@ndla/icons/common";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Heading as OldHeading, Text } from "@ndla/typography";
import { ProgrammeCard, ProgrammeV2 } from "@ndla/ui";
import { useUserAgent } from "../../../UserAgentContext";

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0",
    paddingBlock: "xxsmall",
    desktop: { paddingBlock: "medium" },
  },
});

const AllSubjectsPersonIllustration = styled("div", {
  base: {
    backgroundImage: "url('/static/illustrations/all_subjects_person.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 100%",
    backgroundPosition: "100% 100%",
    height: "175px",
    width: "208px",
  },
});

const ImageWrapper = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

const StyledList = styled("ul", {
  base: { display: "flex", flexDirection: "column", alignItems: "center", gap: "small" },
});

const StyledLi = styled("li", {
  base: {
    listStyle: "none",
    padding: "0",
    lineHeight: "unset",
    "&[data-mobile=false]": { minHeight: "350px", minWidth: "250px", maxHeight: "350px", width: "250px" },
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    borderRadius: "small",
    boxShadow: "full",
    width: "100%",
  },
});
interface Props {
  programmes: ProgrammeV2[];
}

const Description = styled(Text, { base: { marginTop: "xsmall", marginBottom: "large" } });

const Programmes = ({ programmes }: Props) => {
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
      <OldHeading element="h2" headingStyle="h1" serif id="programmes-heading">
        {t("programmes.header")}
      </OldHeading>
      <Description textStyle="content-alt" margin="none">
        {t("programmes.description")}
      </Description>
      <ImageWrapper>
        <AllSubjectsPersonIllustration />
      </ImageWrapper>
      <StyledAccordionRoot multiple>
        <AccordionItem value="1">
          <Heading asChild consumeCss fontWeight="bold" textStyle="label.medium">
            <h2>
              <AccordionItemTrigger id="accordionHeader">
                {t("programmes.header")}
                <AccordionItemIndicator asChild>
                  <ChevronDown size="medium" />
                </AccordionItemIndicator>
              </AccordionItemTrigger>
            </h2>
          </Heading>
          <AccordionItemContent>
            <nav aria-labelledby="accordionHeader">
              <StyledList>{programmeCards}</StyledList>
            </nav>
          </AccordionItemContent>
        </AccordionItem>
      </StyledAccordionRoot>
    </StyledWrapper>
  );
};

export default Programmes;

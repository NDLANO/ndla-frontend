/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { ArrowDownShortLine, ArrowRightLine } from "@ndla/icons/common";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
  Text,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { GQLProgrammes_ProgrammePageFragment } from "../../../graphqlTypes";

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    margin: "0",
    paddingBlock: "xxsmall",
    desktop: { paddingBlock: "medium" },
    gap: "xxlarge",
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

const HeadingWrapper = styled("div", {
  base: { display: "flex", flexDirection: "column", alignItems: "center", gap: "medium" },
});

const StyledList = styled("ul", {
  base: {
    display: "grid",
    columnGap: "xsmall",
    rowGap: "small",
    listStyle: "none",
    gridTemplateColumns: "1fr",
    tablet: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    desktop: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  },
});

const StyledLi = styled("li", {
  base: {
    width: "100%",
    height: "100%",
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    borderRadius: "small",
    boxShadow: "full",
  },
});

const StyledAccordionItemTrigger = styled(AccordionItemTrigger, {
  base: {
    _open: {
      background: "surface.default",
    },
  },
});

const StyledAccordionItemContent = styled(AccordionItemContent, {
  base: {
    paddingBlock: "small",
    paddingInline: "small",
    background: "surface.default",
    desktop: {
      paddingBlock: "medium",
      paddingInline: "medium",
    },
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    position: "relative",
    paddingInline: "small",
    paddingBlock: "medium",
    justifyContent: "space-between",
    textAlign: "start",
    width: "100%",
    height: "4xlarge",
    _after: {
      transitionDuration: "normal",
      transitionTimingFunction: "ease-out",
      transitionProperty: "opacity",
      opacity: "0",
      inset: "0",
      borderRadius: "xsmall",
      position: "absolute",
      content: "''",
      boxShadow: "none",
    },
    "&:not(:active)": {
      _hover: {
        transform: "translateY(-5px)",
        _after: {
          opacity: "1",
          boxShadow: "full",
        },
      },
    },
  },
});

const FullWidth = styled("div", { base: { width: "100%" } });

interface Props {
  programmes: GQLProgrammes_ProgrammePageFragment[];
}

const Description = styled(Text, { base: { fontWeight: "normal" } });

// TODO: Needs to be updated according to new design
const Programmes = ({ programmes }: Props) => {
  const { t } = useTranslation();
  const accordionHeader = useId();

  return (
    <StyledWrapper>
      <HeadingWrapper>
        <Heading asChild consumeCss textStyle="heading.large" id="programmes-heading">
          <h2>{t("programmes.header")}</h2>
        </Heading>
        <Description textStyle="title.medium">{t("programmes.description")}</Description>
      </HeadingWrapper>
      <FullWidth>
        <ImageWrapper>
          <AllSubjectsPersonIllustration />
        </ImageWrapper>
        <StyledAccordionRoot multiple>
          <AccordionItem value="1">
            <Heading asChild consumeCss fontWeight="bold" textStyle="label.medium">
              <h2>
                <StyledAccordionItemTrigger id={accordionHeader} data-testid="accordion-header">
                  {t("programmes.header")}
                  <AccordionItemIndicator asChild>
                    <ArrowDownShortLine size="medium" />
                  </AccordionItemIndicator>
                </StyledAccordionItemTrigger>
              </h2>
            </Heading>
            <StyledAccordionItemContent>
              <nav aria-labelledby="accordionHeader">
                <StyledList>
                  {programmes.map((programme) => (
                    <StyledLi key={programme.id}>
                      <StyledSafeLinkButton to={programme.url} variant="secondary">
                        {programme.title.title}
                        <ArrowRightLine />
                      </StyledSafeLinkButton>
                    </StyledLi>
                  ))}
                </StyledList>
              </nav>
            </StyledAccordionItemContent>
          </AccordionItem>
        </StyledAccordionRoot>
      </FullWidth>
    </StyledWrapper>
  );
};

Programmes.fragments = {
  programmePage: gql`
    fragment Programmes_ProgrammePage on ProgrammePage {
      id
      title {
        title
        language
      }
      url
    }
  `,
};

export default Programmes;

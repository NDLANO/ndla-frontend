/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { transform } from "@ndla/article-converter";
import { ArrowDownShortLine, ArrowLeftLine, ArrowRightLine } from "@ndla/icons";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
  PageContent,
  Text,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleContent, ArticleHeader, ArticleWrapper, ContentTypeBadge, HomeBreadcrumb, LicenseLink } from "@ndla/ui";
import { contains } from "@ndla/util";
import LastLearningpathStepInfo from "./LastLearningpathStepInfo";
import LearningpathEmbed, { EmbedPageContent } from "./LearningpathEmbed";
import LearningpathMenu from "./LearningpathMenu";
import type { LearningpathContext } from "./learningpathUtils";
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpathPage_NodeFragment,
} from "../../graphqlTypes";
import { Breadcrumb as BreadcrumbType } from "../../interfaces";
import { routes, toLearningPath } from "../../routeHelpers";
import FavoriteButton from "../Article/FavoritesButton";
import { PageContainer } from "../Layout/PageContainer";
import AddResourceToFolderModal from "../MyNdla/AddResourceToFolderModal";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  resource?: GQLLearningpathPage_NodeFragment;
  skipToContentId?: string;
  breadcrumbItems: BreadcrumbType[];
  resourcePath?: string;
  context?: LearningpathContext;
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    position: "relative",
    background: "background.subtle",
    gap: "large",
  },
  variants: {
    rounded: {
      true: {
        borderRadius: "xsmall",
      },
    },
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "grid",
    gap: "medium",
  },
  variants: {
    context: {
      preview: {
        display: "flex",
        flexDirection: "column",
      },
      default: {
        gridTemplateRows: "auto auto 1fr",
        gridAutoFlow: "column dense",
        gridTemplateColumns: "minmax(200px, 1fr) minmax(300px, 3fr)",
        gridTemplateAreas: `
"meta   content"
"steps  content"
".      content"
`,
        desktopDown: {
          display: "flex",
          flexDirection: "column",
        },
      },
    },
  },
});

const PageButtonsContainer = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "medium",
    height: "fit-content",
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    gridArea: "content",
    gap: "medium",
  },
});

const ContentTypeWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignItems: "center",
  },
});

const StyledAccordionItemContent = styled(AccordionItemContent, {
  base: {
    background: "background.default",
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    display: "block",
    gridArea: "steps",
    position: "sticky",
    zIndex: "sticky",
    top: "var(--masthead-height)",
    marginInline: "small",
  },
  variants: {
    context: {
      default: {
        desktop: {
          display: "none",
        },
      },
      preview: {},
    },
  },
});

const StyledAccordionItem = styled(AccordionItem, {
  base: {
    borderRadius: "xsmall",
    boxShadow: "small",
  },
});

const MetaWrapper = styled("div", {
  base: {
    gridArea: "meta",
    tabletDown: {
      paddingInline: "xsmall",
    },
  },
});

const MenuWrapper = styled("div", {
  base: {
    display: "none",
    desktop: {
      display: "block",
    },
  },
});

const BreadcrumbWrapper = styled("div", {
  base: {
    tabletDown: {
      paddingInline: "xsmall",
    },
  },
});

const Learningpath = ({
  learningpath,
  learningpathStep,
  resourcePath,
  resource,
  skipToContentId,
  breadcrumbItems,
  context = "default",
}: Props) => {
  const { t, i18n } = useTranslation();
  const [accordionValue, setAccordionValue] = useState<string[]>();
  const accordionRef = useRef<HTMLDivElement>(null);

  const previousStep = learningpath.learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningpath.learningsteps[learningpathStep.seqNo + 1];

  const menu = useMemo(
    () => (
      <LearningpathMenu
        resourcePath={resourcePath}
        learningpath={learningpath}
        currentStep={learningpathStep}
        context={context}
      />
    ),
    [context, learningpath, learningpathStep, resourcePath],
  );
  const parents = resource?.context?.parents || [];
  const root = parents[0];

  return (
    <StyledPageContainer variant="wide" gutters="tabletUp" rounded={context === "preview"}>
      {!!breadcrumbItems.length && (
        <BreadcrumbWrapper>
          <HomeBreadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>
      )}
      <ContentWrapper context={context}>
        {context === "default" && (
          <MetaWrapper data-testid="learningpath-meta">
            <ContentTypeWrapper>
              <ContentTypeBadge contentType="learning-path" />
              {!!resourcePath && (
                <AddResourceToFolderModal
                  resource={{
                    id: learningpath.id.toString(),
                    path: resourcePath,
                    resourceType: "learningpath",
                  }}
                >
                  <FavoriteButton path={resourcePath} />
                </AddResourceToFolderModal>
              )}
            </ContentTypeWrapper>
            <Text textStyle="label.large">
              {`${t("learningPath.youAreInALearningPath")}:`}
              <br />
              <strong>{learningpath.title}</strong>
            </Text>
          </MetaWrapper>
        )}
        <StyledAccordionRoot
          ref={accordionRef}
          id={learningpathStep.id.toString()}
          value={accordionValue}
          onValueChange={(details) => setAccordionValue(details.value)}
          variant="bordered"
          context={context}
          multiple
          onBlur={(e) => {
            // automatically close the accordion when focus leaves the accordion on mobile.
            if (!contains(accordionRef.current, e.relatedTarget ?? e.target)) {
              setAccordionValue([]);
            }
          }}
        >
          <StyledAccordionItem value="menu">
            <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
              <h2>
                <AccordionItemTrigger>
                  {t("learningpathPage.accordionTitle")}
                  <AccordionItemIndicator asChild>
                    <ArrowDownShortLine />
                  </AccordionItemIndicator>
                </AccordionItemTrigger>
              </h2>
            </Heading>
            <StyledAccordionItemContent>{menu}</StyledAccordionItemContent>
          </StyledAccordionItem>
        </StyledAccordionRoot>
        {context === "default" && <MenuWrapper>{menu}</MenuWrapper>}
        <StyledPageContent variant="article" gutters="never">
          {(!!learningpathStep.description || !!learningpathStep.showTitle) && (
            <EmbedPageContent variant="content">
              <ArticleWrapper>
                {!!learningpathStep.showTitle && (
                  <ArticleHeader>
                    <Heading id={learningpathStep.showTitle ? skipToContentId : undefined}>
                      {learningpathStep.title}
                    </Heading>
                    <LicenseLink
                      license={getLicenseByAbbreviation(learningpathStep.license?.license ?? "", i18n.language)}
                    />
                  </ArticleHeader>
                )}
                <ArticleContent>
                  {!!learningpathStep.description && <section>{transform(learningpathStep.description, {})}</section>}
                </ArticleContent>
              </ArticleWrapper>
            </EmbedPageContent>
          )}
          <LearningpathEmbed
            key={learningpathStep.id}
            skipToContentId={!learningpathStep.showTitle ? skipToContentId : undefined}
            subjectId={root?.id}
            learningpathStep={learningpathStep}
            breadcrumbItems={breadcrumbItems}
          >
            <LastLearningpathStepInfo
              seqNo={learningpathStep.seqNo}
              numberOfLearningSteps={learningpath.learningsteps.length - 1}
              title={learningpath.title}
              resource={resource}
            />
          </LearningpathEmbed>
          {/* TODO: How should this handle long titles on smaller screens? */}
          <PageButtonsContainer>
            {previousStep ? (
              <SafeLinkButton
                to={
                  context === "preview"
                    ? routes.myNdla.learningpathPreview(learningpath.id, previousStep.id)
                    : toLearningPath(learningpath.id, previousStep.id, resourcePath)
                }
                variant="secondary"
                aria-label={t("learningPath.previousArrow")}
              >
                <ArrowLeftLine />
                {previousStep.title}
              </SafeLinkButton>
            ) : (
              <div />
            )}
            {nextStep ? (
              <SafeLinkButton
                to={
                  context === "preview"
                    ? routes.myNdla.learningpathPreview(learningpath.id, nextStep.id)
                    : toLearningPath(learningpath.id, nextStep.id, resourcePath)
                }
                variant="secondary"
                aria-label={t("learningPath.nextArrow")}
              >
                {nextStep.title}
                <ArrowRightLine />
              </SafeLinkButton>
            ) : (
              <div />
            )}
          </PageButtonsContainer>
        </StyledPageContent>
      </ContentWrapper>
    </StyledPageContainer>
  );
};

Learningpath.fragments = {
  learningpathStep: gql`
    fragment Learningpath_LearningpathStep on LearningpathStep {
      seqNo
      id
      showTitle
      title
      description
      license {
        license
      }
      ...LearningpathEmbed_LearningpathStep
      ...LearningpathMenu_LearningpathStep
    }
    ${LearningpathMenu.fragments.step}
    ${LearningpathEmbed.fragments.learningpathStep}
  `,
  learningpath: gql`
    fragment Learningpath_Learningpath on Learningpath {
      ...LearningpathMenu_Learningpath
    }
    ${LearningpathMenu.fragments.learningpath}
  `,
};

export default Learningpath;

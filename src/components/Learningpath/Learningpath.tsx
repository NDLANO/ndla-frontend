/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { CSSProperties, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useComponentSize } from "@ndla/hooks";
import { ArrowDownShortLine, ArrowLeftLine, ArrowRightLine } from "@ndla/icons/common";
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
import {
  ArticleContent,
  ArticleHeader,
  ArticleWrapper,
  ContentTypeBadgeNew,
  HomeBreadcrumb,
  LicenseLink,
} from "@ndla/ui";
import { contains } from "@ndla/util";
import LastLearningpathStepInfo from "./LastLearningpathStepInfo";
import LearningpathEmbed, { EmbedPageContent } from "./LearningpathEmbed";
import LearningpathMenu from "./LearningpathMenu";
import { MastheadHeightPx } from "../../constants";
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpath_ResourceTypeDefinitionFragment,
  GQLLearningpath_SubjectFragment,
  GQLLearningpath_TopicFragment,
} from "../../graphqlTypes";
import { Breadcrumb as BreadcrumbType } from "../../interfaces";
import { toLearningPath } from "../../routeHelpers";
import { TopicPath } from "../../util/getTopicPath";
import FavoriteButton from "../Article/FavoritesButton";
import { PageContainer, PageLayout } from "../Layout/PageContainer";
import AddResourceToFolderModal from "../MyNdla/AddResourceToFolderModal";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  topic?: GQLLearningpath_TopicFragment;
  topicPath?: TopicPath[];
  resourceTypes?: GQLLearningpath_ResourceTypeDefinitionFragment[];
  subject?: GQLLearningpath_SubjectFragment;
  skipToContentId?: string;
  breadcrumbItems: BreadcrumbType[];
  resourcePath?: string;
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    position: "relative",
    background: "background.subtle",
    gap: "large",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateRows: "auto auto 1fr",
    gridAutoFlow: "column dense",
    gridTemplateColumns: "minmax(200px, 1fr) minmax(300px, 3fr)",
    gridTemplateAreas: `
"meta   content"
"steps  content"
".      content"
`,
    gap: "medium",
    desktopDown: {
      display: "flex",
      flexDirection: "column",
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
    zIndex: "docked",
    top: "calc(var(--masthead-height) + token(spacing.xsmall))",
    marginInline: "small",
    desktop: {
      display: "none",
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
  topic,
  subject,
  topicPath,
  resourceTypes,
  skipToContentId,
  breadcrumbItems,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [accordionValue, setAccordionValue] = useState<string[]>();
  const accordionRef = useRef<HTMLDivElement>(null);
  const { height = MastheadHeightPx } = useComponentSize("masthead");

  const previousStep = learningpath.learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningpath.learningsteps[learningpathStep.seqNo + 1];

  const menu = useMemo(
    () => <LearningpathMenu resourcePath={resourcePath} learningpath={learningpath} currentStep={learningpathStep} />,
    [learningpath, learningpathStep, resourcePath],
  );

  return (
    <PageLayout asChild>
      <StyledPageContainer variant="wide" gutters="tabletUp">
        {!!breadcrumbItems.length && (
          <BreadcrumbWrapper>
            <HomeBreadcrumb items={breadcrumbItems} />
          </BreadcrumbWrapper>
        )}
        <ContentWrapper>
          <MetaWrapper data-testid="learningpath-meta">
            <ContentTypeWrapper>
              <ContentTypeBadgeNew contentType="learning-path" />
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
          <StyledAccordionRoot
            ref={accordionRef}
            id={learningpathStep.id.toString()}
            value={accordionValue}
            onValueChange={(details) => setAccordionValue(details.value)}
            variant="bordered"
            style={{ "--masthead-height": `${height}px` } as CSSProperties}
            multiple
            onBlur={(e) => {
              // automatically close the accordion when focus leaves the accordion on mobile.
              if (!contains(accordionRef.current, e.relatedTarget)) {
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
          <MenuWrapper>{menu}</MenuWrapper>
          <StyledPageContent variant="article" gutters="never">
            {learningpathStep.showTitle && (
              <EmbedPageContent variant="content">
                <ArticleWrapper>
                  <ArticleHeader>
                    <Heading id={learningpathStep.showTitle ? skipToContentId : undefined}>
                      {learningpathStep.title}
                    </Heading>
                    <LicenseLink
                      license={getLicenseByAbbreviation(learningpathStep.license?.license ?? "", i18n.language)}
                    />
                  </ArticleHeader>
                  <ArticleContent>
                    {!!learningpathStep.description && <section>{parse(learningpathStep.description)}</section>}
                  </ArticleContent>
                </ArticleWrapper>
              </EmbedPageContent>
            )}
            <LearningpathEmbed
              key={learningpathStep.id}
              skipToContentId={!learningpathStep.showTitle ? skipToContentId : undefined}
              subjectId={subject?.id}
              learningpathStep={learningpathStep}
              breadcrumbItems={breadcrumbItems}
            >
              <LastLearningpathStepInfo
                topic={topic}
                topicPath={topicPath}
                resourceTypes={resourceTypes}
                seqNo={learningpathStep.seqNo}
                numberOfLearningSteps={learningpath.learningsteps.length - 1}
                title={learningpath.title}
                subject={subject}
              />
            </LearningpathEmbed>
            <PageButtonsContainer>
              {previousStep ? (
                <SafeLinkButton
                  to={toLearningPath(learningpath.id, previousStep.id, resourcePath)}
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
                  to={toLearningPath(learningpath.id, nextStep.id, resourcePath)}
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
    </PageLayout>
  );
};

Learningpath.fragments = {
  topic: gql`
    fragment Learningpath_Topic on Topic {
      ...LastLearningpathStepInfo_Topic
    }
    ${LastLearningpathStepInfo.fragments.topic}
  `,
  resourceType: gql`
    fragment Learningpath_ResourceTypeDefinition on ResourceTypeDefinition {
      ...LastLearningpathStepInfo_ResourceTypeDefinition
    }
    ${LastLearningpathStepInfo.fragments.resourceType}
  `,
  subject: gql`
    fragment Learningpath_Subject on Subject {
      id
      ...LastLearningpathStepInfo_Subject
    }
    ${LastLearningpathStepInfo.fragments.subject}
  `,
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

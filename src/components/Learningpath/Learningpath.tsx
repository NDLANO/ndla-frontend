/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { ArrowDownShortLine, ArrowLeftLine, ArrowRightLine } from "@ndla/icons";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Badge,
  Heading,
  PageContent,
  Text,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HomeBreadcrumb } from "@ndla/ui";
import { contains } from "@ndla/util";
import { LearningpathMenu } from "./LearningpathMenu";
import type { LearningpathContext } from "./learningpathUtils";
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpathPage_NodeFragment,
} from "../../graphqlTypes";
import { Breadcrumb } from "../../interfaces";
import { routes, toLearningPath } from "../../routeHelpers";
import { FavoriteButton } from "../Article/FavoritesButton";
import { AuthContext } from "../AuthenticationContext";
import { PageContainer } from "../Layout/PageContainer";
import { AddResourceToFolderModal } from "../MyNdla/AddResourceToFolderModal";
import { CopyLearningPath } from "./components/CopyLearningPath";
import { LearningpathIntroduction } from "./components/LearningpathIntroduction";
import { LearningpathStep } from "./components/LearningpathStep";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment | undefined;
  resource?: GQLLearningpathPage_NodeFragment;
  skipToContentId?: string;
  breadcrumbItems: Breadcrumb[];
  resourcePath?: string;
  context?: LearningpathContext;
}

const StyledPageContainer = styled(PageContainer, {
  base: {
    position: "relative",
    background: "background.subtle",
    minHeight: "100vh",
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

export const Learningpath = ({
  learningpath,
  learningpathStep,
  resourcePath,
  resource,
  skipToContentId,
  breadcrumbItems,
  context = "default",
}: Props) => {
  const { t } = useTranslation();
  const [accordionValue, setAccordionValue] = useState<string[]>();
  const accordionRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext);

  const index = learningpathStep
    ? learningpath.learningsteps.findIndex((step) => step.id === learningpathStep.id)
    : undefined;
  const previousStep = index !== undefined ? learningpath.learningsteps[index - 1] : undefined;
  const nextStep = index !== undefined ? learningpath.learningsteps[index + 1] : learningpath.learningsteps[0];

  const menu = useMemo(
    () => (
      <LearningpathMenu
        resourcePath={resourcePath}
        learningpath={learningpath}
        currentIndex={index}
        context={context}
        hasIntroduction={!!learningpath.introduction?.length}
      />
    ),
    [context, index, learningpath, resourcePath],
  );
  const parents = resource?.context?.parents || [];
  const root = parents[0];
  const path = resourcePath ? resourcePath : toLearningPath(learningpath.id);

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
              <Badge>{t("contentTypes.learningpath")}</Badge>
              <AddResourceToFolderModal
                resource={{
                  id: learningpath.id.toString(),
                  path: path,
                  resourceType: "learningpath",
                }}
              >
                <FavoriteButton path={path} />
              </AddResourceToFolderModal>
              {user?.role === "employee" && <CopyLearningPath learningpath={learningpath} />}
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
          id={learningpathStep?.id.toString()}
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
              <span>
                <AccordionItemTrigger>
                  {t("learningpathPage.accordionTitle")}
                  <AccordionItemIndicator asChild>
                    <ArrowDownShortLine />
                  </AccordionItemIndicator>
                </AccordionItemTrigger>
              </span>
            </Heading>
            <StyledAccordionItemContent>{menu}</StyledAccordionItemContent>
          </StyledAccordionItem>
        </StyledAccordionRoot>
        {context === "default" && <MenuWrapper>{menu}</MenuWrapper>}
        <StyledPageContent variant="article" gutters="never">
          {!learningpathStep && !!learningpath.introduction?.length && (
            <LearningpathIntroduction learningpath={learningpath} />
          )}
          {!!learningpathStep && (
            <LearningpathStep
              resource={resource}
              subjectId={root?.id}
              learningpath={learningpath}
              breadcrumbItems={breadcrumbItems}
              skipToContentId={skipToContentId}
              learningpathStep={learningpathStep}
            />
          )}
          {/* TODO: How should this handle long titles on smaller screens? */}
          <PageButtonsContainer>
            {previousStep || (learningpathStep && learningpath.introduction?.length) ? (
              <SafeLinkButton
                to={
                  context === "preview"
                    ? routes.myNdla.learningpathPreview(learningpath.id, previousStep?.id)
                    : toLearningPath(learningpath.id, previousStep?.id, resourcePath)
                }
                variant="secondary"
                aria-label={t("learningPath.previousArrow")}
              >
                <ArrowLeftLine />
                {previousStep?.title ?? t("learningpathPage.introduction")}
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
      copyright {
        license {
          license
        }
        contributors {
          type
          name
        }
      }
      ...LearningpathMenu_LearningpathStep
      ...LearningpathStep_LearningpathStep
    }
    ${LearningpathMenu.fragments.step}
    ${LearningpathStep.fragments.learningpathStep}
  `,
  learningpath: gql`
    fragment Learningpath_Learningpath on Learningpath {
      ...LearningpathMenu_Learningpath
    }
    ${LearningpathMenu.fragments.learningpath}
  `,
};

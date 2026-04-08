/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { ark } from "@ark-ui/react";
import { ArrowRightLine, CheckLine } from "@ndla/icons";
import { Badge, Button, CardContent, CardHeading, CardRoot, Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { BadgesContainer } from "@ndla/ui";
import { usePrevious } from "@ndla/util";
import { ComponentProps, ReactNode, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Launchpad } from "../../components/Resource/Launchpad";
import {
  CollapsedLinkComponent,
  StepperIndicator,
  StepperList,
  StepperListItem,
  StepperRoot,
  StepperSafeLink,
} from "../../components/Stepper";
import { GQLArticleLaunchpad_NodeFragment, GQLArticleLaunchpad_ResourceFragment } from "../../graphqlTypes";
import { getListItemTraits, useListItemTraits } from "../../util/listItemTraits";

interface Props {
  isUnordered: boolean;
  context: "desktop" | "mobile";
  topic: GQLArticleLaunchpad_NodeFragment | undefined;
  learningpaths: GQLArticleLaunchpad_ResourceFragment[];
  supplementaryArticles: GQLArticleLaunchpad_ResourceFragment[];
  coreArticles: GQLArticleLaunchpad_ResourceFragment[];
  loading: boolean;
}

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const StyledNav = styled(
  ark.nav,
  {
    base: {
      display: "flex",
      flexDirection: "column",
      gap: "small",
    },
  },
  { baseComponent: true },
);

const NavHeading = styled(Heading, {
  base: {
    display: "flex",
    gap: "xsmall",
    width: "100%",
  },
});

const StyledStepperWrapper = styled(
  ark.div,
  {
    base: {
      display: "flex",
      flexDirection: "column",
      gap: "medium",
    },
  },
  { baseComponent: true },
);

const StyledButton = styled(Button, {
  base: {
    width: "100%",
  },
});

const StepperItemContent = styled("div", {
  base: {
    position: "static",
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const StyledStepperList = styled(StepperList, {
  base: {
    gap: "xsmall",
  },
});

const StyledStepperListItem = styled(StepperListItem, {
  base: {
    marginInlineStart: "large",
  },
});

export const ArticleLaunchpad = ({
  topic,
  isUnordered,
  learningpaths,
  supplementaryArticles,
  coreArticles,
  context,
  loading,
}: Props) => {
  const { t } = useTranslation();
  const { contextId } = useParams();
  const previousContextId = usePrevious(contextId);
  const [showAll, setShowAll] = useState(coreArticles.findIndex((a) => a.context?.contextId === contextId) >= 20);
  const [completed, setCompleted] = useState<string[]>(contextId ? [contextId] : []);
  const listId = useId();

  const coreArticlesToDisplay = !showAll && coreArticles.length > 20 ? coreArticles.slice(0, 20) : coreArticles;

  useEffect(() => {
    if (previousContextId) {
      setCompleted((prev) => (prev.includes(previousContextId) ? prev : prev.concat(previousContextId)));
    }
  }, [previousContextId]);

  return (
    <Launchpad
      loading={loading}
      type={t("contentTypes.topic")}
      ariaLabel={t("launchpad.articleLabel", { topic: topic?.name })}
      name={topic?.name ?? ""}
      context={context}
    >
      {(collapsed) =>
        !topic ? null : (
          <>
            {!!coreArticlesToDisplay.length && (
              <StyledStepperWrapper>
                <StepperRoot line aria-hidden={collapsed} collapsed={collapsed} asChild>
                  <NavSection title={t("launchpad.coreContentTitle")} srOnlyHeading>
                    <StyledStepperList id={listId}>
                      {coreArticlesToDisplay.map((article, idx) => (
                        <ArticleStepperListItem
                          key={article.id}
                          article={article}
                          index={idx}
                          completed={completed.includes(article.context?.contextId ?? "")}
                          current={article.context?.contextId === contextId}
                          isUnordered={isUnordered}
                          collapsed={collapsed}
                        />
                      ))}
                    </StyledStepperList>
                  </NavSection>
                </StepperRoot>
                {coreArticles.length > 20 && !collapsed && (
                  <StyledButton
                    variant="secondary"
                    onClick={() => setShowAll((prev) => !prev)}
                    aria-controls={listId}
                    aria-expanded={showAll}
                  >
                    {showAll ? t("launchpad.showLess") : t("launchpad.showMore")}
                  </StyledButton>
                )}
              </StyledStepperWrapper>
            )}
            {!!learningpaths.length && !collapsed && (
              <NavSection title={t("launchpad.learningpathsTitle")}>
                <StyledList>
                  {learningpaths.map((lp) => (
                    <LearningpathCard key={lp.id} learningpath={lp} />
                  ))}
                </StyledList>
              </NavSection>
            )}
            {!!supplementaryArticles.length && !collapsed && (
              <StepperRoot asChild>
                <NavSection title={t("launchpad.supplementaryContentTitle")}>
                  <StyledStepperList>
                    {supplementaryArticles.map((article, idx) => (
                      <ArticleStepperListItem
                        key={article.id}
                        article={article}
                        index={idx}
                        completed={completed.includes(article.context?.contextId ?? "")}
                        current={article.context?.contextId === contextId}
                        isUnordered
                        collapsed={collapsed}
                      />
                    ))}
                  </StyledStepperList>
                </NavSection>
              </StepperRoot>
            )}
            {!!topic.links?.length && !collapsed && (
              <StepperRoot asChild>
                <NavSection title={t("launchpad.linksTitle")}>
                  <StyledStepperList>
                    {topic.links.map((link) => (
                      <StyledStepperListItem key={link.id}>
                        <StepperItemContent>
                          <StepperSafeLink to={link.url ?? ""} css={linkOverlay.raw()}>
                            {link.name}
                          </StepperSafeLink>
                          <Text textStyle="label.small" color="text.subtle">
                            {link.context?.breadcrumbs.at(-1)}
                          </Text>
                        </StepperItemContent>
                      </StyledStepperListItem>
                    ))}
                  </StyledStepperList>
                </NavSection>
              </StepperRoot>
            )}
          </>
        )
      }
    </Launchpad>
  );
};

interface ArticleStepperListItemProps {
  article: GQLArticleLaunchpad_ResourceFragment;
  completed: boolean;
  current: boolean;
  collapsed: boolean;
  index: number;
  isUnordered: boolean;
}

const ArticleStepperListItem = ({
  article,
  current,
  collapsed,
  completed,
  index,
  isUnordered,
}: ArticleStepperListItemProps) => {
  const { t } = useTranslation();
  return (
    <StepperListItem
      key={article.id}
      completed={completed}
      // for collapsed styling
      data-current={current ? "" : undefined}
    >
      <CollapsedLinkComponent
        to={article.url || ""}
        collapsed={collapsed}
        aria-current={current ? "page" : undefined}
        css={linkOverlay.raw()}
        aria-label={article.name}
        title={article.name}
      >
        <StepperIndicator>
          {!current && completed ? (
            <CheckLine size="small" />
          ) : isUnordered ? (
            <ArrowRightLine size="small" />
          ) : (
            index + 1
          )}
        </StepperIndicator>
      </CollapsedLinkComponent>
      {!collapsed && (
        <StepperItemContent>
          <StepperSafeLink
            to={article.url || ""}
            lang={article.language}
            css={linkOverlay.raw()}
            aria-current={current ? "page" : undefined}
          >
            {article.name}
          </StepperSafeLink>
          <Text textStyle="label.small" color="text.subtle">
            {getListItemTraits(
              {
                relevanceId: article.relevanceId,
                resourceTypes: article.resourceTypes,
                traits: article.article?.traits,
              },
              t,
            ).join(", ")}
          </Text>
        </StepperItemContent>
      )}
    </StepperListItem>
  );
};

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

interface NavSectionProps extends ComponentProps<"nav"> {
  title: string;
  srOnlyHeading?: boolean;
  children: ReactNode;
}

const NavSection = ({ title, children, srOnlyHeading, ...rest }: NavSectionProps) => {
  const headingId = useId();

  return (
    <StyledNav aria-labelledby={headingId} {...rest}>
      <NavHeading asChild consumeCss textStyle="title.small" id={headingId} srOnly={srOnlyHeading}>
        <h3>{title}</h3>
      </NavHeading>
      {children}
    </StyledNav>
  );
};

interface LearningpathCardProps {
  learningpath: GQLArticleLaunchpad_ResourceFragment;
}

const LearningpathCard = ({ learningpath }: LearningpathCardProps) => {
  const traits = useListItemTraits({
    relevanceId: learningpath.relevanceId,
    resourceTypes: learningpath.resourceTypes,
  });

  return (
    <CardRoot asChild consumeCss>
      <li>
        <CardContent>
          <TextWrapper>
            <CardHeading asChild consumeCss css={linkOverlay.raw()}>
              <SafeLink to={learningpath.url ?? ""}>{learningpath.name}</SafeLink>
            </CardHeading>
            {!!learningpath.learningpath?.description.length && <Text>{learningpath.learningpath.description}</Text>}
          </TextWrapper>
          <BadgesContainer>
            {traits.map((trait) => (
              <Badge key={trait}>{trait}</Badge>
            ))}
          </BadgesContainer>
        </CardContent>
      </li>
    </CardRoot>
  );
};

ArticleLaunchpad.fragments = {
  resource: gql`
    fragment ArticleLaunchpad_Resource on Node {
      id
      name
      relevanceId
      contentUri
      url
      language
      resourceTypes {
        id
        name
      }
      context {
        contextId
      }
      learningpath {
        id
        description
      }
      article {
        id
        traits
      }
    }
  `,
  node: gql`
    fragment ArticleLaunchpad_Node on Node {
      id
      name
      links {
        id
        name
        url
        context {
          contextId
          breadcrumbs
        }
      }
    }
  `,
};

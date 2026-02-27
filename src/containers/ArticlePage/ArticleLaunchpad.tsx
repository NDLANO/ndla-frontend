/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { ArrowRightLine, CheckLine, InformationLine, RouteFill } from "@ndla/icons";
import { Badge, Button, CardContent, CardHeading, CardRoot, Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { BadgesContainer } from "@ndla/ui";
import { ReactNode, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Launchpad } from "../../components/Resource/Launchpad";
import { StepperIndicator, StepperList, StepperListItem, StepperRoot, StepperSafeLink } from "../../components/Stepper";
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

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    width: "100%",
  },
});

const NavHeading = styled(Heading, {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const StyledStepperRoot = styled(StepperRoot, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    alignItems: "center",
    width: "100%",
  },
});

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
    width: "100%",
  },
});

const StyledInformationLine = styled(InformationLine, {
  base: {
    color: "icon.strong",
  },
});

const StyledRouteFill = styled(RouteFill, {
  base: {
    color: "icon.strong",
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
  const [showAll, setShowAll] = useState(coreArticles.findIndex((a) => a.context?.contextId === contextId) >= 20);
  const [completed, setCompleted] = useState<string[]>(contextId ? [contextId] : []);
  const listId = useId();

  const coreArticlesToDisplay = !showAll && coreArticles.length > 20 ? coreArticles.slice(0, 20) : coreArticles;

  return (
    <Launchpad loading={loading} type={t("contentTypes.topic")} name={topic?.name ?? ""} context={context}>
      {(collapsed) =>
        !topic ? null : (
          <>
            {!!coreArticlesToDisplay.length && (
              <StyledStepperRoot line={!isUnordered} aria-hidden={collapsed} collapsed={collapsed}>
                <StyledStepperList id={listId}>
                  {coreArticlesToDisplay.map((article, idx) => (
                    <StepperListItem
                      key={article.id}
                      completed={completed.includes(article.context?.contextId ?? "")}
                      // for collapsed styling
                      data-current={
                        article.context?.contextId && article.context?.contextId === contextId ? "" : undefined
                      }
                    >
                      <StepperIndicator>
                        {article.context?.contextId !== contextId &&
                        completed.includes(article.context?.contextId ?? "") ? (
                          <CheckLine size="small" />
                        ) : isUnordered ? (
                          <ArrowRightLine size="small" />
                        ) : (
                          idx + 1
                        )}
                      </StepperIndicator>
                      {!collapsed && (
                        <StepperItemContent>
                          <StepperSafeLink
                            to={article.url || ""}
                            lang={article.language}
                            css={linkOverlay.raw()}
                            onClick={() => {
                              setCompleted((prev) =>
                                article.context?.contextId && !prev.includes(article.context.contextId)
                                  ? prev.concat(article.context?.contextId)
                                  : prev,
                              );
                            }}
                            aria-current={
                              article.context?.contextId && article.context?.contextId === contextId
                                ? "page"
                                : undefined
                            }
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
                  ))}
                </StyledStepperList>
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
              </StyledStepperRoot>
            )}
            {!!learningpaths.length &&
              (collapsed ? (
                <StyledRouteFill />
              ) : (
                <NavSection title={t("launchpad.learningpathsTitle")} icon={<RouteFill />}>
                  {learningpaths.map((lp) => (
                    <LearningpathCard key={lp.id} learningpath={lp} />
                  ))}
                </NavSection>
              ))}
            {!!topic.links?.length &&
              (collapsed ? (
                <StyledInformationLine />
              ) : (
                <NavSection title={t("launchpad.linksTitle")} icon={<InformationLine />}>
                  {topic.links.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </NavSection>
              ))}
            {!!supplementaryArticles.length &&
              (collapsed ? (
                <StyledInformationLine />
              ) : (
                <NavSection title={t("launchpad.supplementaryContentTitle")} icon={<InformationLine />}>
                  {supplementaryArticles.map((a) => (
                    <SupplementaryArticleCard key={a.id} article={a} />
                  ))}
                </NavSection>
              ))}
          </>
        )
      }
    </Launchpad>
  );
};

interface LinkCardProps {
  link: NonNullable<GQLArticleLaunchpad_NodeFragment["links"]>[number];
}

const StyledCardContent = styled(CardContent, {
  base: {
    gap: "4xsmall",
  },
});

const LinkCard = ({ link }: LinkCardProps) => {
  return (
    <CardRoot key={link.id} asChild consumeCss>
      <li>
        <StyledCardContent>
          <Text>{link.context?.breadcrumbs.at(-1)}</Text>
          <CardHeading asChild consumeCss css={linkOverlay.raw()}>
            <SafeLink to={link.url ?? ""}>{link.name}</SafeLink>
          </CardHeading>
        </StyledCardContent>
      </li>
    </CardRoot>
  );
};

interface LearningpathCardProps {
  learningpath: GQLArticleLaunchpad_ResourceFragment;
}

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

interface NavSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const NavSection = ({ title, icon, children }: NavSectionProps) => {
  const headingId = useId();

  return (
    <StyledNav aria-labelledby={headingId}>
      <NavHeading asChild consumeCss textStyle="title.small" id={headingId}>
        <h2>
          {icon}
          {title}
        </h2>
      </NavHeading>
      <StyledList>{children}</StyledList>
    </StyledNav>
  );
};

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

interface SupplementaryArticleProps {
  article: GQLArticleLaunchpad_ResourceFragment;
}

const SupplementaryArticleCard = ({ article }: SupplementaryArticleProps) => {
  const traits = useListItemTraits({
    traits: article.article?.traits,
    resourceTypes: article.resourceTypes,
  });

  return (
    <CardRoot asChild consumeCss>
      <li>
        <CardContent>
          <CardHeading asChild consumeCss css={linkOverlay.raw()}>
            <SafeLink to={article.url ?? ""}>{article.name}</SafeLink>
          </CardHeading>
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

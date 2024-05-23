/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, ReactNode, useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, misc, mq, spacing } from "@ndla/core";
import { Additional, Core, HumanMaleBoard } from "@ndla/icons/common";
import { SafeLink } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { ContentTypeBadge, constants } from "@ndla/ui";

const contentTypes = constants.contentTypes;

const activeColorMap = {
  [contentTypes.SUBJECT_MATERIAL]: colors.subjectMaterial.dark,
  [contentTypes.TASKS_AND_ACTIVITIES]: colors.tasksAndActivities.dark,
  [contentTypes.ASSESSMENT_RESOURCES]: colors.assessmentResource.dark,
  [contentTypes.CONCEPT]: colors.concept.text,
  [contentTypes.SOURCE_MATERIAL]: colors.sourceMaterial.dark,
  [contentTypes.LEARNING_PATH]: colors.learningPath.dark,
  default: "none",
};

const ListElement = styled.li`
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
  background: ${colors.white};
  margin-bottom: ${spacing.xsmall};
  display: grid;
  align-items: center;
  grid-template-areas:
    "badge resourceType typeWrapper"
    "badge resourceLink typeWrapper";
  grid-row-gap: ${spacing.xsmall};
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;

  padding: ${spacing.small};
  &[data-additional="true"] {
    border-style: dashed;
  }

  * {
    transition:
      height ease-out 0.2s,
      width ease-out 0.2s;
  }
  &[aria-current="true"] {
    &:before {
      ${mq.range({ from: breakpoints.tablet })} {
        content: "";
        display: block;
        position: absolute;
        width: ${spacing.small};
        height: ${spacing.small};
        border-radius: 100%;
        transform: translate(-${spacing.mediumlarge});
        background-color: var(--contentTypeBg);
      }
    }
  }
  &[hidden] {
    display: none;
  }
  &:not([data-content-type]) {
    grid-template-areas: "badge resourceLink typeWrapper";
    grid-row-gap: 0;
    align-items: center;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    grid-template-areas: "badge resourceLink resourceType typeWrapper";
    grid-row-gap: 0;
    align-items: center;
  }
`;

const ResourceLink = styled(SafeLink)`
  grid-area: resourceLink;
  font-weight: ${fonts.weight.semibold};
  box-shadow: none;
  color: ${colors.brand.dark};
  &:not([aria-current="page"]) {
    text-decoration: underline;
    text-underline-offset: ${spacing.xsmall};
  }
  &:hover {
    text-decoration: none;
  }
`;

const TitleContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  ${mq.range({ from: breakpoints.desktop })} {
    align-items: center;
    flex-direction: row;
  }
`;

const ContentBadgeWrapper = styled.div`
  grid-area: badge;
  padding-right: ${spacing.small};
  ${mq.range({ from: breakpoints.tablet })} {
    padding-right: ${spacing.small};
    padding-left: ${spacing.xsmall};
  }
`;

const TypeWrapper = styled.div`
  grid-area: typeWrapper;
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const ContentTypeName = styled(Text)`
  grid-area: resourceType;
  color: ${colors.text.light};
  ${mq.range({ from: breakpoints.desktop })} {
    margin: 0 ${spacing.xsmall};
  }
`;

const CurrentSmall = styled.small`
  text-decoration: none;
  color: ${colors.text.primary};
  font-weight: ${fonts.weight.normal};
  white-space: nowrap;
  ${mq.range({ from: breakpoints.desktop })} {
    padding: 0 ${spacing.xsmall};
  }
`;

const StyledAdditional = styled(Additional)`
  color: ${colors.brand.dark};
`;

const StyledCore = styled(Core)`
  color: ${colors.brand.primary};
`;

interface Props {
  id: string;
  showContentTypeDescription?: boolean;
  contentTypeName?: string;
  contentTypeDescription?: string;
  extraBottomMargin?: boolean;
  showAdditionalResources?: boolean;
  language?: string;
  access?: "teacher";
  heartButton?: (path: string) => ReactNode;
}

const IconWrapper = styled.div`
  display: flex;
`;

export type Resource = {
  id: string;
  name: string;
  path: string;
  contentType?: string;
  active?: boolean;
  additional?: boolean;
};

const ResourceItem = ({
  contentTypeName,
  contentTypeDescription,
  name,
  path,
  contentType,
  active,
  additional,
  showAdditionalResources,
  access,
  language,
  heartButton,
}: Props & Resource) => {
  const { t } = useTranslation();
  const contentTypeId = useId();
  const accessId = useId();
  const describedBy = `${contentTypeId} ${accessId}`;
  const hidden = additional ? !showAdditionalResources : false;
  const listElementVars = useMemo(() => {
    if (!contentType) return {};
    return {
      "--contentTypeBg": activeColorMap[contentType] ?? activeColorMap.default,
    } as unknown as CSSProperties;
  }, [contentType]);

  return (
    <ListElement
      aria-current={active ? "page" : undefined}
      hidden={hidden && !active}
      data-additional={additional}
      data-content-type={contentTypeName}
      style={listElementVars}
    >
      <ContentBadgeWrapper>
        <ContentTypeBadge type={contentType ?? ""} background border={false} />
      </ContentBadgeWrapper>
      <ResourceLink
        to={path}
        lang={language === "nb" ? "no" : language}
        aria-current={active ? "page" : undefined}
        aria-describedby={describedBy}
        disabled={active}
      >
        <TitleContainer>
          {name}
          {active ? <CurrentSmall>{t("resource.youAreHere")}</CurrentSmall> : undefined}
        </TitleContainer>
      </ResourceLink>
      {contentTypeName && (
        <ContentTypeName element="span" textStyle="meta-text-xsmall">
          {contentTypeName}
        </ContentTypeName>
      )}
      <TypeWrapper>
        {access && access === "teacher" && (
          <IconWrapper
            id={accessId}
            aria-label={t("article.access.onlyTeacher")}
            title={t("article.access.onlyTeacher")}
          >
            <HumanMaleBoard />
          </IconWrapper>
        )}
        {showAdditionalResources && contentTypeDescription && (
          <IconWrapper id={contentTypeId} aria-label={contentTypeDescription} title={contentTypeDescription}>
            {additional ? <StyledAdditional size="normal" /> : <StyledCore size="normal" />}
          </IconWrapper>
        )}
        {heartButton?.(path)}
      </TypeWrapper>
    </ListElement>
  );
};

export default ResourceItem;

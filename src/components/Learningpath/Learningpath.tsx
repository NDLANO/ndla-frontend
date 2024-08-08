/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing, spacingUnit } from "@ndla/core";
import { useWindowSize } from "@ndla/hooks";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { HeroContent } from "@ndla/primitives";
import { Heading, Text } from "@ndla/typography";
import { HomeBreadcrumb, OneColumn, LicenseLink, LayoutItem, LearningPathBadge } from "@ndla/ui";
import LastLearningpathStepInfo from "./LastLearningpathStepInfo";
import LearningpathEmbed from "./LearningpathEmbed";
import LearningpathFooter from "./LearningpathFooter";
import LearningpathMenu from "./LearningpathMenu";
import {
  GQLTaxBase,
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpath_ResourceTypeDefinitionFragment,
  GQLLearningpath_TopicFragment,
} from "../../graphqlTypes";
import { Breadcrumb as BreadcrumbType } from "../../interfaces";

interface Props {
  breadcrumbItems: BreadcrumbType[];
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  path?: string;
  resourceId?: string;
  resourceTypes?: GQLLearningpath_ResourceTypeDefinitionFragment[];
  skipToContentId?: string;
  subjectId?: string;
  topic?: GQLLearningpath_TopicFragment;
  topicPath?: GQLTaxBase[];
}

const StyledHeroContent = styled(HeroContent)`
  display: none;

  ${mq.range({ from: breakpoints.desktop })} {
    display: flex;
    min-height: ${spacing.xxlarge}; //TODO: Temporary fix until design is finished
    align-items: end;
    padding: ${spacing.small} 0 ${spacing.xxsmall};
  }
`;

const StyledLearningpathContent = styled.div`
  ${mq.range({ from: breakpoints.desktop })} {
    display: flex;
    border-top: 1px solid ${colors.brand.greyLight};
    margin-top: ${spacing.small};
    padding-top: ${spacing.nsmall};
  }
`;

const LearningPathContent = styled.div`
  width: 100%;
`;

const MobileHeaderWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  background: ${colors.brand.lighter};
  margin: 0 -${spacing.normal} ${spacing.medium};
  padding: ${spacing.small} ${spacing.normal};
  align-items: center;
`;

const LearningPathWrapper = styled.section`
  max-width: ${1402 + spacingUnit}px;
  padding: 0 ${spacing.normal};
  margin: 0 auto;
`;

const Learningpath = ({
  breadcrumbItems,
  learningpath,
  learningpathStep,
  path,
  resourceId,
  resourceTypes,
  skipToContentId,
  subjectId,
  topic,
  topicPath,
}: Props) => {
  const { t, i18n } = useTranslation();

  const { innerWidth } = useWindowSize(100);
  const mobileView = innerWidth < 981;

  const learningpathMenu = <LearningpathMenu path={path} learningpath={learningpath} currentStep={learningpathStep} />;
  const previousStep = learningpath.learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningpath.learningsteps[learningpathStep.seqNo + 1];

  return (
    <LearningPathWrapper>
      <StyledHeroContent>
        <section>
          <HomeBreadcrumb items={breadcrumbItems} />
        </section>
      </StyledHeroContent>
      <StyledLearningpathContent>
        {mobileView ? (
          <MobileHeaderWrapper>
            <LearningPathBadge size="small" background />
            <Text margin="none" textStyle="meta-text-small">
              {t("learningPath.youAreInALearningPath")}
            </Text>
          </MobileHeaderWrapper>
        ) : (
          learningpathMenu
        )}
        {learningpathStep && (
          <LearningPathContent data-testid="learningpath-content">
            {learningpathStep.showTitle && (
              <OneColumn>
                <LayoutItem layout="center">
                  <Heading element="h1" headingStyle="h1-resource" margin="large" id={skipToContentId}>
                    {learningpathStep.title}
                  </Heading>
                  <LicenseLink
                    license={getLicenseByAbbreviation(learningpathStep.license?.license ?? "", i18n.language)}
                  />
                  {!!learningpathStep.description && <div>{parse(learningpathStep.description)}</div>}
                </LayoutItem>
              </OneColumn>
            )}
            <LearningpathEmbed
              skipToContentId={!learningpathStep.showTitle ? skipToContentId : undefined}
              subjectId={subjectId}
              learningpathStep={learningpathStep}
              breadcrumbItems={breadcrumbItems}
            />
            <LastLearningpathStepInfo
              topic={topic}
              topicPath={topicPath}
              resourceTypes={resourceTypes}
              seqNo={learningpathStep.seqNo}
              numberOfLearningSteps={learningpath.learningsteps.length - 1}
              title={learningpath.title}
              resourceId={resourceId}
            />
          </LearningPathContent>
        )}
      </StyledLearningpathContent>
      <LearningpathFooter
        path={path}
        mobileView={mobileView}
        learningPathMenu={learningpathMenu}
        learningPath={learningpath}
        totalSteps={learningpath.learningsteps.length}
        currentStep={learningpathStep.seqNo + 1}
        previousStep={previousStep}
        nextStep={nextStep}
      />
    </LearningPathWrapper>
  );
};

Learningpath.fragments = {
  topic: gql`
    fragment Learningpath_Topic on Node {
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
      ...LearningpathFooter_LearningpathStep
    }
    ${LearningpathMenu.fragments.step}
    ${LearningpathFooter.fragments.learningpathStep}
    ${LearningpathEmbed.fragments.learningpathStep}
  `,
  learningpath: gql`
    fragment Learningpath_Learningpath on Learningpath {
      ...LearningpathMenu_Learningpath
      ...LearningpathFooter_Learningpath
    }
    ${LearningpathMenu.fragments.learningpath}
    ${LearningpathFooter.fragments.learningpath}
  `,
};

export default Learningpath;

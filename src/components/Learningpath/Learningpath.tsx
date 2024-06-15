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
import { Heading, Text } from "@ndla/typography";
import { HomeBreadcrumb, HeroContent, OneColumn, LicenseLink, LayoutItem, LearningPathBadge } from "@ndla/ui";
import LastLearningpathStepInfo from "./LastLearningpathStepInfo";
import LearningpathEmbed from "./LearningpathEmbed";
import LearningpathFooter from "./LearningpathFooter";
import LearningpathMenu from "./LearningpathMenu";
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpath_ResourceFragment,
  GQLLearningpath_ResourceTypeDefinitionFragment,
  GQLLearningpath_SubjectFragment,
  GQLLearningpath_TopicFragment,
} from "../../graphqlTypes";
import { Breadcrumb as BreadcrumbType } from "../../interfaces";
import { useIsNdlaFilm, TaxonomyCrumb } from "../../routeHelpers";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  topic?: GQLLearningpath_TopicFragment;
  topicPath?: TaxonomyCrumb[];
  resourceTypes?: GQLLearningpath_ResourceTypeDefinitionFragment[];
  subject?: GQLLearningpath_SubjectFragment;
  resource?: GQLLearningpath_ResourceFragment;
  skipToContentId?: string;
  breadcrumbItems: BreadcrumbType[];
}

const StyledHeroContent = styled(HeroContent)`
  display: none;

  ${mq.range({ from: breakpoints.desktop })} {
    display: flex;
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

const StyledOneColumn = styled(OneColumn)`
  ${mq.range({ from: breakpoints.desktop })} {
    &[data-inverted="true"] {
      color: ${colors.white};
    }
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

  &[data-inverted="true"] {
    ${mq.range({ until: breakpoints.desktop })} {
      background: #fff;
    }
  }
`;

const Learningpath = ({
  learningpath,
  learningpathStep,
  resource,
  topic,
  subject,
  topicPath,
  resourceTypes,
  skipToContentId,
  breadcrumbItems,
}: Props) => {
  const { t, i18n } = useTranslation();
  const ndlaFilm = useIsNdlaFilm();

  const { innerWidth } = useWindowSize(100);
  const mobileView = innerWidth < 981;

  const learningpathMenu = (
    <LearningpathMenu resource={resource} learningpath={learningpath} currentStep={learningpathStep} />
  );
  const previousStep = learningpath.learningsteps[learningpathStep.seqNo - 1];
  const nextStep = learningpath.learningsteps[learningpathStep.seqNo + 1];

  return (
    <LearningPathWrapper data-inverted={ndlaFilm}>
      <StyledHeroContent>
        <section>
          <HomeBreadcrumb light={ndlaFilm} items={breadcrumbItems} />
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
              <StyledOneColumn data-inverted={ndlaFilm}>
                <LayoutItem layout="center">
                  <Heading element="h1" headingStyle="h1-resource" margin="large" id={skipToContentId}>
                    {learningpathStep.title}
                  </Heading>
                  <LicenseLink
                    license={getLicenseByAbbreviation(learningpathStep.license?.license ?? "", i18n.language)}
                  />
                  {!!learningpathStep.description && <div>{parse(learningpathStep.description)}</div>}
                </LayoutItem>
              </StyledOneColumn>
            )}
            <LearningpathEmbed
              skipToContentId={!learningpathStep.showTitle ? skipToContentId : undefined}
              topic={topic}
              subjectId={subject?.id}
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
              subject={subject}
            />
          </LearningPathContent>
        )}
      </StyledLearningpathContent>
      <LearningpathFooter
        resource={resource}
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
    fragment Learningpath_Topic on Topic {
      ...LastLearningpathStepInfo_Topic
      ...LearningpathEmbed_Topic
    }
    ${LearningpathEmbed.fragments.topic}
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
      ...LearningpathFooter_LearningpathStep
    }
    ${LearningpathMenu.fragments.step}
    ${LearningpathFooter.fragments.learningpathStep}
    ${LearningpathEmbed.fragments.learningpathStep}
  `,
  resource: gql`
    fragment Learningpath_Resource on Resource {
      path
      name
      ...LearningpathMenu_Resource
      ...LearningpathFooter_Resource
    }
    ${LearningpathMenu.fragments.resource}
    ${LearningpathFooter.fragments.resource}
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

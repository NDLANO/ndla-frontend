/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useState, createRef, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { InformationLine } from "@ndla/icons/common";
import { Heading, MessageBox, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { constants, OneColumn, SimpleBreadcrumbItem, HomeBreadcrumb } from "@ndla/ui";
import SubjectLinks from "./components/SubjectLinks";
import SubjectPageContent from "./components/SubjectPageContent";
import { AuthContext } from "../../components/AuthenticationContext";
import CompetenceGoals from "../../components/CompetenceGoals";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import {
  SKIP_TO_CONTENT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
} from "../../constants";
import { GQLSubjectContainer_SubjectFragment } from "../../graphqlTypes";
import { getSubjectType, useIsNdlaFilm } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

type Props = {
  topicIds: string[];
  subject: GQLSubjectContainer_SubjectFragment;
  loading?: boolean;
};

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "medium",
  },
});

const StyledOneColumn = styled(OneColumn, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
    paddingBlock: "xxlarge",
  },
});

const IntroductionText = styled(Text, {
  base: {
    maxWidth: "surface.xlarge",
  },
});

const getSubjectCategoryMessage = (subjectCategory: string | undefined, t: TFunction): string | undefined => {
  if (!subjectCategory || subjectCategory === constants.subjectCategories.ACTIVE_SUBJECTS) {
    return undefined;
  } else if (subjectCategory === constants.subjectCategories.ARCHIVE_SUBJECTS) {
    return t("messageBoxInfo.subjectOutdated");
  } else {
    return undefined;
  }
};

const getSubjectTypeMessage = (subjectType: string | undefined, t: TFunction): string | undefined => {
  if (!subjectType || subjectType === constants.subjectTypes.SUBJECT) {
    return undefined;
  } else if (subjectType === constants.subjectTypes.RESOURCE_COLLECTION) {
    return t("messageBoxInfo.resources");
  } else if (subjectType === constants.subjectTypes.BETA_SUBJECT) {
    return t("messageBoxInfo.subjectBeta");
  } else {
    return undefined;
  }
};

const SubjectContainer = ({ topicIds, subject, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const ndlaFilm = useIsNdlaFilm();
  const subjectType = getSubjectType(subject.id);
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const about = subject.subjectpage?.about;

  useEffect(() => {
    if (!authContextLoaded || loading || topicIds.length) return;
    const dimensions = getAllDimensions({
      filter: subject.name,
      user,
    });
    trackPageView({
      dimensions,
      title: htmlTitle(subject.name, [t("htmlTitles.titleTemplate")]),
    });
  }, [authContextLoaded, loading, subject, t, topicIds.length, trackPageView, user]);

  const [topicCrumbs, setTopicCrumbs] = useState<SimpleBreadcrumbItem[]>([]);

  useEffect(() => {
    setTopicCrumbs((crumbs) => crumbs.slice(0, topicIds.length));
  }, [topicIds.length]);

  const breadCrumbs: SimpleBreadcrumbItem[] = [
    {
      name: t("breadcrumb.toFrontpage"),
      to: "/",
    },
    {
      to: config.enablePrettyUrls ? subject.url : subject.path,
      name: subject.name,
    },
    ...topicCrumbs,
  ];

  const topicRefs = topicIds.map((_) => createRef<HTMLDivElement>());

  const pageTitle = htmlTitle(subject.name, [t("htmlTitles.titleTemplate")]);

  const customFields = subject?.metadata.customFields || {};

  const nonRegularSubjectMessage = getSubjectCategoryMessage(customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY], t);

  const nonRegularSubjectTypeMessage = getSubjectTypeMessage(customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE], t);

  return (
    <main>
      <Helmet>
        {!topicIds.length && <title>{pageTitle}</title>}
        {(customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] === constants.subjectCategories.ARCHIVE_SUBJECTS ||
          customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === "true") && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </Helmet>
      <StyledOneColumn wide>
        {!topicIds.length && (
          <SocialMediaMetadata
            title={subject.name}
            description={subject.subjectpage?.metaDescription}
            imageUrl={about?.visualElement.url}
            trackableContent={{ supportedLanguages: subject.supportedLanguages }}
          />
        )}
        <HomeBreadcrumb items={breadCrumbs} />
        <HeadingWrapper>
          <Heading textStyle="heading.medium" id={topicIds.length === 0 ? SKIP_TO_CONTENT_ID : undefined} tabIndex={-1}>
            {subject.name}
          </Heading>
          <SubjectLinks
            buildsOn={subject.subjectpage?.buildsOn ?? []}
            connectedTo={subject.subjectpage?.connectedTo ?? []}
            leadsTo={subject.subjectpage?.leadsTo ?? []}
          />
          {!!subject.grepCodes?.length && <CompetenceGoals codes={subject.grepCodes} subjectId={subject.id} />}
          {subjectType === "toolbox" ? (
            <IntroductionText textStyle="body.xlarge">{t("toolboxPage.introduction")}</IntroductionText>
          ) : subjectType === "multiDisciplinary" ? (
            <IntroductionText textStyle="body.xlarge">{t("frontpageMultidisciplinarySubject.text")}</IntroductionText>
          ) : null}
        </HeadingWrapper>
        {!ndlaFilm && subjectType !== "multiDisciplinary" && subjectType !== "toolbox" && nonRegularSubjectMessage && (
          <MessageBox variant="warning">
            <InformationLine />
            <Text>{nonRegularSubjectMessage}</Text>
          </MessageBox>
        )}
        {!ndlaFilm &&
          subjectType !== "multiDisciplinary" &&
          subjectType !== "toolbox" &&
          nonRegularSubjectTypeMessage && (
            <MessageBox variant="warning">
              <InformationLine />
              <Text>{nonRegularSubjectTypeMessage}</Text>
            </MessageBox>
          )}
        <SubjectPageContent subject={subject} topicIds={topicIds} refs={topicRefs} setBreadCrumb={setTopicCrumbs} />
      </StyledOneColumn>
    </main>
  );
};

export const subjectContainerFragments = {
  subject: gql`
    fragment SubjectContainer_Subject on Node {
      supportedLanguages
      metadata {
        customFields
      }
      grepCodes
      subjectpage {
        id
        metaDescription
        about {
          title
          visualElement {
            url
          }
        }
        ...SubjectLinks_SubjectPage
      }
      ...SubjectPageContent_Node
    }
    ${SubjectPageContent.fragments.subject}
    ${SubjectLinks.fragments.subjectPage}
  `,
};

export default SubjectContainer;

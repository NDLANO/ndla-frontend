/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { InformationLine } from "@ndla/icons/common";
import { Heading, MessageBox, PageContent, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { constants, SimpleBreadcrumbItem, HomeBreadcrumb } from "@ndla/ui";
import TopicWrapper from "./components/TopicWrapper";
import { AuthContext } from "../../components/AuthenticationContext";
import CompetenceGoals from "../../components/CompetenceGoals";
import FavoriteSubject from "../../components/FavoriteSubject";
import { PageContainer } from "../../components/Layout/PageContainer";
import NavigationBox from "../../components/NavigationBox";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import SubjectLinks from "../../components/Subject/SubjectLinks";
import {
  RELEVANCE_SUPPLEMENTARY,
  SKIP_TO_CONTENT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
} from "../../constants";
import { GQLSubjectContainer_SubjectFragment } from "../../graphqlTypes";
import { fixEndSlash } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

type Props = {
  subject: GQLSubjectContainer_SubjectFragment;
  subjectType?: string;
  topicId?: string;
  topicIds: string[];
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

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
  },
});

const StyledTopicWrapper = styled(PageContainer, {
  base: {
    paddingBlockStart: "0",
    overflowX: "hidden",
    // TODO: There's a bunch of tricky compositions for nested topics. This won't be necessary once we separate each topic out into their own page.
    "& > [data-nav-box] + :is([data-resource-section], [data-topic]), > [data-resource-section] + [data-topic]": {
      paddingBlockStart: "4xlarge",
    },
  },
});

const StyledSubjectWrapper = styled(PageContent, {
  base: {
    paddingBlock: "xxlarge",
    gap: "xxlarge",
    background: "surface.brand.1.subtle",
  },
});

const IntroductionText = styled(Text, {
  base: {
    maxWidth: "surface.xlarge",
  },
});

const PAGE = "page" as const;

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

const SubjectContainer = ({ subject, subjectType, topicId, topicIds, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
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
      name: subject.name,
      to: enablePrettyUrls ? subject.url : subject.path,
    },
    ...topicCrumbs,
  ];

  const pageTitle = htmlTitle(subject.name, [t("htmlTitles.titleTemplate")]);

  const customFields = subject?.metadata.customFields || {};

  const nonRegularSubjectMessage = getSubjectCategoryMessage(customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY], t);

  const nonRegularSubjectTypeMessage = getSubjectTypeMessage(customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE], t);

  const mainTopics = subject?.topics?.map((topic) => {
    return {
      ...topic,
      label: topic?.name,
      current: topicIds.length === 1 && topic?.id === topicIds[0] ? PAGE : topic?.id === topicIds[0],
      url: enablePrettyUrls ? topic?.url : fixEndSlash(topic?.path),
      isRestrictedResource: topic.availability !== "everyone",
      isAdditionalResource: topic.relevanceId === RELEVANCE_SUPPLEMENTARY,
    };
  });

  return (
    <main>
      <Helmet>
        {!topicIds.length && <title>{pageTitle}</title>}
        {(customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] === constants.subjectCategories.ARCHIVE_SUBJECTS ||
          customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === "true") && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </Helmet>
      {!topicIds.length && (
        <SocialMediaMetadata
          title={subject.name}
          description={subject.subjectpage?.metaDescription}
          imageUrl={about?.visualElement.url}
          trackableContent={{ supportedLanguages: subject.supportedLanguages }}
        />
      )}
      <StyledSubjectWrapper>
        <HomeBreadcrumb items={breadCrumbs} />
        <HeadingWrapper>
          <HeaderWrapper>
            <Heading
              textStyle="heading.medium"
              id={topicIds.length === 0 ? SKIP_TO_CONTENT_ID : undefined}
              tabIndex={-1}
            >
              {subject.name}
            </Heading>
            <FavoriteSubject
              subject={subject}
              favorites={user?.favoriteSubjects}
              subjectLinkOrText={<Text>{subject.name}</Text>}
            />
          </HeaderWrapper>
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
        {subjectType === "standard" && nonRegularSubjectMessage && (
          <MessageBox variant="warning">
            <InformationLine />
            <Text>{nonRegularSubjectMessage}</Text>
          </MessageBox>
        )}
        {subjectType === "standard" && nonRegularSubjectTypeMessage && (
          <MessageBox variant="warning">
            <InformationLine />
            <Text>{nonRegularSubjectTypeMessage}</Text>
          </MessageBox>
        )}
        <NavigationBox items={mainTopics || []} />
      </StyledSubjectWrapper>
      <StyledTopicWrapper>
        {topicIds.map((id, index) => (
          <TopicWrapper
            key={id}
            topicId={id}
            topicIds={topicIds}
            activeTopic={topicId === id}
            subjectId={subject.id}
            subjectType={subjectType}
            setBreadCrumb={setTopicCrumbs}
            subTopicId={topicIds[index + 1]}
            showResources={!topicIds[index + 1]}
            subject={subject}
          />
        ))}
      </StyledTopicWrapper>
    </main>
  );
};

export const subjectContainerFragments = {
  subject: gql`
    fragment SubjectContainer_Subject on Node {
      id
      name
      path
      url
      supportedLanguages
      metadata {
        customFields
      }
      grepCodes
      topics: children(nodeType: "TOPIC") {
        id
        name
        path
        url
        availability
        relevanceId
      }
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
      ...TopicWrapper_Subject
    }
    ${TopicWrapper.fragments.subject}
    ${SubjectLinks.fragments.subjectPage}
  `,
};

export default SubjectContainer;

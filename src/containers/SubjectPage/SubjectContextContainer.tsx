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
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";
import { MessageBox, Text } from "@ndla/primitives";
import { useTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import { constants, OneColumn, LayoutItem, SimpleBreadcrumbItem, HomeBreadcrumb } from "@ndla/ui";
import SubjectLinks from "./components/SubjectLinks";
import SubjectPageContent from "./components/SubjectPageContent";
import { AuthContext } from "../../components/AuthenticationContext";
import CompetenceGoals from "../../components/CompetenceGoals";
import { PageSpinner } from "../../components/PageSpinner";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import {
  SKIP_TO_CONTENT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
} from "../../constants";
import {
  GQLNodeFragmentFragment,
  GQLContextContainerQuery,
  GQLContextContainerQueryVariables,
  GQLSubjectContextContainer_SubjectFragment,
} from "../../graphqlTypes";
import { useIsNdlaFilm } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

type Props = {
  subjectFragment?: GQLNodeFragmentFragment & GQLSubjectContextContainer_SubjectFragment;
  subjectId?: string;
  topicFragment?: GQLNodeFragmentFragment;
  topicId?: string;
  topicIds: string[];

  loading?: boolean;
};

const BreadcrumbWrapper = styled.div`
  margin-top: ${spacing.mediumlarge};
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.xsmall};
`;

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

const SubjectContextContainer = ({ subjectId, subjectFragment, topicId, topicFragment, topicIds, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();
  const { trackPageView } = useTracker();

  const subId = subjectId || topicFragment?.context?.rootId;

  const {
    loading: ldng,
    data,
    error,
  } = useGraphQuery<GQLContextContainerQuery, GQLContextContainerQueryVariables>(contextContainerQuery, {
    variables: {
      subjectId: subId,
      topicId: topicId,
    },
  });

  const subject = data?.subject ?? subjectFragment;

  const about = subject?.subjectpage?.about;

  useEffect(() => {
    if (!authContextLoaded || loading || topicIds.length) return;
    const dimensions = getAllDimensions({
      filter: subject?.name,
      user,
    });
    trackPageView({
      dimensions,
      title: htmlTitle(subject?.name, [t("htmlTitles.titleTemplate")]),
    });
  }, [authContextLoaded, loading, subject, t, topicIds.length, trackPageView, user]);

  const [topicCrumbs, setTopicCrumbs] = useState<SimpleBreadcrumbItem[]>([]);

  useEffect(() => {
    setTopicCrumbs((crumbs) => crumbs.slice(0, topicIds.length));
  }, [topicIds.length]);

  if (ldng) {
    return <PageSpinner />;
  }

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const breadCrumbs: SimpleBreadcrumbItem[] = [
    {
      name: t("breadcrumb.toFrontpage"),
      to: "/",
    },
    {
      to: (config.enablePrettyUrls ? subject?.url : subject?.path) ?? "",
      name: subject?.name,
    },
    ...topicCrumbs,
  ];

  const topicRefs = topicIds.map((_) => createRef<HTMLDivElement>());

  const pageTitle = htmlTitle(subject?.name, [t("htmlTitles.titleTemplate")]);

  const customFields = subject?.metadata?.customFields || {};

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
      <OneColumn>
        <LayoutItem layout="extend">
          {!topicIds.length && (
            <SocialMediaMetadata
              title={subject?.name ?? ""}
              description={subject?.subjectpage?.metaDescription}
              imageUrl={about?.visualElement.url}
              trackableContent={{ supportedLanguages: subject?.supportedLanguages }}
            />
          )}
          <HeaderWrapper>
            <BreadcrumbWrapper>
              <HomeBreadcrumb items={breadCrumbs} />
            </BreadcrumbWrapper>
            <Heading
              element="h1"
              margin="xlarge"
              headingStyle="h1-resource"
              id={topicIds.length === 0 ? SKIP_TO_CONTENT_ID : undefined}
              tabIndex={-1}
            >
              {subject?.name}
            </Heading>
            {
              <SubjectLinks
                buildsOn={subject?.subjectpage?.buildsOn ?? []}
                connectedTo={subject?.subjectpage?.connectedTo ?? []}
                leadsTo={subject?.subjectpage?.leadsTo ?? []}
              />
            }
            {!!subject?.grepCodes?.length && <CompetenceGoals codes={subject?.grepCodes} subjectId={subject?.id} />}
          </HeaderWrapper>
          {!ndlaFilm && nonRegularSubjectMessage && (
            <MessageBox variant="warning">
              <InformationOutline />
              <Text>{nonRegularSubjectMessage}</Text>
            </MessageBox>
          )}
          {!ndlaFilm && nonRegularSubjectTypeMessage && (
            <MessageBox variant="warning">
              <InformationOutline />
              <Text>{nonRegularSubjectTypeMessage}</Text>
            </MessageBox>
          )}
          <SubjectPageContent subject={subject} topicIds={topicIds} refs={topicRefs} setBreadCrumb={setTopicCrumbs} />
        </LayoutItem>
      </OneColumn>
    </main>
  );
};

export const subjectContextContainerFragments = {
  subject: gql`
    fragment SubjectContextContainer_Subject on Node {
      id
      name
      path
      url
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
      topics: children(nodeType: TOPIC) {
        id
        name
        url
        path
      }
    }
    ${SubjectLinks.fragments.subjectPage}
  `,
  topic: gql`
    fragment SubjectContextContainer_Topic on Node {
      id
      name
      path
      url
      supportedLanguages
      metadata {
        customFields
      }
      topics: children(nodeType: TOPIC) {
        id
        name
        url
        path
      }
    }
  `,
};

const contextContainerQuery = gql`
  query contextContainer($subjectId: String, $topicId: String) {
    subject: node(id: $subjectId) {
      ...SubjectContextContainer_Subject
      ...SubjectPageContent_Node
    }
    topic: node(id: $topicId, rootId: $subjectId) {
      ...SubjectContextContainer_Topic
    }
  }
  ${subjectContextContainerFragments.subject}
  ${SubjectPageContent.fragments.subject}
  ${subjectContextContainerFragments.topic}
`;

export default SubjectContextContainer;

/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import groupBy from "lodash/groupBy";
import { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { WarningOutline } from "@ndla/icons/common";
import { useTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import { MessageBox, constants } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import CollectionContainer from "../../components/Collection/CollectionContainer";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import NavigationBox from "../../components/NavigationBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { COLLECTION_LANGUAGES, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLCollectionPageQuery, GQLCollectionPageQueryVariables } from "../../graphqlTypes";
import { useTypedParams } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import { getAllDimensions } from "../../util/trackingUtil";
import NotFound from "../NotFoundPage/NotFoundPage";

const collectionPageQuery = gql`
  query collectionPage($language: String!) {
    subjectCollection(language: $language) {
      id
      name
      path
      metadata {
        customFields
      }
      subjectpage {
        about {
          title
        }
      }
    }
  }
`;

const MessageBoxWrapper = styled.div`
  margin-bottom: ${spacing.xxlarge};
`;

const CollectionPage = () => {
  const { collectionLanguage } = useTypedParams();
  const collectionQuery = useGraphQuery<GQLCollectionPageQuery, GQLCollectionPageQueryVariables>(collectionPageQuery, {
    variables: { language: collectionLanguage! },
    skip: !collectionLanguage,
  });

  const isValidLanguage = COLLECTION_LANGUAGES.includes(collectionLanguage ?? "");

  if (collectionQuery.loading) {
    return <Spinner />;
  }

  if (!collectionLanguage || !isValidLanguage) {
    return <NotFound />;
  }

  if (!collectionQuery.data) {
    return <DefaultErrorMessage />;
  }

  return (
    <CollectionContent collectionLanguage={collectionLanguage} subjects={collectionQuery.data.subjectCollection} />
  );
};

interface CollectionContentProps {
  subjects: GQLCollectionPageQuery["subjectCollection"];
  collectionLanguage: string;
}

// TODO: We might want to reconsider this at some point. For now it'll do.
const imageUrl = "https://api.ndla.no/image-api/raw/id/67778";

const CollectionContent = ({ subjects, collectionLanguage }: CollectionContentProps) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const pageTitle = useMemo(
    () => t("htmlTitles.collectionPage", { language: collectionLanguage }),
    [collectionLanguage, t],
  );

  const subjectCategories = useMemo(() => {
    const transformedSubjects = subjects?.map((subject) => ({
      ...subject,
      label: subject.subjectpage?.about?.title ?? subject.name ?? "",
      url: subject.path,
      metadata: {
        ...subject.metadata,
        customFields: {
          ...subject.metadata.customFields,
          subjectType: subject.metadata.customFields.subjectType ?? constants.subjectTypes.SUBJECT,
        },
      },
    }));
    return Object.entries(groupBy(transformedSubjects, (d) => d.metadata.customFields.subjectType));
  }, [subjects]);

  useEffect(() => {
    if (!authContextLoaded) return;
    const dimensions = getAllDimensions({ user });
    trackPageView({
      dimensions,
      title: pageTitle,
    });
  }, [authContextLoaded, pageTitle, t, trackPageView, user]);

  return (
    <CollectionContainer imageUrl={imageUrl}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <SocialMediaMetadata title={pageTitle} imageUrl={imageUrl} />
      <Heading element="h1" margin="xlarge" headingStyle="h1" id={SKIP_TO_CONTENT_ID}>
        {t("collectionPage.title", { language: collectionLanguage })}
      </Heading>
      {subjectCategories.length ? (
        subjectCategories.map(([category, items]) => (
          <NavigationBox key={category} heading={t(`subjectTypes.${category}`)} items={items} />
        ))
      ) : (
        <MessageBoxWrapper>
          <MessageBox type="info">
            <WarningOutline />
            {t("collectionPage.noSubjects")}
          </MessageBox>
        </MessageBoxWrapper>
      )}
    </CollectionContainer>
  );
};

export default CollectionPage;

/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { ErrorWarningLine } from "@ndla/icons";
import { Heading, Image, MessageBox } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { constants } from "@ndla/ui";
import { groupBy } from "@ndla/util";
import { AuthContext } from "../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import NavigationBox from "../../components/NavigationBox";
import { PageSpinner } from "../../components/PageSpinner";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { COLLECTION_LANGUAGES, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLCollectionPageQuery, GQLCollectionPageQueryVariables } from "../../graphqlTypes";
import { useTypedParams } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

// TODO: We might want to reconsider this at some point. For now it'll do.
const IMAGE_URL = "https://api.ndla.no/image-api/raw/id/67778";

const collectionPageQuery = gql`
  query collectionPage($language: String!) {
    subjectCollection(language: $language) {
      id
      name
      url
      metadata {
        customFields
      }
    }
  }
`;

const StyledPageContainer = styled(PageContainer, {
  base: {
    paddingBlockStart: "0",
    gap: "xxlarge",
  },
});

const StyledImage = styled(Image, {
  base: {
    width: "100%",
  },
});

export const CollectionPage = () => {
  const { collectionId } = useTypedParams();
  const isValidLanguage = COLLECTION_LANGUAGES.includes(collectionId ?? "");

  const collectionQuery = useQuery<GQLCollectionPageQuery, GQLCollectionPageQueryVariables>(collectionPageQuery, {
    variables: { language: collectionId! },
    skip: !isValidLanguage,
  });

  if (collectionQuery.loading) {
    return <PageSpinner />;
  }

  if (!isValidLanguage || !collectionId) {
    return <NotFoundPage />;
  }

  if (!collectionQuery.data) {
    return <DefaultErrorMessagePage />;
  }

  return <CollectionPageContent collectionLanguage={collectionId} subjects={collectionQuery.data.subjectCollection} />;
};

interface CollectionpageContentProps {
  collectionLanguage: string;
  subjects: GQLCollectionPageQuery["subjectCollection"];
}

const CollectionPageContent = ({ collectionLanguage, subjects }: CollectionpageContentProps) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const { trackPageView } = useTracker();

  const metaTitle = useMemo(
    () => t("collectionPage.title", { language: t(`languages.${collectionLanguage}`).toLowerCase() }),
    [collectionLanguage, t],
  );
  const pageTitle = useMemo(() => htmlTitle(metaTitle, [t("htmlTitles.titleTemplate")]), [metaTitle, t]);

  const subjectCategories = useMemo(() => {
    const transformedSubjects = subjects?.map((subject) => ({
      ...subject,
      label: subject.name ?? "",
      url: subject.url,
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
  }, [authContextLoaded, pageTitle, trackPageView, user]);

  return (
    <StyledPageContainer padding="large" asChild consumeCss>
      <main>
        <title>{pageTitle}</title>
        <SocialMediaMetadata title={metaTitle} imageUrl={IMAGE_URL} />
        <div>
          {/* TODO: Use semantic tokens */}
          <StyledImage src={IMAGE_URL} alt="" height="400" width="1128" />
          <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
            {t("collectionPage.title", { language: t(`languages.${collectionLanguage}`).toLowerCase() })}
          </Heading>
        </div>
        {subjectCategories.length ? (
          subjectCategories.map(([category, items]) => (
            <NavigationBox key={category} heading={t(`subjectTypes.${category}`)} items={items} />
          ))
        ) : (
          <MessageBox variant="warning">
            <ErrorWarningLine /> {t("collectionPage.noSubjects")}
          </MessageBox>
        )}
      </main>
    </StyledPageContainer>
  );
};

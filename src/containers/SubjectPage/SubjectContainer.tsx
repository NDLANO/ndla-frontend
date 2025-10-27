/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect, useContext, useId } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { InformationLine } from "@ndla/icons";
import { Heading, MessageBox, PageContent, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { constants, SimpleBreadcrumbItem, HomeBreadcrumb } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import { CompetenceGoals } from "../../components/CompetenceGoals";
import { FavoriteSubject } from "../../components/FavoriteSubject";
import { PageContainer } from "../../components/Layout/PageContainer";
import { ImageLicenseAccordion } from "../../components/license/ImageLicenseAccordion";
import { ImageLicenseList } from "../../components/license/ImageLicenseList";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { SubjectLinks } from "../../components/Subject/SubjectLinks";
import { TransportationPageHeader } from "../../components/TransportationPage/TransportationPageHeader";
import { TransportationNode } from "../../components/TransportationPage/TransportationPageNode";
import { TransportationPageNodeListGrid } from "../../components/TransportationPage/TransportationPageNodeListGrid";
import { TransportationPageVisualElement } from "../../components/TransportationPage/TransportationPageVisualElement";
import {
  SKIP_TO_CONTENT_ID,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
} from "../../constants";
import { GQLSubjectContainer_NodeFragment } from "../../graphqlTypes";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

type Props = {
  node: GQLSubjectContainer_NodeFragment;
  subjectType?: string;
  loading?: boolean;
};

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "medium",
    paddingBlockEnd: "medium",
  },
});

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
  },
});

const StyledSubjectWrapper = styled(PageContent, {
  base: {
    paddingBlockStart: "xxlarge",
    gap: "xxlarge",
    background: "surface.brand.1.subtle",
  },
});

const IntroductionText = styled(Text, {
  base: {
    maxWidth: "surface.xlarge",
  },
});

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    paddingBlockStart: "0",
    "& > :first-child": {
      marginBlockStart: "xxlarge",
      marginBlockEnd: "medium",
    },
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

export const SubjectContainer = ({ node, subjectType, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const about = node.subjectpage?.about;
  const headingId = useId();

  useEffect(() => {
    if (!authContextLoaded || loading) return;
    const dimensions = getAllDimensions({ user });
    trackPageView({
      dimensions,
      title: htmlTitle(node.name, [t("htmlTitles.titleTemplate")]),
    });
  }, [authContextLoaded, loading, node, t, trackPageView, user]);

  const breadCrumbs: SimpleBreadcrumbItem[] = [
    {
      name: t("breadcrumb.toFrontpage"),
      to: "/",
    },
    {
      name: node.name,
      to: node.url || "",
    },
  ];

  const pageTitle = htmlTitle(node.name, [t("htmlTitles.titleTemplate")]);

  const customFields = node?.metadata.customFields || {};

  const nonRegularSubjectMessage = getSubjectCategoryMessage(customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY], t);

  const nonRegularSubjectTypeMessage = getSubjectTypeMessage(customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE], t);

  return (
    <main>
      <title>{pageTitle}</title>
      {(!node.context?.isActive || customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === "true") && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      <SocialMediaMetadata
        title={node.name}
        description={node.subjectpage?.metaDescription}
        imageUrl={about?.visualElement.imageUrl}
        trackableContent={{ supportedLanguages: node.supportedLanguages }}
      />
      <StyledSubjectWrapper>
        <HomeBreadcrumb items={breadCrumbs} />
        <TransportationPageHeader>
          <HeadingWrapper>
            <HeaderWrapper>
              <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
                {node.name}
              </Heading>
              <FavoriteSubject
                node={node}
                favorites={user?.favoriteSubjects}
                subjectLinkOrText={<Text>{node.name}</Text>}
              />
            </HeaderWrapper>
            {!!node.subjectpage?.metaDescription && (
              <Text textStyle="body.xlarge">{node.subjectpage.metaDescription}</Text>
            )}
            <SubjectLinks
              buildsOn={node.subjectpage?.buildsOn ?? []}
              connectedTo={node.subjectpage?.connectedTo ?? []}
              leadsTo={node.subjectpage?.leadsTo ?? []}
            />
            {!!node.grepCodes?.length && <CompetenceGoals codes={node.grepCodes} subjectId={node.id} />}
            {subjectType === "toolbox" ? (
              <IntroductionText textStyle="body.xlarge">{t("toolboxPage.introduction")}</IntroductionText>
            ) : subjectType === "multiDisciplinary" ? (
              <IntroductionText textStyle="body.xlarge">{t("frontpageMultidisciplinarySubject.text")}</IntroductionText>
            ) : null}
          </HeadingWrapper>
          {!!about?.visualElement && about.visualElement.type === "image" && (
            <TransportationPageVisualElement metaImage={about.visualElement} />
          )}
        </TransportationPageHeader>
      </StyledSubjectWrapper>
      <StyledPageContainer>
        {subjectType !== "film" &&
          subjectType !== "multiDisciplinary" &&
          subjectType !== "toolbox" &&
          !!nonRegularSubjectMessage && (
            <MessageBox variant="warning">
              <InformationLine />
              <Text>{nonRegularSubjectMessage}</Text>
            </MessageBox>
          )}
        {subjectType !== "film" &&
          subjectType !== "multiDisciplinary" &&
          subjectType !== "toolbox" &&
          !!nonRegularSubjectTypeMessage && (
            <MessageBox variant="warning">
              <InformationLine />
              <Text>{nonRegularSubjectTypeMessage}</Text>
            </MessageBox>
          )}
        {!!node.nodes?.length && (
          <StyledNav aria-labelledby={headingId}>
            <Heading id={headingId} textStyle="heading.small" asChild consumeCss>
              <h2>{t("topicsPage.topics")}</h2>
            </Heading>
            <TransportationPageNodeListGrid>
              {node.nodes.map((node) => (
                <TransportationNode key={node.id} node={node} />
              ))}
            </TransportationPageNodeListGrid>
          </StyledNav>
        )}
        {!!about?.visualElement.imageLicense && (
          <ImageLicenseAccordion imageLicenses={[about.visualElement.imageLicense]} />
        )}
      </StyledPageContainer>
    </main>
  );
};

export const subjectContainerFragments = {
  subject: gql`
    fragment SubjectContainer_Node on Node {
      id
      name
      supportedLanguages
      url
      nodeType
      metadata {
        customFields
      }
      context {
        contextId
        isActive
        rootId
        parentIds
        url
      }
      grepCodes
      nodes: children(nodeType: "TOPIC") {
        ...TransportationNode_Node
      }
      subjectpage {
        id
        metaDescription
        about {
          title
          visualElement {
            type
            alt
            url
            imageUrl
            imageLicense {
              ...ImageLicenseList_ImageLicense
            }
          }
        }
        ...SubjectLinks_SubjectPage
      }
      ...FavoriteSubject_Node
    }
    ${TransportationNode.fragments.node}
    ${ImageLicenseList.fragments.image}
    ${FavoriteSubject.fragments.node}
    ${SubjectLinks.fragments.subjectPage}
  `,
};

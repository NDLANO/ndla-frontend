/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { SafeLinkButton } from "@ndla/safelink";
import { useTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import { MessageBox } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import CollectionContainer from "../../components/Collection/CollectionContainer";
import NavigationBox from "../../components/NavigationBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLProgrammeContainer_ProgrammeFragment } from "../../graphqlTypes";
import { LocaleType } from "../../interfaces";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

const getDocumentTitle = (title: string, grade: string, t: TFunction) => {
  return htmlTitle(`${title} - ${grade}`, [t("htmlTitles.titleTemplate")]);
};

interface GradesData {
  name: string;
  missingProgrammeSubjects: boolean;
  categories?: {
    name: string;
    subjects?: {
      label: string;
      url: string;
    }[];
  }[];
}

interface Props {
  locale: LocaleType;
  programme: GQLProgrammeContainer_ProgrammeFragment;
  grade: string;
}

const mapGradesData = (grades: GQLProgrammeContainer_ProgrammeFragment["grades"]): GradesData[] => {
  if (!grades) return [];
  return grades?.map((grade) => {
    let foundProgrammeSubject = false;
    const categories = grade.categories?.map((category) => {
      foundProgrammeSubject = foundProgrammeSubject || category.isProgrammeSubject;
      const categorySubjects = category.subjects?.map((subject) => {
        return {
          label: subject.subjectpage?.about?.title || subject.name || "",
          url: subject.path,
        };
      });
      return {
        name: category.title.title,
        isProgrammeSubject: category.isProgrammeSubject,
        subjects: categorySubjects,
      };
    });
    return {
      name: grade.title.title,
      missingProgrammeSubjects: !foundProgrammeSubject,
      categories,
    };
  });
};

const GradesMenu = styled.ul`
  display: flex;
  gap: ${spacing.small};
  padding-left: 0;
  li {
    list-style: none;
    padding: 0;
  }
`;

const MessageBoxWrapper = styled.div`
  margin-top: ${spacing.normal};
`;

const ProgrammeContainer = ({ programme, grade: gradeProp }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const heading = programme.title.title;
  const grades = mapGradesData(programme.grades || []);
  const socialMediaTitle = `${programme.title.title} - ${gradeProp}`;
  const metaDescription = programme.metaDescription;
  const image = programme.desktopImage?.url || "";
  const pageTitle = getDocumentTitle(programme.title.title, gradeProp, t);
  const { trackPageView } = useTracker();

  useEffect(() => {
    if (!authContextLoaded) return;
    const dimensions = getAllDimensions({ user });
    trackPageView({
      dimensions,
      title: getDocumentTitle(programme.title.title, gradeProp, t),
    });
  }, [authContextLoaded, gradeProp, programme.title.title, t, trackPageView, user]);

  const selectedGrade = gradeProp.toLowerCase();

  const grade = useMemo(
    () => grades?.find((grade) => grade.name.toLowerCase() === selectedGrade) ?? grades?.[0],
    [grades, selectedGrade],
  );

  return (
    <CollectionContainer imageUrl={programme.desktopImage?.url ?? ""}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <SocialMediaMetadata title={socialMediaTitle} description={metaDescription} imageUrl={image} />
      <Heading element="h1" margin="xlarge" headingStyle="h1" id={SKIP_TO_CONTENT_ID}>
        {heading}
      </Heading>
      <GradesMenu aria-label={t("programmes.grades")}>
        {grades?.map((item) => {
          const current = item.name.toLowerCase() === selectedGrade;
          return (
            <li key={item.name}>
              <SafeLinkButton
                to={current ? "" : item.name.toLowerCase()}
                colorTheme={current ? undefined : "lighter"}
                shape="pill"
                aria-current={current}
              >
                {item.name}
              </SafeLinkButton>
            </li>
          );
        })}
      </GradesMenu>
      {grade?.missingProgrammeSubjects && (
        <MessageBoxWrapper>
          <MessageBox>{t("messageBoxInfo.noContent")}</MessageBox>
        </MessageBoxWrapper>
      )}
      {grade?.categories?.map((category) => (
        <NavigationBox key={category.name} heading={category.name} items={category.subjects} />
      ))}
    </CollectionContainer>
  );
};

ProgrammeContainer.fragments = {
  programme: gql`
    fragment ProgrammeContainer_Programme on ProgrammePage {
      id
      metaDescription
      title {
        title
      }
      desktopImage {
        url
      }
      grades {
        id
        title {
          title
        }
        url
        categories {
          id
          title {
            title
          }
          isProgrammeSubject
          subjects {
            id
            name
            path
            subjectpage {
              about {
                title
              }
            }
          }
        }
      }
    }
  `,
};

export default ProgrammeContainer;

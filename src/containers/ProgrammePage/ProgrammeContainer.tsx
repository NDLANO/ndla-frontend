/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { InformationLine } from "@ndla/icons";
import { Heading, Image, MessageBox, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { PageContainer } from "../../components/Layout/PageContainer";
import { NavigationBox } from "../../components/NavigationBox";
import { NavigationSafeLinkButton } from "../../components/NavigationSafeLinkButton";
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLProgrammeContainer_ProgrammeFragment } from "../../graphqlTypes";
import { LocaleType } from "../../interfaces";
import { toProgramme } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";

const getDocumentTitle = (title: string, grade: string, t: TFunction) => {
  return htmlTitle(`${title} - ${grade}`, [t("htmlTitles.titleTemplate")]);
};

interface GradesData {
  id: string;
  name: string;
  missingProgrammeSubjects: boolean;
  categories?: {
    name: string;
    subjects?: {
      label: string;
      url?: string;
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
          url: subject.url,
        };
      });
      return {
        name: category.title.title,
        isProgrammeSubject: category.isProgrammeSubject,
        subjects: categorySubjects,
      };
    });
    return {
      id: grade.id,
      name: grade.title.title,
      missingProgrammeSubjects: !foundProgrammeSubject,
      categories,
    };
  });
};

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    marginBlockEnd: "xxlarge",
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
    boxShadow: "full",
    paddingInline: "medium",
    paddingBlockStart: "xxlarge",
    paddingBlockEnd: "large",

    tabletDown: {
      gap: "xsmall",
      paddingBlockStart: "medium",
      paddingInline: "xsmall",
      paddingBlockEnd: "small",
      marginBlockEnd: "medium",
    },
  },
});

const GradesList = styled("ul", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const MessageBoxWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    paddingBlockStart: "0",
    gap: "xxlarge",
  },
});

const StyledNavigationSafeLinkButton = styled(NavigationSafeLinkButton, {
  base: {
    minWidth: "3xlarge",
    justifyContent: "center",
  },
});

const StyledImage = styled(Image, {
  base: {
    width: "100%",
  },
});

export const ProgrammeContainer = ({ programme, grade: gradeProp }: Props) => {
  const { t } = useTranslation();
  const heading = programme.title.title;
  const grades = mapGradesData(programme.grades || []);
  const socialMediaTitle = `${programme.title.title} - ${gradeProp}`;
  const metaDescription = programme.metaDescription;
  const image = programme.desktopImage?.url || "";
  const pageTitle = getDocumentTitle(programme.title.title, gradeProp, t);

  const selectedGrade = gradeProp.toLowerCase();

  const grade = useMemo(
    () => grades?.find((grade) => grade.name.toLowerCase() === selectedGrade) ?? grades?.[0],
    [grades, selectedGrade],
  );

  return (
    <StyledPageContainer padding="large" asChild consumeCss>
      <main>
        <PageTitle title={pageTitle} />
        <SocialMediaMetadata title={socialMediaTitle} description={metaDescription} imageUrl={image} />
        <div>
          {/* TODO: Use semantic tokens */}
          <StyledImage src={programme.desktopImage?.url} alt="" height="400" width="1128" fetchPriority="high" />
          <HeadingWrapper>
            <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
              {heading}
            </Heading>
            {!!grades.length && (
              <GradesList aria-label={t("programmes.grades")}>
                {grades?.map((item) => (
                  <li key={item.id}>
                    <StyledNavigationSafeLinkButton
                      to={toProgramme(programme.url, item.name.toLowerCase())}
                      variant="secondary"
                      aria-current={item.name.toLowerCase() === selectedGrade ? "page" : undefined}
                    >
                      {item.name}
                    </StyledNavigationSafeLinkButton>
                  </li>
                ))}
              </GradesList>
            )}
          </HeadingWrapper>
        </div>
        {!!grade?.missingProgrammeSubjects && (
          <MessageBoxWrapper>
            <Heading asChild consumeCss textStyle="heading.small">
              <h2>{t("programmePage.programmeSubjects")}</h2>
            </Heading>
            <MessageBox variant="info">
              <InformationLine />
              <Text>{t("messageBoxInfo.noContent")}</Text>
            </MessageBox>
          </MessageBoxWrapper>
        )}
        {grade?.categories?.map((category) => (
          <NavigationBox key={category.name} heading={category.name} items={category.subjects} />
        ))}
      </main>
    </StyledPageContainer>
  );
};

ProgrammeContainer.fragments = {
  programme: gql`
    fragment ProgrammeContainer_Programme on ProgrammePage {
      id
      metaDescription
      title {
        title
        language
      }
      desktopImage {
        url
      }
      url
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
            url
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

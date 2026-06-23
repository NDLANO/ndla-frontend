/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Heading, Image, Label } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { PageContainer } from "../../components/Layout/PageContainer";
import { NavigationSafeLinkButton } from "../../components/NavigationSafeLinkButton";
import { PageTitle } from "../../components/PageTitle";
import { RestrictedContent } from "../../components/RestrictedBlock";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLProgrammeContainer_ProgrammeFragment } from "../../graphqlTypes";
import { LocaleType } from "../../interfaces";
import { toProgramme } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";

const getDocumentTitle = (title: string, t: TFunction) => {
  return htmlTitle(`${title}`, [t("htmlTitles.titleTemplate")]);
};

interface GradesData {
  id: string;
  name: string;
  slug: string;
  missingProgrammeSubjects: boolean;
  categories?: {
    id: string;
    name: string;
    subjects?: {
      label: string;
      url?: string | null;
    }[];
  }[];
}

interface Props {
  locale: LocaleType;
  programme: GQLProgrammeContainer_ProgrammeFragment;
}

export const sanitizeGrade = (grade: string) => {
  return encodeURIComponent(grade.replace("/", "").trim().toLowerCase());
};

const mapGradesData = (grades: GQLProgrammeContainer_ProgrammeFragment["grades"]): GradesData[] => {
  if (!grades) return [];
  return grades.map((grade) => {
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
        id: category.id,
        name: category.title.title,
        isProgrammeSubject: category.isProgrammeSubject,
        subjects: categorySubjects,
      };
    });
    return {
      id: grade.id,
      name: grade.title.title,
      slug: sanitizeGrade(grade.title.title),
      missingProgrammeSubjects: !foundProgrammeSubject,
      categories,
    };
  });
};

const HeadingWrapper = styled("div", {
  base: {
    width: "100%",
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: "large",
    backgroundColor: "background.default",
    boxShadow: "xsmall",
    paddingTop: "medium",
    paddingRight: "xxlarge",
    paddingBottom: "large",
    paddingLeft: "large",

    tabletDown: {
      gap: "medium",
      paddingBlockStart: "medium",
      paddingInline: "medium",
      paddingBlockEnd: "medium",
    },
  },
});

const HeadingTextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const GradesList = styled("ul", {
  base: {
    display: "flex",
    gap: "xsmall",
    padding: "xsmall",
    alignItems: "flex-start",
    flexDirection: "row",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    backgroundColor: "background.strong",
    paddingBlockStart: "0",
    gap: "medium",
  },
});

const StyledNavigationSafeLinkButton = styled(NavigationSafeLinkButton, {
  base: {
    minWidth: "79px",
    minHeight: "32px",
    justifyContent: "center",
    display: "flex",
    padding: "4xsmall xsmall",
    gap: "small",
  },
});

const StyledImage = styled(Image, {
  base: {
    width: "100%",
    padding: "large",
  },
});

const SubjectSection = styled("div", {
  base: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "background.default",
    boxShadow: "xsmall",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "small",
    padding: "xxlarge",

    tabletDown: {
      padding: "medium",
    },
  },
});

const SubjectList = styled("ul", {
  base: {
    listStyle: "none",
    padding: "0",
    display: "grid",
    rowGap: "xsmall",
    columnGap: "xsmall",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

    tabletDown: {
      gridTemplateColumns: "1fr",
    },
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    color: "text.strong",
    textDecoration: "underline",
    textUnderlineOffset: "20%",
    textStyle: "body.large",
    overflowWrap: "break-word",
  },
});

const ResourceButtonList = styled("ul", {
  base: {
    display: "flex",
    padding: "small medium",
    gap: "xxsmall",
    alignItems: "flex-start",
  },
});

export const ProgrammeContainer = ({ programme }: Props) => {
  const { t } = useTranslation();
  const { grade: gradeParam = "" } = useParams();
  const heading = programme.title.title;
  const grades = mapGradesData(programme.grades || []);
  const grade = useMemo(
    () => grades?.find((grade) => grade.slug === sanitizeGrade(gradeParam)) ?? grades?.[0],
    [grades, gradeParam],
  );

  const socialMediaTitle = `${programme.title.title} - ${grade?.name}`;
  const metaDescription = programme.metaDescription;
  const image = programme.desktopImage?.url || "";
  const pageTitle = getDocumentTitle(socialMediaTitle, t);

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <PageTitle title={pageTitle} trackingProps={{ defaultUrl: programme.defaultUrl, rootId: programme.id }} />
        <SocialMediaMetadata
          title={socialMediaTitle}
          description={metaDescription}
          imageUrl={image}
          canonicalPath={programme.url}
        />
        <div>
          {/* TODO: Use semantic tokens */}
          {/* TODO: Variants */}
          <StyledImage src={programme.desktopImage?.url} alt="" height="400" width="1128" fetchPriority="high" />
          <HeadingWrapper>
            <HeadingTextWrapper>
              <Label textStyle="label.small">{"Utdanningsprogram"}</Label>
              <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
                {heading}
              </Heading>
            </HeadingTextWrapper>
            {!!grades.length && (
              <GradesList aria-label={t("programmes.grades")}>
                {grades?.map((item) => (
                  <li key={item.id}>
                    <StyledNavigationSafeLinkButton
                      to={toProgramme(programme.url, item.slug)}
                      variant="secondary"
                      aria-current={item.slug === grade?.slug ? "page" : undefined}
                    >
                      {item.name}
                    </StyledNavigationSafeLinkButton>
                  </li>
                ))}
              </GradesList>
            )}
          </HeadingWrapper>
        </div>
        <RestrictedContent context="bleed">
          {grade?.categories?.map((category) => {
            const isOtherResources = category.name === "Andre ressurser";
            return (
              <SubjectSection key={category.id}>
                <Heading textStyle="title.large">{category.name}</Heading>

                {isOtherResources ? (
                  <ResourceButtonList>
                    {category.subjects?.map((subject) => (
                      <li key={subject.url ?? subject.label}>
                        <StyledNavigationSafeLinkButton to={subject.url || "#"} variant="secondary">
                          {subject.label}
                        </StyledNavigationSafeLinkButton>
                      </li>
                    ))}
                  </ResourceButtonList>
                ) : (
                  <SubjectList>
                    {category.subjects?.map((subject) => (
                      <li key={subject.url ?? subject.label}>
                        <StyledSafeLink to={subject.url || "#"}>{subject.label}</StyledSafeLink>
                      </li>
                    ))}
                  </SubjectList>
                )}
              </SubjectSection>
            );
          })}
        </RestrictedContent>
      </main>
    </StyledPageContainer>
  );
};

ProgrammeContainer.fragments = {
  programme: gql`
    fragment ProgrammeContainer_Programme on ProgrammePage {
      id
      metaDescription
      defaultUrl
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

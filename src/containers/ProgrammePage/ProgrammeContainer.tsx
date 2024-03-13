/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useTracker } from "@ndla/tracker";
import { Programme } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { LocaleType } from "../../interfaces";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

const getDocumentTitle = (title: string, grade: string, t: TFunction) => {
  return htmlTitle(`${title} - ${grade}`, [t("htmlTitles.titleTemplate")]);
};

interface GradeResult {
  id: string;
  title: {
    title: string;
  };
  url?: string;
  categories?: {
    id: string;
    title: {
      title: string;
    };
    isProgrammeSubject: boolean;
    subjects?: {
      id: string;
      name: string;
      path: string;
      metadata: {
        customFields: Record<string, string>;
      };
      subjectpage?: {
        about?: {
          title: string;
        };
        banner?: {
          desktopUrl: string;
        };
      };
    }[];
  }[];
}

interface ProgrammeQueryResult {
  id: string;
  title: {
    title: string;
  };
  metaDescription?: string;
  desktopImage?: {
    url: string;
  };
  mobileImage?: {
    url: string;
  };
  grades?: GradeResult[];
}

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
  programme: ProgrammeQueryResult;
  grade: string;
}

export const mapGradesData = (grades: GradeResult[]): GradesData[] => {
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

const ProgrammeContainer = ({ programme, grade }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const heading = programme.title.title;
  const grades = mapGradesData(programme.grades || []);
  const socialMediaTitle = `${programme.title.title} - ${grade}`;
  const metaDescription = programme.metaDescription;
  const image = programme.desktopImage?.url || "";
  const pageTitle = getDocumentTitle(programme.title.title, grade, t);
  const { trackPageView } = useTracker();

  useEffect(() => {
    if (!authContextLoaded) return;
    const dimensions = getAllDimensions({ user });
    trackPageView({
      dimensions,
      title: getDocumentTitle(programme.title.title, grade, t),
    });
  }, [authContextLoaded, grade, programme.title.title, t, trackPageView, user]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <SocialMediaMetadata title={socialMediaTitle} description={metaDescription} imageUrl={image} />
      <main>
        <Programme
          headingId={SKIP_TO_CONTENT_ID}
          heading={heading}
          grades={grades}
          image={image}
          selectedGrade={grade.toLowerCase()}
        />
      </main>
    </>
  );
};

export default ProgrammeContainer;

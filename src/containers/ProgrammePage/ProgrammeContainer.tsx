/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { withTracker } from '@ndla/tracker';
import { FeideUserApiType, Programme } from '@ndla/ui';
import { Helmet } from 'react-helmet-async';
import { WithTranslation, withTranslation } from 'react-i18next';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import { LocaleType } from '../../interfaces';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

const getDocumentTitle = ({
  programme,
  grade,
  t,
}: Pick<Props, 'programme' | 'grade' | 't'>) => {
  return htmlTitle(`${programme.title.title} - ${grade}`, [
    t('htmlTitles.titleTemplate'),
  ]);
};

interface GradeResult {
  id: string;
  title: {
    title: string;
  }
  url?: string;
  categories?: {
    id: string;
    title: {
      title: string;
    }
    subjects?: {
      id: string;
      name: string;
      path: string;
      metadata: {
        customFields: Record<string, string>;
      }
      subjectpage?: {
        about: {
          title: string;
        }
        banner?: {
          desktopUrl: string;
        }
      }
    }[];
  }[];
} 

interface ProgrammeQueryResult {
  id: string;
  title: {
    title: string;
  }
  metaDescription?: string;
  desktopImage?: {
    url: string;
  }
  mobileImage?: {
    url: string;
  }
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

interface Props extends WithTranslation {
  locale: LocaleType;
  user?: FeideUserApiType;
  programme: ProgrammeQueryResult;
  grade: string;
}

export const mapGradesData = (
  grades: GradeResult[],
): GradesData[] => {
  return grades?.map((grade) => {
    const categories =
      grade.categories?.map((category) => {
        const categorySubjects =
          category.subjects?.map((subject) => {
            return {
              label: subject.subjectpage?.about?.title || subject.name || '',
              url: subject.path,
            };
          });
        return {
          name: category.title.title,
          subjects: categorySubjects,
        };
      });
    return {
      name: grade.title.title,
      missingProgrammeSubjects: false,
      categories,
    };
  });
};

const ProgrammeContainer = ({ programme, grade, t }: Props) => {
  const heading = programme.title.title;
  const grades = mapGradesData(programme.grades || []);
  const socialMediaTitle = `${programme.title.title} - ${grade}`;
  const metaDescription = programme.metaDescription;
  const image = programme.desktopImage?.url || '';
  const pageTitle = getDocumentTitle({ programme, grade, t });
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <SocialMediaMetadata
        title={socialMediaTitle}
        description={metaDescription}
        imageUrl={image}
      />
      <main>
        <Programme
          headingId={SKIP_TO_CONTENT_ID}
          heading={heading}
          grades={grades}
          image={image}
          selectedGrade={grade}
        />
      </main>
    </>
  );
};

ProgrammeContainer.getDocumentTitle = getDocumentTitle;

ProgrammeContainer.getDimensions = (props: Props) => {
  const { programme, grade, user } = props;
  const subjectName = `${programme.title.title} - ${grade}`;
  return getAllDimensions(
    { subject: { name: subjectName }, user },
    undefined,
    false,
  );
};

export default withTranslation()(withTracker(ProgrammeContainer));

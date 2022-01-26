/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';
import { withTracker } from '@ndla/tracker';

import { Programme } from '@ndla/ui';
import { withTranslation } from 'react-i18next';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { getAllDimensions } from '../../util/trackingUtil';
import { getProgrammeBySlug } from '../../data/programmes';
import { getSubjectById } from '../../data/subjects';
import { createSubjectUrl } from '../../util/programmesSubjectsHelper';
import { htmlTitle } from '../../util/titleHelper';

export const mapGradesData = (grades, locale, programmeSlug) => {
  return grades.map(grade => {
    const data = { name: grade.name };
    data.categories = grade.categories.map(category => {
      const categoryData = { name: category.name ? category.name[locale] : '' };
      const subjects = category.subjects.map(subject => {
        const subjectInfo = getSubjectById(subject.id);
        const subjectData = {};
        if (subjectInfo) {
          /*const url = toProgrammeSubject(
            programmeSlug,
            subjectInfo.id,
            subjectInfo.filters,
          );*/
          const url = createSubjectUrl(subjectInfo);
          return {
            label: subjectInfo.name[locale],
            url: url,
          };
        }

        return subjectData;
      });
      subjects.sort((a, b) => a.label?.localeCompare(b.label, locale));
      categoryData.subjects = subjects;
      return categoryData;
    });
    return data;
  });
};

const getProgrammeName = (match, locale) => {
  const slug = match?.params?.programme;
  const programmeData = getProgrammeBySlug(slug, locale);
  let heading = '';
  if (programmeData) {
    heading = programmeData.name[locale];
  }
  return heading;
};

const getDocumentTitle = ({ match, locale, t }) => {
  const name = getProgrammeName(match, locale);
  return htmlTitle(name, [t('htmlTitles.titleTemplate')]);
};

const ProgrammePage = ({ match, locale, t }) => {
  const slug = match?.params?.programme;
  const programmeData = getProgrammeBySlug(slug, locale);

  if (!programmeData) {
    return <NotFoundPage />;
  }

  const heading = programmeData.name[locale];
  const grades = mapGradesData(programmeData.grades, locale, slug);
  const documentTitle = getDocumentTitle({ match, locale, t });
  const metaDescription = programmeData.meta?.description?.[locale];
  const image = programmeData.image?.url || '';
  return (
    <>
      <Helmet>
        <title>{documentTitle}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>
      <Programme heading={heading} grades={grades} image={image} />
    </>
  );
};

ProgrammePage.getDocumentTitle = getDocumentTitle;

ProgrammePage.getDimensions = props => {
  const { match, locale, user } = props;
  return getAllDimensions(
    { subject: { name: getProgrammeName(match, locale) }, user },
    undefined,
    false,
  );
};

ProgrammePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      programme: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  user: PropTypes.shape({
    eduPersonPrimaryAffiliation: PropTypes.string,
    primarySchool: PropTypes.shape({
      displayName: PropTypes.string,
    }),
  }),
};

export default withTranslation()(withTracker(ProgrammePage));

/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SubjectLinks, SubjectShortcuts } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { GraphQLSubjectPageShape } from '../../../graphqlShapes';
import { toLinkProps } from '../../../routeHelpers';
import { getSearchUrl } from '../subjectPageHelpers';
import SubjectPageFlexChild from './SubjectPageFlexChild';

export const SubjectPageSidebar = ({
  subjectId,
  subjectpage,
  twoColumns,
  locale,
  t,
}) => {
  const { mostRead, goTo } = subjectpage;

  return [
    goTo.length > 0 && (
      <SubjectPageFlexChild key="subjectpage_shortcuts" twoColumns={twoColumns}>
        <SubjectShortcuts
          messages={{
            heading: t('subjectPage.subjectShortcuts.heading'),
            showMore: t('subjectPage.subjectShortcuts.showMore'),
            showLess: t('subjectPage.subjectShortcuts.showLess'),
          }}
          links={goTo.map(type => ({
            text: type.name,
            url: getSearchUrl(subjectId, type),
          }))}
        />
      </SubjectPageFlexChild>
    ),
    mostRead.length > 0 && (
      <SubjectPageFlexChild key="subjectpage_mostread" twoColumns={twoColumns}>
        <SubjectLinks
          heading={t('subjectPage.mostRead.heading')}
          links={mostRead.map(resource => ({
            text: resource.name,
            url: toLinkProps(resource, locale).to,
            toLinkProps: () => toLinkProps(resource, locale),
          }))}
        />
      </SubjectPageFlexChild>
    ),
  ];
};
SubjectPageSidebar.propTypes = {
  subjectpage: GraphQLSubjectPageShape,
  subjectId: PropTypes.string.isRequired,
  twoColumns: PropTypes.bool,
  locale: PropTypes.string.isRequired,
};

SubjectPageSidebar.defaultProps = {
  subjectpage: {},
  twoColumns: false,
};

export default injectT(SubjectPageSidebar);

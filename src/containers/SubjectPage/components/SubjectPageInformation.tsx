/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { tType } from '@ndla/i18n';
import SubjectTopical from './SubjectTopical';
import SubjectPageAbout from './SubjectPageAbout';
import { GQLSubjectPage } from '../../../graphqlTypes';

interface Props {
  subjectpage?: GQLSubjectPage;
  twoColumns?: boolean;
  wide: boolean;
}

export const SubjectPageInformation = ({
  subjectpage,
  twoColumns,
  wide,
  t,
}: Props & tType) => {
  if (!subjectpage?.topical || subjectpage?.about) return null;
  const { topical, about } = subjectpage;

  return (
    <>
      <SubjectTopical
        key="subjectpage_information_topical"
        twoColumns={twoColumns}
        topical={topical}
        t={t}
      />
      <SubjectPageAbout
        key="subjectpage_information_about"
        twoColumns={twoColumns}
        about={about!}
        wide={wide}
      />
    </>
  );
};

export default SubjectPageInformation;

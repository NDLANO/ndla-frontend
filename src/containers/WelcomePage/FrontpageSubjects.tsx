/**
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { FrontpageProgramMenu } from '@ndla/ui';

import { getProgrammes } from '../../util/programmesSubjectsHelper';
import { getSubjectsCategories } from '../../data/subjects';
import { LocaleType } from '../../interfaces';
import { GQLSubjectInfoFragment } from '../../graphqlTypes';

interface Props {
  locale: LocaleType;
  subjects?: GQLSubjectInfoFragment[];
}
const FrontpageSubjects = ({ locale, subjects }: Props) => (
  <FrontpageProgramMenu
    programItems={getProgrammes(locale)}
    subjectCategories={getSubjectsCategories(subjects)}
  />
);

export default FrontpageSubjects;

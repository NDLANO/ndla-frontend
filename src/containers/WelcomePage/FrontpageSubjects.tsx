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

import {
  getCategorizedSubjects,
  getProgrammes,
} from '../../util/programmesSubjectsHelper';
import { LocaleType } from '../../interfaces';

interface Props {
  locale: LocaleType;
}
const FrontpageSubjects = ({ locale }: Props) => (
  <FrontpageProgramMenu
    programItems={getProgrammes(locale)}
    subjectCategories={getCategorizedSubjects(locale)}
  />
);

export default FrontpageSubjects;

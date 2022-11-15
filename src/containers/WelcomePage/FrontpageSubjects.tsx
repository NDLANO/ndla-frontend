/**
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FrontpageProgramMenu } from '@ndla/ui';

import { useTranslation } from 'react-i18next';
import { getProgrammes } from '../../util/programmesSubjectsHelper';
import { getSubjectsCategories } from '../../data/subjects';
import { LocaleType } from '../../interfaces';
import { GQLSubjectInfoFragment } from '../../graphqlTypes';

interface Props {
  locale: LocaleType;
  subjects?: GQLSubjectInfoFragment[];
}
const FrontpageSubjects = ({ locale, subjects }: Props) => {
  const { t } = useTranslation();
  return (
    <FrontpageProgramMenu
      programItems={getProgrammes(locale)}
      subjectCategories={getSubjectsCategories(t, subjects)}
    />
  );
};

export default FrontpageSubjects;

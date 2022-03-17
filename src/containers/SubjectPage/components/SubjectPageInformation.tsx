/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import SubjectTopical from './SubjectTopical';
import SubjectPageAbout from './SubjectPageAbout';
import { GQLSubjectPageInformation_SubjectPageFragment } from '../../../graphqlTypes';

interface Props {
  subjectpage?: GQLSubjectPageInformation_SubjectPageFragment;
  twoColumns?: boolean;
  wide: boolean;
}

export const SubjectPageInformation = ({
  subjectpage,
  twoColumns = false,
  wide = false,
}: Props) => {
  if (!subjectpage?.topical || subjectpage?.about) return null;
  const { topical, about } = subjectpage;

  return (
    <>
      {topical.__typename === 'Resource' && (
        <SubjectTopical
          key="subjectpage_information_topical"
          twoColumns={twoColumns}
          topical={topical}
        />
      )}
      <SubjectPageAbout
        key="subjectpage_information_about"
        twoColumns={twoColumns}
        about={about!}
        wide={wide}
      />
    </>
  );
};

SubjectPageInformation.fragments = {
  subjectpage: gql`
    fragment SubjectPageInformation_SubjectPage on SubjectPage {
      topical {
        ...SubjectTopical_TaxonomyEntity
      }
      about {
        ...SubjectPageAbout_SubjectPageAbout
      }
    }
    ${SubjectTopical.fragments.topical}
    ${SubjectPageAbout.fragments.about}
  `,
};

export default SubjectPageInformation;

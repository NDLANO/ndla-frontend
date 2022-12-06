/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, fonts, misc, spacing } from '@ndla/core';
import { HeartOutline } from '@ndla/icons/lib/action';
import SafeLink from '@ndla/safelink';
import { toSubject } from '../../routeHelpers';

interface Subject {
  id: string;
  name: string;
}

interface Props {
  label: string;
  subjects: Subject[];
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`;

const Heading = styled.h2`
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xxsmall} ${spacing.small};
  ${fonts.sizes('18px', '24px')}
`;

const SubjectCategory = ({ label, subjects }: Props) => {
  return (
    <div>
      <Heading id={`subject-${label}`}>{label.toUpperCase()}</Heading>
      <Grid>
        {subjects.map(subject => {
          return (
            <div key={subject.id}>
              <IconButtonV2
                aria-label="TEMP"
                variant="ghost"
                size="xsmall"
                colorTheme="lighter">
                <HeartOutline />
              </IconButtonV2>
              <SafeLink to={toSubject(subject.id)}>{subject.name}</SafeLink>
            </div>
          );
        })}
      </Grid>
    </div>
  );
};

export default SubjectCategory;

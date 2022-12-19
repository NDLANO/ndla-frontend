/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, fonts, misc, spacing } from '@ndla/core';
import { Forward } from '@ndla/icons/lib/common';
import { useMastheadHeight } from '@ndla/ui';
import { Subject } from './interfaces';
import SubjectLink from './SubjectLink';

interface Props {
  label: string;
  subjects: Subject[];
  favorites: string[] | undefined;
  openLoginModal: () => void;
}

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  gap: ${spacing.xxsmall};
  padding: 0 ${spacing.small};
  margin: ${spacing.small} 0;
`;

interface StyledProps {
  offset?: number;
}

const StickyHeading = styled.div<StyledProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.small};
  position: sticky;
  background: white;
  top: calc(${({ offset }) => offset}px + ${spacing.small});
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xxsmall} ${spacing.small};
`;

const StyledH2 = styled.h2`
  margin: 0;
  ${fonts.sizes('18px', '24px')};
`;

const StyledArrow = styled(Forward)`
  transform: rotate(-90deg);
`;

const GoToTop = styled.a`
  ${fonts.sizes('16px', '24px')};
  font-weight: ${fonts.weight.semibold};
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  box-shadow: none;
  color: ${colors.brand.primary};
`;

const SubjectCategory = ({
  label,
  subjects,
  favorites,
  openLoginModal,
}: Props) => {
  const headingOffset = useMastheadHeight().height || 84;
  return (
    <div>
      <StickyHeading offset={headingOffset}>
        <StyledH2>{label.toUpperCase()}</StyledH2>
        <GoToTop href="#SkipToContentId">
          Gå til toppen <StyledArrow />
        </GoToTop>
      </StickyHeading>
      <Grid id={`subject-${label}`}>
        {subjects.map(subject => (
          <SubjectLink
            openLoginModal={openLoginModal}
            favorites={favorites}
            key={subject.id}
            subject={subject}
          />
        ))}
      </Grid>
    </div>
  );
};

export default SubjectCategory;

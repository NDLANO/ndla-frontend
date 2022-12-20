/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { buttonStyleV2 } from '@ndla/button';
import { breakpoints, colors, fonts, misc, mq, spacing } from '@ndla/core';
import { Forward } from '@ndla/icons/lib/common';
import { useMastheadHeight } from '@ndla/ui';
import { useRef } from 'react';
import useStickyObserver from '../../util/useStickyObserver';
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
  ${mq.range({ until: breakpoints.tablet })} {
    display: flex;
    flex-direction: column;
  }
  gap: ${spacing.xxsmall};
  padding: 0;
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

  ${mq.range({ until: breakpoints.tabletWide })} {
    border: none;
    border-bottom: 0;
    top: ${({ offset }) => offset}px;
    margin: 0;
    padding: ${spacing.small} 0;
    border-radius: 0;
    :before {
      content: '';
      position: absolute;
      width: 100vw;
      bottom: 0;
      right: 50%;
      transform: translateX(50%);
      height: 1px;
      background: ${colors.brand.lighter};
    }
  }
`;

const StyledH2 = styled.h2`
  margin: 0;
  ${fonts.sizes('18px', '24px')};
`;

const StyledArrow = styled(Forward)`
  transform: rotate(-90deg);
`;

interface GoToTopProps {
  isSticky: boolean;
}

const GoToTop = styled.a<GoToTopProps>`
  ${fonts.sizes('16px', '24px')};
  font-weight: ${fonts.weight.semibold};
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  box-shadow: none;
  color: ${colors.brand.primary};
  opacity: ${({ isSticky }) => (isSticky ? 1 : 0)};
  transition: ${misc.transition.default};
  :focus,
  :hover {
    opacity: 1;
  }

  ${mq.range({ until: breakpoints.tabletWide })} {
    ${buttonStyleV2({ shape: 'pill', variant: 'outline' })}
    border-width: 1px;
  }
`;

const SubjectCategory = ({
  label,
  subjects,
  favorites,
  openLoginModal,
}: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { isSticky } = useStickyObserver(rootRef, stickyRef);
  const { height = 85 } = useMastheadHeight();
  return (
    <div ref={rootRef}>
      <StickyHeading ref={stickyRef} offset={height}>
        <StyledH2>{label.toUpperCase()}</StyledH2>
        <GoToTop isSticky={isSticky} href="#SkipToContentId">
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

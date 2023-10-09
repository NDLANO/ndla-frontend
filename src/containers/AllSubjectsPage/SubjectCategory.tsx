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
import { useIntersectionObserver } from '@ndla/hooks';
import { Forward } from '@ndla/icons/common';
import { OneColumn, useMastheadHeight } from '@ndla/ui';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Subject } from './interfaces';
import SubjectLink from './SubjectLink';

const StyledColumn = styled(OneColumn)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &::after {
    content: none !important;
  }
`;

export const GridList = styled.ul`
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
  color: ${colors.brand.greyDark};
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
      width: 100%;
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
  ${mq.range({ until: breakpoints.tabletWide })} {
    ${fonts.sizes('30px', '36px')};
  }
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
interface Props {
  label: string;
  subjects: Subject[];
  favorites: string[] | undefined;
}

const SubjectCategory = ({ label, subjects, favorites }: Props) => {
  const rootRef = useRef<HTMLLIElement>(null);
  const { t } = useTranslation();
  const stickyRef = useRef<HTMLDivElement>(null);
  const { entry } = useIntersectionObserver({
    root: rootRef.current,
    target: stickyRef.current,
    rootMargin: '-1px 0px 0px 0px',
    threshold: 1,
  });
  const { height = 85 } = useMastheadHeight();

  return (
    <li
      ref={rootRef}
      aria-owns={`subject-${label}`}
      aria-labelledby={`subject-header-${label}`}
    >
      <StickyHeading ref={stickyRef} offset={height}>
        <StyledColumn wide>
          <StyledH2
            id={`subject-header-${label}`}
            aria-label={label === '#' ? t('labels.other') : label}
          >
            {label.toUpperCase()}
          </StyledH2>
          <GoToTop isSticky={!!entry?.isIntersecting} href="#SkipToContentId">
            {t('subjectsPage.goToTop')} <StyledArrow />
          </GoToTop>
        </StyledColumn>
      </StickyHeading>
      <StyledColumn wide>
        <GridList
          id={`subject-${label}`}
          aria-label={t('subjectsPage.subjectGroup', {
            category: label === '#' ? t('labels.other') : label,
          })}
        >
          {subjects.map((subject) => (
            <SubjectLink
              favorites={favorites}
              key={subject.id}
              subject={subject}
            />
          ))}
        </GridList>
      </StyledColumn>
    </li>
  );
};

export default SubjectCategory;

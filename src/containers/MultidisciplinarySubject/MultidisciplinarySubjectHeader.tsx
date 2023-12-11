/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';
import { HomeBreadcrumb, SimpleBreadcrumbItem } from '@ndla/ui';
import {
  ClimateIllustration,
  DemocracyClimateIllustration,
  DemocracyIllustration,
  PublicHealthClimateIllustration,
  PublicHealthDemocracyClimateIllustration,
  PublicHealthDemocracyIllustration,
  PublicHealthIllustration,
} from './Illustrations';

const StyledWrapper = styled.div`
  width: 100%;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 68.75%,
      #ffffff 100%
    ),
    linear-gradient(336.12deg, #efeedc 35.53%, #faf6f0 74.23%), #ddd8af;

  display: flex;
  justify-content: center;
  align-items: stretch;
`;

const ContentWrapper = styled.div`
  max-width: 1440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TextWrapper = styled.div`
  padding: ${spacing.normal} ${spacing.normal} 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  width: 100%;
  z-index: 2;
  ${mq.range({ from: breakpoints.tablet })} {
    padding: 44px 44px 0;
  }
`;

const SubjectsWrapper = styled.div`
  margin-top: ${spacing.small};
`;

type IllustrationsWrapperProps = {
  subjectCount?: number;
};
const IllustrationsWrapper = styled.div<IllustrationsWrapperProps>`
  display: flex;
  align-items: flex-end;
  margin-bottom: 24px;
`;

type subjects = 'climate' | 'democracy' | 'publicHealth';

type subjectLink = {
  label: string;
  url: string;
};

type Props = {
  subjects?: subjects[];
  subjectsLinks?: subjectLink[];
  breadcrumbs?: SimpleBreadcrumbItem[];
};

const MultidisciplinarySubjectHeader = ({
  subjects = [],
  subjectsLinks = [],
  breadcrumbs = [],
}: Props) => {
  const { t } = useTranslation();
  const getIllustration = () => {
    if (subjects.length === 3) {
      return <PublicHealthDemocracyClimateIllustration />;
    }
    if (subjects.includes('publicHealth') && subjects.includes('democracy')) {
      return <PublicHealthDemocracyIllustration />;
    }
    if (subjects.includes('climate') && subjects.includes('democracy')) {
      return <DemocracyClimateIllustration />;
    }
    if (subjects.includes('climate') && subjects.includes('publicHealth')) {
      return <PublicHealthClimateIllustration />;
    }
    return (
      <>
        {subjects.includes('publicHealth') && <PublicHealthIllustration />}
        {subjects.includes('democracy') && <DemocracyIllustration />}
        {subjects.includes('climate') && <ClimateIllustration />}
      </>
    );
  };
  return (
    <StyledWrapper>
      <ContentWrapper>
        <TextWrapper>
          <HomeBreadcrumb items={breadcrumbs} />
          <Text element="span" textStyle="meta-text-medium">
            {t('frontpageMultidisciplinarySubject.heading')}
          </Text>
          <SubjectsWrapper>
            <Text textStyle="content-alt" element="span" margin="none">
              {t('multidisciplinarySubject.subjectsLinksDescription')}:{' '}
            </Text>
            {subjectsLinks.map((subject, index) => {
              return (
                <span key={subject.label}>
                  {index > 0 &&
                    (index < subjectsLinks.length - 1 ? ', ' : ' og ')}
                  <SafeLink to={subject.url}>{subject.label}</SafeLink>
                </span>
              );
            })}
          </SubjectsWrapper>
        </TextWrapper>
        <IllustrationsWrapper subjectCount={subjects.length}>
          {getIllustration()}
        </IllustrationsWrapper>
      </ContentWrapper>
    </StyledWrapper>
  );
};

export default MultidisciplinarySubjectHeader;

/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { spacing, fonts, breakpoints, mq } from '@ndla/core';
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from '@ndla/accordion';
import { ContentLoader, Heading, ProgrammeCard, ProgrammeV2 } from '@ndla/ui';
import { SKIP_TO_CONTENT_ID } from '../../../constants';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding-top: 4px;
  ${mq.range({ from: breakpoints.desktop })} {
    padding-top: ${spacing.nsmall};
  }
`;

const Desktop = styled.div`
  display: none;
  ${mq.range({ from: breakpoints.tablet })} {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: ${spacing.normal};
  }
`;

const Mobile = styled.div`
  display: none;
  ${mq.range({ until: breakpoints.tablet })} {
    width: 100%;
    display: block;
  }
`;

const AllSubjectsPersonIllustration = styled.div`
  background-image: url('/static/illustrations/all_subjects_person.svg');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 100% 100%;
  height: 175px;
  width: 208px;
`;

const StyledAccordionRoot = styled(AccordionRoot)`
  gap: 0;
`;

const StyledAccordionContent = styled(AccordionContent)`
  a {
    margin-top: ${spacing.normal};
  }
`;

const StyledAccordionHeader = styled(AccordionHeader)`
  ${fonts.sizes('16px', '24px')};
  ${fonts.weight.semibold};
  :hover {
    text-decoration: none;
  }
  :active {
    text-decoration: underline;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  ${mq.range({ until: breakpoints.tablet })} {
    display: flex;
  }
`;

interface Props {
  programmes: ProgrammeV2[];
  loading: boolean;
}

const placeholder = (
  <ContentLoader width={1150} height={350}>
    <rect x="0" y="10" rx="3" ry="3" width="250" height="350" key="rect-1-1" />
    <rect
      x="274"
      y="10"
      rx="3"
      ry="3"
      width="250"
      height="350"
      key="rect-1-2"
    />
    <rect
      x="548"
      y="10"
      rx="3"
      ry="3"
      width="250"
      height="350"
      key="rect-1-3"
    />
    <rect
      x="812"
      y="10"
      rx="3"
      ry="3"
      width="250"
      height="350"
      key="rect-1-4"
    />
  </ContentLoader>
);

const Description = styled.div`
  margin-top: ${spacing.xsmall};
  margin-bottom: ${spacing.large};
  ${fonts.sizes('18px', '24px')};
`;

const Programmes = ({ programmes, loading }: Props) => {
  const { t } = useTranslation();

  const programmeCards = useMemo(() => {
    return programmes.map((programme) => (
      <ProgrammeCard
        key={programme.id}
        id={programme.id}
        title={programme.title}
        wideImage={programme.wideImage}
        narrowImage={programme.narrowImage}
        url={programme.url}
      />
    ));
  }, [programmes]);

  return (
    <StyledWrapper>
      <Heading element="h2" headingStyle="h1" serif id={SKIP_TO_CONTENT_ID}>
        {t('programmes.header')}
      </Heading>
      <Description>{t('programmes.description')}</Description>
      <Desktop>{loading ? placeholder : programmeCards}</Desktop>
      <Mobile>
        <StyledAccordionRoot type="single" collapsible>
          <ImageWrapper>
            <AllSubjectsPersonIllustration />
          </ImageWrapper>
          <AccordionItem value="1">
            <StyledAccordionHeader>
              {t('programmes.accordionHeader')}
            </StyledAccordionHeader>
            <StyledAccordionContent>{programmeCards}</StyledAccordionContent>
          </AccordionItem>
        </StyledAccordionRoot>
      </Mobile>
    </StyledWrapper>
  );
};

export default Programmes;

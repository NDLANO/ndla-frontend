/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { spacing, fonts, breakpoints, mq } from '@ndla/core';
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from '@ndla/accordion';
import { ProgrammeCard, ProgrammeV2 } from '@ndla/ui';
import { css } from '@emotion/react';
import { useMemo } from 'react';
import { AllSubjectsPersonIllustration } from '../../MultidisciplinarySubject/Illustrations';

const DesktopContainer = styled.div`
  display: none;
  ${mq.range({ from: breakpoints.tablet })} {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: ${spacing.normal};
  }
`;

const MobilContainer = styled.div`
  display: none;
  ${mq.range({ until: breakpoints.tablet })} {
    display: block;
  }
`;

const StyledAccordianRoot = styled(AccordionRoot)`
  gap: 0;
`;

const StyledAccordianContent = styled(AccordionContent)`
  a {
    margin-top: ${spacing.normal};
  }
`;

const AccordionHeaderStyling = css`
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
  display: flex;
  justify-content: center;
`;

interface Props {
  programmes: ProgrammeV2[];
}

const Programme = ({ programmes }: Props) => {
  const { t } = useTranslation();

  const programmeCards = useMemo(() => {
    return programmes.map((programme) => (
      <ProgrammeCard
        key={programme.id}
        id={programme.id}
        title={programme.title}
        desktopImage={programme.desktopImage}
        mobileImage={programme.mobileImage}
        url={programme.url}
      />
    ));
  }, [programmes]);

  return (
    <>
      <DesktopContainer>{programmeCards}</DesktopContainer>
      <MobilContainer>
        <StyledAccordianRoot type="single" collapsible>
          <ImageWrapper>
            <AllSubjectsPersonIllustration />
          </ImageWrapper>
          <AccordionItem value="1">
            <AccordionHeader headerCSS={AccordionHeaderStyling}>
              {t('programme.accordianHeader')}
            </AccordionHeader>
            <StyledAccordianContent>{programmeCards}</StyledAccordianContent>
          </AccordionItem>
        </StyledAccordianRoot>
      </MobilContainer>
    </>
  );
};

export default Programme;

/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, colors, misc, mq, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { SectionHeading } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { toSubject } from '../../routeHelpers';
import {
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from '../../constants';

export const FrontpageSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${spacing.nsmall};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.medium};
  ${mq.range({ from: breakpoints.desktop })} {
    padding: ${spacing.large};
    margin: 124px 0;
  }
  p {
    display: inline-block;
    width: 100%;
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    ${mq.range({ from: breakpoints.desktop })} {
      font-size: 20px;
      line-height: 32px;
    }
  }
`;

const ToolboxSection = styled(FrontpageSection)`
  border: 1px solid ${colors.background.dark};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: ${spacing.nsmall};
  ${mq.range({ until: breakpoints.tablet })} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Illustration = styled.div`
  background-image: url('/static/illustrations/toolbox_mobile.svg');
  background-repeat: no-repeat;
  background-size: cover;
  padding-bottom: calc(100% * 1 / 4);
  ${mq.range({ from: breakpoints.tablet })} {
    background-image: url('/static/illustrations/toolbox_desktop.svg');
    padding-bottom: calc(100% * 1 / 9);
  }
`;

const FrontpageToolbox = () => {
  const { t } = useTranslation();
  return (
    <ToolboxSection>
      <SectionHeading headingLevel="h2" large>
        {t('frontPageToolbox.heading')}
      </SectionHeading>
      <p>{t('frontPageToolbox.text')}</p>
      <ButtonsWrapper>
        <SafeLinkButton
          size="medium"
          shape="pill"
          to={toSubject(TOOLBOX_STUDENT_SUBJECT_ID)}
        >
          {t('frontPageToolbox.linkTextStudents')}
        </SafeLinkButton>
        <SafeLinkButton
          size="medium"
          shape="pill"
          to={toSubject(TOOLBOX_TEACHER_SUBJECT_ID)}
        >
          {t('frontPageToolbox.linkTextTeachers')}
        </SafeLinkButton>
      </ButtonsWrapper>
      <Illustration />
    </ToolboxSection>
  );
};

export default FrontpageToolbox;

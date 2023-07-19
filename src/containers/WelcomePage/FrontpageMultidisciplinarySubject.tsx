/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import { SectionHeading } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import SafeLink, { SafeLinkButton } from '@ndla/safelink';
import { LocaleType, TopicType } from '../../interfaces';
import { multidisciplinaryTopics } from '../../data/subjects';
import { toSubject, toTopic } from '../../routeHelpers';
import { MULTIDISCIPLINARY_SUBJECT_ID } from '../../constants';
import { FrontpageSection } from './FrontpageToolbox';

const getMultidisciplinaryTopics = (locale: LocaleType) => {
  return multidisciplinaryTopics.map((topic: TopicType) => {
    return {
      id: topic.id,
      title: topic.name?.[locale] ?? '',
      url: toTopic(MULTIDISCIPLINARY_SUBJECT_ID, topic.id ?? ''),
    };
  });
};

const StyledSection = styled(FrontpageSection)`
  background-color: rgb(250, 246, 240);
  background: linear-gradient(
    304.38deg,
    rgba(239, 238, 220, 0.35),
    rgba(250, 246, 240, 0.75)
  );
  p {
    max-width: 720px;
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  gap: ${spacing.nsmall};
  a {
    box-shadow: none;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
  ${mq.range({ until: breakpoints.tablet })} {
    flex-direction: column;
  }
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  align-self: flex-start;
`;

const Illustration = styled.div`
  background-image: url('/static/illustrations/frontpage_multidisciplinary.svg');
  background-repeat: no-repeat;
  background-size: cover;
  padding-bottom: calc(100% * 1 / 5.8);
`;

const FrontpageMultidisciplinarySubject = () => {
  const { t, i18n } = useTranslation();
  const topics = useMemo(
    () => getMultidisciplinaryTopics(i18n.language),
    [i18n.language],
  );

  return (
    <StyledSection>
      <SectionHeading headingLevel="h2" large>
        {t('frontpageMultidisciplinarySubject.heading')}
      </SectionHeading>
      <LinksWrapper>
        {topics.map((topic) => (
          <SafeLink key={topic.id} to={topic.url}>
            {topic.title}
          </SafeLink>
        ))}
      </LinksWrapper>
      <p>{t('frontpageMultidisciplinarySubject.text')}</p>
      <StyledSafeLinkButton
        to={toSubject(MULTIDISCIPLINARY_SUBJECT_ID)}
        size="medium"
        shape="pill"
      >
        {t('frontpageMultidisciplinarySubject.linkText')}
      </StyledSafeLinkButton>
      <Illustration />
    </StyledSection>
  );
};

export default FrontpageMultidisciplinarySubject;

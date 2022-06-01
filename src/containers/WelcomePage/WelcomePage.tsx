/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { HelmetWithTracker } from '@ndla/tracker';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  FrontpageToolbox,
  FrontpageMultidisciplinarySubject,
  MessageBox,
  MessageBoxType,
  BannerCard,
} from '@ndla/ui';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import WelcomePageInfo from './WelcomePageInfo';
import FrontpageSubjects from './FrontpageSubjects';
import { FILM_PAGE_PATH, UKR_PAGE_PATH } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import { toSubject, toTopic } from '../../routeHelpers';
import { getSubjectById, multidisciplinaryTopics } from '../../data/subjects';
import { LocaleType } from '../../interfaces';
import { setClosedAlert, useAlerts } from '../../components/AlertsContext';

const getUrlFromSubjectId = (subjectId: string) => {
  const subject = getSubjectById(subjectId);
  return subject ? toSubject(subject.id) : '';
};

const MULTIDISCIPLINARY_SUBJECT_ID =
  'urn:subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7';
const TOOLBOX_TEACHER_SUBJECT_ID =
  'urn:subject:1:9bb7b427-3f5b-4c45-9719-efc509f3d9cc';
const TOOLBOX_STUDENT_SUBJECT_ID =
  'urn:subject:1:54b1727c-2d91-4512-901c-8434e13339b4';

const getMultidisciplinaryTopics = (locale: LocaleType) => {
  const baseSubject = getSubjectById(MULTIDISCIPLINARY_SUBJECT_ID);

  if (!baseSubject) return [];

  return multidisciplinaryTopics.map(topic => {
    return {
      id: topic.id,
      title: topic.name[locale],
      url: toTopic(baseSubject.id, topic.id),
    };
  });
};

const BannerCardWrapper = styled.div`
  padding-bottom: ${spacing.large};
`;

interface Props {
  locale: LocaleType;
  skipToContentId?: string;
}

const WelcomePage = ({ locale, skipToContentId }: Props) => {
  const { t } = useTranslation();

  const alerts = useAlerts().map(alert => ({
    content: alert.body || alert.title,
    closable: alert.closable,
    number: alert.number,
  }));
  const googleSearchJSONLd = () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://ndla.no/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ndla.no/search?query={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };
    return JSON.stringify(data);
  };

  return (
    <>
      {skipToContentId && (
        <a
          tabIndex={0}
          href={`#${skipToContentId}`}
          className="c-masthead__skip-to-main-content">
          {t('masthead.skipToContent')}
        </a>
      )}
      <HelmetWithTracker title={t('htmlTitles.welcomePage')}>
        <script type="application/ld+json">{googleSearchJSONLd()}</script>
      </HelmetWithTracker>
      <SocialMediaMetadata
        title={t('welcomePage.heading.heading')}
        description={t('meta.description')}
        imageUrl={`${config.ndlaFrontendDomain}/static/logo.png`}>
        <meta name="keywords" content={t('meta.keywords')} />
      </SocialMediaMetadata>
      {alerts?.map(alert => (
        <MessageBox
          type={MessageBoxType.fullpage}
          onClose={() => setClosedAlert(alert.number)}
          showCloseButton={alert.closable}>
          {alert.content}
        </MessageBox>
      ))}
      <FrontpageHeader locale={locale} showHeader={true}>
        <WelcomePageSearch />
      </FrontpageHeader>
      <main>
        <OneColumn extraPadding>
          <BannerCardWrapper>
            <BannerCard
              link={UKR_PAGE_PATH}
              title="Lær om det norske samfunnet - på ukrainsk"
              content="Дізнайтеся про норвезьке суспільство – українською"
              linkText="Learn about Norwegian society - in Ukrainian"
              image={{
                altText: 'Ukrainian flag',
                imageSrc: '/static/flag_of_ukraine.svg',
              }}
            />
          </BannerCardWrapper>
          <div data-testid="category-list" id={skipToContentId}>
            <FrontpageSubjects locale={locale} />
          </div>
        </OneColumn>
        <OneColumn wide>
          <FrontpageMultidisciplinarySubject
            url={getUrlFromSubjectId(MULTIDISCIPLINARY_SUBJECT_ID)}
            topics={getMultidisciplinaryTopics(locale)}
          />
          <FrontpageToolbox
            urlStudents={getUrlFromSubjectId(TOOLBOX_STUDENT_SUBJECT_ID)}
            urlTeachers={getUrlFromSubjectId(TOOLBOX_TEACHER_SUBJECT_ID)}
          />
          <BlogPosts locale={locale} />
          <FrontpageFilm
            imageUrl="/static/film_illustrasjon.svg"
            url={FILM_PAGE_PATH}
          />
          <WelcomePageInfo />
        </OneColumn>
      </main>
    </>
  );
};

export default WelcomePage;

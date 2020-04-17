/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Helmet from 'react-helmet';
import { SubjectHeader } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';

import { LocationShape } from '../../shapes';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { subjectPageQuery } from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import SubjectPageSecondaryContent from './components/SubjectPageSecondaryContent';
import SubjectPageSocialMedia from './components/SubjectPageSocialMedia';
import SubjectPageContent from './components/SubjectPageContent';
import SubjectEditorChoices from './components/SubjectEditorChoices';
import {
  getFiltersFromUrl,
  getFiltersFromUrlAsArray,
} from '../../util/filterHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { useGraphQuery } from '../../util/runQueries';
import config from '../../config';

const getDocumentTitle = ({ t, data }) => {
  return `${data?.subject?.name || ''}${t('htmlTitles.titleTemplate')}`;
};

const SubjectPage = ({
  match,
  location,
  history,
  locale,
  skipToContentId,
  ndlaFilm,
  t,
}) => {
  const { subjectId } = getUrnIdsFromProps({ ndlaFilm, match });
  const { loading, data } = useGraphQuery(subjectPageQuery, {
    variables: { subjectId, filterIds: getFiltersFromUrl(location) },
  });

  const handleFilterClick = newValues => {
    const searchString = `?${queryString.stringify({
      filters: newValues.join(','),
    })}`;
    history.push(
      newValues.length > 0
        ? {
            search: searchString,
          }
        : {},
    );
  };

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.subject) {
    return <NotFoundPage />;
  }

  const activeFilters = getFiltersFromUrlAsArray(location);
  const { subject = {} } = data;
  const { name: subjectName } = subject;
  const subjectpage = subject.subjectpage || {};

  const {
    latestContent,
    facebook,
    twitter,
    banner,
    editorsChoices,
    layout,
    about,
    metaDescription,
  } = subjectpage;

  return (
    <article>
      <Helmet>
        <title>{`${getDocumentTitle({ t, data })}`}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>
      {about && (
        <SocialMediaMetadata
          title={about.title}
          description={metaDescription}
          locale={locale}
          image={
            about.visualElement && {
              src: about.visualElement.url,
              altText: about.visualElement.alt,
            }
          }
        />
      )}
      <SubjectHeader
        heading={subjectName || ''}
        images={[
          {
            url: banner?.desktopUrl || '',
            types: ['wide', 'desktop', 'tablet'],
          },
          { url: banner?.mobileUrl || '', types: ['mobile'] },
        ]}
        showFFBadge={config.isFFServer}
      />
      <SubjectPageContent
        skipToContentId={skipToContentId}
        layout={layout}
        locale={locale}
        subjectId={subjectId}
        subjectpage={subjectpage}
        subject={subject}
        activeFilters={activeFilters}
        handleFilterClick={handleFilterClick}
      />
      <SubjectEditorChoices
        wideScreen
        editorsChoices={editorsChoices}
        locale={locale}
      />
      {latestContent && (
        <SubjectPageSecondaryContent
          locale={locale}
          subjectName={subjectName}
          latestContent={latestContent}
        />
      )}
      <SubjectPageSocialMedia twitter={twitter} facebook={facebook} />
    </article>
  );
};

SubjectPage.getDocumentTitle = getDocumentTitle;

SubjectPage.willTrackPageView = (trackPageView, currentProps) => {
  const { data } = currentProps;
  if (data?.subject?.topics?.length > 0) {
    trackPageView(currentProps);
  }
};

SubjectPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: LocationShape,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string.isRequired,
};

export default injectT(withRouter(withTracker(SubjectPage)));

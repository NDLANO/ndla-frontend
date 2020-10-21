/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {
  OneColumn,
  NavigationHeading,
  Breadcrumblist,
  SubjectBanner,
  LayoutItem,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { useIntersectionObserver } from '@ndla/hooks';

import { LocationShape } from '../../shapes';
import SubjectPageContent from './components/SubjectPageContent';
import SubjectEditorChoices from './components/SubjectEditorChoices';
import { getFiltersFromUrl } from '../../util/filterHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { scrollToRef } from './subjectPageHelpers';
import SubjectPageInformation from './components/SubjectPageInformation';
import { getSubjectBySubjectIdFilters } from '../../data/subjects';
import { GraphQLSubjectShape } from '../../graphqlShapes';
import { parseAndMatchUrl } from '../../util/urlHelper';

const getDocumentTitle = ({ t, data }) => {
  return `${data?.subject?.name || ''}${t('htmlTitles.titleTemplate')}`;
};

const SubjectPage = ({
  history,
  location,
  locale,
  skipToContentId,
  t,
  subjectId,
  topics,
  data,
  ndlaFilm,
}) => {
  const { subject = {} } = data;
  const { name: subjectName } = subject;

  const activeFilterId = getFiltersFromUrl(location);
  const filter = subject.filters.filter(filter =>
    activeFilterId.split(',').includes(filter.id),
  );

  // get subjectpage from filter
  const filterSubjectpage = filter?.[0]?.subjectpage;
  const subjectpage = filterSubjectpage || subject.subjectpage || {};

  const { editorsChoices, layout, about, metaDescription } = subjectpage;

  const [currentLevel, setCurrentLevel] = useState(0);
  const [breadCrumbList, setBreadCrumbList] = useState([]);

  /* const [programme] = useState(() => {
    const programmeData = {
      name: data?.subject?.name,
      url: '',
    };
    const programme = getProgrammeByPath(location.pathname, locale);
    if (programme) {
      programmeData.name = programme.name[locale];
      programmeData.url = toProgramme(programme.url[locale]);
    }
    return programmeData;
  }); */
  const [subjectNames] = useState(() => {
    const subjectData = getSubjectBySubjectIdFilters(
      subject.id,
      activeFilterId.split(','),
    );
    if (subjectData) {
      return {
        name: subjectData.name[locale],
        longName: subjectData.longName[locale],
      };
    }
    // Fallback if subject and filters are missing in static constants
    const filterString =
      filter.length > 0
        ? filter.map(f => f.name).reduce((a, b) => a + ', ' + b)
        : '';
    return {
      name: subjectName,
      longName: `${subjectName} ${filterString}`,
    };
  });

  const breadCrumbs = [
    /*{
      id: subject.id,
      label: programme.name,
      typename: 'Subjecttype',
      url: programme.url,
    },*/
    ...(filter.length > 0
      ? [
          {
            id: filter.id,
            label: subjectNames.name,
            typename: 'Subject',
            url: '#',
            isCurrent: currentLevel === 'Subject',
          },
        ]
      : []),
    ...breadCrumbList.map((crumb, index) => ({
      ...crumb,
      index,
      isCurrent: currentLevel === index,
      typename: index > 0 ? 'Subtopic' : 'Topic',
    })),
  ];
  console.log(breadCrumbs);
  console.log(currentLevel);

  const setBreadCrumb = (topic, index) => {
    setCurrentLevel(index);
    const breadcrumbs = breadCrumbList.slice(0, index);
    breadcrumbs[index] = topic;
    setBreadCrumbList(breadcrumbs);
  };

  const headerRef = useRef(null);
  const refs = topics.map(_ => React.createRef());

  const handleNav = (e, item) => {
    e.preventDefault();
    const { typename, index } = item;
    if (typename === 'Subjecttype' || typename === 'Subject') {
      setCurrentLevel(typename);
      scrollToRef(headerRef);
    } else {
      setCurrentLevel(index);
      scrollToRef(refs[index]);
    }
  };

  const onClickTopics = e => {
    e.preventDefault();
    const lowermostId = topics[topics.length - 1];
    const lowermost = subject.allTopics.find(topic => topic.id === lowermostId);
    const filterParam =
      lowermost?.filters?.length && !getFiltersFromUrl(location)
        ? `?filters=${lowermost.filters[0].id}`
        : `?filters=${getFiltersFromUrl(location)}`;
    const path = parseAndMatchUrl(e.currentTarget.href);
    history.replace(`${path.url}${filterParam}`);
  };

  // show/hide breadcrumb based on intersection
  const [containerRef, { entry }] = useIntersectionObserver({
    root: null,
    rootMargin: '-275px',
  });
  const showBreadCrumb = entry && entry.isIntersecting;
  const moveBannerUp = !topics.length;
  return (
    <>
      <Helmet>
        <title>{`${subjectNames?.name || ''}${t(
          'htmlTitles.titleTemplate',
        )}`}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>
      <div ref={containerRef}>
        <OneColumn>
          <LayoutItem layout="extend">
            {about && (
              <SocialMediaMetadata
                title={about.title}
                description={metaDescription}
                locale={locale}
                image={
                  about.visualElement && {
                    url: about.visualElement.url,
                    altText: about.visualElement.alt,
                  }
                }
              />
            )}
            <div ref={headerRef}>
              <NavigationHeading invertedStyle={ndlaFilm}>
                {subjectNames.longName}
              </NavigationHeading>
            </div>
            <SubjectPageContent
              skipToContentId={skipToContentId}
              layout={layout}
              locale={locale}
              subjectId={subjectId}
              subjectpage={subjectpage}
              subject={subject}
              filterIds={activeFilterId}
              ndlaFilm={ndlaFilm}
              onClickTopics={onClickTopics}
              topics={topics}
              refs={refs}
              setBreadCrumb={setBreadCrumb}
            />
          </LayoutItem>
        </OneColumn>
      </div>
      {subjectpage.banner && (
        <SubjectBanner
          image={subjectpage.banner.desktopUrl}
          negativeTopMargin={moveBannerUp}
        />
      )}
      {false && subjectpage.about && (
        <OneColumn wide>
          <SubjectPageInformation subjectpage={subjectpage} wide />
        </OneColumn>
      )}
      {false && editorsChoices?.length > 0 && (
        <SubjectEditorChoices
          wideScreen
          editorsChoices={editorsChoices}
          locale={locale}
        />
      )}
      <OneColumn wide>
        <Breadcrumblist
          items={breadCrumbs}
          onNav={handleNav}
          invertedStyle={ndlaFilm}
          isVisible={showBreadCrumb}
        />
      </OneColumn>
    </>
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
    replace: PropTypes.func.isRequired,
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
  subjectId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    subject: GraphQLSubjectShape,
  }),
  topics: PropTypes.arrayOf(PropTypes.string),
};

export default injectT(withTracker(SubjectPage));

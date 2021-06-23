/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
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
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { scrollToRef } from './subjectPageHelpers';
import SubjectPageInformation from './components/SubjectPageInformation';
import { getSubjectBySubjectId, getSubjectLongName } from '../../data/subjects';
import { GraphQLSubjectShape } from '../../graphqlShapes';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { getAllDimensions } from '../../util/trackingUtil';

const getDocumentTitle = ({ t, data }) => {
  return `${data?.subject?.name || ''}${t('htmlTitles.titleTemplate')}`;
};

const SubjectContainer = ({
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

  const subjectpage = subject.subjectpage || {};

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
    const subjectData = getSubjectBySubjectId(subject.id);
    if (subjectData) {
      return {
        subHeading: undefined,
        name: subjectData.name[locale],
        longName: subjectData.longName[locale],
      };
    }
    // Fallback if subject is missing in static constants
    return {
      subHeading: subjectName,
      name: subjectName,
      longName: subjectName,
    };
  });

  const breadCrumbs = [
    /*{
      id: subject.id,
      label: programme.name,
      typename: 'Subjecttype',
      url: programme.url,
    },*/
    {
      id: subjectId,
      label: subjectNames.name,
      typename: 'Subject',
      url: '#',
      isCurrent: currentLevel === 'Subject',
    },
    ...(breadCrumbList.length > 0
      ? breadCrumbList.map(crumb => ({
          ...crumb,
          isCurrent: currentLevel === crumb.index,
          typename: crumb.index > 0 ? 'Subtopic' : 'Topic',
          url: '#',
        }))
      : []),
  ];

  const setBreadCrumb = topic => {
    setCurrentLevel(topic.index);
    setBreadCrumbList(prevState => [
      ...prevState.filter(
        b =>
          b.id.localeCompare(topic.id) !== 0 &&
          (b.typename === 'Subjecttype' ||
            b.typename === 'Subject' ||
            topics.includes(b.id)),
      ),
      topic,
    ]);
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
    const path = parseAndMatchUrl(e.currentTarget.href, true);
    history.replace({ pathname: path.url });
  };

  // show/hide breadcrumb based on intersection
  const [containerRef, { entry }] = useIntersectionObserver({
    root: null,
    rootMargin: '-275px',
  });
  const showBreadCrumb = entry && entry.isIntersecting;
  const moveBannerUp = !topics.length;

  const topicPath = topics.map(t =>
    data.subject.allTopics.find(topic => topic.id === t),
  );

  const socialMediaMetadata = {
    title: topicPath?.[topicPath.length - 1]?.name || about?.title,
    description:
      topicPath?.[topicPath.length - 1]?.meta.metaDescription ||
      metaDescription,
    image:
      topicPath?.[topicPath.length - 1]?.meta.metaImage || about?.visualElement,
  };

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
                title={socialMediaMetadata.title}
                description={socialMediaMetadata.description}
                locale={locale}
                image={
                  socialMediaMetadata.image && {
                    url: socialMediaMetadata.image.url,
                    altText: socialMediaMetadata.image.alt,
                  }
                }
              />
            )}
            <div ref={headerRef}>
              <NavigationHeading
                subHeading={subjectNames.subHeading}
                invertedStyle={ndlaFilm}>
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

SubjectContainer.getDocumentTitle = getDocumentTitle;

SubjectContainer.willTrackPageView = (trackPageView, currentProps) => {
  const { data, loading, topics } = currentProps;
  if (!loading && data?.subject?.topics?.length > 0 && topics?.length === 0) {
    trackPageView(currentProps);
  }
};

SubjectContainer.getDimensions = props => {
  const { data, locale, topics } = props;
  const topicPath = topics.map(t =>
    data.subject.allTopics.find(topic => topic.id === t),
  );
  const longName = getSubjectLongName(data.subject?.id, locale);

  return getAllDimensions({
    subject: data.subject,
    topicPath,
    filter: longName,
  });
};

SubjectContainer.propTypes = {
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
  loading: PropTypes.bool,
};

export default injectT(withTracker(SubjectContainer));

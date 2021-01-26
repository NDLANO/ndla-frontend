/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import Button from '@ndla/button';
import { LearningPath } from '@ndla/icons/contentType';
import { injectT } from '@ndla/i18n';
import {
  LearningPathWrapper,
  LearningPathMenu,
  LearningPathContent,
  LearningPathInformation,
  LearningPathSticky,
  LearningPathStickySibling,
  LearningPathMobileStepInfo,
  showLearningPathButtonToggleCss,
  Breadcrumb,
} from '@ndla/ui';
import { getCookie, setCookie } from '@ndla/util';
import { withRouter } from 'react-router-dom';
import { toLearningPath } from '../../routeHelpers';
import { getFiltersFromUrl } from '../../util/filterHelper';
import LastLearningpathStepInfo from './LastLearningpathStepInfo';
import {
  BreadCrumbShape,
  LearningpathShape,
  LearningpathStepShape,
  ResourceShape,
  ResourceTypeShape,
  SubjectShape,
  TopicShape,
} from '../../shapes';
import LearningpathEmbed from './LearningpathEmbed';
import config from '../../config';
import styled from "@emotion/styled";
import {animations, breakpoints, colors, mq, spacing} from "@ndla/core";
import {css} from "@emotion/core";

const LEARNING_PATHS_COOKIES_KEY = 'LEARNING_PATHS_COOKIES_KEY';

const Learningpath = ({
  learningpath,
  learningpathStep,
  resource,
  topic,
  subject,
  topicPath,
  resourceTypes,
  skipToContentId,
  locale,
  location,
  history,
  onKeyUpEvent,
  ndlaFilm,
  breadcrumbItems,
  t,
}) => {
  const {
    id,
    learningsteps,
    duration,
    lastUpdated,
    copyright,
    title,
  } = learningpath;

  const lastUpdatedDate = new Date(lastUpdated);
  const stepId = learningpathStep.id;
  const filterIds = getFiltersFromUrl(location);

  const lastUpdatedString = `${lastUpdatedDate.getDate()}.${
    lastUpdatedDate.getMonth() < 10 ? '0' : ''
  }${lastUpdatedDate.getMonth()}.${lastUpdatedDate.getFullYear()}`;

  const cookieKey = `${LEARNING_PATHS_COOKIES_KEY}_${id}`;

  const [useCookies, setUseCookies] = useState({});

  const updateCookies = () => {
    if (
      learningpath &&
      learningpathStep &&
      learningpathStep.seqNo !== undefined
    ) {
      const currentCookie = getCookie(cookieKey, document.cookie);
      const updatedCookie = currentCookie ? JSON.parse(currentCookie) : {};
      setUseCookies(updatedCookie);
      updatedCookie[learningpathStep.id] = true;
      setCookie(cookieKey, JSON.stringify(updatedCookie));
    }
  };

  useEffect(() => updateCookies(), [learningpathStep.id]);
  useEffect(() => {
    window.addEventListener('keyup', onKeyUpEvent);
    updateCookies();
    return () => {
      window.removeEventListener('keyup', onKeyUpEvent);
    };
  }, [onKeyUpEvent]);

  const showLearningPathButtonToggleCss = css`
  ${mq.range({ from: breakpoints.tablet })} {
    display: none;
  }
  margin-right: auto;
  margin-left: ${spacing.normal};
  z-index: 100;
  svg {
    width: 20px;
    height: 20px;
    margin-right: ${spacing.xsmall};
    transform: translateY(-2px);
  }
`;

  const FOOTER_HEIGHT = '78px';
  const FOOTER_HEIGHT_MOBILE = spacing.large;

  const StyledFooter = styled.nav`
  display: flex;
  height: ${FOOTER_HEIGHT};
  width: 100%;
  ${mq.range({ until: breakpoints.tablet })} {
    height: ${FOOTER_HEIGHT_MOBILE};
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: flex-end;
    padding-bottom: env(safe-area-inset-bottom);
  }
  background: ${colors.brand.lighter};
  align-items: center;
  justify-content: space-between;
  ${animations.fadeInBottom()}
`;

  const showLearningPathButton = (
      <Button css={showLearningPathButtonToggleCss}>
        <LearningPath />
        <span>{t('learningPath.openMenuTooltip')}</span>
      </Button>
  );

  return (
    <LearningPathWrapper>
      <div className="c-hero__content">
        <section>
          <Breadcrumb invertedStyle={ndlaFilm} items={breadcrumbItems} />
        </section>
      </div>
      <LearningPathContent>
        <LearningPathMenu
          invertedStyle={ndlaFilm}
          learningPathId={id}
          learningsteps={learningsteps}
          duration={duration}
          toLearningPathUrl={(pathId, stepId) =>
            toLearningPath(pathId, stepId, resource, filterIds)
          }
          lastUpdated={lastUpdatedString}
          copyright={copyright}
          stepId={stepId}
          currentIndex={learningpathStep.seqNo}
          name={title}
          cookies={useCookies}
          learningPathURL={config.learningPathDomain}
          showLearningPathButton={showLearningPathButton}
        />
        {learningpathStep && (
          <div>
            {learningpathStep.showTitle && (
              <LearningPathInformation
                invertedStyle={ndlaFilm}
                title={learningpathStep.title}
                description={learningpathStep.description}
                license={learningpathStep.license}
              />
            )}
            <LearningpathEmbed
              skipToContentId={skipToContentId}
              locale={locale}
              topic={topic}
              learningpathStep={learningpathStep}
              breadcrumbItems={breadcrumbItems}
            />
            <LastLearningpathStepInfo
              topic={topic}
              topicPath={topicPath}
              resourceTypes={resourceTypes}
              seqNo={learningpathStep.seqNo}
              numberOfLearningSteps={learningsteps.length - 1}
              title={title}
              subject={subject}
              filters={filterIds}
              ndlaFilm={ndlaFilm}
            />
          </div>
        )}
      </LearningPathContent>
      <StyledFooter>
        {showLearningPathButton}
        {learningpathStep.seqNo > 0 ? (
          <LearningPathStickySibling
            arrow="left"
            pathId={learningpath.id}
            stepId={learningsteps[learningpathStep.seqNo - 1].id}
            toLearningPathUrl={(pathId, stepId) =>
              toLearningPath(pathId, stepId, resource, filterIds)
            }
            label={t('learningPath.previousArrow')}
            title={learningsteps[learningpathStep.seqNo - 1].title}
          />
        ) : (
          <div />
        )}
        <LearningPathMobileStepInfo
          total={learningsteps.length}
          current={learningpathStep.seqNo + 1}
        />
        {learningpathStep.seqNo < learningsteps.length - 1 && (
          <LearningPathStickySibling
            arrow="right"
            label={t('learningPath.nextArrow')}
            pathId={learningpath.id}
            stepId={learningsteps[learningpathStep.seqNo + 1].id}
            toLearningPathUrl={(pathId, stepId) =>
              toLearningPath(pathId, stepId, resource, filterIds)
            }
            title={learningsteps[learningpathStep.seqNo + 1].title}
          />
        )}
      </StyledFooter>
    </LearningPathWrapper>
  );
};

Learningpath.propTypes = {
  learningpath: LearningpathShape,
  learningpathStep: LearningpathStepShape,
  topic: TopicShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  subject: SubjectShape,
  resource: ResourceShape,
  skipToContentId: PropTypes.string,
  locale: PropTypes.string.isRequired,
  location: PropTypes.string,
  ndlaFilm: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onKeyUpEvent: func.isRequired,
  breadcrumbItems: PropTypes.arrayOf(BreadCrumbShape),
};

export default injectT(withRouter(Learningpath));

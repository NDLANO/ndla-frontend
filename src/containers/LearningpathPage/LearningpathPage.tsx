/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet';
import { withTracker } from '@ndla/tracker';
import { TFunction, WithTranslation, withTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import { htmlTitle } from '../../util/titleHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import Learningpath from '../../components/Learningpath';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { toBreadcrumbItems, toLearningPath } from '../../routeHelpers';
import { getSubjectLongName } from '../../data/subjects';
import {
  GQLLearningpath,
  GQLLearningpathStep,
  GQLResource,
  GQLResourceTypeDefinition,
  GQLSubject,
  GQLTopic,
} from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';

interface PropData {
  relevance: string;
  topic?: GQLTopic;
  topicPath: GQLTopic[];
  subject?: GQLSubject;
  resourceTypes?: GQLResourceTypeDefinition[];
  resource?: GQLResource;
}

interface Props extends WithTranslation {
  locale: string;
  loading: boolean;
  ndlaFilm?: boolean;
  data: PropData;
  skipToContentId: string;
  stepId?: string;
}

const LearningpathPage = ({
  data,
  locale,
  skipToContentId,
  ndlaFilm,
  stepId,
  t,
}: Props) => {
  const history = useHistory();
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });

  const onKeyUpEvent = (evt: KeyboardEvent) => {
    const learningpathStep = stepId
      ? data.resource?.learningpath?.learningsteps?.find(
          step => step.id.toString() === stepId.toString(),
        )
      : data.resource?.learningpath?.learningsteps?.[0];
    if (evt.code === 'ArrowRight' || evt.code === 'ArrowLeft') {
      const directionValue = evt.code === 'ArrowRight' ? 1 : -1;
      const newSeqNo = (learningpathStep?.seqNo ?? 0) + directionValue;
      const newLearningpathStep = data.resource?.learningpath?.learningsteps?.find(
        step => step.seqNo === newSeqNo,
      );
      if (newLearningpathStep) {
        const res = !!resource.path
          ? { path: resource.path, id: resource.id }
          : undefined;
        history.push(
          toLearningPath(
            data.resource!.learningpath!.id.toString(),
            newLearningpathStep.id.toString(),
            res,
          ),
        );
      }
    }
  };

  if (
    !data.resource ||
    !data.resource.learningpath ||
    !data.topic ||
    !data.topicPath ||
    !data.subject ||
    !((data.resource?.learningpath?.learningsteps?.length ?? 0) === 0)
  ) {
    return <DefaultErrorMessage />;
  }
  const { resource, topic, resourceTypes, subject, topicPath } = data;
  const learningpath = resource.learningpath!;

  const learningpathStep = stepId
    ? learningpath.learningsteps?.find(
        step => step.id.toString() === stepId.toString(),
      )
    : learningpath.learningsteps?.[0];

  if (!learningpathStep) {
    return null;
  }

  const breadcrumbItems =
    subject && topicPath
      ? toBreadcrumbItems(
          t('breadcrumb.toFrontpage'),
          [
            subject,
            ...topicPath,
            { name: learningpath.title, id: `${learningpath.id}` },
          ],
          locale as LocaleType,
        )
      : toBreadcrumbItems(
          t('breadcrumb.toFrontpage'),
          [{ name: learningpath.title, id: `${learningpath.id}` }],
          locale as LocaleType,
        );

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle(t, data)}`}</title>
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(getTitle(subject, learningpath, learningpathStep), [
          t('htmlTitles.titleTemplate'),
        ])}
        trackableContent={learningpath}
        description={learningpath.description}
        locale={locale as LocaleType}
        image={{
          url: learningpath.coverphoto?.url,
        }}
      />
      <Learningpath
        skipToContentId={skipToContentId}
        learningpath={learningpath}
        learningpathStep={learningpathStep}
        topic={topic}
        subject={subject}
        onKeyUpEvent={onKeyUpEvent}
        resource={resource}
        resourceTypes={resourceTypes}
        topicPath={topicPath}
        locale={locale}
        ndlaFilm={ndlaFilm}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
};

LearningpathPage.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  const { loading, data } = currentProps;
  if (loading || !data) {
    return;
  }
  trackPageView(currentProps);
};

LearningpathPage.getDimensions = (props: Props) => {
  const articleProps = getArticleProps(props.data.resource);
  const {
    data: { resource, subject, topicPath, relevance },
    i18n,
    stepId,
  } = props;
  const learningpath = resource?.learningpath;
  const firstStep = learningpath?.learningsteps?.[0];
  const currentStep = learningpath?.learningsteps?.find(
    ls => `${ls.id}` === stepId,
  );
  const learningstep = currentStep || firstStep;
  const longName = getSubjectLongName(subject?.id, i18n.language as LocaleType);

  return getAllDimensions(
    {
      subject,
      relevance,
      topicPath,
      learningpath,
      learningstep,
      filter: longName,
    },
    articleProps.label,
    false,
  );
};

const getTitle = (
  subject?: GQLSubject,
  learningpath?: GQLLearningpath,
  learningpathStep?: GQLLearningpathStep,
) => {
  return htmlTitle(learningpath?.title, [
    learningpathStep?.title,
    subject?.name,
  ]);
};

const getDocumentTitle = (t: TFunction, data: PropData) => {
  const subject = data.subject;
  const learningpath = data.resource?.learningpath;
  return htmlTitle(getTitle(subject, learningpath), [
    t('htmlTitles.titleTemplate'),
  ]);
};

LearningpathPage.getDocumentTitle = ({ t, data }: Props) =>
  getDocumentTitle(t, data);

export default withTranslation()(withTracker(LearningpathPage));

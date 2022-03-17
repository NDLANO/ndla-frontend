/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { gql } from '@apollo/client';
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
  GQLLearningpathPage_ResourceFragment,
  GQLLearningpathPage_ResourceTypeDefinitionFragment,
  GQLLearningpathPage_SubjectFragment,
  GQLLearningpathPage_TopicFragment,
  GQLLearningpathStep,
  GQLSubject,
} from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { FeideUserWithGroups } from '../../util/feideApi';
import { TopicPaths } from '../ResourcePage/ResourcePage';

interface PropData {
  relevance: string;
  topic?: GQLLearningpathPage_TopicFragment;
  topicPath: TopicPaths;
  subject?: GQLLearningpathPage_SubjectFragment;
  resourceTypes?: GQLLearningpathPage_ResourceTypeDefinitionFragment[];
  resource?: GQLLearningpathPage_ResourceFragment;
}

interface Props extends WithTranslation {
  locale: LocaleType;
  loading: boolean;
  ndlaFilm?: boolean;
  data: PropData;
  skipToContentId: string;
  stepId?: string;
  user?: FeideUserWithGroups;
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
    const steps = data?.resource?.learningpath?.learningsteps;
    const learningpathStep = stepId
      ? steps?.find(step => step.id.toString() === stepId.toString())
      : steps?.[0];
    if (evt.code === 'ArrowRight' || evt.code === 'ArrowLeft') {
      const directionValue = evt.code === 'ArrowRight' ? 1 : -1;
      const newSeqNo = (learningpathStep?.seqNo ?? 0) + directionValue;
      const newLearningpathStep = steps?.find(step => step.seqNo === newSeqNo);
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
    (data?.resource?.learningpath?.learningsteps?.length ?? 0) === 0
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
        imageUrl={learningpath.coverphoto?.url}
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
        ndlaFilm={!!ndlaFilm}
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
  const { data, i18n, stepId, user } = props;
  const { resource, subject, topicPath, relevance } = data;
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
      user,
    },
    articleProps.label,
    false,
  );
};

const getTitle = (
  subject?: Pick<GQLSubject, 'name'>,
  learningpath?: Pick<GQLLearningpath, 'title'>,
  learningpathStep?: Pick<GQLLearningpathStep, 'title'>,
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

export const learningpathPageFragments = {
  topic: gql`
    fragment LearningpathPage_Topic on Topic {
      ...Learningpath_Topic
    }
    ${Learningpath.fragments.topic}
  `,
  subject: gql`
    fragment LearningpathPage_Subject on Subject {
      id
      ...Learningpath_Subject
    }
    ${Learningpath.fragments.subject}
  `,
  resourceType: gql`
    fragment LearningpathPage_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Learningpath_ResourceTypeDefinition
    }
    ${Learningpath.fragments.resourceType}
  `,
  resource: gql`
    fragment LearningpathPage_Resource on Resource {
      id
      ...Learningpath_Resource
      learningpath {
        supportedLanguages
        tags
        description
        coverphoto {
          url
          metaUrl
        }
        learningsteps {
          type
          ...Learningpath_LearningpathStep
        }
        ...Learningpath_Learningpath
      }
    }
    ${Learningpath.fragments.learningpathStep}
    ${Learningpath.fragments.learningpath}
    ${Learningpath.fragments.resource}
  `,
};

export default withTranslation()(withTracker(LearningpathPage));

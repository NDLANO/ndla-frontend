import { ReactNode } from 'react';
//@ts-ignore
import { TopicMenu } from '@ndla/ui';
import { toSubject, removeUrn, toTopic } from '../../../routeHelpers';
import { resourceToLinkProps } from '../../Resources/resourceHelpers';
import { mapTopicResourcesToTopic } from '../mastheadHelpers';
import { getSubjectLongName } from '../../../data/subjects';
import {
  GQLResource,
  GQLResourceType,
  GQLSubject,
} from '../../../graphqlTypes';
import { ProgramSubjectType } from '../../../util/programmesSubjectsHelper';
import { LocaleType, SimpleProgramType } from '../../../interfaces';

export function toTopicWithBoundParams(
  subjectId: string,
  expandedTopicIds: string[],
) {
  return (topicId: string) => {
    // expandedTopics is an array like this: [mainTopic, subtopic, subsubtopic, etc]
    // topicId is always either mainTopic, subtopic, subsubtopic, etc
    // It implies that we can use expandedTopics to create a path of
    // topic ids we can send to toTopic().
    const index = expandedTopicIds.indexOf(topicId);
    const topicIds = expandedTopicIds.slice(0, index + 1);
    return toTopic(subjectId, ...topicIds);
  };
}

interface Props {
  onClose: () => void;
  subject?: GQLSubject;
  expandedTopicId: string;
  expandedSubtopicsId: string[];
  topicResourcesByType: GQLResourceType[];
  locale: LocaleType;
  onNavigate: (
    expandedTopicId: string,
    subtopicId?: string,
    currentIndex?: number,
  ) => void;
  searchFieldComponent: ReactNode;
  programmes: ProgramSubjectType[];
  currentProgramme?: SimpleProgramType;
  subjectCategories: {
    name: string;
    subjects: ProgramSubjectType[];
  }[];
  initialSelectedMenu?: string;
}

const MastheadTopics = ({
  onClose,
  subject,
  expandedTopicId,
  expandedSubtopicsId,
  topicResourcesByType,
  locale,
  onNavigate,
  searchFieldComponent,
  programmes,
  currentProgramme,
  subjectCategories,
  initialSelectedMenu,
}: Props) => {
  const expandedTopicIds = [expandedTopicId, ...expandedSubtopicsId];

  const topicsWithContentTypes =
    subject &&
    mapTopicResourcesToTopic(
      subject.topics || [],
      expandedTopicId,
      topicResourcesByType,
      expandedSubtopicsId,
    );

  const localResourceToLinkProps = (resource: GQLResource) => {
    if (!subject) return;
    const subjectTopicPath = [subject.id, ...expandedTopicIds]
      .map(removeUrn)
      .join('/');
    return resourceToLinkProps(resource, '/' + subjectTopicPath, locale);
  };

  const subjectTitle = getSubjectLongName(subject?.id, locale) || subject?.name;

  const handleSubjectClick = () => {
    if (subject) {
      toSubject(subject.id);
    }
  };

  return (
    <TopicMenu
      close={onClose}
      toFrontpage={() => '/'}
      searchFieldComponent={searchFieldComponent}
      topics={topicsWithContentTypes || []}
      toTopic={subject && toTopicWithBoundParams(subject.id, expandedTopicIds)}
      toSubject={handleSubjectClick}
      defaultCount={12}
      subjectTitle={subjectTitle}
      resourceToLinkProps={localResourceToLinkProps}
      onNavigate={onNavigate}
      expandedTopicId={expandedTopicId}
      expandedSubtopicsId={expandedSubtopicsId}
      programmes={programmes}
      currentProgramme={currentProgramme}
      subjectCategories={subjectCategories}
      initialSelectedMenu={initialSelectedMenu}
      locale={locale}
    />
  );
};

export default MastheadTopics;

import {
  toTopic,
  toSubjects,
} from '../../routeHelpers';

export function toTopicWithSubjectIdBound(subjectId) {
  return toTopic.bind(undefined, subjectId);
}

export function mapTopicResourcesToTopic(
  topics,
  selectedTopicId,
  topicResourcesByType,
) {
  return topics.map(topic => {
    if (topic.id === selectedTopicId) {
      const contentTypeResults = topicResourcesByType.map(type => ({
        resources: type.resources
          .map(resource => ({
            ...resource,
            path: toSubjects() + resource.path,
          }))
          .filter(resource => !resource.additional),
        title: type.name,
      }));
      return { ...topic, contentTypeResults };
    } else if (topic.subtopics && topic.subtopics.length > 0) {
      return {
        ...topic,
        subtopics: mapTopicResourcesToTopic(
          topic.subtopics,
          selectedTopicId,
          topicResourcesByType,
        ),
      };
    }
    return topic;
  });
}

import { isEqual, takeWhile } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//@ts-ignore
import { TopicMenu } from '@ndla/ui';
import {
  GQLMastHeadQuery,
  GQLResource,
  GQLResourceType,
} from '../../../graphqlTypes';
import { useAlerts } from '../../../components/AlertsContext';
import MastheadSearch from './MastheadSearch';
import {
  getInitialMastheadMenu,
  removeUrn,
  toProgramme,
  toSubject,
  toTopic,
  useTypedParams,
  useUrnIds,
} from '../../../routeHelpers';
import { getSubjectLongName } from '../../../data/subjects';
import { LocaleType } from '../../../interfaces';
import { resourceToLinkProps } from '../../Resources/resourceHelpers';
import {
  getCategorizedSubjects,
  getProgrammes,
} from '../../../util/programmesSubjectsHelper';
import { getProgrammeBySlug } from '../../../data/programmes';
import { mapGradesData } from '../../ProgrammePage/ProgrammePage';
import { mapTopicResourcesToTopic } from '../mastheadHelpers';

interface Props {
  locale: LocaleType;
  subject?: GQLMastHeadQuery['subject'];
  topicResourcesByType: GQLResourceType[];
  onTopicChange: (newId: string) => void;
  close: () => void;
}

export const toTopicWithBoundParams = (
  subjectId?: string,
  ...topicIds: string[]
) => {
  if (!subjectId) return '';
  return (topicId: string) => {
    const topics = takeWhile(topicIds, id => id !== topicId);
    return toTopic(subjectId, ...topics, topicId);
  };
};

const getProgramme = (programme: string | undefined, locale: LocaleType) => {
  if (!programme) return undefined;
  const data = getProgrammeBySlug(programme, locale);
  if (!data) return undefined;
  const grades = mapGradesData(data.grades, locale);
  return { name: data.name[locale], url: data.url[locale], grades };
};

const MastheadMenu = ({
  locale,
  topicResourcesByType,
  subject,
  onTopicChange,
  close,
}: Props) => {
  const { openAlerts, closeAlert } = useAlerts();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { grade } = useTypedParams<{ grade?: string }>();
  const initialSelectedMenu = getInitialMastheadMenu(pathname);
  const params = useUrnIds();
  const initialParams = useRef<ReturnType<typeof useUrnIds>>(params);
  const { topicList, programme } = params;
  const [expandedTopicId, setExpandedTopicId] = useState<string>(
    topicList[0] ?? '',
  );
  const [expandedSubTopicIds, setExpandedSubTopicIds] = useState<string[]>(
    topicList.slice(1) ?? [],
  );

  useEffect(() => {
    if (
      params.subjectId !== initialParams.current.subjectId ||
      params.resourceId !== initialParams.current.resourceId
    ) {
      initialParams.current = params;
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    const oldParams = initialParams.current;
    if (oldParams.subjectId !== params.subjectId) {
      setExpandedTopicId('');
      setExpandedSubTopicIds([]);
      initialParams.current = params;
    } else if (!isEqual(oldParams.topicList, params.topicList)) {
      setExpandedTopicId(params.topicList[0] ?? '');
      setExpandedSubTopicIds(params.topicList.slice(1) ?? []);
      initialParams.current = params;
    }
  }, [params]);

  const subjectTitle = getSubjectLongName(subject?.id, locale) ?? subject?.name;
  const currentProgramme = getProgramme(programme, locale);

  const handleSubjectClick = (subjectId?: string) => {
    return subjectId ? toSubject(subjectId) : '';
  };

  const localResourceToLinkProps = (
    resource: Pick<GQLResource, 'id' | 'path' | 'contentUri'>,
  ) => {
    const subjectTopicPath = [
      subject!.id,
      expandedTopicId,
      ...expandedSubTopicIds,
    ]
      .map(removeUrn)
      .join('/');
    return resourceToLinkProps(resource, '/' + subjectTopicPath);
  };

  const onNavigate = (
    expandedTopicId?: string,
    subtopicId?: string,
    currentIndex?: number,
  ) => {
    if (currentIndex === undefined && expandedTopicId) {
      setExpandedTopicId(expandedTopicId);
      setExpandedSubTopicIds([]);
      onTopicChange(expandedTopicId);
    } else if (subtopicId) {
      if (!currentIndex) {
        setExpandedSubTopicIds([subtopicId]);
      } else if (subtopicId && currentIndex) {
        setExpandedSubTopicIds(prev =>
          prev.slice(0, currentIndex).concat(subtopicId),
        );
      }
      onTopicChange(subtopicId);
    }
  };

  const onGradeChange = (newGrade: string) => {
    if (currentProgramme?.grades.some(g => g.name.toLowerCase() === newGrade)) {
      navigate(toProgramme(currentProgramme.url, newGrade));
    }
  };

  const topicsWithContentTypes =
    subject &&
    mapTopicResourcesToTopic(
      subject.topics ?? [],
      expandedTopicId,
      topicResourcesByType ?? [],
      expandedSubTopicIds,
    );

  const shouldRenderSearch =
    !pathname.includes('search') && (pathname.includes('utdanning') || subject);

  const alerts = openAlerts?.map(alert => ({
    content: alert.body || alert.title,
    closable: alert.closable,
    number: alert.number,
  }));
  return (
    <TopicMenu
      messages={alerts}
      close={close}
      closeAlert={closeAlert}
      toFrontpage={() => '/'}
      searchFieldComponent={
        shouldRenderSearch && (
          <MastheadSearch subject={subject} hideOnNarrowScreen={false} />
        )
      }
      topics={topicsWithContentTypes ?? []}
      toTopic={toTopicWithBoundParams(
        subject?.id,
        expandedTopicId,
        ...expandedSubTopicIds,
      )}
      toSubject={() => handleSubjectClick(subject?.id)}
      defaultCount={12}
      subjectTitle={subjectTitle}
      resourceToLinkProps={localResourceToLinkProps}
      onNavigate={onNavigate}
      expandedTopicId={expandedTopicId}
      expandedSubtopicsId={expandedSubTopicIds}
      programmes={getProgrammes(locale)}
      currentProgramme={currentProgramme}
      subjectCategories={getCategorizedSubjects(locale)}
      initialSelectedMenu={initialSelectedMenu}
      locale={locale}
      selectedGrade={grade}
      onGradeChange={onGradeChange}
    />
  );
};

export default MastheadMenu;

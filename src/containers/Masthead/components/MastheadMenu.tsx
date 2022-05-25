import { ReactNode, useEffect, useRef, useState } from 'react';
import { useUrnIds } from '../../../routeHelpers';
import { getSelectedTopic } from '../mastheadHelpers';
import MastheadTopics from './MastheadTopics';
import MastheadMenuModal from './MastheadMenuModal';
import { GQLMastHeadQuery, GQLResourceType } from '../../../graphqlTypes';
import { ProgramSubjectType } from '../../../util/programmesSubjectsHelper';
import { LocaleType } from '../../../interfaces';
import { GradesData } from '../../ProgrammePage/ProgrammePage';

export interface MastheadProgramme {
  name: string;
  url: string;
  grades: GradesData[];
}

interface Props {
  locale: LocaleType;
  subject?: GQLMastHeadQuery['subject'];
  topicResourcesByType: GQLResourceType[];
  onDataFetch: (
    subjectId: string,
    topicId?: string,
    resourceId?: string,
  ) => void;
  searchFieldComponent: ReactNode;
  subjectCategories: {
    name: string;
    subjects: ProgramSubjectType[];
  }[];
  programmes: ProgramSubjectType[];
  currentProgramme?: MastheadProgramme;
  initialSelectMenu?: string;
}

const MastheadMenu = ({
  onDataFetch,
  searchFieldComponent,
  topicResourcesByType,
  subject,
  locale,
  programmes,
  currentProgramme,
  subjectCategories,
  initialSelectMenu,
}: Props) => {
  const [expandedTopicId, setExpandedTopicId] = useState<string | undefined>(
    undefined,
  );
  const [expandedSubtopicsId, setExpandedSubtopicsId] = useState<string[]>([]);
  const { subjectId, resourceId } = useUrnIds();
  const { topicList } = useUrnIds();
  const previousTopicList = useRef<string[] | null>(null);

  useEffect(() => {
    if (previousTopicList.current === null) {
      previousTopicList.current = topicList;
      return;
    }
    if (previousTopicList.current !== topicList) {
      setExpandedTopicId(topicList?.[0]);
      setExpandedSubtopicsId(topicList?.slice(1) ?? []);
    }
    previousTopicList.current = topicList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNavigate = async (
    expandedTopicId: string,
    subtopicId?: string,
    currentIndex?: number,
  ) => {
    let newExpandedSubtopics: string[] = [];
    if (expandedSubtopicsId.length > (currentIndex ?? 0)) {
      newExpandedSubtopics = expandedSubtopicsId.slice(0, currentIndex);
    }
    if (subtopicId) {
      newExpandedSubtopics.push(subtopicId);
    } else {
      newExpandedSubtopics.pop();
    }
    setExpandedTopicId(expandedTopicId);
    setExpandedSubtopicsId(newExpandedSubtopics);

    const selectedTopicId = getSelectedTopic([
      expandedTopicId,
      ...expandedSubtopicsId,
    ]);

    if (selectedTopicId) {
      onDataFetch(subjectId!, selectedTopicId, resourceId);
    }
  };

  return (
    <MastheadMenuModal>
      {(onClose: () => void) => (
        <MastheadTopics
          onClose={onClose}
          searchFieldComponent={searchFieldComponent}
          expandedTopicId={expandedTopicId!}
          expandedSubtopicsId={expandedSubtopicsId}
          topicResourcesByType={topicResourcesByType}
          subject={subject}
          locale={locale}
          programmes={programmes}
          currentProgramme={currentProgramme}
          subjectCategories={subjectCategories}
          onNavigate={onNavigate}
          initialSelectedMenu={initialSelectMenu}
        />
      )}
    </MastheadMenuModal>
  );
};

export default MastheadMenu;

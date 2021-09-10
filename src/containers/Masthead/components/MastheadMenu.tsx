import React, { Component, Fragment } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Location } from 'history';
import { getUrnIdsFromProps } from '../../../routeHelpers';
import { getSelectedTopic } from '../mastheadHelpers';
import MastheadTopics from './MastheadTopics';
import MastheadMenuModal from './MastheadMenuModal';
import {
  GQLResource,
  GQLResourceType,
  GQLSubject,
  GQLTopic,
} from '../../../graphqlTypes';
import { ProgramSubjectType } from '../../../util/programmesSubjectsHelper';
import { LocaleType } from '../../../interfaces';

interface Props extends RouteComponentProps {
  locale: LocaleType;
  subject: GQLSubject;
  resource?: GQLResource;
  topicResourcesByType: GQLResourceType[];
  topicPath: GQLTopic[];
  onDataFetch: (
    subjectId: string,
    topicId?: string,
    resourceId?: string,
  ) => void;
  searchFieldComponent: React.ReactNode;
  ndlaFilm?: boolean;
  subjectCategories: {
    name: string;
    subjects: ProgramSubjectType[];
  }[];
  programmes: ProgramSubjectType[];
}

interface State {
  expandedTopicId?: string;
  expandedSubtopicsId: string[];
  location?: Location;
}

class MastheadMenu extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expandedSubtopicsId: [],
    };
  }

  onNavigate = async (
    expandedTopicId: string,
    subtopicId?: string,
    currentIndex?: number,
  ) => {
    const { onDataFetch } = this.props;
    let { expandedSubtopicsId } = this.state;

    if (expandedSubtopicsId.length > (currentIndex ?? 0)) {
      expandedSubtopicsId = expandedSubtopicsId.slice(0, currentIndex);
    }
    if (subtopicId) {
      expandedSubtopicsId.push(subtopicId);
    } else {
      expandedSubtopicsId.pop();
    }
    this.setState({
      expandedTopicId,
      expandedSubtopicsId,
    });

    const selectedTopicId = getSelectedTopic([
      expandedTopicId,
      ...expandedSubtopicsId,
    ]);

    if (selectedTopicId) {
      const { subjectId, resourceId } = getUrnIdsFromProps(this.props);
      onDataFetch(subjectId!, selectedTopicId, resourceId);
    }
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { location } = nextProps;
    if (location !== prevState.location) {
      const { topicList } = getUrnIdsFromProps(nextProps);
      return {
        expandedTopicId: topicList[0],
        expandedSubtopicsId: topicList?.slice(1) || [],
        location,
      };
    }
    return null;
  }

  render() {
    const {
      subject,
      topicResourcesByType,
      locale,
      searchFieldComponent,
      ndlaFilm,
      programmes,
      subjectCategories,
    } = this.props;

    const { expandedTopicId, expandedSubtopicsId } = this.state;

    return (
      <Fragment>
        <MastheadMenuModal ndlaFilm={ndlaFilm}>
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
              subjectCategories={subjectCategories}
              onNavigate={this.onNavigate}
            />
          )}
        </MastheadMenuModal>
      </Fragment>
    );
  }
}

export default withRouter(MastheadMenu);

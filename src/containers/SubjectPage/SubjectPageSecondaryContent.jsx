import React from 'react';
import {
  OneColumn,
  SubjectFlexWrapper,
  SubjectFlexChild,
  SubjectChildContent,
  SubjectNewContent,
  InfoWidget,
  SubjectSecondaryContent,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { EmailOutline } from 'ndla-icons/common';
import formatDate from '../../util/formatDate';
import { GraphQLSubjectShape  } from '../../graphqlShapes';
import {
  toSubjects,
} from '../../routeHelpers';

const SubjectPageSecondaryContent = ({
  subjectName,
  latestContentResources,
  t,
}) => (
    <SubjectSecondaryContent>
      <OneColumn noPadding>
        <SubjectChildContent>
          <SubjectFlexWrapper>
            <SubjectFlexChild>
              <SubjectNewContent
                heading="Nytt innhold"
                content={latestContentResources.map(content => ({
                  name: content.name,
                  url: toSubjects() + content.path,
                  topicName: subjectName,
                  formattedDate: content.meta ? formatDate(content.meta.lastUpdated) : '',
                }))}
              />
            </SubjectFlexChild>
            <SubjectFlexChild>
              <InfoWidget
                center
                heading="Nyhetsbrev"
                description="Få tilgang til det som er nytt for undervisningen og aktuelt for tidspunktet."
                mainLink={{
                  name: 'Meld deg på',
                  url: '#1',
                }}
                iconLinks={[
                  {
                    icon: <EmailOutline />,
                    name: 'Meld deg på nyhetsbrev',
                  },
                ]}
              />
            </SubjectFlexChild>
          </SubjectFlexWrapper>
        </SubjectChildContent>
      </OneColumn>
    </SubjectSecondaryContent>
  );

SubjectPageSecondaryContent.propTypes = {
  subject: GraphQLSubjectShape,
};

export default injectT(SubjectPageSecondaryContent);

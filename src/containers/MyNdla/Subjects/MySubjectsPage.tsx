/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useSubjects } from '../subjectMutations';
import { usePersonalData, useUpdatePersonalData } from '../userMutations';

const MySubjectsPageContainer = styled.div``;

const MySubjectsPage = () => {
  const { personalData, loading } = usePersonalData();
  const { updatePersonalData } = useUpdatePersonalData();
  const favoriteSubjects = personalData.favoriteSubjects || [];

  const { subjects: allSubjects } = useSubjects();
  const { subjects: mySubjects } = useSubjects(favoriteSubjects);

  return (
    <MySubjectsPageContainer>
      {allSubjects.map(subject => (
        <div key={subject.id}>{subject.name}</div>
      ))}
    </MySubjectsPageContainer>
  );
};

export default MySubjectsPage;

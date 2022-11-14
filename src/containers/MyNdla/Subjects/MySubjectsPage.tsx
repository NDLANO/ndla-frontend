/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { usePersonalData, useUpdatePersonalData } from '../folderMutations';

const MySubjectsPageContainer = styled.div``;

const MySubjectsPage = () => {
  const { personalData, loading } = usePersonalData();
  const { updatePersonalData } = useUpdatePersonalData();
  const subjects = personalData.favoriteSubjects || [];

  return (
    <MySubjectsPageContainer>
      {subjects.map(subject => (
        <div>{subject}</div>
      ))}
    </MySubjectsPageContainer>
  );
};

export default MySubjectsPage;

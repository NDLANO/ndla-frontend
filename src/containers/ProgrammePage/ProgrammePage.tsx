/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { Spinner } from '@ndla/icons';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { subjectInfoFragment } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import { GQLProgrammePageQuery } from '../../graphqlTypes';
import { TypedParams, useTypedParams } from '../../routeHelpers';
import ProgrammeContainer from './ProgrammeContainer';
import { AuthContext } from '../../components/AuthenticationContext';

interface MatchParams extends TypedParams {
  programme: string;
}

const programmePageQuery = gql`
  query programmePage($path: String!) {
    programme(path: $path) {
      id
      title {
        title
      }
      metaDescription
      desktopImage {
        url
      }
      mobileImage {
        url
      }
      url
      grades {
        id
        title {
          title
        }
        url
        categories {
          id
          title {
            title
          }
          subjects {
            ...SubjectInfo
          }
        }
      }
    }
  }
  ${subjectInfoFragment}
`;

const ProgrammePage = () => {
  const { i18n } = useTranslation();
  const { programme: path } = useTypedParams<MatchParams>();
  const { user } = useContext(AuthContext);
  const { loading, data } = useGraphQuery<GQLProgrammePageQuery>(
    programmePageQuery,
    { variables: { path: path } },
  );

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  if (!data.programme) {
    return <NotFoundPage />;
  }

  return (
    <ProgrammeContainer
      programme={data.programme}
      grade={data.programme.grades?.[0]?.title.title || ''}
      locale={i18n.language}
      user={user}
    />
  );
};

export default ProgrammePage;

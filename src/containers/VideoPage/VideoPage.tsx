/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ContentPlaceholder, OneColumn } from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { useParams } from 'react-router-dom';
import i18next, { t } from 'i18next';
import { gql } from '@apollo/client';
import { HelmetWithTracker } from '@ndla/tracker';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import ErrorPage from '../../containers/ErrorPage';
import VisualElementWrapper from '../../components/VisualElement/VisualElementWrapper';
import {
  GQLBrightcoveVideoQuery,
  GQLBrightcoveVideoQueryVariables,
  GQLCopyright,
  GQLVisualElementWrapper_VisualElementFragment,
} from '../../graphqlTypes';
import {
  getContributorGroups,
  getLicenseByNBTitle,
} from '../../util/brightcoveHelpers';
import { useGraphQuery } from '../../util/runQueries';

const VideoPage = () => {
  const { videoId } = useParams();
  const { data, loading, error } = useGraphQuery<
    GQLBrightcoveVideoQuery,
    GQLBrightcoveVideoQueryVariables
  >(VideoPageQuery, {
    variables: {
      id: videoId ?? '',
    },
    skip: Number.isNaN(videoId),
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (!data?.brightcoveVideo) {
    return <NotFoundPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  const licenseCode = getLicenseByNBTitle(
    data?.brightcoveVideo?.customFields?.license ?? '',
  );
  const license = getLicenseByAbbreviation(licenseCode, i18next.language);
  const copyright: GQLCopyright = {
    license: {
      license: licenseCode,
      description: license?.description,
      url: license?.url,
    },
    ...getContributorGroups(
      data?.brightcoveVideo?.customFields?.licenseInfo ?? [],
    ),
  };

  const src = `https://players.brightcove.net/${data.brightcoveVideo.customFields?.accountId}/default_default/index.html?videoId=${videoId}`;

  const visualElement: GQLVisualElementWrapper_VisualElementFragment = {
    resource: 'brightcove',
    url: src,
    brightcove: data.brightcoveVideo,
    copyright: {
      ...copyright,
    },
  };

  return (
    <OneColumn>
      <HelmetWithTracker
        title={`${data.brightcoveVideo.name} - ${t(
          'resourcepageTitles.video',
        )} - NDLA`}
      />
      <VisualElementWrapper visualElement={visualElement} videoId={videoId} />
    </OneColumn>
  );
};

export default VideoPage;

const VideoPageQuery = gql`
  query brightcoveVideo($id: String!) {
    brightcoveVideo(id: $id) {
      videoid
      customFields {
        licenseInfo
        license
        accountId
      }
      iframe {
        height
        width
        src
      }
      download
      name
    }
  }
`;

import { ContentPlaceholder, Figure, OneColumn } from '@ndla/ui';
import { useEffect, useState } from 'react';
import { initArticleScripts } from '@ndla/article-scripts';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { useParams } from 'react-router-dom';
import i18next from 'i18next';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import {
  BrightcoveApiType,
  fetchBrightcoveVideo,
  fetchVideoSources,
  getBrightcoveToken,
} from '../../util/brightcoveApi';
import ErrorPage from '../../containers/ErrorPage';
import { BrightcoveCopyright, BrightcoveVideoSource } from '../../interfaces';
import config from '../../config';
import VisualElementWrapper from '../../components/VisualElement/VisualElementWrapper';
import { GQLVisualElementWrapper_VisualElementFragment } from '../../graphqlTypes';
import {
  getContributorGroups,
  brightcovePlayerUrl,
  getLicenseByNBTitle,
} from '../../util/brightcoveHelpers';

const VideoPage = () => {
  const { videoId } = useParams();
  const [brightcoveData, setBrightcoveData] = useState<
    BrightcoveApiType | undefined
  >(undefined);
  const [brightcoveSource, setBrightcoveSource] = useState<
    BrightcoveVideoSource[] | undefined
  >(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (videoId) {
      fetchBrightcoveVideo(videoId).then(bright => {
        setBrightcoveData(bright);
        setLoading(false);
      });
      fetchVideoSources(
        videoId,
        config.brightCoveAccountId,
        getBrightcoveToken()!,
      ).then(source => {
        setBrightcoveSource(source);
      });
    }
  }, [videoId]);

  useEffect(() => {
    initArticleScripts();
  }, []);

  if (isLoading) {
    return <ContentPlaceholder />;
  }

  if (!brightcoveData && !brightcoveSource && !isLoading) {
    return <NotFoundPage />;
  }

  if (!brightcoveData || !videoId) {
    return <ErrorPage />;
  }

  const licenseCode = getLicenseByNBTitle(brightcoveData.custom_fields.license);
  const license = getLicenseByAbbreviation(licenseCode, i18next.language);

  const copyright: BrightcoveCopyright = {
    license: {
      license: licenseCode,
      description: license?.description,
      url: license?.url,
    },
    ...getContributorGroups(brightcoveData.custom_fields),
  };

  const visualElement: GQLVisualElementWrapper_VisualElementFragment = {
    url: brightcovePlayerUrl(videoId, brightcoveData.account_id),
    brightcove: {
      iframe: {
        height: 650,
        width: -1,
        src: brightcovePlayerUrl(videoId, brightcoveData.account_id),
      },
    },
    copyright: {
      ...copyright,
    },
  };

  return (
    <OneColumn>
      <Figure>
        <VisualElementWrapper visualElement={visualElement} />
      </Figure>
    </OneColumn>
  );
};

export default VideoPage;

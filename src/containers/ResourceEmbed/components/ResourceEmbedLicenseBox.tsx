/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TFunction, useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { gql } from '@apollo/client';
import Tabs from '@ndla/tabs';
import { GQLResourceEmbedLicenseBox_MetaFragment } from '../../../graphqlTypes';
import ImageLicenseList from '../../../components/license/ImageLicenseList';
import AudioLicenseList from '../../../components/license/AudioLicenseList';
import PodcastLicenseList from '../../../components/license/PodcastLicenseList';
import VideoLicenseList from '../../../components/license/VideoLicenseList';
import H5pLicenseList from '../../../components/license/H5pLicenseList';
import ConceptLicenseList from '../../../components/license/ConceptLicenseList';

interface Props {
  metaData: GQLResourceEmbedLicenseBox_MetaFragment;
}

const buildLicenseTabList = (
  metaData: GQLResourceEmbedLicenseBox_MetaFragment,
  t: TFunction,
) => {
  const tabs = [];
  if (metaData.images?.length) {
    tabs.push({
      title: t('license.tabs.images'),
      id: 'images',
      content: <ImageLicenseList images={metaData.images} />,
    });
  }
  if (metaData.audios?.length) {
    tabs.push({
      title: t('license.tabs.audio'),
      id: 'audio',
      content: <AudioLicenseList audios={metaData.audios} />,
    });
  }
  if (metaData.podcasts?.length) {
    tabs.push({
      title: t('license.tabs.podcast'),
      id: 'podcast',
      content: <PodcastLicenseList podcasts={metaData.podcasts} />,
    });
  }
  if (metaData.brightcoves?.length) {
    tabs.push({
      title: t('license.tabs.video'),
      id: 'video',
      content: <VideoLicenseList videos={metaData.brightcoves} />,
    });
  }

  if (metaData.h5ps?.length) {
    tabs.push({
      title: t('license.tabs.h5p'),
      id: 'h5p',
      content: <H5pLicenseList h5ps={metaData.h5ps} />,
    });
  }

  if (metaData.concepts?.length) {
    tabs.push({
      title: t('license.tabs.concept'),
      id: 'concept',
      content: <ConceptLicenseList concepts={metaData.concepts} />,
    });
  }

  return tabs;
};

const ResourceEmbedLicenseBox = ({ metaData }: Props) => {
  const { t } = useTranslation();
  const tabs = useMemo(() => buildLicenseTabList(metaData, t), [metaData, t]);

  return (
    <div>
      <Tabs tabs={tabs} />
    </div>
  );
};

ResourceEmbedLicenseBox.fragments = {
  metaData: gql`
    fragment ResourceEmbedLicenseBox_Meta on ResourceMetaData {
      concepts {
        content
        metaImageUrl
        ...ConceptLicenseList_ConceptLicense
      }
      h5ps {
        ...H5pLicenseList_H5pLicense
      }
      brightcoves {
        description
        ...VideoLicenseList_BrightcoveLicense
      }
      audios {
        ...AudioLicenseList_AudioLicense
      }
      podcasts {
        coverPhotoUrl
        ...PodcastLicenseList_PodcastLicense
      }
      images {
        altText
        ...ImageLicenseList_ImageLicense
      }
    }
    ${ConceptLicenseList.fragments.concept}
    ${H5pLicenseList.fragments.h5p}
    ${VideoLicenseList.fragments.video}
    ${AudioLicenseList.fragments.audio}
    ${PodcastLicenseList.fragments.podcast}
    ${ImageLicenseList.fragments.image}
  `,
};

export default ResourceEmbedLicenseBox;

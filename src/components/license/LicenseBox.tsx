/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import Tabs from '@ndla/tabs';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import ImageLicenseList from './ImageLicenseList';
import AudioLicenseList from './AudioLicenseList';
import PodcastLicenseList from './PodcastLicenseList';
import TextLicenseList from './TextLicenseList';
import VideoLicenseList from './VideoLicenseList';
import H5pLicenseList from './H5pLicenseList';
import ConceptLicenseList from './ConceptLicenseList';
import OembedItem from './OembedItem';
import { GQLLicenseBox_ArticleFragment } from '../../graphqlTypes';

function buildLicenseTabList(
  article: GQLLicenseBox_ArticleFragment,
  t: TFunction,
  copyText?: string,
  printUrl?: string,
) {
  const images = article.metaData?.images || [];
  const audios = article.metaData?.audios || [];
  const podcasts = article.metaData?.podcasts || [];
  const brightcove = article.metaData?.brightcoves || [];
  const h5ps = article.metaData?.h5ps || [];
  const oembed = article.oembed;
  const concepts = article.metaData?.concepts || [];
  const tabs = [];
  if (images.length > 0) {
    tabs.push({
      title: t('license.tabs.images'),
      id: 'images',
      content: <ImageLicenseList images={images} />,
    });
  }
  tabs.push({
    title: t('license.tabs.text'),
    id: 'text',
    content: (
      <TextLicenseList
        printUrl={printUrl}
        texts={[
          {
            title: article.title,
            copyright: article.copyright,
            updated: article.published,
            copyText,
          },
        ]}
      />
    ),
  });

  if (audios.length > 0) {
    tabs.push({
      title: t('license.tabs.audio'),
      id: 'audio',
      content: <AudioLicenseList audios={audios} />,
    });
  }

  if (podcasts.length > 0) {
    tabs.push({
      title: t('license.tabs.podcast'),
      id: 'podcast',
      content: <PodcastLicenseList podcasts={podcasts} />,
    });
  }

  if (brightcove.length > 0) {
    tabs.push({
      title: t('license.tabs.video'),
      id: 'video',
      content: <VideoLicenseList videos={brightcove} />,
    });
  }

  if (h5ps.length) {
    tabs.push({
      title: t('license.tabs.h5p'),
      id: 'h5p',
      content: <H5pLicenseList h5ps={h5ps} />,
    });
  }

  if (
    concepts.some(
      (concept) =>
        concept.copyright?.license?.license &&
        concept.copyright.license.license !== 'unknown',
    )
  ) {
    tabs.push({
      title: t('license.tabs.concept'),
      id: 'concept',
      content: <ConceptLicenseList concepts={concepts} />,
    });
  }

  if (oembed) {
    tabs.push({
      title: t('license.tabs.embedlink'),
      id: 'embedLink',
      content: <OembedItem oembed={oembed} />,
    });
  }

  return tabs;
}

interface Props {
  article: GQLLicenseBox_ArticleFragment;
  copyText?: string;
  printUrl?: string;
}
const LicenseBox = ({ article, copyText, printUrl }: Props) => {
  const { t } = useTranslation();
  const tabs = buildLicenseTabList(article, t, copyText, printUrl);
  return <Tabs tabs={tabs} />;
};

LicenseBox.fragments = {
  article: gql`
    fragment LicenseBox_Article on Article {
      id
      title
      oembed
      published
      copyright {
        ...TextLicenseList_Copyright
      }
      metaData {
        copyText
        concepts {
          ...ConceptLicenseList_ConceptLicense
        }
        h5ps {
          ...H5pLicenseList_H5pLicense
        }
        brightcoves {
          ...VideoLicenseList_BrightcoveLicense
        }
        audios {
          ...AudioLicenseList_AudioLicense
        }
        podcasts {
          ...PodcastLicenseList_PodcastLicense
        }
        images {
          ...ImageLicenseList_ImageLicense
        }
      }
    }
    ${ConceptLicenseList.fragments.concept}
    ${H5pLicenseList.fragments.h5p}
    ${VideoLicenseList.fragments.video}
    ${AudioLicenseList.fragments.audio}
    ${PodcastLicenseList.fragments.podcast}
    ${ImageLicenseList.fragments.image}
    ${TextLicenseList.fragments.copyright}
  `,
};

export default LicenseBox;

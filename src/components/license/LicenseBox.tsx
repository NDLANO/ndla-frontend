/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Tabs from '@ndla/tabs';
import { useTranslation, TFunction } from 'react-i18next';
import ImageLicenseList from './ImageLicenseList';
import AudioLicenseList from './AudioLicenseList';
import TextLicenseList from './TextLicenseList';
import VideoLicenseList from './VideoLicenseList';
import H5pLicenseList from './H5pLicenseList';
import ConceptLicenseList from './ConceptLicenseList';
import OembedItem from './OembedItem';
import { GQLArticleInfoFragment } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';

function buildLicenseTabList(
  article: GQLArticleInfoFragment,
  locale: LocaleType,
  t: TFunction,
) {
  const images = article.metaData?.images || [];
  const audios = article.metaData?.audios || [];
  const brightcove = article.metaData?.brightcoves || [];
  const h5ps = article.metaData?.h5ps || [];
  const oembed = article.oembed;
  const concepts = article.metaData?.concepts || [];
  const tabs = [];

  if (images.length > 0) {
    tabs.push({
      title: t('license.tabs.images'),
      content: <ImageLicenseList images={images} locale={locale} />,
    });
  }
  tabs.push({
    title: t('license.tabs.text'),
    content: (
      <TextLicenseList
        texts={[
          {
            title: article.title,
            copyright: article.copyright,
            updated: article.published,
            copyText: article.metaData?.copyText,
          },
        ]}
        locale={locale}
      />
    ),
  });

  if (audios.length > 0) {
    tabs.push({
      title: t('license.tabs.audio'),
      content: <AudioLicenseList audios={audios} locale={locale} />,
    });
  }

  if (brightcove.length > 0) {
    tabs.push({
      title: t('license.tabs.video'),
      content: <VideoLicenseList videos={brightcove} locale={locale} />,
    });
  }

  if (h5ps.length) {
    tabs.push({
      title: t('license.tabs.h5p'),
      content: <H5pLicenseList h5ps={h5ps} locale={locale} />,
    });
  }

  if (concepts.length) {
    tabs.push({
      title: t('license.tabs.concept'),
      content: <ConceptLicenseList concepts={concepts} locale={locale} />,
    });
  }

  if (oembed) {
    tabs.push({
      title: t('license.tabs.embedlink'),
      content: <OembedItem oembed={oembed} />,
    });
  }

  return tabs;
}

interface Props {
  article: GQLArticleInfoFragment;
  locale: LocaleType;
}

const LicenseBox = ({ article, locale }: Props) => {
  const { t } = useTranslation();
  const tabs = buildLicenseTabList(article, locale, t);
  return (
    <div>
      <h1 className="license__heading">{t('license.heading')}</h1>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default LicenseBox;

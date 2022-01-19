import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AudioPlayer,
  // @ts-ignore
  Figure,
  // @ts-ignore
  FigureCaption,
} from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
// @ts-ignore
import Button from '@ndla/button';
// @ts-ignore
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { AudioLicenseInfo } from '../../components/license/AudioLicenseList';
import { Audio, LocaleType } from '.../../../interfaces';
import { getLicenseCredits } from './util';

interface Props {
  podcast: Audio;
  locale: LocaleType;
}

const Podcast = ({ podcast, locale }: Props) => {
  const license =
    podcast.copyright?.license &&
    getLicenseByAbbreviation(podcast.copyright?.license?.license, locale);

  const coverPhoto = podcast.podcastMeta?.coverPhoto && {
    url: podcast.podcastMeta?.coverPhoto?.url,
    alt: podcast.podcastMeta?.coverPhoto?.altText,
  };

  const { t } = useTranslation();

  return (
    <Figure id={`figure-${podcast.id}`} type="full-column">
      <AudioPlayer
        src={podcast.audioFile.url}
        title={podcast.title.title}
        description={podcast.podcastMeta?.introduction}
        img={coverPhoto}
        textVersion={podcast.manuscript?.manuscript}
      />
      <FigureCaption
        figureId={`figure-${podcast.id}`}
        id={`${podcast.id}`}
        locale={locale}
        key="caption"
        caption={podcast.title.title}
        licenseRights={license?.rights || []}
        reuseLabel={t('other.reuse')}
        authors={getLicenseCredits(podcast.copyright)} // Fiks
      >
        <Modal
          backgroundColor="blue"
          activateButton={<Button link>{t('article.useContent')}</Button>}
          size="medium">
          {(onClose: () => void) => (
            <>
              <ModalHeader modifier="no-bottom-padding">
                <ModalCloseButton onClick={onClose} title="Lukk" />
              </ModalHeader>
              <ModalBody>
                <AudioLicenseInfo
                  audio={{
                    src: podcast.audioFile.url,
                    copyright: podcast.copyright,
                    title: podcast.title.title,
                  }}
                  image={coverPhoto}
                  locale={locale}
                />
              </ModalBody>
            </>
          )}
        </Modal>
      </FigureCaption>
    </Figure>
  );
};

export default Podcast;

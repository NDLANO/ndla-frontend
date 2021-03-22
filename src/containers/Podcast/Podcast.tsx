/* eslint-disable react/prop-types */
import React from 'react';
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
import { injectT, tType } from '@ndla/i18n';
// @ts-ignore
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
// @ts-ignore
import { AudioLicenseInfo } from 'components/license/AudioLicenseList';
import { Copyright, Audio } from '.../../../interfaces';

const getLicenseCredits = (copyright: Copyright) => {
  if (copyright.creators && copyright.creators.length > 0) {
    return copyright.creators;
  }
  if (copyright.rightsholders && copyright.rightsholders.length > 0) {
    return copyright.rightsholders;
  }
  if (copyright.processors && copyright.processors.length > 0) {
    return copyright.processors;
  }
  return [];
};

interface PodcastProps {
  podcast: Audio;
}

const Podcast: React.FC<tType & PodcastProps> = ({ podcast, t }) => {
  const license =
    podcast.copyright?.license &&
    getLicenseByAbbreviation(
      podcast.copyright?.license?.license,
      'nb', // Fiks
    );

  return (
    <Figure id={`figure-${podcast.id}`} type="full-column">
      <AudioPlayer
        src={podcast.audioFile.url}
        title={podcast.title}
        description={podcast.podcastMeta?.introduction}
        img={
          podcast.podcastMeta?.coverPhoto && {
            url: podcast.podcastMeta?.coverPhoto?.url,
            alt: podcast.podcastMeta?.coverPhoto?.altText,
          }
        }
        textVersion={podcast.podcastMeta?.manuscript}
      />
      <FigureCaption
        figureId={`figure-${podcast.id}`}
        id={podcast.id}
        locale="nb" // Fiks
        key="caption"
        caption={podcast.title}
        licenseRights={license?.rights}
        authors={getLicenseCredits(podcast.copyright)} // Fiks
      >
        <Modal
          backgroundColor="blue"
          activateButton={<Button link>{t('article.useContent')}</Button>}
          size="regular">
          {(onClose: void) => (
            <>
              <ModalHeader modifier="no-bottom-padding">
                <ModalCloseButton onClick={onClose} title="Lukk" />
              </ModalHeader>
              <ModalBody>
                <div>
                  <AudioLicenseInfo
                    audio={{
                      src: podcast.audioFile.url,
                      copyright: podcast.copyright,
                      title: podcast.title,
                    }}
                    locale={'nb'}
                    t={(
                      arg: string,
                      obj: { [key: string]: string | boolean | number },
                    ) => t(`license.${arg}`, obj)}
                  />
                </div>
              </ModalBody>
            </>
          )}
        </Modal>
      </FigureCaption>
    </Figure>
  );
};

export default injectT(Podcast);

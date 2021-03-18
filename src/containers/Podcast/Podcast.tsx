/* eslint-disable react/prop-types */
import React from 'react';
import {
  AudioPlayer,
  // @ts-ignore
  Figure,
  // @ts-ignore
  FigureLicenseDialog,
  // @ts-ignore
  FigureCaption,
} from '@ndla/ui';
import {
  getLicenseByAbbreviation,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
// @ts-ignore
import Button, { StyledButton } from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import { Copyright, Audio } from '.../../../interfaces';

const Anchor = StyledButton.withComponent('a');

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

interface AudioActionButtonProps {
  src: string;
  copyString: string;
}

const AudioActionButtons: React.FC<AudioActionButtonProps & tType> = ({
  src,
  copyString,
  t,
}) => (
  <>
    <Button
      key="copy"
      outline
      data-copied-title={t('license.hasCopiedTitle')}
      data-copy-string={copyString}>
      {t('license.copyTitle')}
    </Button>
    <Anchor key="download" href={src} download appearance="outline">
      {t('audio.download')}
    </Anchor>
  </>
);

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
  const contributors = getGroupedContributorDescriptionList(
    podcast.copyright,
    'nb', // Fiks
  ).map(item => ({
    name: item.description,
    type: item.label,
  }));
  return (
    <Figure id={podcast.id} type="full-column">
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
      <FigureLicenseDialog
        id={podcast.id}
        key={podcast.id}
        license={license}
        authors={contributors}
        origin={podcast.copyright?.origin}
        title={podcast.title}
        locale={'nb'} // Fiks
        messages={{
          close: 'Lukk', // Fiks
          rulesForUse: 'Regler for bruk av lydklippet', // Fiks
          learnAboutLicenses: license?.linkText,
          source: 'Kilde', // Fiks
          title: 'Tittel', // Fiks
        }}>
        <AudioActionButtons src="test" copyString="test" t={t} />
      </FigureLicenseDialog>
      <FigureCaption
        figureId={podcast.id}
        id={podcast.id}
        locale="nb" // Fiks
        key="caption"
        caption={podcast.title}
        reuseLabel={'Bruk lydklipp'} // Fiks
        licenseRights={license?.rights}
        authors={getLicenseCredits(podcast.copyright)} //
      />
    </Figure>
  );
};

export default injectT(Podcast);

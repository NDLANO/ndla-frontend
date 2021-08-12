import React, { useEffect } from 'react';
//@ts-ignore
import { FigureCaption, FigureLicenseDialog, Figure } from '@ndla/ui';
import {
  getGroupedContributorDescriptionList,
  getLicenseByAbbreviation,
} from '@ndla/licenses';
import { injectT, tType } from '@ndla/i18n';
import { initArticleScripts } from '@ndla/article-scripts';
import { uuid } from '@ndla/util';
import { GQLVisualElement } from '../../graphqlTypes';
import VisualElement from './VisualElement';
import VisualElementLicenseButtons from './VisualElementLicenseButtons';
import { LocaleType, ResourceType } from '../../interfaces';

interface Props {
  visualElement: GQLVisualElement;
  locale: LocaleType;
}

export const resourceType = (VisualElementType?: string): ResourceType => {
  switch (VisualElementType) {
    case 'external':
    case 'brightcove':
      return 'video';
    case 'image':
      return 'image';
    default:
      return 'other';
  }
};

const VisualElementWrapper = ({ visualElement, locale, t }: Props & tType) => {
  useEffect(() => {
    initArticleScripts();
  }, []);

  const copyright = visualElement.copyright;

  const license = getLicenseByAbbreviation(copyright?.license?.license!, 'nb');
  const contributors = getGroupedContributorDescriptionList(
    {
      rightsholders: copyright?.rightsholders || [],
      creators: copyright?.creators || [],
      processors: copyright?.processors || [],
    },
    locale,
  ).map(item => ({
    name: item.description,
    type: item.label,
  }));

  const caption =
    visualElement.image?.title ||
    visualElement.brightcove?.caption ||
    visualElement.brightcove?.title ||
    visualElement.h5p?.title ||
    '';

  const messages = {
    learnAboutLicenses: license
      ? license.linkText
      : t('license.learnMore') || '',
    title: t('title'),
    close: t('close'),
    source: t('source'),
    rulesForUse: t('license.images.rules'),
    reuse: t('image.reuse'),
    download: t('image.download'),
  };
  const id = uuid();
  const figureId = `figure-${id}`;

  return (
    <Figure id={figureId} type={'full-column'} resizeIframe={true}>
      <VisualElement visualElement={visualElement} />
      {visualElement.resource !== 'external' && copyright && (
        <FigureCaption
          id={id}
          figureId={figureId}
          locale={locale}
          caption={caption}
          reuseLabel={messages.reuse}
          licenseRights={license.rights}
          authors={
            copyright?.creators ||
            copyright?.rightsholders ||
            copyright?.processors ||
            []
          }>
          <FigureLicenseDialog
            id={id}
            authors={contributors}
            locale={locale}
            license={license}
            messages={messages}
            title={visualElement.title}
            origin={copyright?.origin}>
            <VisualElementLicenseButtons
              visualElement={visualElement}
              resourceType={resourceType(visualElement.resource)}
            />
          </FigureLicenseDialog>
        </FigureCaption>
      )}
    </Figure>
  );
};

export default injectT(VisualElementWrapper);

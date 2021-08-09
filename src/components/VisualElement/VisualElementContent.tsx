import React from 'react';
//@ts-ignore
import { FigureCaption, FigureLicenseDialog, Figure } from '@ndla/ui';
import Button from '@ndla/button';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { injectT, tType } from '@ndla/i18n';
import { GQLTopic } from '../../graphqlTypes';
import VisualElement from './VisualElement';
import { LocaleType, ResourceType } from '../../interfaces';


interface Props {
  topic: GQLTopic;
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

const VisualElementContent = ({ topic, locale, t }: Props & tType) => {
  const {article, id} = topic;

  const license = getLicenseByAbbreviation(
    article?.copyright?.license?.license!,
    'nb',
  );
  const messages = {
    learnAboutLicenses: license ? license.linkText : t('license.learnMore'),
    title: t('title'),
    close: t('close'),
    source: t('source'),
    rulesForUse: t('license.images.rules'),
    reuse: t('image.reuse'),
    download: t('image.download'),
  };

  const figureId = `figure-${id}`;

  console.log(!!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement &&
    !window.document.hidden
  ))
  const k = "asfdasdasd1231a";
  const s = "dsfdasdasd1231a";

  return (
    <Figure id={figureId} type={'full-column'} resizeIframe={true}>
      <VisualElement visualElement={article?.visualElement!} />
      <FigureCaption
        id={k}
        figureId={s}
        locale={locale}
        caption={article?.visualElement?.title || ''}
        reuseLabel={messages.reuse}
        licenseRights={license.rights}
        authors={article?.copyright?.creators}
        >
        <FigureLicenseDialog
          id={s}
          authors={article?.copyright.creators}
          locale={locale}
          license={license}
          messages={messages}
          title={article?.visualElement?.title}
          origin={article?.visualElement?.url}
        >
          <Button outline>{t('license.copyTitle')}</Button>
          <Button outline>{messages.download}</Button>
        </FigureLicenseDialog >
      </FigureCaption>
    </Figure>
  );
};

export default injectT(VisualElementContent);

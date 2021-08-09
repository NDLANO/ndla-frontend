import React,{ useEffect } from 'react';
//@ts-ignore
import { FigureCaption, FigureLicenseDialog, Figure } from '@ndla/ui';
import { StyledButton } from '@ndla/button';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { injectT, tType } from '@ndla/i18n';
import { initArticleScripts } from '@ndla/article-scripts';
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

  useEffect(() => {
    initArticleScripts();
  }, [])  

  const { article, id } = topic;
  const copyright =
    article?.visualElement?.resource === 'image'
      ? article?.visualElement?.image?.copyright
      : article?.visualElement?.copyright;

  const license = getLicenseByAbbreviation(copyright?.license?.license!, 'nb');
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

  const Button = StyledButton.withComponent('a');

  console.log(license)
  console.log(article?.visualElement)


  return (
    <Figure id={figureId} type={'full-column'} resizeIframe={true}>
      <VisualElement visualElement={article?.visualElement!} />
      <FigureCaption
        id={id}
        figureId={figureId}
        locale={locale}
        caption={article?.visualElement?.title}
        reuseLabel={messages.reuse}
        licenseRights={license.rights}
        authors={copyright?.creators || []}>
        <FigureLicenseDialog
          id={id}
          authors={copyright?.rightsholders || []}
          locale={locale}
          license={license}
          messages={messages}
          title={article?.visualElement?.title}
          origin={article?.visualElement?.copyright?.origin}>
          <Button outline>{t('license.copyTitle')}</Button>
          <Button outline>{messages.download}</Button>
        </FigureLicenseDialog>
      </FigureCaption>
    </Figure>
  );
};

export default injectT(VisualElementContent);

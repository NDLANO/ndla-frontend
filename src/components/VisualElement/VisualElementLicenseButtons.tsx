import { useTranslation } from 'react-i18next';
import { StyledButton } from '@ndla/button';
import queryString from 'query-string';
import CopyTextButton from '../license/CopyTextButton';
import { GQLVisualElement } from '../../graphqlTypes';

const makeIframeString = (
  url: string,
  width: string,
  height: string,
  title = '',
) => {
  const strippedWidth = Number.isInteger(width)
    ? width
    : width.replace(/\s*px/, '');
  const strippedHeight = Number.isInteger(height)
    ? height
    : height.replace(/\s*px/, '');
  const urlOrTitle = title || url;
  return `<iframe title="${urlOrTitle}" aria-label="${urlOrTitle}" src="${url}" width="${strippedWidth}" height="${strippedHeight}" allowfullscreen scrolling="no" frameborder="0" loading="lazy"></iframe>`;
};

const downloadUrl = (imageSrc?: string) => {
  if (!imageSrc) return undefined;
  const urlObject = queryString.parseUrl(imageSrc);
  return `${urlObject.url}?${queryString.stringify({
    ...urlObject.query,
    download: true,
  })}`;
};

interface Props {
  visualElement: GQLVisualElement;
  resourceType: string;
}

const VisualElementLicenseButtons = ({
  visualElement,
  resourceType,
}: Props) => {
  const { t } = useTranslation();
  const Button = StyledButton.withComponent('a');

  const copyText = visualElement.image?.copyText;

  return (
    <>
      <CopyTextButton
        stringToCopy={copyText || ''}
        copyTitle={t('license.copyTitle')}
        hasCopiedTitle={t('license.hasCopiedTitle')}
      />
      {visualElement.copyright?.license?.license !== 'COPYRIGHTED' && (
        <Button
          key="download"
          href={
            visualElement.brightcove?.download ||
            downloadUrl(visualElement.image?.src)
          }
          appearance="outline"
          download>
          {t(`${resourceType}.download`)}
        </Button>
      )}
      {visualElement.brightcove && (
        <CopyTextButton
          copyTitle={t('license.embed')}
          hasCopiedTitle={t('license.hasCopiedTitle')}
          stringToCopy={makeIframeString(
            visualElement.brightcove.iframe?.src!,
            `${visualElement.brightcove.iframe?.width}`,
            `${visualElement.brightcove.iframe?.height}`,
            t('brightcove.name'),
          )}></CopyTextButton>
      )}
    </>
  );
};

export default VisualElementLicenseButtons;

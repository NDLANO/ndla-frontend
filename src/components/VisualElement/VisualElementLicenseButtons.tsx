/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { SafeLinkButton } from '@ndla/safelink';
import queryString from 'query-string';
import CopyTextButton from '../license/CopyTextButton';
import { GQLVisualElementLicenseButtons_VisualElementFragment } from '../../graphqlTypes';

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
  visualElement: GQLVisualElementLicenseButtons_VisualElementFragment;
  resourceType: string;
}

const VisualElementLicenseButtons = ({
  visualElement,
  resourceType,
}: Props) => {
  const { t } = useTranslation();

  const copyText = visualElement.image?.copyText;

  return (
    <>
      <CopyTextButton
        stringToCopy={copyText || ''}
        copyTitle={t('license.copyTitle')}
        hasCopiedTitle={t('license.hasCopiedTitle')}
      />
      {visualElement.copyright?.license?.license !== 'COPYRIGHTED' && (
        <SafeLinkButton
          key="download"
          to={
            visualElement.brightcove?.download ||
            downloadUrl(visualElement.image?.src) ||
            ''
          }
          outline
          download>
          {t(`${resourceType}.download`)}
        </SafeLinkButton>
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

VisualElementLicenseButtons.fragments = {
  visualElement: gql`
    fragment VisualElementLicenseButtons_VisualElement on VisualElement {
      copyright {
        license {
          license
        }
      }
      image {
        src
        copyText
      }
      brightcove {
        download
        iframe {
          width
          height
          src
        }
      }
    }
  `,
};

export default VisualElementLicenseButtons;

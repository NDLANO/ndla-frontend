/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import LtiEmbedCode from './LtiEmbedCode';
import { fetchArticleOembed } from '../../containers/ArticlePage/articleApi';
import { LtiItem } from '../../interfaces';
import config from '../../config';

interface Props {
  item: LtiItem;
}
const LtiDefault = ({ item }: Props) => {
  const [embedCode, setEmbedCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const showEmbedCode = async (item: LtiItem) => {
    if (typeof item.url === 'string') {
      const oembed = await fetchArticleOembed(`${config.ndlaFrontendDomain}${item.url}`);
      setEmbedCode(oembed.html);
    } else {
      setEmbedCode(
        `<iframe src="${item.url.href}" frameborder="0" allowFullscreen="" aria-label="${item.url.href}" />`,
      );
    }
    setIsOpen(true);
  };

  const hideEmbedCode = () => {
    setEmbedCode('');
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => showEmbedCode(item)}>{t('lti.embed')}</Button>
      <LtiEmbedCode isOpen={isOpen} code={embedCode} onClose={hideEmbedCode} />
    </>
  );
};

export default LtiDefault;

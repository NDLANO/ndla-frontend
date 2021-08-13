/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import LtiEmbedCode from './LtiEmbedCode';
import { fetchArticleOembed } from '../../containers/ArticlePage/articleApi';

const LtiDefault = ({ item }) => {
  const [embedCode, setEmbedCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const showEmbedCode = async item => {
    if (item.url.href) {
      setEmbedCode(
        `<iframe src="${item.url.href}" frameborder="0" allowFullscreen="" aria-label="${item.url.href}" />`,
      );
    } else {
      const oembed = await fetchArticleOembed(item.url);
      setEmbedCode(oembed.html);
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

LtiDefault.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.oneOfType([
      PropTypes.shape({
        href: PropTypes.string,
      }),
      PropTypes.string,
    ]),
  }),
};

export default LtiDefault;

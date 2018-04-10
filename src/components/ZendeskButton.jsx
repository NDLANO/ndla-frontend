/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import config from '../config';

const zendeskHost =
  process.env.BUILD_TARGET === 'server' || process.env.NODE_ENV === 'unittest'
    ? config.zendeskHost
    : window.DATA.config.zendeskHost;
const ZendeskButton = ({ t }) =>
  zendeskHost ? (
    <Button
      onClick={() => (window && window.zE ? window.zE.activate() : undefined)}
      className="c-zendesk__button"
      outline>
      {t('askNDLA')}
    </Button>
  ) : null;

export default injectT(ZendeskButton);

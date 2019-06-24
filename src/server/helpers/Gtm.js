/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import config from '../../config';

export const GoogleTagMangerNoScript = () => {
  if (config.googleTagManagerId) {
    return (
      <noscript>
        <iframe
          aria-hidden="true"
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${
            config.googleTagManagerId
          }`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    );
  }
  return null;
};

export const GoogleTagMangerScript = () => {
  if (config.googleTagManagerId) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${
            config.googleTagManagerId
          }');`,
        }}
      />
    );
  }
  return null;
};

/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

class Document extends React.Component {
  static getInitialProps({ assets, data, renderPage }) {
    const page = renderPage();
    return { assets, data, ...page };
  }

  render() {
    const { helmet, assets, data, lang } = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html lang={lang} {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>NDLA</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,600,700|Source+Serif+Pro:400,700"
          />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.css && <link rel="stylesheet" href={assets.css} />}
        </head>
        <body {...bodyAttrs}>
          <div id="root">REPLACE_ME</div>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `window.DATA = ${JSON.stringify(data)}; `,
            }}
          />
          {assets.js.map(js => (
            <script type="text/javascript" src={js} defer />
          ))}

          {helmet.script.toComponent()}
        </body>
      </html>
    );
  }
}

Document.propTypes = {
  helmet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  lang: PropTypes.string.isRequired,
  assets: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Document;

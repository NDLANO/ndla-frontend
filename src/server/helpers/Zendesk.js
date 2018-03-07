/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';

const Zendesk = ({ useZendesk, locale }) =>
  useZendesk && config.zendeskHost ? (
    <Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: `/*<![CDATA[*/window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(e){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var e=this.createElement("script");n&&(this.domain=n),e.id="js-iframe-async",e.src="https://assets.zendesk.com/embeddable_framework/main.js",this.t=+new Date,this.zendeskHost="${
            config.zendeskHost
          }",this.zEQueue=a,this.body.appendChild(e)},o.write('<body onload="document._l();">'),o.close()}();
    /*]]>*/`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          zE(function() {
            zE.setLocale('${locale}');
            zE.hide();
          });`,
        }}
      />
    </Fragment>
  ) : null;

Zendesk.propTypes = {
  locale: PropTypes.string.isRequired,
  useZendesk: PropTypes.bool,
};

export default Zendesk;

/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IncomingMessage } from "http";
import { matchPath } from "react-router-dom";
import config from "../config";
import { embedRoutes } from "../routes";

const connectSrc = (() => {
  const defaultConnectSrc = [
    " 'self' ",
    "http://api-gateway.ndla-local",
    "https://*.ndla.no",
    "https://logs-01.loggly.com",
    "https://edge.api.brightcove.com",
    "https://*.brightcove.com",
    "https://bcsecure01-a.akamaihd.net",
    "https://hlsak-a.akamaihd.net",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.zendesk.com",
    "https://ekr.zdassets.com",
    "https://ltiredirect.itslearning.com",
    "https://platform.itslearning.com",
    "cdn.jsdelivr.net",
    "https://*.dataporten.no",
    "https://*.clarity.ms",
    "https://*.sentry.io",
    "https://app.formbricks.com",
  ];
  if (config.runtimeType === "development") {
    return [
      ...defaultConnectSrc,
      "https://devtools.apollodata.com/graphql",
      "http://localhost:3001",
      "ws://localhost:3001",
      "http://localhost:3100",
      "http://localhost:4000",
      "http://localhost",
      "http://localhost:24678",
      "ws://localhost:24678",
    ];
  }
  // Temp for testing xapi
  if (config.ndlaEnvironment === "test") {
    return [...defaultConnectSrc, "https://xapi.com", "https://learninglocker.kf.no"];
  }

  return defaultConnectSrc;
})();

const scriptSrc = (() => {
  const defaultScriptSrc = [
    "'self'",
    "'unsafe-inline'",
    " 'unsafe-eval'",
    "http://api-gateway.ndla-local",
    "https://*.ndlah5p.com",
    "https://h5p.org",
    "https://*.ndla.no",
    "https://players.brightcove.net",
    "http://players.brightcove.net",
    "https://players.brightcove.net",
    "*.nrk.no",
    "http://nrk.no",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://tagmanager.google.com",
    "https://www.youtube.com",
    "https://s.ytimg.com",
    "https://cdn.auth0.com",
    "https://vjs.zencdn.net",
    "https://httpsak-a.akamaihd.net",
    "*.brightcove.com",
    "*.facebook.net",
    "*.twitter.com",
    "*.twimg.com",
    "*.brightcove.net",
    "bcove.me",
    "bcove.video",
    "*.api.brightcove.com",
    "*.o.brightcove.com",
    "players.brightcove.net",
    "hls.ak.o.brightcove.com",
    "uds.ak.o.brightcove.com",
    "brightcove.vo.llnwd.net",
    "*.llnw.net",
    "*.llnwd.net",
    "*.edgefcs.net",
    "*.akafms.net",
    "*.edgesuite.net",
    "*.akamaihd.net",
    "*.analytics.edgekey.net",
    "*.deploy.static.akamaitechnologies.com",
    "*.cloudfront.net",
    "hlstoken-a.akamaihd.net",
    "vjs.zencdn.net",
    "*.gallerysites.net",
    "ndla.no",
    "*.ndla.no",
    "cdnjs.cloudflare.com",
    "https://*.zendesk.com",
    "https://static.zdassets.com",
    "cdn.jsdelivr.net",
    "https://*.dataporten.no",
    "https://*.clarity.ms",
    "https://app-script.monsido.com",
    "https://browser.sentry-cdn.com",
    "https://js.sentry-cdn.com",
    "https://app.formbricks.com",
  ];
  if (config.runtimeType === "development") {
    return [...defaultScriptSrc, "http://localhost:3001", "ws://localhost:3001", "http://localhost:3000"];
  }
  // Temp for testing xapi
  if (config.ndlaEnvironment === "test") {
    return [...defaultScriptSrc, "https://xapi.com", "https://learninglocker.kf.no"];
  }
  return defaultScriptSrc;
})();

const frameSrc = (() => {
  const defaultFrameSrc = [
    "blob:",
    "http://api-gateway.ndla-local",
    "*.nrk.no",
    "nrk.no",
    "*.vg.no",
    "vg.no",
    "https://www.tv2skole.no/",
    "*.elevkanalen.no",
    "elevkanalen.no",
    "https://www.scribd.com/",
    "https://www.youtube.com",
    "ndla.no",
    "*.ndlah5p.com",
    "https://h5p.org",
    "*.ndla.no",
    "*.slideshare.net",
    "slideshare.net",
    "*.vimeo.com",
    "vimeo.com",
    "*.ndla.filmiundervisning.no",
    "ndla.filmiundervisning.no",
    "*.prezi.com",
    "prezi.com",
    "*.commoncraft.com",
    "commoncraft.com",
    "*.embed.kahoot.it",
    "*.brightcove.net",
    "embed.kahoot.it",
    "fast.wistia.com",
    "https://khanacademy.org/",
    "*.khanacademy.org/",
    "*.vg.no/",
    "*.facebook.com",
    "*.twitter.com",
    "e.issuu.com",
    "new.livestream.com",
    "livestream.com",
    "channel9.msdn.com",
    "tomknudsen.no",
    "www.tomknudsen.no",
    "geogebra.org",
    "www.geogebra.org",
    "ggbm.at",
    "www.imdb.com",
    "imdb.com",
    "miljoatlas.miljodirektoratet.no",
    "www.miljostatus.no",
    "miljostatus.no",
    "phet.colorado.edu",
    "lab.concord.org",
    "worldbank.org",
    "*.worldbank.org",
    "ted.com",
    "embed.ted.com",
    "embed.molview.org",
    "reader.pubfront.com",
    "ebok.no",
    "trinket.io",
    "codepen.io",
    "public.flourish.studio",
    "flo.uri.sh",
    "ourworldindata.org",
    "*.sketchup.com",
    "www.gapminder.org",
    "www.facebook.com",
    "fb.watch",
    "sketchfab.com",
    "jeopardylabs.com",
    "*.uio.no",
    "*.maps.arcgis.com",
    "*.arcgis.com",
    "arcg.is",
    "norgeskart.no",
    "kartiskolen.no",
    "norgeibilder.no",
    "video.qbrick.com",
    "www.norskpetroleum.no",
    "pub.dialogapi.no",
  ];
  if (config.runtimeType === "development") {
    return [
      ...defaultFrameSrc,
      "http://localhost:3001",
      "ws://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3100",
    ];
  }
  return defaultFrameSrc;
})();

const fontSrc = (() => {
  const defaultFontSrc = [
    "'self'",
    "data:",
    "https://*.ndla.no",
    "cdnjs.cloudflare.com",
    "https://*.clarity.ms",
    "cdn.jsdelivr.net",
    "*.fontshare.com",
  ];
  if (config.runtimeType === "development") {
    return defaultFontSrc.concat("http://localhost:3001");
  }
  return defaultFontSrc;
})();

const contentSecurityPolicy = {
  directives: {
    baseUri: ["'self'", "https://tall.ndla.no"],
    defaultSrc: ["'self'", "blob:"],
    upgradeInsecureRequests: config.runtimeType === "development" || config.ndlaEnvironment === "local" ? null : [],
    scriptSrc,
    frameSrc,
    frameAncestors: [
      (req: IncomingMessage) => {
        const isEmbeddable = !!req.url?.length && embedRoutes.some((r) => matchPath(r, req.url || ""));
        if (isEmbeddable || req.url?.startsWith("/lti")) {
          return "*";
        }
        return "'self' https://tall.ndla.no https://tall.test.ndla.no https://exam.net https://*.exam.net";
      },
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://*.ndla.no",
      "https://tagmanager.google.com",
      "*.twitter.com",
      "*.twimg.com",
      "cdn.jsdelivr.net",
      "*.fontshare.com",
    ],
    fontSrc: fontSrc,
    imgSrc: [
      "'self'",
      "http://api-gateway.ndla-local",
      "https://*.ndla.no",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://stats.g.doubleclick.net",
      "http://metrics.brightcove.com",
      "https://httpsak-a.akamaihd.net",
      "https://*.boltdns.net",
      "https://www.nrk.no/",
      "https://ssl.gstatic.com",
      "https://www.gstatic.com",
      "https://*.clarity.ms",
      "https://ndla.zendesk.com",
      "tracking.monsido.com",
      "*.facebook.com",
      "*.twitter.com",
      "*.twimg.com",
      " data:",
    ],
    mediaSrc: ["'self'", "blob:", "https://*.ndla.no", "*.brightcove.com", "brightcove.com"],
    connectSrc,
  },
};
export default contentSecurityPolicy;

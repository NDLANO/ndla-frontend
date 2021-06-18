/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const hmrPort = parseInt(process.env.PORT as string, 10) + 1;
const connectSrc = (() => {
  const defaultConnectSrc = [
    " 'self' ",
    'https://*.ndla.no',
    'https://logs-01.loggly.com',
    'https://edge.api.brightcove.com',
    'https://*.brightcove.com',
    'https://bcsecure01-a.akamaihd.net',
    'https://hlsak-a.akamaihd.net',
    'ws://*.hotjar.com wss://*.hotjar.com',
    'https://*.hotjar.com',
    'https://*.hotjar.com:*',
    'https://www.google-analytics.com',
    'https://*.zendesk.com',
    'https://ekr.zdassets.com',
    'https://optimize.google.com',
    'https://ltiredirect.itslearning.com',
    'https://platform.itslearning.com',
    'cdn.jsdelivr.net',
    'https://auth.dataporten.no',
  ];
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.RAZZLE_LOCAL_ARTICLE_CONVERTER
  ) {
    return [
      ...defaultConnectSrc,
      'http://api-gateway.ndla-local',
      'https://devtools.apollodata.com/graphql',
      `http://localhost:${hmrPort}`,
      `ws://localhost:${hmrPort}`,
      'http://localhost:3100',
      'http://localhost:4000',
    ];
  }

  return defaultConnectSrc;
})();

const scriptSrc = (() => {
  const defaultScriptSrc = [
    "'self'",
    "'unsafe-inline'",
    " 'unsafe-eval'",
    'https://*.ndlah5p.com',
    'https://h5p.org',
    'https://*.ndla.no',
    'https://players.brightcove.net',
    'http://players.brightcove.net',
    'https://players.brightcove.net',
    '*.nrk.no',
    'http://nrk.no',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://tagmanager.google.com',
    'https://optimize.google.com',
    'https://www.youtube.com',
    'https://s.ytimg.com',
    'https://cdn.auth0.com',
    'https://vjs.zencdn.net',
    'https://httpsak-a.akamaihd.net',
    '*.brightcove.com',
    '*.facebook.net',
    '*.twitter.com',
    '*.twimg.com',
    '*.brightcove.net',
    'bcove.me',
    'bcove.video',
    '*.api.brightcove.com',
    '*.o.brightcove.com',
    'players.brightcove.net',
    'hls.ak.o.brightcove.com',
    'uds.ak.o.brightcove.com',
    'brightcove.vo.llnwd.net',
    '*.llnw.net',
    '*.llnwd.net',
    '*.edgefcs.net',
    '*.akafms.net',
    '*.edgesuite.net',
    '*.akamaihd.net',
    '*.analytics.edgekey.net',
    '*.deploy.static.akamaitechnologies.com',
    '*.cloudfront.net',
    'hlstoken-a.akamaihd.net',
    'vjs.zencdn.net',
    ' *.gallerysites.net',
    'ndla.no',
    '*.ndla.no',
    'ws://*.hotjar.com',
    'wss://*.hotjar.com',
    'https://*.hotjar.com',
    'cdnjs.cloudflare.com',
    'https://*.zendesk.com',
    'https://static.zdassets.com',
    'cdn.jsdelivr.net',
    'https://auth.dataporten.no',
  ];
  if (process.env.NODE_ENV === 'development') {
    return [...defaultScriptSrc, `http://localhost:${hmrPort}`];
  }
  return defaultScriptSrc;
})();

const frameSrc = (() => {
  const defaultFrameSrc = [
    'blob:',
    '*.nrk.no',
    'nrk.no',
    '*.vg.no',
    'vg.no',
    'https://www.tv2skole.no/',
    'https://www.scribd.com/',
    'https://optimize.google.com',
    'https://www.youtube.com',
    'ndla.no',
    '*.ndlah5p.com',
    'https://h5p.org',
    '*.ndla.no',
    '*.slideshare.net',
    'slideshare.net',
    '*.vimeo.com',
    'vimeo.com',
    '*.ndla.filmiundervisning.no',
    'ndla.filmiundervisning.no',
    '*.prezi.com',
    'prezi.com',
    '*.commoncraft.com',
    'commoncraft.com',
    '*.embed.kahoot.it',
    '*.brightcove.net',
    'https://*.hotjar.com',
    'embed.kahoot.it',
    'fast.wistia.com',
    'https://khanacademy.org/',
    '*.khanacademy.org/',
    '*.vg.no/',
    '*.facebook.com',
    '*.twitter.com',
    'e.issuu.com',
    'new.livestream.com',
    'livestream.com',
    'channel9.msdn.com',
    'tomknudsen.no',
    'www.tomknudsen.no',
    'geogebra.org',
    'www.geogebra.org',
    'ggbm.at',
    'www.imdb.com',
    'imdb.com',
    'miljoatlas.miljodirektoratet.no',
    'www.miljostatus.no',
    'miljostatus.no',
    'phet.colorado.edu',
    'lab.concord.org',
    'worldbank.org',
    '*.worldbank.org',
    'ted.com',
    'embed.ted.com',
    'embed.molview.org',
  ];
  if (process.env.NODE_ENV === 'development') {
    return [
      ...defaultFrameSrc,
      `http://localhost:${hmrPort}`,
      'http://localhost:3000',
    ];
  }
  return defaultFrameSrc;
})();

const imgSrc = (() => {
  const defaultImageSrc = [
    "'self'",
    'https://*.ndla.no',
    'https://www.google-analytics.com',
    'https://optimize.google.com',
    'https://stats.g.doubleclick.net',
    'http://metrics.brightcove.com',
    'https://httpsak-a.akamaihd.net',
    'https://*.boltdns.net',
    'https://www.nrk.no/',
    'https://ssl.gstatic.com',
    'https://www.gstatic.com',
    'https://*.hotjar.com',
    'https://ndla.zendesk.com',
    '*.facebook.com',
    '*.twitter.com',
    '*.twimg.com',
    ' data:',
  ];
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.RAZZLE_LOCAL_ARTICLE_CONVERTER
  ) {
    return [...defaultImageSrc, 'http://api-gateway.ndla-local'];
  }

  return defaultImageSrc;
})();

const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'", 'blob:'],
    scriptSrc,
    frameSrc,
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://optimize.google.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://tagmanager.google.com',
      '*.twitter.com',
      '*.twimg.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'data:',
      'cdnjs.cloudflare.com',
      'https://*.hotjar.com',
      'cdn.jsdelivr.net',
    ],
    imgSrc,
    mediaSrc: [
      "'self'",
      'blob:',
      'https://*.ndla.no',
      '*.brightcove.com',
      'brightcove.com',
    ],
    connectSrc,
  },
};
export default contentSecurityPolicy;

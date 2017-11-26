/*
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { metaTypes } from 'ndla-licenses';

function mkCreditsString(group, t, ignoreType) {
  return group
    .map(creator => {
      if (creator.type.toLowerCase() === ignoreType) {
        return creator.name;
      }
      const type = t(`creditType.${creator.type.toLowerCase()}`);
      return `${type} ${creator.name}`;
    })
    .join(', ');
}

export function getLicenseMetaInfo(copyright, t) {
  const creators = mkCreditsString(copyright.creators, t, 'originator');
  const rightsholders = mkCreditsString(
    copyright.rightsholders,
    t,
    'rightsholder',
  );
  const processors = mkCreditsString(copyright.processors, t, 'processor');

  return [
    {
      label: t(`creditType.originator`),
      description: creators,
      metaType: metaTypes.author,
    },
    {
      label: t(`creditType.rightsholder`),
      description: rightsholders,
      metaType: metaTypes.copyrightHolder,
    },
    {
      label: t(`creditType.processor`),
      description: processors,
      metaType: metaTypes.contributor,
    },
  ].filter(item => item.description !== '');
}

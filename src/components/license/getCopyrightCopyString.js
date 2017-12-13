/*
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function getCopyrightCopyString(copyright, t) {
  const { license } = copyright.license;
  let creatorsCopyString;

  if (copyright.authors) {
    creatorsCopyString = copyright.authors
      .map(author => `${author.type}: ${author.name}`)
      .join('\n');
  } else {
    creatorsCopyString = copyright.creators
      .map(creator => {
        const type = t(`creditType.${creator.type.toLowerCase()}`);
        return `${type}: ${creator.name}`;
      })
      .join('\n');
  }

  const licenseCopyString = `${
    license.toLowerCase().includes('by') ? 'CC ' : ''
  }${license}`.toUpperCase();

  const copyString = `${licenseCopyString} ${creatorsCopyString}`;
  return copyString;
}

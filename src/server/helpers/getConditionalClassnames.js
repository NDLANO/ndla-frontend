/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default function(userAgentString) {
  if (userAgentString && userAgentString.indexOf('MSIE') >= 0) {
    return 'ie lt-ie11';
  }
  if (userAgentString && userAgentString.indexOf('Trident/7.0; rv:11.0') >= 0) {
    return 'ie gt-ie10';
  }
  return '';
}

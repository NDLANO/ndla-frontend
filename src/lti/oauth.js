/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import crypto from 'crypto';

var htmlEscaper = /[&<>"'\/]/g;
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};
// Escape a string for HTML interpolation.
const encoder = string => {
  return ('' + string).replace(htmlEscaper, function(match) {
    return htmlEscapes[match];
  });
};

export const getSign = (url, data) => {
  const sharedSecret = 'natten';

  // keys in lexicographical order
  const reqObj = {};
  Object.keys(data)
    .sort()
    .forEach(function(key) {
      reqObj[key] = data[key] || '';
    });
  // make the string...got tired of writing that long thing
  var paramsStr = '';
  for (var i in reqObj) {
    if (reqObj[i] instanceof Object) {
      paramsStr += '&' + i + '=' + JSON.stringify(reqObj[i]);
    } else {
      paramsStr += '&' + i + '=' + reqObj[i];
    }
  }

  // had an extra '&' at the front
  paramsStr = paramsStr.substr(1);
  const sigBaseStr = 'POST&' + url + '&' + paramsStr;

  // no access token but we still have to append '&' according to the instructions
  const hashedBaseStr = crypto
    .createHmac('sha1', sharedSecret)
    .update(sigBaseStr)
    .digest('base64');
  return hashedBaseStr;
};

/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const func = function(array: any[], key: string) {
  return array.reduce((obj, item) => {
    const copy = obj;
    copy[item[key]] = copy[item[key]] || [];
    copy[item[key]].push(item);
    return copy;
  }, {});
};
export default func;

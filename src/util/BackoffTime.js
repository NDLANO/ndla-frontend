/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default function BackoffTime(initialDelay = 50, maxDelay = 5000) {
  this.delay = initialDelay;
  this.maxDelay = maxDelay;

  BackoffTime.prototype.getExponentialDelay = function getExponentialDelay() {
    if (this.maxDelay < this.delay) {
      return this.maxDelay;
    }
    this.delay = this.delay * 2;
    return this.delay;
  };
}

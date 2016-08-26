/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

export const SvgPolyfillScript = ({ className }) => {
  if (className !== '') {
    return <script src="/assets/svg4everybody.min.js" />;
  }
  return null;
};

SvgPolyfillScript.propTypes = {
  className: PropTypes.string.isRequired,
};

export const SvgPolyfillScriptInitalization = ({ className }) => {
  if (className !== '') {
    return <script dangerouslySetInnerHTML={{ __html: 'svg4everybody();' }} />;
  }
  return null;
};

SvgPolyfillScriptInitalization.propTypes = {
  className: PropTypes.string.isRequired,
};

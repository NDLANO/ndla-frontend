/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { cloneElement } from 'react';
import classNames from 'classnames';

import LicenseCc from './LicenseCc';
import Download from './Download';
import LicenseBy from './LicenseBy';
import LicenseNc from './LicenseNc';
import LicenseNd from './LicenseNd';
import LicenseSa from './LicenseSa';

function Icon(props) {
  const { children, ...rest } = props;

  const icon = cloneElement(children, { className: classNames('icon', rest.className) });

  return icon;
}

Icon.Download = props => (<Icon {...props}><Download /></Icon>);
Icon.LicenseCc = props => (<Icon {...props}><LicenseCc /></Icon>);
Icon.LicenseBy = props => (<Icon {...props}><LicenseBy /></Icon>);
Icon.LicenseNc = props => (<Icon {...props}><LicenseNc /></Icon>);
Icon.LicenseNd = props => (<Icon {...props}><LicenseNd /></Icon>);
Icon.LicenseSa = props => (<Icon {...props}><LicenseSa /></Icon>);

export default Icon;

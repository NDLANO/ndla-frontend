import React, { cloneElement } from 'react';
import classNames from 'classnames';

import LicenseCc from './LicenseCc';
import LicenseBy from './LicenseBy';
import LicenseNc from './LicenseNc';
import LicenseNd from './LicenseNd';
import LicenseSa from './LicenseSa';

function Icon(props) {
  const { children, ...rest } = props;

  const icon = cloneElement(children, { className: classNames('license-byline__icon', 'license__icon--mini', rest.className) });

  return icon;
}

Icon.LicenseCc = props => (<Icon {...props}><LicenseCc /></Icon>);
Icon.LicenseBy = props => (<Icon {...props}><LicenseBy /></Icon>);
Icon.LicenseNc = props => (<Icon {...props}><LicenseNc /></Icon>);
Icon.LicenseNd = props => (<Icon {...props}><LicenseNd /></Icon>);
Icon.LicenseSa = props => (<Icon {...props}><LicenseSa /></Icon>);

export default Icon;

/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { createElement } from 'react';
import classNames from 'classnames';
import elementType from 'react-prop-types/lib/elementType';

import Download from 'ndla-ui/es/icons/Download';
import Copy from 'ndla-ui/es/icons/Copy';
import Audio from 'ndla-ui/es/icons/Audio';
import Document from 'ndla-ui/es/icons/Document';
import ArrowDown from 'ndla-ui/es/icons/ArrowDown';
import Grid from 'ndla-ui/es/icons/Grid';
import Link from 'ndla-ui/es/icons/Link';
import Embed from 'ndla-ui/es/icons/Embed';
import OpenWindow from 'ndla-ui/es/icons/OpenWindow';
import Time from 'ndla-ui/es/icons/Time';
import User from 'ndla-ui/es/icons/User';

function Icon(props) {
  const { icon, ...rest } = props;
  return createElement(icon, { className: classNames('icon', rest.className) });
}

Icon.propTypes = {
  icon: elementType,
};

Icon.Download = props => <Icon {...props} icon={Download} />;
Icon.Copy = props => <Icon {...props} icon={Copy} />;
Icon.Audio = props => <Icon {...props} icon={Audio} />;
Icon.Document = props => <Icon {...props} icon={Document} />;
Icon.ArrowDown = props => <Icon {...props} icon={ArrowDown} />;
Icon.Grid = props => <Icon {...props} icon={Grid} />;
Icon.Link = props => <Icon {...props} icon={Link} />;
Icon.Embed = props => <Icon {...props} icon={Embed} />;
Icon.OpenWindow = props => <Icon {...props} icon={OpenWindow} />;
Icon.Time = props => <Icon {...props} icon={Time} />;
Icon.User = props => <Icon {...props} icon={User} />;

export default Icon;

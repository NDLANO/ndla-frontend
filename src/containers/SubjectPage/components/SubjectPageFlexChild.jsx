/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SubjectFlexChild } from 'ndla-ui';

export const SubjectPageFlexChild = ({ children, displayInTwoColumns }) =>
  displayInTwoColumns ? (
    <SubjectFlexChild>{children}</SubjectFlexChild>
  ) : (
    children
  );

SubjectPageFlexChild.propTypes = {
  displayInTwoColumns: PropTypes.bool,
};

SubjectPageFlexChild.defaultProps = {
  displayInTwoColumns: false,
};

export default SubjectPageFlexChild;

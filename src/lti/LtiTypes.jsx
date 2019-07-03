/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const LtiTypes = ltiData => {
  switch (ltiData.lti_message_type) {
    case 'basic-lti-launch-request':
      return null;
    case 'ContentItemSelectionRequest':
      return null;
    default:
      return null;
  }
};

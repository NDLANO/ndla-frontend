/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import { LtiDataShape } from '../shapes';
import LtiDefault from './components/LtiDefault';
import LtiDeepLinking from './components/LtiDeepLinking';
import LtiBasicLaunch from './components/LtiBasicLaunch';

const LtiEmbed = ({ ltiData, item }) => {
  switch (ltiData.lti_message_type) {
    case 'basic-lti-launch-request':
      return <LtiBasicLaunch ltiData={ltiData} item={item} />;
    case 'ContentItemSelectionRequest':
      return <LtiDeepLinking ltiData={ltiData} item={item} />;
    default:
      return <LtiDefault item={item} />;
  }
};

LtiEmbed.defaultProps = {
  ltiData: {},
};

LtiEmbed.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }),
  ltiData: LtiDataShape,
};

export default LtiEmbed;

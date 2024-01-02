/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import LtiBasicLaunch from "./components/LtiBasicLaunch";
import LtiDeepLinking from "./components/LtiDeepLinking";
import LtiDefault from "./components/LtiDefault";
import { LtiData, LtiItem } from "../interfaces";

interface Props {
  item: LtiItem;
  ltiData?: LtiData;
}
const LtiEmbed = ({ ltiData = {}, item }: Props) => {
  switch (ltiData?.lti_message_type) {
    case "basic-lti-launch-request":
      return <LtiBasicLaunch ltiData={ltiData} item={item} />;
    case "ContentItemSelectionRequest":
      return <LtiDeepLinking ltiData={ltiData} item={item} />;
    default:
      return <LtiDefault item={item} />;
  }
};

export default LtiEmbed;

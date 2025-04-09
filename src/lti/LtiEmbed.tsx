/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLtiData } from "../components/LtiContext";
import { LtiData, LtiItem } from "../interfaces";
import LtiBasicLaunch from "./components/LtiBasicLaunch";
import LtiDeepLinking from "./components/LtiDeepLinking";
import LtiDefault from "./components/LtiDefault";

interface Props {
  item: LtiItem;
  ltiData?: LtiData;
}
const LtiEmbed = ({ ltiData, item }: Props) => {
  const _ltiData = useLtiData()?.ltiData;
  const withFallback = ltiData ?? _ltiData ?? {};
  switch (ltiData?.lti_message_type) {
    case "basic-lti-launch-request":
      return <LtiBasicLaunch ltiData={withFallback} item={item} />;
    case "ContentItemSelectionRequest":
      return <LtiDeepLinking ltiData={withFallback} item={item} />;
    default:
      return <LtiDefault item={item} />;
  }
};

export default LtiEmbed;

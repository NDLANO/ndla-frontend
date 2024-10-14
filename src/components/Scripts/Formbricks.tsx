/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";

const Formbricks = () => {
  if (!config.formbricksId) {
    return null;
  }
  return (
    <>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
    !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://app.formbricks.com/api/packages/website";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e),setTimeout(function(){window.formbricks.init({environmentId: "${config.formbricksId}",  apiHost: "https://app.formbricks.com"})},500)}();
`,
        }}
      />
    </>
  );
};

export default Formbricks;

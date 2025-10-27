/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";

export const Formbricks = () => {
  if (!config.formbricksId) {
    return null;
  }
  const host = "https://app.formbricks.com";
  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
    !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="${host}/js/formbricks.umd.cjs";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e),setTimeout(function(){window.formbricks?.setup({environmentId: "${config.formbricksId}", appUrl: "${host}"})},500)}();
`,
      }}
    />
  );
};

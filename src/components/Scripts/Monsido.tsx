/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";

const Monsido = () => {
  if (!config.monsidoToken) {
    return null;
  }
  return (
    <>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
    window._monsido = window._monsido || {
        token: "${config.monsidoToken}",
        statistics: {
            enabled: true,
            cookieLessTracking: true,
            documentTracking: {
                enabled: false,
                documentCls: "monsido_download",
                documentIgnoreCls: "monsido_ignore_download",
                documentExt: [],
            },
        },
    };
`,
        }}
      />
      <script type="text/javascript" async src="https://app-script.monsido.com/v2/monsido-script.js"></script>
    </>
  );
};

export default Monsido;

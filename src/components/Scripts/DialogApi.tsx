/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";

export const DialogApi = () => {
  if (!config.enableDialogApi) return null;
  return (
    <script
      type="text/javascript"
      id="mnm-widget"
      async={!0}
      data-params={JSON.stringify({ config: "7d91f7cd-e049-4f4d-bc46-23a5cc79d388.json", version: "2" })}
      src="https://cdn.dialogapi.no/widget.v4.min.gz.js"
    ></script>
  );
};

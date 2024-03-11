/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request } from "express";
import { defaultRender } from "./render/defaultRender";
import { errorRender } from "./render/errorRender";
import { iframeArticleRender } from "./render/iframeArticleRender";
import { iframeEmbedRender } from "./render/iframeEmbedRender";
import { ltiRender } from "./render/ltiRender";
import { RootRenderFunc } from "./serverHelpers";

const render: RootRenderFunc = (req: Request, renderer: string) => {
  if (renderer === "default") {
    return defaultRender(req);
  } else if (renderer === "lti") {
    return ltiRender(req);
  } else if (renderer === "iframeEmbed") {
    return iframeEmbedRender(req);
  } else if (renderer === "iframeArticle") {
    return iframeArticleRender(req);
  } else if (renderer === "error") {
    return errorRender(req);
  } else {
    return defaultRender(req);
  }
};

export default render;

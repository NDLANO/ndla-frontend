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

const render: RootRenderFunc = (req: Request, _res, renderer: string, chunks) => {
  if (renderer === "default") {
    return defaultRender(req, chunks);
  } else if (renderer === "lti") {
    return ltiRender(req, chunks);
  } else if (renderer === "iframeEmbed") {
    return iframeEmbedRender(req, chunks);
  } else if (renderer === "iframeArticle") {
    return iframeArticleRender(req, chunks);
  } else if (renderer === "error") {
    return errorRender(req, chunks);
  } else {
    return defaultRender(req, chunks);
  }
};

export default render;

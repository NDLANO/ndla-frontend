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
import { withCtx } from "./middleware/loggerContextMiddleware";

const render: RootRenderFunc = (req: Request, _res, renderer: string, manifest, ctx) => {
  return withCtx(ctx, () => {
    if (renderer === "default") {
      return defaultRender(req, manifest);
    } else if (renderer === "lti") {
      return ltiRender(req, manifest);
    } else if (renderer === "iframeEmbed") {
      return iframeEmbedRender(req, manifest);
    } else if (renderer === "iframeArticle") {
      return iframeArticleRender(req, manifest);
    } else if (renderer === "error") {
      return errorRender(req, manifest);
    } else {
      return defaultRender(req, manifest);
    }
  });
};

export default render;

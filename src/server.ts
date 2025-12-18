/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import path from "node:path";
import express, { NextFunction, Request, Response } from "express";
import promBundle from "express-prom-bundle";
import helmet from "helmet";
import { matchPath } from "react-router";
import serialize from "serialize-javascript";
import { Manifest, ViteDevServer } from "vite";
import { getCookie } from "@ndla/util";
import config from "./config";
import { gracefulShutdown } from "./server/helpers/gracefulShutdown";
import { log } from "./util/logger/logger";
import { activeRequestsMiddleware } from "./server/middleware/activeRequestsMiddleware";
import { loggerContextMiddleware, getLoggerContextStore } from "./server/middleware/loggerContextMiddleware";
import { contentSecurityPolicy } from "./server/contentSecurityPolicy";
import api from "./server/api";
import { healthRouter } from "./server/routes/healthRouter";
import { RootRenderFunc, RouteChunkInfo, sendResponse } from "./server/serverHelpers";
import { INTERNAL_SERVER_ERROR } from "./statusCodes";
import { getRouteChunkInfo } from "./server/getManifestChunks";
import { getLocaleInfoFromPath } from "./i18n";
import { privateRoutes, routes } from "./routes";
import { isAccessTokenValid } from "./util/authHelpers";
import { handleError, ensureError } from "./util/handleError";
import { NOT_FOUND_PAGE_PATH } from "./constants";
import { isRestrictedMode } from "./server/helpers/restrictedMode";

const base = "/";

global.fetch = fetch;
const app = express();
const allowedBodyContentTypes = ["application/json", "application/x-www-form-urlencoded"];

app.disable("x-powered-by");
app.enable("trust proxy");

let vite: ViteDevServer | undefined;
if (!IS_PRODUCTION) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const sirv = (await import("sirv")).default;
  app.use(base, sirv(path.join(process.cwd(), "build", "public"), { extensions: [], maxAge: 5 * 60 }));
}

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: false,
  excludeRoutes: ["/health"],
});

app.use(metricsMiddleware);
app.use(activeRequestsMiddleware);
app.use(loggerContextMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    type: (req) => allowedBodyContentTypes.includes(req.headers["content-type"] ?? ""),
  }),
);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    referrerPolicy: {
      policy: ["origin", "no-referrer-when-downgrade"],
    },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    contentSecurityPolicy,
    xFrameOptions: false,
  }),
);

app.use(api);
app.use(healthRouter);

let manifest: Manifest = {};

if (IS_PRODUCTION) {
  manifest = (await import(`../build/public/.vite/manifest.json`)).default;
}

const renderRoute = async (req: Request, res: Response, renderer: string, chunkInfo: RouteChunkInfo) => {
  const ctx = getLoggerContextStore();
  if (!ctx) {
    throw new Error("Logger context is not available");
  }
  let render: RootRenderFunc;
  if (!IS_PRODUCTION) {
    try {
      render = (await vite!.ssrLoadModule(`./src/server/server.render.ts`)).default;
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: "Failed to parse server-side render function. You probably have some syntax errors somewhere.",
      };
    }
  } else {
    render = (await import(`../build/server/server.render.js`)).default;
  }

  const response = await render(req, res, renderer, chunkInfo, ctx);
  if ("location" in response) {
    return {
      status: response.status,
      data: { Location: response.location },
    };
  } else {
    const { htmlContent, data } = response.data;

    const serializedData = serialize({
      ...data,
      config: {
        ...data?.config,
        isClient: true,
      },
    });
    const htmlData = htmlContent.replace('"$WINDOW_DATA"', serializedData);
    return {
      status: response.status,
      data: `<!DOCTYPE html>
${htmlData}`,
    };
  }
};

type RouteFunc = (req: Request, res: Response) => Promise<{ data: any; status: number }>;

const applyRestrictedModeCacheHeader = (req: Request, res: Response) => {
  const { restricted } = isRestrictedMode(req);
  if (restricted) {
    res.setHeader("Cache-Control", "no-store");
  }
  return restricted;
};

const handleRequest = async (req: Request, res: Response, next: NextFunction, route: RouteFunc) => {
  try {
    const { data, status } = await route(req, res);
    applyRestrictedModeCacheHeader(req, res);
    sendResponse(req, res, data, status);
  } catch (err) {
    next(err);
  }
};

const defaultChunks = getRouteChunkInfo(manifest, "default");
const ltiChunks = getRouteChunkInfo(manifest, "lti");
const iframeEmbedChunks = getRouteChunkInfo(manifest, "iframeEmbed");
const iframeArticleChunks = getRouteChunkInfo(manifest, "iframeArticle");

const defaultRoute = async (req: Request, res: Response) => renderRoute(req, res, "default", defaultChunks);
const ltiRoute = async (req: Request, res: Response) => renderRoute(req, res, "lti", ltiChunks);
const iframeEmbedRoute = async (req: Request, res: Response) => renderRoute(req, res, "iframeEmbed", iframeEmbedChunks);
const iframeArticleRoute = async (req: Request, res: Response) =>
  renderRoute(req, res, "iframeArticle", iframeArticleChunks);

app.get(["/embed-iframe/:embedType/:embedId", "/embed-iframe/:lang/:embedType/:embedId"], async (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  handleRequest(req, res, next, iframeEmbedRoute);
});

const iframeArticleCallback = async (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  handleRequest(req, res, next, iframeArticleRoute);
};

app.get(
  [
    "/article-iframe/:lang/article/:articleId",
    "/article-iframe/:lang/:taxonomyId/:articleId",
    "/article-iframe/article/:articleId",
    "/article-iframe/:taxonomyId/:articleId",
  ],
  iframeArticleCallback,
);
app.post(
  [
    "/article-iframe/:lang/article/:articleId",
    "/article-iframe/:lang/:taxonomyId/:articleId",
    "/article-iframe/article/:articleId",
    "/article-iframe/:taxonomyId/:articleId",
  ],
  iframeArticleCallback,
);

app.post("/lti", async (req, res, next) => {
  handleRequest(req, res, next, ltiRoute);
});

app.get("/lti", async (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  handleRequest(req, res, next, ltiRoute);
});

app.get(["/", "/*splat"], (req, res, next) => {
  const { basepath: path } = getLocaleInfoFromPath(req.path);
  const route = routes.find((r) => matchPath(r, path)); // match with routes used in frontend
  const isPrivate = privateRoutes.some((r) => matchPath(r, path));
  res.setHeader("Cache-Control", isPrivate ? "private" : "public, max-age=300");
  const feideCookie = getCookie("feide_auth", req.headers.cookie ?? "") ?? "";
  const feideToken = feideCookie ? JSON.parse(feideCookie) : undefined;
  const isTokenValid = !!feideToken && isAccessTokenValid(feideToken);
  const shouldRedirect = isPrivate && !isTokenValid;

  if (route && shouldRedirect) {
    applyRestrictedModeCacheHeader(req, res);
    return res.redirect(`/login?state=${req.path}`);
  }

  return handleRequest(req, res, next, defaultRoute);
});

const errorRoute = async (req: Request, res: Response) =>
  renderRoute(req, res, "error", getRouteChunkInfo(manifest, "error"));

const getStatusCodeToReturn = (err?: Error): number => {
  if (err && "status" in err && typeof err.status === "number") {
    if (err.status >= 400 && err.status < 600) return err.status;
  }
  return INTERNAL_SERVER_ERROR;
};

async function sendInternalServerError(req: Request, res: Response, statusCode: number) {
  applyRestrictedModeCacheHeader(req, res);
  if (res.getHeader("Content-Type") === "application/json") {
    res.status(statusCode).json("Internal server error");
    return;
  }

  try {
    const { data } = await errorRoute(req, res);
    res.status(statusCode).send(data);
  } catch (e) {
    handleError(ensureError(e), { statusCode });
    res.status(statusCode).send("Internal server error");
  }
}

app.get("/*splat", (_req: Request, res: Response) => {
  res.redirect(NOT_FOUND_PAGE_PATH);
});
app.post("/*splat", (_req: Request, res: Response) => {
  res.redirect(NOT_FOUND_PAGE_PATH);
});

// NOTE: The error handler should be defined after all middlewares and routes
//       according to the express documentation
//       https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // NOTE: Even though the next parameter is not used, it is required to define the error handler
  vite?.ssrFixStacktrace(err);
  const statusCode = getStatusCodeToReturn(err);
  handleError(err, { statusCode });
  sendInternalServerError(req, res, statusCode);
});

if (!config.isVercel) {
  const server = app.listen(config.port, () => {
    log.info(`> Started on port ${config.port}`);
  });
  process.on("SIGTERM", () => gracefulShutdown(server));
}

export default app;

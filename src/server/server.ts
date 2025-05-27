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
import { matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import { Manifest, ManifestChunk, ViteDevServer } from "vite";
import { getCookie } from "@ndla/util";
import api from "./api";
import contentSecurityPolicy from "./contentSecurityPolicy";
import { RootRenderFunc, sendResponse } from "./serverHelpers";
import config from "../config";
import { NOT_FOUND_PAGE_PATH } from "../constants";
import { getLocaleInfoFromPath } from "../i18n";
import { privateRoutes, routes } from "../routes";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../statusCodes";
import { isAccessTokenValid } from "../util/authHelpers";
import handleError from "../util/handleError";
import { getRouteChunks } from "./getManifestChunks";
import { HttpError } from "./httpError";

const base = "/";
const isProduction = config.runtimeType === "production";

global.fetch = fetch;
const app = express();
const allowedBodyContentTypes = ["application/json", "application/x-www-form-urlencoded"];

app.disable("x-powered-by");
app.enable("trust proxy");

app.use((req, _, next) => {
  try {
    decodeURIComponent(req.url);
    next();
  } catch (e: any) {
    const error = new HttpError(`Invalid URL: ${req.url}`, BAD_REQUEST);
    next(error);
  }
});

let vite: ViteDevServer | undefined;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const sirv = (await import("sirv")).default;
  app.use(base, sirv(path.join(process.cwd(), "build", "public"), { extensions: [] }));
}

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: false,
  excludeRoutes: ["/health"],
});

app.use(metricsMiddleware);

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

let manifest: Manifest = {};

if (isProduction) {
  manifest = (await import(`../../build/public/.vite/manifest.json`)).default;
}

const renderRoute = async (req: Request, renderer: string, chunks: ManifestChunk[]) => {
  let render: RootRenderFunc;
  if (!isProduction) {
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
    render = (await import(`../../build/server/server.render.js`)).default;
  }

  const response = await render(req, renderer, chunks);
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

type RouteFunc = (req: Request) => Promise<{ data: any; status: number }>;

const handleRequest = async (req: Request, res: Response, next: NextFunction, route: RouteFunc) => {
  try {
    const { data, status } = await route(req);
    sendResponse(res, data, status);
  } catch (err) {
    next(err);
  }
};

const defaultRoute = async (req: Request) => renderRoute(req, "default", getRouteChunks(manifest, "default"));
const ltiRoute = async (req: Request) => renderRoute(req, "lti", getRouteChunks(manifest, "lti"));
const iframeEmbedRoute = async (req: Request) =>
  renderRoute(req, "iframeEmbed", getRouteChunks(manifest, "iframeEmbed"));
const iframeArticleRoute = async (req: Request) =>
  renderRoute(req, "iframeArticle", getRouteChunks(manifest, "iframeArticle"));

app.get(["/embed-iframe/:embedType/:embedId", "/embed-iframe/:lang/:embedType/:embedId"], async (req, res, next) => {
  handleRequest(req, res, next, iframeEmbedRoute);
});

const iframeArticleCallback = async (req: Request, res: Response, next: NextFunction) => {
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
  handleRequest(req, res, next, ltiRoute);
});

app.get(["/", "/*splat"], (req, res, next) => {
  const { basepath: path } = getLocaleInfoFromPath(req.path);
  const route = routes.find((r) => matchPath(r, path)); // match with routes used in frontend
  const isPrivate = privateRoutes.some((r) => matchPath(r, path));
  const feideCookie = getCookie("feide_auth", req.headers.cookie ?? "") ?? "";
  const feideToken = feideCookie ? JSON.parse(feideCookie) : undefined;
  const isTokenValid = !!feideToken && isAccessTokenValid(feideToken);
  const shouldRedirect = isPrivate && !isTokenValid;

  if (route && shouldRedirect) {
    return res.redirect(`/login?state=${req.path}`);
  }

  return handleRequest(req, res, next, defaultRoute);
});

const errorRoute = async (req: Request) => renderRoute(req, "error", getRouteChunks(manifest, "error"));

const getStatusCodeToReturn = (err?: Error): number => {
  if (err && "status" in err && typeof err.status === "number") {
    if (err.status >= 400 && err.status < 600) return err.status;
  }
  return INTERNAL_SERVER_ERROR;
};

async function sendInternalServerError(req: Request, res: Response, statusCode: number) {
  if (res.getHeader("Content-Type") === "application/json") {
    res.status(statusCode).json("Internal server error");
    return;
  }

  try {
    const { data } = await errorRoute(req);
    res.status(statusCode).send(data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Something went wrong when retrieving errorRoute.", e);
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
  handleError(err, req.path, { statusCode });
  sendInternalServerError(req, res, statusCode);
});

export default app;

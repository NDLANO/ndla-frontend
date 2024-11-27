/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fs from "fs/promises";
import { join } from "path";
import express, { NextFunction, Request, Response } from "express";
import promBundle from "express-prom-bundle";
import helmet from "helmet";
import { matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import { ViteDevServer } from "vite";
import { getCookie } from "@ndla/util";
import api from "./api";
import contentSecurityPolicy from "./contentSecurityPolicy";
import { RenderDataReturn, RootRenderFunc, sendResponse } from "./serverHelpers";
import config from "../config";
import { NOT_FOUND_PAGE_PATH } from "../constants";
import { getLocaleInfoFromPath } from "../i18n";
import { privateRoutes, routes } from "../routes";
import { INTERNAL_SERVER_ERROR } from "../statusCodes";
import { isAccessTokenValid } from "../util/authHelpers";
import handleError from "../util/handleError";

const base = "/";
const isProduction = config.runtimeType === "production";

global.fetch = fetch;
const app = express();
const allowedBodyContentTypes = ["application/json", "application/x-www-form-urlencoded"];

app.disable("x-powered-by");
app.enable("trust proxy");

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
  app.use(base, sirv("./build/public", { extensions: [] }));
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

const faviconEnvironment = config.ndlaEnvironment === "dev" ? "test" : config.ndlaEnvironment;
const favicons = `
  <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-${faviconEnvironment}-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-${faviconEnvironment}-16x16.png" />
  <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="/static/apple-touch-icon-${faviconEnvironment}.png" />
`;

const prepareTemplate = (template: string, renderData: RenderDataReturn["data"]) => {
  const { helmetContext, htmlContent, data } = renderData;
  const meta = `
  ${helmetContext?.helmet.title.toString() ?? ""}
  ${helmetContext?.helmet.meta.toString() ?? ""}
  ${helmetContext?.helmet.link.toString() ?? ""}
  ${favicons}
  ${helmetContext?.helmet.script.toString() ?? ""}
  `;

  const serializedData = serialize({
    ...data,
    config: {
      ...data?.config,
      isClient: true,
    },
  });

  const bodyContent = `
  <div id="root">${htmlContent}</div>
  <script type="text/javascript">
    window.DATA = ${serializedData}
  </script>
  `;

  const html = template
    .replace('data-html-attributes=""', helmetContext?.helmet.htmlAttributes.toString() ?? "")
    .replace("<!--HEAD-->", meta)
    .replace('data-body-attributes=""', helmetContext?.helmet.bodyAttributes.toString() ?? "")
    .replace("<!--BODY-->", bodyContent);

  return html;
};

const renderRoute = async (req: Request, index: string, htmlTemplate: string, renderer: string) => {
  const url = req.originalUrl.replace(base, "");
  let template = htmlTemplate;
  let render: RootRenderFunc;
  if (!isProduction) {
    // Always read fresh template in development
    template = await fs.readFile(index, "utf-8");
    template = await vite!.transformIndexHtml(url, template);

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

  const response = await render(req, renderer);
  if ("location" in response) {
    return {
      status: response.status,
      data: { Location: response.location },
    };
  } else {
    const html = prepareTemplate(template, response.data);
    return { status: response.status, data: html };
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

const templateHtml = isProduction
  ? await fs.readFile(join(process.cwd(), "build", "public", "index.html"), "utf-8")
  : "";

const ltiTemplateHtml = isProduction
  ? await fs.readFile(join(process.cwd(), "build", "public", "lti.html"), "utf-8")
  : "";

const iframeEmbedTemplateHtml = isProduction
  ? await fs.readFile(join(process.cwd(), "build", "public", "iframe-embed.html"), "utf-8")
  : "";

const iframeArticleTemplateHtml = isProduction
  ? await fs.readFile(join(process.cwd(), "build", "public", "iframe-article.html"), "utf-8")
  : "";

const errorTemplateHtml = isProduction
  ? await fs.readFile(join(process.cwd(), "build", "public", "error.html"), "utf-8")
  : "";

const defaultRoute = async (req: Request) => renderRoute(req, "index.html", templateHtml, "default");
const ltiRoute = async (req: Request) => renderRoute(req, "lti.html", ltiTemplateHtml, "lti");
const iframeEmbedRoute = async (req: Request) =>
  renderRoute(req, "iframe-embed.html", iframeEmbedTemplateHtml, "iframeEmbed");
const iframeArticleRoute = async (req: Request) =>
  renderRoute(req, "iframe-article.html", iframeArticleTemplateHtml, "iframeArticle");

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

const errorRoute = async (req: Request) => renderRoute(req, "error.html", errorTemplateHtml, "error");

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

const errorHandler = (err: Error, req: Request, res: Response) => {
  vite?.ssrFixStacktrace(err);
  const statusCode = getStatusCodeToReturn(err);
  handleError(err, req.path, { statusCode });
  sendInternalServerError(req, res, statusCode);
};

app.get("/*splat", (_req: Request, res: Response) => {
  res.redirect(NOT_FOUND_PAGE_PATH);
});
app.post("/*splat", (_req: Request, res: Response) => {
  res.redirect(NOT_FOUND_PAGE_PATH);
});

// NOTE: The error handler should be defined after all middlewares and routes
//       according to the express documentation
//       https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
app.use(errorHandler);

export default app;

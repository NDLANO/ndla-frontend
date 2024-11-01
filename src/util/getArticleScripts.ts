/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../config";
import { GQLArticle } from "../graphqlTypes";

export interface Scripts {
  key?: string;
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
}

export function getArticleScripts(
  article: Pick<GQLArticle, "requiredLibraries" | "transformedContent">,
  locale = "nb",
) {
  const scripts: Array<Scripts> =
    article.requiredLibraries?.map((lib) => ({
      src: lib.url,
      type: lib.mediaType,
    })) || [];
  if (article && article.transformedContent?.content.indexOf("<math") > -1 && config.isClient) {
    if (!window.MathJax) {
      window.MathJax = {
        chtml: {
          mathmlSpacing: false,
        },
        options: {
          enableMenu: true,
          menuOptions: {
            settings: {
              assistiveMml: false,
              collapsible: false,
              explorer: true,
            },
          },
          sre: {
            domain: "mathspeak",
            style: "sbrief",
            speech: "shallow",
            locale: locale,
            structure: false,
          },
        },
      };
    } else if (window.MathJax.options?.sre) {
      window.MathJax.options.sre.locale = locale;
    }

    scripts.push({
      src: "https://cdn.jsdelivr.net/npm/mathjax@4.0.0-beta.7/mml-chtml.js",
      type: "text/javascript",
      async: false,
      defer: true,
    });
  }

  if (article && article.transformedContent?.content.indexOf('data-resource="h5p"') > -1) {
    scripts.push({
      src: "https://ca.h5p.ndla.no/h5p-php-library/js/h5p-resizer.js",
      type: "text/javascript",
      async: false,
      defer: true,
    });
  }

  return scripts;
}

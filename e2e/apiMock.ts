/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Page } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'fs/promises';
const mockDir = 'e2e/apiMocks/';

interface MockRoute {
  page: Page;
  path: string | RegExp;
  fixture: string;
  overrideValue?: string | ((value: string) => string);
  status?: number;
  overrideRoute?: boolean;
}

const skipHttpMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];

export const mockRoute = async ({
  page,
  path,
  fixture,
  overrideValue,
  overrideRoute,
  status = 200,
}: MockRoute) => {
  if (overrideRoute) {
    await page.unroute(path);
  }

  return await page.route(path, async (route) => {
    if (process.env.RECORD_FIXTURES === 'true') {
      const text = skipHttpMethods.includes(route.request().method())
        ? ''
        : await (await route.fetch()).text();
      const override = overrideValue
        ? typeof overrideValue === 'string'
          ? overrideValue
          : overrideValue(text)
        : undefined;
      await mkdir(mockDir, { recursive: true });
      await writeFile(`${mockDir}${fixture}.json`, override ?? text, {
        flag: 'w',
      });
      return route.fulfill({ body: text, status });
    } else {
      try {
        const res = await readFile(`${mockDir}${fixture}.json`, 'utf8');
        return route.fulfill({ body: res, status });
      } catch (e) {
        route.abort();
      }
    }
  });
};

interface GraphqlMockRoute {
  page: Page;
  operationNames: string[];
  fixture: string;
  overrideRoute?: boolean;
}

export const mockGraphqlRoute = async ({
  page,
  operationNames,
  fixture,
  overrideRoute,
}: GraphqlMockRoute) => {
  if (overrideRoute) {
    await page.unroute('**/graphql-api/graphql');
  }

  return await page.route('**/graphql-api/graphql', async (route) => {
    if (process.env.RECORD_FIXTURES === 'true') {
      const body = await route.request().postDataJSON();
      const res = await route.fetch();
      if (operationNames.includes(body.operationName)) {
        await mkdir(mockDir, { recursive: true });
        await writeFile(
          `${mockDir}${fixture}_${body.operationName}.json`,
          await res.text(),
          {
            flag: 'w',
          },
        );
        return route.fulfill({
          contentType: 'application/json',
          body: await res.text(),
        });
      }
    } else {
      const body = await route.request().postDataJSON();
      if (operationNames.includes(body.operationName)) {
        try {
          const res = await readFile(
            `${mockDir}${fixture}_${body.operationName}.json`,
            'utf-8',
          );
          return route.fulfill({ contentType: 'application/json', body: res });
        } catch (e) {
          route.abort();
        }
      }
    }
  });
};

export const mockWaitResponse = async (page: Page, url: string) => {
  if (process.env.RECORD_FIXTURES === 'true') {
    await page.waitForResponse(url);
  }
};

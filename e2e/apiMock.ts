/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Page } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'fs/promises';
import isEqual from 'lodash/isEqual';
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
  operation: {
    names: string[];
    fixture: string;
  }[];
  overrideRoute?: boolean;
}

interface GQLBody {
  operationName: string;
  variables: Record<string, string>;
  query: string;
}

export const mockGraphqlRoute = async ({
  page,
  operation,
  overrideRoute,
}: GraphqlMockRoute) => {
  if (overrideRoute) {
    await page.unroute('**/graphql-api/graphql');
  }

  return await page.route('**/graphql-api/graphql', async (route) => {
    if (process.env.RECORD_FIXTURES === 'true') {
      const body: GQLBody[] | GQLBody = await route.request().postDataJSON();
      const resp = await route.fetch();
      const text = await resp.text();

      console.log(text, resp);

      const bodyOperationNames = Array.isArray(body)
        ? body.map((b) => b.operationName)
        : [body.operationName];

      const match = operation
        .filter((op) => isEqual(bodyOperationNames.sort(), op.names.sort()))
        .pop();
      console.log(match);
      if (match) {
        await mkdir(mockDir, { recursive: true });
        await writeFile(`${mockDir}${match.fixture}.json`, text, {
          flag: 'w',
        });
        return route.fulfill({
          body: text,
        });
      }
    } else {
      const body = await route.request().postDataJSON();
      const bodyOperationNames = Array.isArray(body)
        ? body.map((b) => b.operationName)
        : [body.operationName];

      const match = operation
        .filter((op) => isEqual(bodyOperationNames.sort(), op.names.sort()))
        .pop();

      if (match) {
        try {
          const res = await readFile(
            `${mockDir}${match.fixture}.json`,
            'utf-8',
          );
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: res,
          });
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

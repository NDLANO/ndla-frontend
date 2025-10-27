/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MemoryRouter, StaticRouter } from "react-router";
import { render } from "@testing-library/react";
import { RedirectContext } from "../RedirectContext";
import { RedirectExternal } from "../RedirectExternal";

test("External redirect for static router", () => {
  const context = {};
  render(
    <RedirectContext value={context}>
      <StaticRouter location="">
        <RedirectExternal to="https://google.com/" />
      </StaticRouter>
    </RedirectContext>,
  );

  expect(context).toEqual({
    url: "https://google.com/",
  });
});

test("External redirect for static router with basename", () => {
  const context = {};
  render(
    <RedirectContext value={context}>
      <StaticRouter basename="nb" location={"/nb"}>
        <RedirectExternal to="https://google.com/" />
      </StaticRouter>
    </RedirectContext>,
  );

  expect(context).toEqual({
    url: "https://google.com/",
  });
});

test("External redirect for (memory/dom) router", () => {
  // @ts-expect-error - This is a workaround
  delete window.location;
  const replace = vi.fn();
  // @ts-expect-error - This is a workaround
  window.location = { replace };

  render(
    <MemoryRouter basename="nb" initialEntries={["/nb"]}>
      <RedirectExternal to="https://google.com/" />
    </MemoryRouter>,
  );

  expect(replace).toHaveBeenCalledWith("https://google.com/");
});

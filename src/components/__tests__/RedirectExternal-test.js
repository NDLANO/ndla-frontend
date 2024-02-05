/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MemoryRouter } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server.js";
import { render } from "@testing-library/react";
import RedirectContext from "../RedirectContext";
import RedirectExternal from "../RedirectExternal";

test("External redirect for static router", () => {
  const context = {};
  render(
    <RedirectContext.Provider value={context}>
      <StaticRouter>
        <RedirectExternal to="https://google.com/" />
      </StaticRouter>
    </RedirectContext.Provider>,
  );

  expect(context).toEqual({
    url: "https://google.com/",
  });
});

test("External redirect for static router with basename", () => {
  const context = {};
  render(
    <RedirectContext.Provider value={context}>
      <StaticRouter basename="nb" location={"/nb"}>
        <RedirectExternal to="https://google.com/" />
      </StaticRouter>
    </RedirectContext.Provider>,
  );

  expect(context).toEqual({
    url: "https://google.com/",
  });
});

test("External redirect for (memory/dom) router", () => {
  const context = {};
  const replace = jest.fn();
  delete window.location;
  window.location = { replace };

  render(
    <MemoryRouter basename="nb" context={context} initialEntries={["/nb"]}>
      <RedirectExternal to="https://google.com/" />
    </MemoryRouter>,
  );

  expect(context).toEqual({});
  expect(replace).toHaveBeenCalledWith("https://google.com/");
});

/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "@testing-library/jest-dom/vitest";
import { ResizeObserver } from "@juggle/resize-observer";
import { cleanup } from "@testing-library/react";

beforeAll(() => {
  global.ResizeObserver = ResizeObserver;
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
});

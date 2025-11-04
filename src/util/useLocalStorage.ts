/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useSyncExternalStore } from "react";
import { log } from "./logger/logger";

// https://www.nico.fyi/blog/ssr-friendly-local-storage-react-custom-hook
export const useLocalStorage = (key: string, initialValue?: string | null) => {
  const data = useSyncExternalStore(
    (onChange) => {
      const onStorageEvent = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail.key === key) {
          onChange();
        }
      };
      window.addEventListener("storage", onChange);
      window.addEventListener("local-storage-change", onStorageEvent as EventListener);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("local-storage-change", onStorageEvent as EventListener);
      };
    },
    () => {
      try {
        const data = localStorage.getItem(key);
        return data || initialValue;
      } catch (e) {
        log.error(`Could not read ${key} from localStorage`);
        return initialValue;
      }
    },
    () => initialValue,
  );

  const setData = useCallback(
    (value: string) => {
      try {
        localStorage.setItem(key, value);
        window.dispatchEvent(new CustomEvent("local-storage-change", { detail: { key } }));
      } catch (e) {
        log.error(`Could not save ${key} to localStorage`);
      }
    },
    [key],
  );

  return [data, setData] as const;
};

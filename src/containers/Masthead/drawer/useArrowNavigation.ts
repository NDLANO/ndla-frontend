/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";

const ROOT_SELECTOR = '[role="menubar"], [role="tree"]';
const ITEM_SELECTOR = '[role="menuitem"], [role="treeitem"]';

const getItem = (activeElement: Element, direction: number) => {
  const elements = Array.from(activeElement.closest(ROOT_SELECTOR)?.querySelectorAll(ITEM_SELECTOR) ?? []);
  const index = elements.findIndex((el) => el === activeElement);

  return elements.at(index + direction);
};

interface ArrowNavigationConfig {
  initialFocused?: string;
  initialSelected?: string;
  onRightKeyPressed?: (id: string | undefined, e: KeyboardEvent) => void;
  onLeftKeyPressed?: (id: string | undefined, e: KeyboardEvent) => void;
  multilevel?: boolean;
}

const useArrowNavigation = (
  active: boolean,
  { initialFocused, initialSelected, onLeftKeyPressed, onRightKeyPressed, multilevel }: ArrowNavigationConfig,
) => {
  const [focused, _setFocused] = useState<string | undefined>(undefined);

  const setFocused = useCallback(
    (focus: string) => {
      if (focused && focus !== focused) {
        document.getElementById(focused)?.setAttribute("tabIndex", "-1");
      }
      _setFocused(focus);
    },
    [focused],
  );
  const arrowHandler = useCallback(
    (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const listElement = activeElement?.closest(ROOT_SELECTOR);
      if (!active || !activeElement || !listElement) {
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeElement.setAttribute("tabindex", "-1");
        const listItem = activeElement.closest('[data-list-item="true"]');

        const resourceGroup = activeElement?.closest('[data-resource-group="true"]');

        const element = multilevel
          ? getItem(activeElement, +1)
          : (listItem?.nextElementSibling ?? resourceGroup?.nextElementSibling)?.querySelector(ITEM_SELECTOR);

        if (element?.id) {
          setFocused(element.id);
        } else {
          const element = listElement.querySelector(ITEM_SELECTOR);
          if (element?.id) {
            setFocused(element.id);
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeElement.setAttribute("tabindex", "-1");

        const listItem = activeElement
          .closest('[data-list-item="true"')
          ?.previousElementSibling?.querySelector(ITEM_SELECTOR);

        const element = multilevel ? getItem(activeElement, -1) : listItem;

        if (element?.id) {
          setFocused(element.id);
        } else {
          const resourceGroup = activeElement?.closest('[data-resource-group="true"]')?.previousElementSibling;
          const elements = (resourceGroup ?? listElement).querySelectorAll(ITEM_SELECTOR);
          const element = elements[elements.length - 1];
          if (element?.id) {
            setFocused(element.id);
          }
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onLeftKeyPressed?.(document.activeElement?.id, e);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onRightKeyPressed?.(document.activeElement?.id, e);
      } else if (e.key === "Home") {
        const element = listElement.querySelector(ITEM_SELECTOR);
        if (element?.id) {
          setFocused(element.id);
        }
      } else if (e.key === "End") {
        const elements = listElement.querySelectorAll(ITEM_SELECTOR);
        const element = elements[elements.length - 1];
        if (element?.id) {
          setFocused(element.id);
        }
      }
    },
    [active, multilevel, setFocused, onLeftKeyPressed, onRightKeyPressed],
  );

  useEffect(() => {
    if (!focused && initialFocused) {
      setFocused(initialFocused);
    }
  }, [initialFocused, focused, setFocused]);

  useEffect(() => {
    if (initialSelected) {
      document.getElementById(initialSelected)?.setAttribute("tabindex", active ? "0" : "-1");
    }
  }, [initialSelected, active]);

  useEffect(() => {
    if (active && focused) {
      document.getElementById(focused)?.focus();
    }
  }, [active, focused]);

  useEffect(() => {
    if (focused) {
      document.getElementById(focused)?.setAttribute("tabindex", active ? "0" : "-1");
    }
  }, [active, focused]);

  useEffect(() => {
    window.addEventListener("keydown", arrowHandler);
    return () => window.removeEventListener("keydown", arrowHandler);
  }, [arrowHandler]);

  return { focused, setFocused };
};

export default useArrowNavigation;

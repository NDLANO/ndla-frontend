/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from 'react';

const useArrowNavigation = (
  active: boolean,
  initialFocused?: string,
  onRightKeyPressed?: (id: string | undefined, e: KeyboardEvent) => void,
  onLeftKeyPressed?: (id: string | undefined, e: KeyboardEvent) => void,
) => {
  const [focused, setFocused] = useState<string | undefined>(undefined);
  const arrowHandler = useCallback(
    (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const listElement = activeElement?.closest('[role="menubar"]');
      if (!active || !activeElement || !listElement) {
        return;
      }
      if (e.key === 'Home') {
        const element = listElement.querySelector('[role="menuitem"]');
        if (element?.id) {
          setFocused(element.id);
        }
      } else if (e.key === 'End') {
        const elements = listElement.querySelectorAll('[role="menuitem"]');
        const element = elements[elements.length - 1];
        if (element?.id) {
          setFocused(element.id);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeElement.setAttribute('tabindex', '-1');
        const listItem = activeElement.closest('[data-list-item="true"]');
        const resourceGroup = activeElement?.closest(
          '[data-resource-group="true"]',
        );
        const focusChild = (
          listItem?.nextElementSibling ?? resourceGroup?.nextElementSibling
        )?.querySelector('[role="menuitem"]');
        if (focusChild?.id) {
          setFocused(focusChild.id);
        } else {
          const element = listElement.querySelector('[role="menuitem"]');
          if (element?.id) {
            setFocused(element.id);
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeElement.setAttribute('tabindex', '-1');
        const listItem = activeElement
          .closest('[data-list-item="true"]')
          ?.previousElementSibling?.querySelector('[role="menuitem"]');
        if (listItem?.id) {
          setFocused(listItem.id);
        } else {
          const resourceGroup = activeElement?.closest(
            '[data-resource-group="true"]',
          )?.previousElementSibling;
          const elements = (resourceGroup ?? listElement).querySelectorAll(
            '[role="menuitem"]',
          );
          const element = elements[elements.length - 1];
          if (element?.id) {
            setFocused(element.id);
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onLeftKeyPressed?.(document.activeElement?.id, e);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onRightKeyPressed?.(document.activeElement?.id, e);
      }
    },
    [onLeftKeyPressed, onRightKeyPressed, active],
  );

  useEffect(() => {
    if (!focused && initialFocused) {
      setFocused(initialFocused);
    }
  }, [initialFocused, focused]);

  useEffect(() => {
    if (active && focused) {
      document.getElementById(focused)?.focus();
    }
  }, [active, focused]);

  useEffect(() => {
    if (focused) {
      document
        .getElementById(focused)
        ?.setAttribute('tabindex', active ? '0' : '-1');
    }
  }, [active, focused]);

  useEffect(() => {
    window.addEventListener('keydown', arrowHandler);
    return () => window.removeEventListener('keydown', arrowHandler);
  }, [arrowHandler]);

  return focused;
};

export default useArrowNavigation;

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
      const listElement = activeElement?.parentElement?.parentElement;
      if (!active || !activeElement || !listElement) {
        return;
      }
      if (e.key === 'Home') {
        const element = listElement?.firstElementChild?.firstElementChild;
        if (element) {
          setFocused(element.id!);
        }
      } else if (e.key === 'End') {
        const element = listElement?.lastElementChild?.firstElementChild;
        if (element) {
          setFocused(element.id!);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeElement.setAttribute('tabindex', '-1');
        const nextSibling =
          activeElement?.parentElement?.nextElementSibling?.firstElementChild;
        if (nextSibling) {
          setFocused(nextSibling.id!);
        } else {
          const firstElement = listElement.firstElementChild?.firstElementChild;
          if (firstElement) {
            setFocused(firstElement.id!);
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeElement.setAttribute('tabindex', '-1');
        const previousSibling =
          document.activeElement?.parentElement?.previousElementSibling
            ?.firstElementChild;
        if (previousSibling) {
          setFocused(previousSibling.id!);
        } else {
          const lastElement = listElement.lastElementChild?.firstElementChild;
          if (lastElement) {
            setFocused(lastElement.id!);
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

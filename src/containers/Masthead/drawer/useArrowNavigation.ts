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
      if (!active || !activeElement) {
        return;
      }
      if (e.key === 'Home') {
        const element =
          activeElement.parentElement?.parentElement?.firstElementChild
            ?.firstElementChild;
        if (element) {
          setFocused(element.id!);
        }
      } else if (e.key === 'End') {
        const element =
          activeElement.parentElement?.parentElement?.lastElementChild
            ?.firstElementChild;
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
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeElement.setAttribute('tabindex', '-1');
        const previousSibling =
          document.activeElement?.parentElement?.previousElementSibling
            ?.firstElementChild;
        if (previousSibling) {
          setFocused(previousSibling.id!);
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
    setFocused(initialFocused);
  }, [initialFocused]);

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

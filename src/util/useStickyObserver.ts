/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RefObject, useEffect, useState } from 'react';

const useStickyObserver = (
  rootRef: RefObject<HTMLElement>,
  targetRef: RefObject<HTMLElement>,
) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e?.intersectionRatio === 1),
      {
        root: rootRef.current,
        threshold: [1],
        rootMargin: `-1px 0px 0px 0px`,
      },
    );

    if (!target) {
      return;
    }
    observer.observe(target);
    return function() {
      observer.unobserve(target);
    };
  }, [rootRef, targetRef]);

  return { isSticky };
};

export default useStickyObserver;

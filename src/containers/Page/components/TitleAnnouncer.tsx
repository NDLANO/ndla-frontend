/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text } from "@ndla/primitives";
import { useEffect, useRef, useState } from "react";

export const TitleAnnouncer = () => {
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTitle = document.querySelector("title")?.textContent;
      if (newTitle) {
        setTitle(newTitle);
      }
    });

    observer.observe(document.head, { childList: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.location.hash.length) {
      titleRef.current?.focus();
    }
  }, [title]);

  return (
    <Text srOnly aria-live="assertive" tabIndex={-1} id="titleAnnouncer" ref={titleRef}>
      {title}
    </Text>
  );
};

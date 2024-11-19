/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Text } from "@ndla/primitives";

const TitleAnnouncer = () => {
  const [title, setTitle] = useState("");
  const prevTitle = useRef(title);
  const titleRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!!title && title !== prevTitle.current) {
      prevTitle.current = title;
      titleRef.current?.focus();
    }
  }, [title, titleRef]);

  return (
    <>
      <Text srOnly aria-live="assertive" tabIndex={-1} id="titleAnnouncer" ref={titleRef}>
        {title}
      </Text>
      <Helmet onChangeClientState={(state) => state.title && setTitle(state.title)} />
    </>
  );
};

export default TitleAnnouncer;

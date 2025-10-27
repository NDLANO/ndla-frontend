/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState } from "react";
import { Button } from "@ndla/primitives";

interface Props {
  stringToCopy: string;
  copyTitle: string;
  hasCopiedTitle: string;
  children?: ReactNode;
}

export const CopyTextButton = ({ stringToCopy, copyTitle, hasCopiedTitle, children }: Props) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(stringToCopy);
      setHasCopied(true);
    } catch (_) {
      setHasCopied(false);
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    if (hasCopied) {
      timeout = setTimeout(() => setHasCopied(!hasCopied), 10000);
    }
    return () => window.clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <span>
      <Button variant="secondary" disabled={hasCopied} onClick={handleClick} size="small">
        {children}
        {hasCopied ? hasCopiedTitle : copyTitle}
      </Button>
    </span>
  );
};

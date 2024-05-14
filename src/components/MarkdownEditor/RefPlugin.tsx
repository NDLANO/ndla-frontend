/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// Hacky solution to add a ref to the lexical contenteditable root.
// Taken from https://github.com/facebook/lexical/issues/3703#issuecomment-1856500840
export const RefPlugin = forwardRef<HTMLElement>((_props, ref) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerRootListener((root, _prevRoot) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(root);
      } else {
        throw new Error("non-callback ref not supported");
      }
    });
  }, [editor, ref]);

  return null;
});

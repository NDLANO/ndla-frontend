/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine } from "@ndla/icons/action";
import { DialogCloseTrigger, IconButton, IconButtonProps } from "@ndla/primitives";

export const DialogCloseButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, variant = "clear", ...props }, ref) => {
    const { t } = useTranslation();
    const content = children ?? <CloseLine />;
    const label = props["aria-label"] ?? t("close");

    return (
      <DialogCloseTrigger asChild>
        <IconButton ref={ref} variant={variant} {...props} aria-label={label} title={props["title"] ?? label}>
          {content}
        </IconButton>
      </DialogCloseTrigger>
    );
  },
);

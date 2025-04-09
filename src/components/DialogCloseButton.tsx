/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { type Ref } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine } from "@ndla/icons";
import { DialogCloseTrigger, IconButton, IconButtonProps } from "@ndla/primitives";

interface Props extends IconButtonProps {
  ref?: Ref<HTMLButtonElement>;
}

export const DialogCloseButton = ({ children, variant = "clear", ref, ...props }: Props) => {
  const { t } = useTranslation();
  const content = children ?? <CloseLine />;
  const label = props["aria-label"] ?? t("close");

  return (
    <DialogCloseTrigger ref={ref} asChild>
      <IconButton variant={variant} {...props} aria-label={label} title={props["title"] ?? label}>
        {content}
      </IconButton>
    </DialogCloseTrigger>
  );
};

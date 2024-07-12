/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Heart, HeartOutline } from "@ndla/icons/action";
import { IconButton, IconButtonProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledFavoriteButton = styled(IconButton, { base: { borderRadius: "100%" } });

export interface Props extends Omit<IconButtonProps, "children"> {
  isFavorite?: boolean;
}

const FavoriteButton = forwardRef<HTMLButtonElement, Props>(({ isFavorite, variant = "tertiary", ...props }, ref) => {
  const { t } = useTranslation();
  const labelModifier = isFavorite ? "added" : "add";
  const Icon = isFavorite ? Heart : HeartOutline;
  const ariaLabel = props["aria-label"] || t(`myNdla.resource.${labelModifier}ToMyNdla`);
  const title = props["title"] || t(`myNdla.resource.${labelModifier}ToMyNdla`);

  return (
    <StyledFavoriteButton variant={variant} ref={ref} {...props} aria-label={ariaLabel} title={title}>
      <Icon />
    </StyledFavoriteButton>
  );
});

export default FavoriteButton;

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

export interface Props extends Omit<IconButtonProps, "aria-label"> {
  isFavorite?: boolean;
}

const FavoriteButton = forwardRef<HTMLButtonElement, Props>(({ isFavorite, onClick }, ref) => {
  const { t } = useTranslation();
  const labelModifier = isFavorite ? "added" : "add";
  const Icon = isFavorite ? Heart : HeartOutline;
  return (
    <StyledFavoriteButton
      variant="tertiary"
      ref={ref}
      onClick={onClick}
      aria-label={t(`myNdla.resource.${labelModifier}ToMyNdla`)}
      title={t(`myNdla.resource.${labelModifier}ToMyNdla`)}
    >
      <Icon />
    </StyledFavoriteButton>
  );
});

export default FavoriteButton;

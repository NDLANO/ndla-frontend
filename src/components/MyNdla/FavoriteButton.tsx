/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { type Ref } from "react";
import { useTranslation } from "react-i18next";
import { HeartFill, HeartLine } from "@ndla/icons";
import { IconButton, IconButtonProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledFavoriteButton = styled(IconButton, { base: { borderRadius: "100%" } });

export interface Props extends Omit<IconButtonProps, "children"> {
  ref?: Ref<HTMLButtonElement>;
  isFavorite?: boolean;
}

const FavoriteButton = ({ isFavorite, variant = "tertiary", ...props }: Props) => {
  const { t } = useTranslation();
  const labelModifier = isFavorite ? "added" : "add";
  const Icon = isFavorite ? HeartFill : HeartLine;
  const ariaLabel = props["aria-label"] || t(`myNdla.resource.${labelModifier}ToMyNdla`);
  const title = props["title"] || t(`myNdla.resource.${labelModifier}ToMyNdla`);

  return (
    <StyledFavoriteButton variant={variant} {...props} aria-label={ariaLabel} title={title}>
      <Icon />
    </StyledFavoriteButton>
  );
};

export default FavoriteButton;

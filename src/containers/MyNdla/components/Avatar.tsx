/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

type AvatarProps = {
  myProfile?: boolean;
  displayName: string | undefined;
  profilePicture: string | undefined;
  rest?: Record<string, any>;
};

const StyledAvatarContainer = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    backgroundColor: "surface.default",
    border: "2px solid",
    borderColor: "stroke.default",
    borderRadius: "full",
    flexShrink: "0",
    height: "xxlarge",
    justifyContent: "center",
    minWidth: "xxlarge",
  },
  variants: {
    variant: {
      small: {},
      big: {
        height: "250px",
        width: "250px",
        borderWidth: "4px",
        "& p": {
          fontSize: "98px",
        },
      },
    },
  },
});

const UserPersonalPicture = styled("img", {
  base: {
    aspectRatio: "1/1",
    borderRadius: "full",
    height: "100%",
    width: "100%",
  },
});

// a function to split up displayName, get the initials of first and last names and merge them
export const getFirstLastInitials = (userName: string | undefined) => {
  return userName
    ?.split(" ")
    .map((value, index, array) => (index === 0 || index + 1 === array.length ? value.at(0) : null))
    .join("");
};

const Avatar = ({ myProfile, displayName, profilePicture, ...rest }: AvatarProps) => {
  const { t } = useTranslation();
  const initials = useMemo(() => getFirstLastInitials(displayName), [displayName]);

  return (
    <StyledAvatarContainer data-myprofile={myProfile} variant={myProfile ? "big" : "small"} {...rest}>
      {profilePicture ? (
        <UserPersonalPicture src={profilePicture} alt={t("myNdla.userPictureAltText")} />
      ) : (
        <Text color="text.strong" fontWeight="bold" data-myprofile={myProfile}>
          {initials}
        </Text>
      )}
    </StyledAvatarContainer>
  );
};

export default Avatar;

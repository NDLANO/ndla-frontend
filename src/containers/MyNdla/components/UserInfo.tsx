/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GQLMyNdlaPersonalDataFragmentFragment } from "../../../graphqlTypes";

interface Props {
  user: GQLMyNdlaPersonalDataFragmentFragment | undefined;
}

const StyledComponentContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const ShortInfoDiv = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
    maxWidth: "surface.xlarge",
  },
});

const StyledUl = styled("ul", {
  base: {
    paddingInlineStart: "xlarge",
    paddingBlockEnd: "xxsmall",
  },
});

export const UserInfo = ({ user }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledComponentContainer>
      {
        <Text>
          {t("user.loggedInAs", {
            role: t(`user.role.${user?.role}`),
          })}
        </Text>
      }
      <ShortInfoDiv>
        <Text>
          {t("user.username")}: {user?.username}
        </Text>{" "}
        <Text>
          {t("user.name")}: {user?.displayName}
        </Text>
        <Text>
          {t("user.mail")}: {user?.email}
        </Text>
      </ShortInfoDiv>
      <StyledUl>
        {user?.groups.map((org) => (
          <Text key={org.id} asChild consumeCss>
            <li>{`${org.displayName}${org.isPrimarySchool ? ` (${t("user.primarySchool")})` : ""}`}</li>
          </Text>
        ))}
      </StyledUl>
    </StyledComponentContainer>
  );
};

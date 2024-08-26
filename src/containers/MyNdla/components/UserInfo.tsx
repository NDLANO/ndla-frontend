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
    listStyleType: "unset",
  },
});

const UserInfoWrapper = styled("span", {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "4xsmall",
  },
});

const ShortInfoLine = ({ label, value }: { label: string; value?: string }) => (
  <UserInfoWrapper>
    <Text textStyle="body.large">
      <strong>{label}:</strong>
    </Text>
    <Text textStyle="body.large">{value}</Text>
  </UserInfoWrapper>
);

export const UserInfo = ({ user }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledComponentContainer>
      {
        <Text textStyle="body.large">
          {t("user.loggedInAs", {
            role: t(`user.role.${user?.role}`),
          })}
        </Text>
      }
      <ShortInfoDiv>
        <ShortInfoLine label={t("user.name")} value={user?.displayName} />
        <ShortInfoLine label={t("user.username")} value={user?.username} />
        <ShortInfoLine label={t("user.mail")} value={user?.email} />
      </ShortInfoDiv>
      <StyledUl>
        {user?.groups.map((org) => (
          <Text key={org.id} textStyle="body.large" asChild consumeCss>
            <li>{`${org.displayName}${org.isPrimarySchool ? ` (${t("user.primarySchool")})` : ""}`}</li>
          </Text>
        ))}
      </StyledUl>
    </StyledComponentContainer>
  );
};

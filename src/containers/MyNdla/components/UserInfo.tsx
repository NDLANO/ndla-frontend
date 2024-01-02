/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Text } from "@ndla/typography";
import { UnOrderedList } from "@ndla/ui";
import { GQLMyNdlaPersonalDataFragmentFragment } from "../../../graphqlTypes";

interface Props {
  user: GQLMyNdlaPersonalDataFragmentFragment | undefined;
}

const StyledComponentContainer = styled.div`
  max-width: 700px;
`;

const ShortInfoDiv = styled.div`
  margin: ${spacing.normal} auto;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
`;

export const UserInfo = ({ user }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledComponentContainer>
      {
        <Text element="p" textStyle="content-alt" margin="none">
          {t("user.loggedInAs", {
            role: t(`user.role.${user?.role}`),
          })}
        </Text>
      }
      <ShortInfoDiv>
        <Text element="p" textStyle="content-alt" margin="none">
          {t("user.username")}: {user?.username}
        </Text>
        <Text element="p" textStyle="content-alt" margin="none">
          {t("user.name")}: {user?.displayName}
        </Text>
        <Text element="p" textStyle="content-alt" margin="none">
          {t("user.mail")}: {user?.email}
        </Text>
      </ShortInfoDiv>
      <UnOrderedList>
        {user?.groups.map((org) => (
          <Text element="li" textStyle="content-alt" margin="none" key={org.id}>
            {`${org.displayName}${org.isPrimarySchool ? ` (${t("user.primarySchool")})` : ""}`}
          </Text>
        ))}
      </UnOrderedList>
    </StyledComponentContainer>
  );
};

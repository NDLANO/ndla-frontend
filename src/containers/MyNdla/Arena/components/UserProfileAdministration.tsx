/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { CheckboxItem, FormControl, Label } from "@ndla/forms";
import { Heading } from "@ndla/typography";
import { AuthContext, isArenaModerator } from "../../../../components/AuthenticationContext";
import config from "../../../../config";
import { useUpdateOtherUser } from "../../arenaMutations";

interface Props {
  userToAdmin:
    | {
        id?: number;
        displayName?: string;
        groups?: string[];
      }
    | undefined;
}

const getNewGroups = (newIsModerator: boolean, oldGroups: string[]): string[] => {
  if (newIsModerator) return [...new Set([...oldGroups, "ADMIN"])];

  return oldGroups.filter((g) => g !== "ADMIN");
};

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

const UserProfileAdministration = ({ userToAdmin }: Props) => {
  const { t } = useTranslation();
  const { user: currentUser } = useContext(AuthContext);
  const isModerator = isArenaModerator(userToAdmin?.groups);
  const [updateUser] = useUpdateOtherUser();

  if (!currentUser?.isModerator || !userToAdmin || config.enableNodeBB) return null;

  return (
    <>
      <Heading element="h2" headingStyle="h2" margin="normal">
        {`${t("myNdla.arena.admin.administrate")} ${userToAdmin?.displayName}`}
      </Heading>
      <SettingsWrapper>
        <FormControl id="adminForm">
          <CheckboxWrapper>
            <CheckboxItem
              disabled={userToAdmin.id === currentUser.id}
              checked={isModerator}
              onCheckedChange={() => {
                if (!userToAdmin.id || !userToAdmin.groups) return;
                updateUser({
                  variables: {
                    userId: userToAdmin.id,
                    user: {
                      arenaGroups: getNewGroups(!isModerator, userToAdmin?.groups),
                    },
                  },
                });
              }}
            />
            <Label textStyle="label-small" margin="none">
              {t(`myNdla.arena.admin.users.selectAdministrator`, {
                user: userToAdmin.displayName,
              })}
            </Label>
          </CheckboxWrapper>
        </FormControl>
      </SettingsWrapper>
    </>
  );
};

export default UserProfileAdministration;

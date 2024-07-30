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
import { Done } from "@ndla/icons/editor";
import { CheckboxControl, CheckboxHiddenInput, CheckboxIndicator, CheckboxLabel, CheckboxRoot } from "@ndla/primitives";
import { Heading } from "@ndla/typography";
import { AuthContext, isArenaModerator } from "../../../../components/AuthenticationContext";
import { useToast } from "../../../../components/ToastContext";
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

const UserProfileAdministration = ({ userToAdmin }: Props) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { user: currentUser } = useContext(AuthContext);
  const isModerator = isArenaModerator(userToAdmin?.groups);
  const [updateUser] = useUpdateOtherUser();

  if (!currentUser?.isModerator || !userToAdmin || config.enableNodeBB) return null;

  const onCheckedChange = async () => {
    if (!userToAdmin.id || !userToAdmin.groups) return;
    const newGroups = getNewGroups(!isModerator, userToAdmin?.groups);
    const becameAdmin = newGroups.includes(config.arenaAdminGroup);
    await updateUser({
      variables: {
        userId: userToAdmin.id,
        user: {
          arenaGroups: newGroups,
        },
      },
    });
    toast.create({
      title: t("myNdla.arena.userUpdated"),
      description: becameAdmin
        ? t("myNdla.arena.admin.users.becameAdmin", { user: userToAdmin?.displayName })
        : t("myNdla.arena.admin.users.becameNormalUser", { user: userToAdmin?.displayName }),
    });
  };

  return (
    <>
      <Heading element="h2" headingStyle="h2" margin="normal">
        {`${t("myNdla.arena.admin.administrate")} ${userToAdmin?.displayName}`}
      </Heading>
      <SettingsWrapper>
        <CheckboxRoot
          onCheckedChange={onCheckedChange}
          checked={isModerator}
          disabled={userToAdmin.id === currentUser.id}
        >
          <CheckboxControl>
            <CheckboxIndicator asChild>
              <Done />
            </CheckboxIndicator>
          </CheckboxControl>
          <CheckboxLabel>
            {t(`myNdla.arena.admin.users.selectAdministrator`, {
              user: userToAdmin.displayName,
            })}
          </CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRoot>
      </SettingsWrapper>
    </>
  );
};

export default UserProfileAdministration;

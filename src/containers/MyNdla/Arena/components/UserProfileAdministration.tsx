/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons/editor";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
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

const SettingsWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

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
      <Heading asChild consumeCss textStyle="title.medium">
        <h2>{`${t("myNdla.arena.admin.administrate")} ${userToAdmin?.displayName}`}</h2>
      </Heading>
      <SettingsWrapper>
        <CheckboxRoot
          onCheckedChange={onCheckedChange}
          checked={isModerator}
          disabled={userToAdmin.id === currentUser.id}
        >
          <CheckboxControl>
            <CheckboxIndicator asChild>
              <CheckLine />
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

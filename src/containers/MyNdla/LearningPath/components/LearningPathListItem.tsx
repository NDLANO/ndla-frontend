/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Cross, DeleteBinLine, PencilLine } from "@ndla/icons/action";
import { ArrowRightLine, ExternalLinkLine, PersonOutlined, ShareArrow } from "@ndla/icons/common";
import { LearningPath } from "@ndla/icons/contentType";
import { CheckLine } from "@ndla/icons/editor";
import { ListItemContent, ListItemRoot, Text } from "@ndla/primitives";
import { HStack, styled, VStack } from "@ndla/styled-system/jsx";
import { LearningPathDeleteDialogContent } from "./LearningPathDeleteDialogContent";
import { LearningPathShareDialogContent } from "./LearningPathShareDialogContent";
import { copyLearningPathSharingLink } from "./utils";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import { GQLLearningpathFragmentFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import SettingsMenu, { MenuItemProps } from "../../components/SettingsMenu";

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const updateLearningPathStatus = async ({ variables }: { variables: { learningpathId: number; status: string } }) => {};
const deleteLearningPath = async ({ variables }: { variables: { learningpathId: number } }) => {};

interface Props {
  learningPath: GQLLearningpathFragmentFragment;
  showMenu: Boolean;
}
export const LearningPathListItem = ({ learningPath, showMenu = true }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const isShared = learningPath.status === "shared";

  const menuItems = useMemo(() => {
    const onDeleteLearningPath = async () => {
      await deleteLearningPath({ variables: { learningpathId: learningPath.id } });
      toast.create({
        title: t("myNdla.folder.folderDeleted", {
          folderName: learningPath.title,
        }),
      });
    };

    const edit: MenuItemProps = {
      type: "link",
      text: t("myndla.learningpath.menu.edit"),
      link: "",
      value: "editLearningPath",
      icon: <PencilLine />,
    };

    const del: MenuItemProps = {
      type: "dialog",
      text: t("myndla.learningpath.menu.delete"),
      value: "deleteLearningPath",
      icon: <DeleteBinLine />,
      modalContent: (close) => (
        <LearningPathDeleteDialogContent
          learningPath={learningPath}
          onClose={close}
          onDelete={async () => {
            await onDeleteLearningPath();
            close();
          }}
        />
      ),
    };

    const share: MenuItemProps = {
      type: "dialog",
      text: t("myndla.learningpath.menu.share"),
      value: "shareLearningPath",
      icon: <ShareArrow />,
      modalContent: (close) => (
        <LearningPathShareDialogContent
          learningPath={learningPath}
          onClose={close}
          onCopyText={() => copyLearningPathSharingLink(learningPath.id)}
        />
      ),
      onClick: isShared
        ? () => {
            updateLearningPathStatus({
              variables: {
                learningpathId: learningPath.id,
                status: "shared",
              },
            });
          }
        : undefined,
    };
    const unShare: MenuItemProps = {
      type: "action",
      text: t("myndla.learningpath.menu.unShare"),
      value: "unShareLearningPath",
      icon: <Cross />,
      onClick: () => {
        updateLearningPathStatus({
          variables: {
            learningpathId: learningPath.id,
            status: "private",
          },
        });
        toast.create({
          title: t("myNdla.learningpath.sharing.unshared", { title: learningPath.title }),
        });
      },
    };

    const preview: MenuItemProps = {
      type: "link",
      text: t("myndla.learningpath.menu.goTo"),
      value: "goToLearningPath",
      icon: <ArrowRightLine />,
      link: routes.learningPath(learningPath.id),
      onClick: () => {
        navigate(routes.learningPath(learningPath.id));
      },
    };

    const link: MenuItemProps = {
      type: "action",
      text: t("myndla.learningpath.menu.copy"),
      icon: <ExternalLinkLine />,
      value: "copyLearningPathLink",
      onClick: () => {
        navigator.clipboard.writeText(`${config.ndlaFrontendDomain}/learningpath/${learningPath.id}`);
        toast.create({
          title: t("myNdla.resource.linkCopied"),
        });
      },
    };

    if (learningPath.status === "shared") {
      return [edit, preview, link, unShare, del];
    }
    return [edit, share, del];
  }, [isShared, learningPath, navigate, t, toast]);

  return (
    <StyledListItemRoot>
      <LearningPath />
      <ListItemContent>
        <VStack>
          <Text>{learningPath.title}</Text>
          <Text textStyle="label.small" color="text.subtle">
            {t("myndla.learningpath.createShared")}
          </Text>
        </VStack>
        <HStack>
          {learningPath.status === "published" && (
            <Text>
              <PersonOutlined />
              {t("myndla.learningpath.status.delt")}
            </Text>
          )}
          {learningPath.status === "private" && (
            <Text>
              <PencilLine />
              {t("myndla.learningpath.status.delt")}
            </Text>
          )}
          {learningPath.status === "ready_for_sharing" && (
            <Text>
              <CheckLine />
              {t("myndla.learningpath.status.delt")}
            </Text>
          )}
          {showMenu ? <SettingsMenu menuItems={menuItems} /> : null}
        </HStack>
      </ListItemContent>
    </StyledListItemRoot>
  );
};

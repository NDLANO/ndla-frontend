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
import { PencilLine, DeleteBinLine, CloseLine } from "@ndla/icons/action";
import { Share, ArrowRightLine, ExternalLinkLine } from "@ndla/icons/common";
import { LearningPathDeleteDialogContent } from "./LearningPathDeleteDialogContent";
import { LearningPathShareDialogContent } from "./LearningPathShareDialogContent";
import { copyLearningPathSharingLink } from "./utils";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import { GQLLearningpathFragmentFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { MenuItemProps } from "../../components/SettingsMenu";

const updateLearningPathStatus = async ({ variables }: { variables: { learningpathId: number; status: string } }) => {};
const deleteLearningPath = async ({ variables }: { variables: { learningpathId: number } }) => {};

export const useLearningPathActionHooks = (learningPath: GQLLearningpathFragmentFragment) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isShared = learningPath.status === "shared";

  const actionItems: MenuItemProps[] = useMemo(() => {
    const edit: MenuItemProps = {
      type: "link",
      text: t("myNdla.learningpath.menu.edit"),
      link: "",
      value: "editLearningPath",
      icon: <PencilLine />,
    };

    const del: MenuItemProps = {
      type: "dialog",
      text: t("myNdla.learningpath.menu.delete"),
      value: "deleteLearningPath",
      icon: <DeleteBinLine />,
      modalContent: (close) => (
        <LearningPathDeleteDialogContent
          learningPath={learningPath}
          onClose={close}
          onDelete={async () => {
            await deleteLearningPath({ variables: { learningpathId: learningPath.id } });
            toast.create({
              title: t("myNdla.learningpath.toast.deleted", {
                folderName: learningPath.title,
              }),
            });
            close();
          }}
        />
      ),
    };

    const share: MenuItemProps = {
      type: "dialog",
      text: t("myNdla.learningpath.menu.share"),
      value: "shareLearningPath",
      icon: <Share />,
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
      text: t("myNdla.learningpath.menu.unShare"),
      value: "unShareLearningPath",
      icon: <CloseLine />,
      onClick: () => {
        updateLearningPathStatus({
          variables: {
            learningpathId: learningPath.id,
            status: "private",
          },
        });
        toast.create({
          title: t("myNdla.learningpath.toast.unshared", { name: learningPath.title }),
        });
      },
    };

    const preview: MenuItemProps = {
      type: "link",
      text: t("myNdla.learningpath.menu.goTo"),
      value: "goToLearningPath",
      icon: <ArrowRightLine />,
      link: routes.learningPath(learningPath.id),
      onClick: () => {
        navigate(routes.learningPath(learningPath.id));
      },
    };

    const link: MenuItemProps = {
      type: "action",
      text: t("myNdla.learningpath.menu.copy"),
      icon: <ExternalLinkLine />,
      value: "copyLearningPathLink",
      onClick: () => {
        navigator.clipboard.writeText(`${config.ndlaFrontendDomain}/learningpath/${learningPath.id}`);
        toast.create({
          title: t("myNdla.resource.linkCopied"),
        });
      },
    };

    if (learningPath.status === "published") {
      return [edit, preview, link, unShare, del];
    }

    return [edit, share, del];
  }, [isShared, learningPath, navigate, t, toast]);
  return actionItems;
};

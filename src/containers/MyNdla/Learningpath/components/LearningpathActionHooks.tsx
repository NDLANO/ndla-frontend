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
import { PencilLine, DeleteBinLine, CloseLine, AddLine } from "@ndla/icons/action";
import { Share, ArrowRightLine, ExternalLinkLine } from "@ndla/icons/common";
import { LearningpathDeleteDialogContent } from "./LearningpathDeleteDialogContent";
import { LearningpathShareDialogContent } from "./LearningpathShareDialogContent";
import { copyLearningpathSharingLink } from "./utils";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import { GQLLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { MenuItemProps } from "../../components/SettingsMenu";
import { useDeleteLearningpath, useUpdateLearningpathStatus } from "../../learningpathQueries";

export const useLearningpathActionHooks = (learningPath?: GQLLearningpathFragment) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { updateLearningpathStatus } = useUpdateLearningpathStatus();
  const { deleteLearningpath } = useDeleteLearningpath();

  const isShared = learningPath?.status === "shared";

  const actionItems: MenuItemProps[] = useMemo(() => {
    const newLp: MenuItemProps = {
      type: "link",
      link: routes.myNdla.learningpathNew,
      icon: <AddLine />,
      text: t("myNdla.learningpath.menu.new"),
      value: t("myNdla.learningpath.menu.new"),
    };

    if (!learningPath) {
      return [newLp];
    }

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
      variant: "destructive",
      icon: <DeleteBinLine />,
      modalContent: (close) => (
        <LearningpathDeleteDialogContent
          learningPath={learningPath}
          onClose={close}
          onDelete={async () => {
            if (!learningPath) return;
            await deleteLearningpath({ variables: { id: learningPath?.id } });
            toast.create({
              title: t("myNdla.learningpath.toast.deleted", {
                name: learningPath.title,
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
        <LearningpathShareDialogContent
          learningPath={learningPath}
          onClose={close}
          onCopyText={() => copyLearningpathSharingLink(learningPath.id)}
        />
      ),
      onClick: !isShared
        ? () => {
            updateLearningpathStatus({
              variables: {
                id: learningPath.id,
                status: "UNLISTED",
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
        updateLearningpathStatus({
          variables: {
            id: learningPath.id,
            status: "PRIVATE",
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

    if (learningPath.status === "UNLISTED") {
      return [edit, preview, link, unShare, del];
    }
    return [edit, share, del];
  }, [deleteLearningpath, isShared, learningPath, navigate, t, toast, updateLearningpathStatus]);
  return actionItems;
};

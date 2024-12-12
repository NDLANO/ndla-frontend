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
import {
  PencilLine,
  DeleteBinLine,
  CloseLine,
  AddLine,
  ArrowRightLine,
  ExternalLinkLine,
  ShareLine,
} from "@ndla/icons";
import { LearningpathDeleteDialogContent } from "./LearningpathDeleteDialogContent";
import { LearningpathShareDialogContent } from "./LearningpathShareDialogContent";
import { copyLearningpathSharingLink, LEARNINGPATH_READY_FOR_SHARING, LEARNINGPATH_SHARED } from "./utils";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { routes, toLearningPath } from "../../../../routeHelpers";
import { MenuItemProps } from "../../components/SettingsMenu";
import { useUpdateLearningpathStatus, useDeleteLearningpath } from "../learningpathMutations";

export const useLearningpathActionHooks = (learningpath?: GQLMyNdlaLearningpathFragment) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [updateLearningpathStatus] = useUpdateLearningpathStatus();
  const [onDeleteLearningpath] = useDeleteLearningpath();

  const actionItems: MenuItemProps[] = useMemo(() => {
    if (!learningpath) {
      const newLearningpath: MenuItemProps = {
        type: "link",
        link: routes.myNdla.learningpathNew,
        icon: <AddLine />,
        text: t("myNdla.learningpath.menu.new"),
        value: t("myNdla.learningpath.menu.new"),
      };

      return [newLearningpath];
    }

    const editLearningpath: MenuItemProps = {
      type: "link",
      text: t("myNdla.learningpath.menu.edit"),
      link: routes.myNdla.learningpathEdit(learningpath.id),
      value: "editLearningPath",
      icon: <PencilLine />,
    };

    const deleteLearningpath: MenuItemProps = {
      type: "dialog",
      text: t("myNdla.learningpath.menu.delete"),
      value: "deleteLearningPath",
      variant: "destructive",
      icon: <DeleteBinLine />,
      modalContent: (close) => (
        <LearningpathDeleteDialogContent
          learningpath={learningpath}
          onClose={close}
          onDelete={async () => {
            const res = await onDeleteLearningpath({ variables: { id: learningpath.id } });
            // TODO: Better error handling https://github.com/NDLANO/Issues/issues/4242
            if (res.errors?.length === 0) {
              toast.create({
                title: t("myNdla.learningpath.toast.deleted", {
                  name: learningpath.title,
                }),
              });
              close();
            }
          }}
        />
      ),
    };

    const isShared = learningpath?.status === LEARNINGPATH_SHARED;

    const shareLearningpath: MenuItemProps = {
      type: "dialog",
      text: t("myNdla.learningpath.menu.share"),
      value: "shareLearningPath",
      icon: <ShareLine />,
      modalContent: (close) => (
        <LearningpathShareDialogContent
          learningpath={learningpath}
          onClose={close}
          onCopyText={() => copyLearningpathSharingLink(learningpath.id)}
        />
      ),
      onClick: !isShared
        ? async () => {
            const res = await updateLearningpathStatus({
              variables: {
                id: learningpath.id,
                status: LEARNINGPATH_SHARED,
              },
            });

            // TODO: Better error handling https://github.com/NDLANO/Issues/issues/4242
            if (res.errors?.length === 0) {
              toast.create({
                title: t("myNdla.learningpath.toast.shared"),
              });
            }
          }
        : undefined,
    };

    const unShareLearningpath: MenuItemProps = {
      type: "action",
      text: t("myNdla.learningpath.menu.unShare"),
      value: "unShareLearningPath",
      icon: <CloseLine />,
      onClick: async () => {
        // TODO: Better error handling https://github.com/NDLANO/Issues/issues/4242
        await updateLearningpathStatus({
          variables: {
            id: learningpath.id,
            status: LEARNINGPATH_READY_FOR_SHARING,
          },
        });
        toast.create({
          title: t("myNdla.learningpath.toast.unshared", { name: learningpath.title }),
        });
      },
    };

    const previewLearningpath: MenuItemProps = {
      type: "link",
      text: t("myNdla.learningpath.menu.goTo"),
      value: "goToLearningPath",
      icon: <ArrowRightLine />,
      link: routes.learningpath(learningpath.id),
      onClick: () => {
        navigate(routes.learningpath(learningpath.id));
      },
    };

    const linkLearningpath: MenuItemProps = {
      type: "action",
      text: t("myNdla.learningpath.menu.copy"),
      icon: <ExternalLinkLine />,
      value: "copyLearningPathLink",
      onClick: () => {
        navigator.clipboard.writeText(toLearningPath(learningpath.id));
        toast.create({
          title: t("myNdla.resource.linkCopied"),
        });
      },
    };

    if (learningpath.status === LEARNINGPATH_SHARED) {
      return [
        editLearningpath,
        shareLearningpath,
        previewLearningpath,
        linkLearningpath,
        unShareLearningpath,
        deleteLearningpath,
      ];
    }

    return [editLearningpath, shareLearningpath, deleteLearningpath];
  }, [onDeleteLearningpath, learningpath, navigate, t, toast, updateLearningpathStatus]);

  return actionItems;
};
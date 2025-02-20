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
import { PencilLine, DeleteBinLine, CloseLine, AddLine, ArrowRightLine, ShareLine, FileCopyLine } from "@ndla/icons";
import { LearningpathDeleteDialogContent } from "./LearningpathDeleteDialogContent";
import { LearningpathShareDialogContent } from "./LearningpathShareDialogContent";
import { useToast } from "../../../../components/ToastContext";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { MenuItemProps } from "../../components/SettingsMenu";
import { useUpdateLearningpathStatus, useDeleteLearningpath } from "../learningpathMutations";
import { myLearningpathQuery } from "../learningpathQueries";
import { copyLearningpathSharingLink, LEARNINGPATH_READY_FOR_SHARING, LEARNINGPATH_SHARED } from "../utils";

export const useLearningpathActionHooks = (
  learningpaths?: GQLMyNdlaLearningpathFragment[],
  selectedLearningpath?: GQLMyNdlaLearningpathFragment,
) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [updateLearningpathStatus] = useUpdateLearningpathStatus();
  const [onDeleteLearningpath] = useDeleteLearningpath();

  const actionItems: MenuItemProps[] = useMemo(() => {
    if (!selectedLearningpath) {
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
      link: routes.myNdla.learningpathEditSteps(selectedLearningpath.id),
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
          learningpath={selectedLearningpath}
          onClose={close}
          onDelete={async () => {
            const res = await onDeleteLearningpath({
              variables: { id: selectedLearningpath.id },
              refetchQueries: [{ query: myLearningpathQuery }],
            });
            // TODO: Better error handling https://github.com/NDLANO/Issues/issues/4242
            if (!res.errors?.length) {
              close();
              toast.create({
                title: t("myNdla.learningpath.toast.deleted", {
                  name: selectedLearningpath.title,
                }),
              });

              const learningpathIndex = learningpaths?.findIndex(({ id }) => id === selectedLearningpath.id) ?? -1;
              const nextLearningpath = learningpaths?.[learningpathIndex + 1] ?? learningpaths?.[learningpathIndex - 1];

              if (nextLearningpath) {
                setTimeout(
                  () =>
                    document
                      .getElementById(`learningpath-listitem-${nextLearningpath.id}`)
                      ?.getElementsByTagName("a")?.[0]
                      ?.focus(),
                  1,
                );
              } else {
                setTimeout(() => document.getElementById(SKIP_TO_CONTENT_ID)?.focus(), 1);
              }
            }
          }}
        />
      ),
    };

    const isShared = selectedLearningpath?.status === LEARNINGPATH_SHARED;

    const shareLearningpath: MenuItemProps = {
      type: "dialog",
      text: t("myNdla.learningpath.menu.share"),
      value: "shareLearningPath",
      icon: <ShareLine />,
      modalContent: (close) => (
        <LearningpathShareDialogContent
          learningpath={selectedLearningpath}
          onClose={close}
          onCopyText={() => copyLearningpathSharingLink(selectedLearningpath.id)}
        />
      ),
      onClick: !isShared
        ? async () => {
            const res = await updateLearningpathStatus({
              variables: {
                id: selectedLearningpath.id,
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
            id: selectedLearningpath.id,
            status: LEARNINGPATH_READY_FOR_SHARING,
          },
        });
        toast.create({
          title: t("myNdla.learningpath.toast.unshared", { name: selectedLearningpath.title }),
        });
      },
    };

    const previewLearningpath: MenuItemProps = {
      type: "link",
      text: t("myNdla.learningpath.menu.goTo"),
      value: "goToLearningPath",
      icon: <ArrowRightLine />,
      link: routes.learningpath(selectedLearningpath.id),
      onClick: () => {
        navigate(routes.learningpath(selectedLearningpath.id));
      },
    };

    const linkLearningpath: MenuItemProps = {
      type: "action",
      text: t("myNdla.learningpath.menu.copy"),
      icon: <FileCopyLine />,
      value: "copyLearningPathLink",
      onClick: () => {
        copyLearningpathSharingLink(selectedLearningpath.id);
        toast.create({
          title: t("myNdla.resource.linkCopied"),
        });
      },
    };

    if (selectedLearningpath.status === LEARNINGPATH_SHARED) {
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
  }, [selectedLearningpath, t, onDeleteLearningpath, toast, learningpaths, updateLearningpathStatus, navigate]);

  return actionItems;
};

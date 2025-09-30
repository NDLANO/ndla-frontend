/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDialogContext } from "@ark-ui/react";
import { FileCopyLine } from "@ndla/icons";
import { DialogContent, DialogHeader, DialogTitle, DialogBody, Button, DialogFooter, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { GQLLearningpath_LearningpathFragment, GQLMyNdlaPersonalDataFragmentFragment } from "../../../graphqlTypes";
import { useCopyLearningpathMutation } from "../../../mutations/learningpathMutations";
import { routes } from "../../../routeHelpers";
import { AuthContext } from "../../AuthenticationContext";
import { DialogCloseButton } from "../../DialogCloseButton";
import LoginModalContent from "../../MyNdla/LoginModalContent";
import { useToast } from "../../ToastContext";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
}

const CopyLearningPathDialogContent = ({ learningpath }: Props) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { authenticated, user } = useContext(AuthContext);
  const { setOpen } = useDialogContext();

  const [copyLearningPath] = useCopyLearningpathMutation();

  const onError = () => toast.create({ title: t("myNdla.learningpath.copy.error") });

  const onCopyLearningPath = async (user: GQLMyNdlaPersonalDataFragmentFragment) => {
    try {
      const contributors = [
        {
          type: "writer",
          name: user.displayName,
        },
      ];
      const res = await copyLearningPath({
        variables: {
          learningpathId: learningpath.id,
          params: {
            title: `${learningpath.title}_Kopi`,
            language: i18n.language,
            copyright: { license: { license: learningpath.copyright.license.license }, contributors },
          },
        },
      });
      if (!res.errors) {
        toast.create({
          title: t("myNdla.learningpath.copy.success.title"),
          description: (
            <div>
              {t("myNdla.learningpath.copy.success.description")}
              <SafeLink to={routes.myNdla.learningpath}>{`"${t("myNdla.learningpath.title")}"`}</SafeLink>
            </div>
          ),
        });
        setOpen(false);
      } else {
        onError();
      }
    } catch (err) {
      onError();
    }
  };

  if (authenticated && user) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("myNdla.learningpath.copy.title")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Text>{t("myNdla.learningpath.copy.description")}</Text>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => onCopyLearningPath(user)}>
            <FileCopyLine />
            {t("myNdla.learningpath.copy.button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <LoginModalContent
      title={t("myNdla.learningpath.copy.loginCopyPitch")}
      loginIngress={t("myNdla.learningpath.copy.description")}
    />
  );
};

export default CopyLearningPathDialogContent;

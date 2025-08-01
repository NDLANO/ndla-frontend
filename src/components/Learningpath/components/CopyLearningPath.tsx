/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileCopyLine } from "@ndla/icons";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  IconButton,
  DialogTitle,
  DialogBody,
  Button,
  DialogFooter,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { GQLLearningpath_LearningpathFragment, GQLMyNdlaPersonalDataFragmentFragment } from "../../../graphqlTypes";
import { useCopyLearningpathMutation } from "../../../mutations/learningpathMutations";
import { routes } from "../../../routeHelpers";
import { AuthContext } from "../../AuthenticationContext";
import { DialogCloseButton } from "../../DialogCloseButton";
import LoginModalContent from "../../MyNdla/LoginModalContent";
import { useToast } from "../../ToastContext";

const StyledFileCopyLine = styled(FileCopyLine, {
  base: {
    fill: "icon.strong",
  },
});

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
}

const CopyLearningPath = ({ learningpath }: Props) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const { authenticated, user } = useContext(AuthContext);

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
      if (!res.errors?.length) {
        setOpen(false);
        toast.create({
          title: t("myNdla.learningpath.copy.success.title"),
          description: (
            <div>
              {t("myNdla.learningpath.copy.success.description")}
              <SafeLink to={routes.myNdla.learningpath}>{`"${t("myNdla.learningpath.title")}"`}</SafeLink>
            </div>
          ),
        });
      } else {
        onError();
      }
    } catch (err) {
      onError();
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <IconButton
          title={t("myNdla.learningpath.copy.title")}
          aria-label={t("myNdla.learningpath.copy.title")}
          variant="tertiary"
        >
          <StyledFileCopyLine />
        </IconButton>
      </DialogTrigger>
      {authenticated && user ? (
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
      ) : (
        <LoginModalContent
          title={t("myNdla.learningpath.copy.loginCopyPitch")}
          loginIngress={t("myNdla.learningpath.copy.description")}
        />
      )}
    </DialogRoot>
  );
};

export default CopyLearningPath;

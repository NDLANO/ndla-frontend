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
import { styled } from "@ndla/styled-system/jsx";
import { useCopyLearningpathMutation } from "../../../containers/MyNdla/Learningpath/learningpathMutations";
import { GQLLearningpath_LearningpathFragment } from "../../../graphqlTypes";
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
  const { authenticated } = useContext(AuthContext);

  const [copyLearningPath] = useCopyLearningpathMutation();

  const onCopyLearningPath = async () => {
    try {
      await copyLearningPath({
        variables: {
          learningpathId: learningpath.id,
          params: { title: `${learningpath.title}_Kopi`, language: i18n.language },
        },
      });
      setOpen(false);
      toast.create({ title: t("myNdla.learningpath.copy.success") });
    } catch (err) {
      toast.create({ title: t("myNdla.learningpath.copy.error") });
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
      {authenticated ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myNdla.learningpath.copy.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <Text>{t("myNdla.learningpath.copy.description")}</Text>
          </DialogBody>
          <DialogFooter>
            <Button onClick={onCopyLearningPath}>
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

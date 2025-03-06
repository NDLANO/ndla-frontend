/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FileCopyLine } from "@ndla/icons";
import { Button, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { copyLearningpathSharingLink, sharedLearningpathLink } from "../utils";

const GapWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const CopyLinkButton = styled(Button, {
  base: {
    justifyContent: "space-between",
    overflowWrap: "anywhere",
  },
});

interface Props {
  learningpath: GQLMyNdlaLearningpathFragment;
}

export const LearningpathShareLink = ({ learningpath }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <>
      <Text>{t("myNdla.learningpath.sharing.description.shared")}</Text>
      <Text>{t("myNdla.learningpath.sharing.description.private")}</Text>
      <GapWrapper>
        <Text textStyle="label.medium" fontWeight="bold" asChild consumeCss>
          <span>{t("myNdla.learningpath.sharing.description.copy")}</span>
        </Text>
        <CopyLinkButton
          aria-label={t("myNdla.learningpath.sharing.link")}
          title={t("myNdla.learningpath.sharing.link")}
          variant="secondary"
          onClick={() => {
            copyLearningpathSharingLink(learningpath.id);
            toast.create({
              title: t("myNdla.learningpath.sharing.copied"),
            });
          }}
        >
          {sharedLearningpathLink(learningpath.id)}
          <FileCopyLine />
        </CopyLinkButton>
      </GapWrapper>
    </>
  );
};

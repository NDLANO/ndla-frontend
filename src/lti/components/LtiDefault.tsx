/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import config from "../../config";
import { fetchArticleOembed } from "../../containers/ArticlePage/articleApi";
import { LtiItem } from "../../interfaces";

const BreakableCode = styled("code", {
  base: {
    wordBreak: "break-word",
  },
});

const StyledButton = styled(Button, {
  base: {
    position: "relative",
  },
});

interface Props {
  item: LtiItem;
}
const LtiDefault = ({ item }: Props) => {
  const [embedCode, setEmbedCode] = useState("");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const onOpenChange = useCallback(
    async (open: boolean) => {
      if (!open) {
        setOpen(false);
        setEmbedCode("");
      } else {
        const oembed = await fetchArticleOembed(`${config.ndlaFrontendDomain}${item.url}`);
        setEmbedCode(oembed.html);
        setOpen(true);
      }
    },
    [item.url],
  );

  return (
    <DialogRoot open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <DialogTrigger asChild>
        <StyledButton variant="primary">{t("lti.embed")}</StyledButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("lti.unsupportedDialogTitle")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Text>{t("lti.notSupported")}</Text>
          <pre>
            <BreakableCode>{embedCode}</BreakableCode>
          </pre>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default LtiDefault;

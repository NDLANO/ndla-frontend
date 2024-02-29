/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTrigger } from "@ndla/modal";
import config from "../../config";
import { fetchArticleOembed } from "../../containers/ArticlePage/articleApi";
import { LtiItem } from "../../interfaces";

const MarginLeftParagraph = styled.p`
  margin-left: 26px;
`;

const CodeWithBreakWord = styled.code`
  word-break: break-word;
`;

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
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalTrigger>
        <ButtonV2>{t("lti.embed")}</ButtonV2>
      </ModalTrigger>
      <ModalContent size="normal">
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <MarginLeftParagraph>{t("lti.notSupported")}</MarginLeftParagraph>
          <pre>
            <CodeWithBreakWord>{embedCode}</CodeWithBreakWord>
          </pre>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LtiDefault;

/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { transform } from "@ndla/article-converter";
import { AccessibilityFill } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@ndla/primitives";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GQLDisclaimer_ArticleFragment } from "../graphqlTypes";
import { DialogCloseButton } from "./DialogCloseButton";

interface Props {
  article: GQLDisclaimer_ArticleFragment;
}

export const Disclaimer = ({ article }: Props) => {
  const { t } = useTranslation();

  const transformedDisclaimer = useMemo(() => {
    return transform(article.transformedDisclaimer.content, {});
  }, [article.transformedDisclaimer.content]);

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="secondary" size="small">
          {t("uuDisclaimer.title")}
          <AccessibilityFill />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("uuDisclaimer.title")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <div>{transformedDisclaimer}</div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

Disclaimer.fragments = {
  article: gql`
    fragment Disclaimer_Article on Article {
      id
      transformedDisclaimer {
        content
      }
    }
  `,
};

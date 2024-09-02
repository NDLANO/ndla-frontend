/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import {
  Button,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectRootProps,
  SelectTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { supportedLanguages } from "../i18n";
import { LocaleType } from "../interfaces";

const LanguageSelectTrigger = styled(SelectTrigger, {
  base: {
    width: "unset",
  },
});

export const LanguageSelector = (props: SelectRootProps<LocaleType>) => {
  const { t, i18n } = useTranslation();
  return (
    <SelectRoot {...props} value={[i18n.language]} itemToString={(item) => t(`languages.${item}`)}>
      <SelectLabel srOnly>{t("languages.prefixChangeLanguage")}</SelectLabel>
      <LanguageSelectTrigger asChild>
        <Button variant="tertiary">
          {t("languages.prefixChangeLanguage")} <ArrowDownShortLine />
        </Button>
      </LanguageSelectTrigger>
      <SelectPositioner>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang} item={lang}>
              <SelectItemText>{t(`languages.${lang}`)}</SelectItemText>
              <SelectItemIndicator>
                <CheckLine />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
};

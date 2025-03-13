/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { ArrowDownShortLine, CheckLine } from "@ndla/icons";
import {
  Button,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectRootProps,
  SelectTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { preferredLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";

const LanguageSelectTrigger = styled(SelectTrigger, {
  base: {
    width: "unset",
  },
});

interface Props extends Omit<SelectRootProps<LocaleType>, "collection"> {
  languages: LocaleType[];
}

export const LanguageSelectorSelect = ({ languages, ...props }: Props) => {
  const { t, i18n } = useTranslation();

  const collection = useMemo(
    () => createListCollection({ items: languages, itemToString: (item) => t(`languages.${item}`) }),
    [languages, t],
  );

  return (
    <SelectRoot {...props} value={[i18n.language]} collection={collection}>
      <SelectLabel srOnly>{t("languages.prefixChangeLanguage")}</SelectLabel>
      <LanguageSelectTrigger asChild>
        <Button variant="tertiary">
          {t("languages.prefixChangeLanguage")} <ArrowDownShortLine />
        </Button>
      </LanguageSelectTrigger>
      <SelectContent>
        {preferredLanguages.map((lang) => (
          <SelectItem key={lang} item={lang}>
            <SelectItemText>{t(`languages.${lang}`)}</SelectItemText>
            <SelectItemIndicator>
              <CheckLine />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
      <SelectHiddenSelect />
    </SelectRoot>
  );
};

/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ChevronDown } from "@ndla/icons/common";
import { Done } from "@ndla/icons/editor";
import {
  Button,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectRoot,
  SelectRootProps,
  SelectTrigger,
} from "@ndla/primitives";
import { supportedLanguages } from "../i18n";
import { LocaleType } from "../interfaces";

const LanguageButton = styled(Button)`
  width: unset;
`;

// TODO: This should probably be a Menu.

export const LanguageSelector = (props: SelectRootProps<LocaleType>) => {
  const { t, i18n } = useTranslation();
  return (
    <SelectRoot {...props} value={[i18n.language]} itemToString={(item) => t(`languages.${item}`)}>
      <SelectTrigger asChild>
        <LanguageButton variant="tertiary">
          {t("languages.prefixChangeLanguage")} <ChevronDown />
        </LanguageButton>
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang} item={lang}>
              <SelectItemText>{t(`languages.${lang}`)}</SelectItemText>
              <SelectItemIndicator>
                <Done />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
};

/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Heading,
} from "@ndla/primitives";
import { FilterContainer } from "./FilterContainer";
import { DialogCloseButton } from "../../components/DialogCloseButton";

export const SubjectFilter = () => {
  const { t } = useTranslation();
  return (
    <FilterContainer>
      <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
        {/* TODO: i18n */}
        <h3>Sorter på fag</h3>
      </Heading>
      <DialogRoot>
        <DialogTrigger asChild>
          {/* TODO: i18n */}
          <Button variant="secondary">Velg fag</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogBody>
            <DialogHeader>
              <DialogTitle>{t("searchPage.searchFilterMessages.filterLabel")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </FilterContainer>
  );
};

/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ArrowDownShortLine } from "@ndla/icons";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import ImageLicenseList from "./ImageLicenseList";
import { GQLImageLicenseList_ImageLicenseFragment } from "../../graphqlTypes";

type Props = {
  imageLicenses: GQLImageLicenseList_ImageLicenseFragment[];
};

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    marginBlockStart: "3xlarge",
    width: "2/3",
  },
});

export const ImageLicenseAccordion = ({ imageLicenses }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledAccordionRoot multiple>
      <AccordionItem value={"rulesForUse"}>
        <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
          <h2>
            <AccordionItemTrigger>
              {t("article.useContent")}
              <AccordionItemIndicator asChild>
                <ArrowDownShortLine />
              </AccordionItemIndicator>
            </AccordionItemTrigger>
          </h2>
        </Heading>
        <AccordionItemContent>
          <ImageLicenseList images={imageLicenses} />
        </AccordionItemContent>
      </AccordionItem>
    </StyledAccordionRoot>
  );
};

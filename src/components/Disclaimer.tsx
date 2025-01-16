/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { transform } from "@ndla/article-converter";
import { AccessibilityFill } from "@ndla/icons";
import { Button, PopoverContent, PopoverRoot, PopoverTrigger } from "@ndla/primitives";
import { GQLTransformedDisclaimerContent } from "../graphqlTypes";

interface Props {
  disclaimer: GQLTransformedDisclaimerContent;
}

const Disclaimer = ({ disclaimer }: Props) => {
  const { t } = useTranslation();

  const transformedDisclaimer = useMemo(() => {
    return transform(disclaimer.content, {});
  }, [disclaimer]);

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="small">
          {t("uuDisclaimer.title")}
          <AccessibilityFill />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>{transformedDisclaimer}</div>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default Disclaimer;

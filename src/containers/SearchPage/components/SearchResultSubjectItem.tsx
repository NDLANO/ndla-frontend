/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CardContent, CardHeading, CardRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew } from "@ndla/ui";
import { SubjectItem } from "../SearchInnerPage";

const FullHeightListElement = styled("li", { base: { height: "100%", minHeight: "75" } });
const FullheightCardRoot = styled(CardRoot, { base: { height: "100%" } });

interface Props {
  item: SubjectItem;
}

const SearchResultSubjectItem = ({ item }: Props) => {
  const { t } = useTranslation();

  return (
    <FullHeightListElement>
      <FullheightCardRoot>
        <CardContent>
          <ContentTypeBadgeNew contentType="subject">{t("contentTypes.subject")}</ContentTypeBadgeNew>
          <CardHeading>
            <SafeLink to={item.url} unstyled css={linkOverlay.raw()}>
              {item.title}
            </SafeLink>
          </CardHeading>
        </CardContent>
      </FullheightCardRoot>
    </FullHeightListElement>
  );
};

export default SearchResultSubjectItem;

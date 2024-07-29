/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { stackOrder } from "@ndla/core";
import { CardContent, CardHeading, CardImage, CardRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew } from "@ndla/ui";
import { SearchItem } from "../searchHelpers";

interface Props {
  item: SearchItem;
  type: string;
}
const LtiWrapper = styled.div`
  z-index: ${stackOrder.offsetSingle};
  display: flex;
  flex-direction: column;
`;

const SearchResultItem = ({ item, type }: Props) => {
  const { t } = useTranslation();
  const contentType = type === "topic-article" ? "topic" : type;

  return (
    <li>
      <CardRoot>
        {item.img && <CardImage alt={item.img.alt} height={200} src={item.img.url} />}
        <CardContent>
          <ContentTypeBadgeNew contentType={contentType}>{t(`contentTypes.${contentType}`)}</ContentTypeBadgeNew>
          <CardHeading>
            <SafeLink to={item.url} unstyled css={linkOverlay.raw()}>
              {item.title}
            </SafeLink>
          </CardHeading>
          <Text>{parse(item.ingress)}</Text>
        </CardContent>
      </CardRoot>
      <LtiWrapper>{item.children}</LtiWrapper>
    </li>
  );
};

export default SearchResultItem;

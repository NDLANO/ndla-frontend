/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { mq, breakpoints, spacing, fonts, misc } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Heading } from "@ndla/typography";

interface Props {
  items: {
    id: string;
    title: string;
    url: string;
    img?: { url: string };
  }[];
}

const Container = styled.div`
  display: grid;
  gap: ${spacing.normal};
  grid-template-columns: repeat(1, 1fr);
  ${mq.range({ from: breakpoints.tablet })} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${mq.range({ from: breakpoints.desktop })} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ItemWrapper = styled.div`
  background: #deebf6;
  padding: ${spacing.normal} ${spacing.medium};
  border-radius: ${misc.borderRadius};
  height: 150px;
  background-repeat: no-repeat;
  background-repeat: no-repeat;
  background-position-y: 100%;
  background-position-x: 100%;
  background-size: auto 100px;
  background-image: var(--background-image);
  a {
    font-weight: ${fonts.weight.semibold};
  }
`;

const ItemHeading = styled(Heading)`
  margin: ${spacing.small} 0px;
  font-weight: ${fonts.weight.semibold};
`;

const SearchSubjectResult = ({ items }: Props) => {
  const { t } = useTranslation();
  return (
    <Container>
      {items.map((item) => (
        <ItemWrapper key={item.id} style={{ "--background-image": `url(${item.img?.url ?? ""})` } as CSSProperties}>
          <ItemHeading element="h2" headingStyle="h4">
            {item.title}
          </ItemHeading>
          <SafeLink to={item.url}>{t("searchPage.resultType.toSubjectPageLabel")}</SafeLink>
        </ItemWrapper>
      ))}
    </Container>
  );
};

export default SearchSubjectResult;

/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { styled } from "@ndla/styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    // TODO: Figure out if we want to remove this margin. It's only here to add some gap between the article content and the byline.
    marginBlockStart: "medium",
    paddingBlockStart: "xsmall",
    borderTop: "1px solid",
    borderColor: "stroke.subtle",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    width: "100%",
    justifyContent: "space-between",
    paddingBlock: "xsmall",
    textStyle: "body.medium",
    '& [data-contributors="false"]': {
      marginInlineStart: "auto",
    },
  },
});

type AuthorProps = {
  name: string;
};

type Props = {
  authors?: AuthorProps[];
};

const renderContributors = (contributors: AuthorProps[], t: TFunction) => {
  const contributorsArray = contributors.map((contributor, index) => {
    if (index < 1) return contributor.name;
    const sep = index === contributors.length - 1 ? ` ${t("article.conjunction")} ` : ", ";
    return `${sep}${contributor.name}`;
  });
  return contributorsArray.join("");
};

export const ExternalStepByline = ({ authors = [] }: Props) => {
  const { t } = useTranslation();

  const showPrimaryContributors = authors.length > 0;

  return (
    <Wrapper>
      <TextWrapper>
        {!!showPrimaryContributors && (
          <span>
            {authors.length > 0 &&
              `${t("learningPath.externalStepAuthorsLabel", {
                names: renderContributors(authors, t),
                interpolation: { escapeValue: false },
              })}. `}
          </span>
        )}
      </TextWrapper>
    </Wrapper>
  );
};

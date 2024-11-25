/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import FavoriteSubject from "../../components/FavoriteSubject";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import { GQLTaxBase } from "../../graphqlTypes";

const SubjectLinkWrapper = styled("li", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "small",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: { color: "text.default", textDecoration: "underline", _hover: { textDecoration: "none" } },
});

interface Props {
  subject: GQLTaxBase;
  favorites: string[] | undefined;
  className?: string;
}

const SubjectLink = ({ subject, favorites, className }: Props) => {
  const enablePrettyUrls = useEnablePrettyUrls();
  const to = enablePrettyUrls ? subject.url : subject.path;
  return (
    <SubjectLinkWrapper className={className}>
      <FavoriteSubject
        node={subject}
        favorites={favorites}
        subjectLinkOrText={<StyledSafeLink to={to || ""}>{subject.name}</StyledSafeLink>}
      />
      <StyledSafeLink to={to || ""}>{subject.name}</StyledSafeLink>
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;

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
import { GQLAllSubjects_SubjectFragment } from "../../graphqlTypes";

const SubjectLinkWrapper = styled("li", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "small",
  },
});

// TODO: Remove/update this custom SafeLink styling?
const StyledSafeLink = styled(SafeLink, {
  base: { color: "text.default", textDecoration: "underline", _hover: { textDecoration: "none" } },
});

interface Props {
  subject: GQLAllSubjects_SubjectFragment;
  favorites: string[] | undefined;
  className?: string;
}

const SubjectLink = ({ subject, favorites, className }: Props) => {
  const enablePrettyUrls = useEnablePrettyUrls();
  return (
    <SubjectLinkWrapper className={className}>
      <FavoriteSubject
        subject={subject}
        favorites={favorites}
        subjectLinkOrText={<StyledSafeLink to={enablePrettyUrls ? subject.url : subject.path}>{subject.name}</StyledSafeLink>}
      />
      <StyledSafeLink to={enablePrettyUrls ? subject.url : subject.path}>{subject.name}</StyledSafeLink>
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;

/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { GQLSubjectLinks_SubjectPageFragment } from "../../graphqlTypes";

const LinksWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledText = styled(Text, {
  base: {
    alignItems: "center",
    "& > *:not(:first-child)": {
      marginInlineStart: "xxsmall",
    },
  },
});

type SubjectLinkItem = {
  name?: string;
  url?: string;
};

interface SubjectLinkSetProps {
  set: string;
  subjects: SubjectLinkItem[];
  title: string;
}

export const SubjectLinkSet = ({ set, subjects, title }: SubjectLinkSetProps) => {
  const { t } = useTranslation();

  return (
    <StyledText textStyle="label.medium">
      <b>{title}:</b>
      {subjects.map((subject, index) => {
        return (
          <StyledText textStyle="body.link" key={`${set}-${index}`} asChild consumeCss>
            <span>
              {subject.url ? (
                <SafeLink to={subject.url}>
                  {subject.name}
                  {index < subjects.length - 2 ? "," : null}
                </SafeLink>
              ) : (
                <span>
                  {subject.name}
                  {index < subjects.length - 2 ? "," : null}
                </span>
              )}
              {index === subjects.length - 2 && <span>{t("article.conjunction")}</span>}
            </span>
          </StyledText>
        );
      })}
    </StyledText>
  );
};

interface SubjectLinksProps extends GQLSubjectLinks_SubjectPageFragment {}

const SubjectLinks = ({ buildsOn, connectedTo, leadsTo }: SubjectLinksProps) => {
  const { t } = useTranslation();
  if (!connectedTo.length && !buildsOn.length && !leadsTo.length) return null;
  return (
    <LinksWrapper>
      {!!connectedTo.length && (
        <SubjectLinkSet set="connectedTo" subjects={connectedTo} title={t("subjectFrontPage.connectedTo")} />
      )}
      {!!buildsOn.length && (
        <SubjectLinkSet set="buildsOn" subjects={buildsOn} title={t("subjectFrontPage.buildsOn")} />
      )}
      {!!leadsTo.length && <SubjectLinkSet set="leadsTo" subjects={leadsTo} title={t("subjectFrontPage.leadsTo")} />}
    </LinksWrapper>
  );
};

SubjectLinks.fragments = {
  subjectPage: gql`
    fragment SubjectLinks_SubjectPage on SubjectPage {
      buildsOn {
        name
        url
      }
      connectedTo {
        name
        url
      }
      leadsTo {
        name
        url
      }
    }
  `,
};

export default SubjectLinks;

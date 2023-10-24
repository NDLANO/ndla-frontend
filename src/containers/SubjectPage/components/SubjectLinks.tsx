/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const LinksContainer = styled.div`
  margin-bottom: ${spacing.medium};
`;

const StyledLink = styled.a`
  margin-left: ${spacing.xsmall};
`;

type SubjectLinkItem = {
  name?: string;
  path?: string;
};

type SubjectLinkSetProps = {
  subjects: SubjectLinkItem[];
  title: string;
};

type SubjectLinksProps = {
  buildsOn: SubjectLinkItem[];
  connectedTo: SubjectLinkItem[];
  leadsTo: SubjectLinkItem[];
};

const SubjectLinkSet = ({ subjects, title }: SubjectLinkSetProps) => {
  return (
    <div>
      <span>{title}:</span>
      {subjects.map((subject) => (
        <StyledLink href={subject.path}>{subject.name}</StyledLink>
      ))}
    </div>
  );
};

const SubjectLinks = ({
  buildsOn,
  connectedTo,
  leadsTo,
}: SubjectLinksProps) => {
  const { t } = useTranslation();
  return (
    <LinksContainer>
      {connectedTo.length > 0 ? (
        <SubjectLinkSet
          subjects={connectedTo}
          title={t('subjects.connectedTo')}
        />
      ) : null}
      {buildsOn.length > 0 ? (
        <SubjectLinkSet subjects={buildsOn} title={t('subjects.buildsOn')} />
      ) : null}
      {leadsTo.length > 0 ? (
        <SubjectLinkSet subjects={leadsTo} title={t('subjects.leadsTo')} />
      ) : null}
    </LinksContainer>
  );
};

SubjectLinks.fragments = {
  links: gql`
    fragment SubjectLinks_Subject on SubjectPage {
      buildsOn {
        path
        name
      }
      connectedTo {
        path
        name
      }
      leadsTo {
        path
        name
      }
    }
  `,
};

export default SubjectLinks;

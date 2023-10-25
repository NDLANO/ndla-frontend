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

const ComponentRoot = styled.div`
  margin-bottom: ${spacing.medium};
`;

const StyledLink = styled.a`
  white-space: wrap;
`;

const LinkElement = styled.span`
  display: inline-block;
  margin-right: ${spacing.small};
`;

const LinkSetTitle = styled.span`
  margin-right: ${spacing.small};
`;

type SubjectLinkItem = {
  name?: string;
  path?: string;
};

type SubjectLinkSetProps = {
  set: string;
  subjects: SubjectLinkItem[];
  title: string;
};

type SubjectLinksProps = {
  buildsOn: SubjectLinkItem[];
  connectedTo: SubjectLinkItem[];
  leadsTo: SubjectLinkItem[];
};

const SubjectLinkSet = ({ set, subjects, title }: SubjectLinkSetProps) => {
  return (
    <div>
      <LinkSetTitle>{title}:</LinkSetTitle>
      {subjects.map((subject, index) => (
        <LinkElement key={`${set}-${index}`}>
          <StyledLink href={subject.path}>{subject.name}</StyledLink>
          {index < subjects.length - 1 && ','}
        </LinkElement>
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
    <ComponentRoot>
      {connectedTo.length > 0 ? (
        <SubjectLinkSet
          set={'connectedTo'}
          subjects={connectedTo}
          title={t('subjects.connectedTo')}
        />
      ) : null}
      {buildsOn.length > 0 ? (
        <SubjectLinkSet
          set={'buildsOn'}
          subjects={buildsOn}
          title={t('subjects.buildsOn')}
        />
      ) : null}
      {leadsTo.length > 0 ? (
        <SubjectLinkSet
          set={'leadsTo'}
          subjects={leadsTo}
          title={t('subjects.leadsTo')}
        />
      ) : null}
    </ComponentRoot>
  );
};

SubjectLinks.fragments = {
  links: gql`
    fragment SubjectLinks_Subject on SubjectPage {
      buildsOn {
        name
        path
      }
      connectedTo {
        name
        path
      }
      leadsTo {
        name
        path
      }
    }
  `,
};

export default SubjectLinks;

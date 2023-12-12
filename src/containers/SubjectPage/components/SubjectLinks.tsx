/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';

const ComponentRoot = styled.ul`
  margin-bottom: ${spacing.medium};
  list-style: none;
`;

const SubComponentRoot = styled.li`
  margin: 0;
`;

const LinkElement = styled.span`
  display: inline-block;
  margin-right: ${spacing.xsmall};
`;

const LinkSetTitle = styled.span`
  font-weight: 600;
  margin-right: ${spacing.xsmall};
`;

const Conjunction = styled.span`
  margin-right: ${spacing.xsmall};
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
  const { t } = useTranslation();

  return (
    <SubComponentRoot>
      <LinkSetTitle>{title}:</LinkSetTitle>
      {subjects.map((subject, index) => (
        <Fragment key={`${set}-${index}`}>
          <LinkElement>
            {subject.path ? (
              <SafeLink to={subject.path}>{subject.name}</SafeLink>
            ) : (
              <span>{subject.name}</span>
            )}

            {index < subjects.length - 2 && ','}
          </LinkElement>
          {index === subjects.length - 2 && (
            <Conjunction>{t('article.conjunction')}</Conjunction>
          )}
        </Fragment>
      ))}
    </SubComponentRoot>
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
          set="connectedTo"
          subjects={connectedTo}
          title={t('subjectFrontPage.connectedTo')}
        />
      ) : null}
      {buildsOn.length > 0 ? (
        <SubjectLinkSet
          set="buildsOn"
          subjects={buildsOn}
          title={t('subjectFrontPage.buildsOn')}
        />
      ) : null}
      {leadsTo.length > 0 ? (
        <SubjectLinkSet
          set="leadsTo"
          subjects={leadsTo}
          title={t('subjectFrontPage.leadsTo')}
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

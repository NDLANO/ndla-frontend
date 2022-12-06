/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { SubjectLinks, SubjectShortcuts } from '@ndla/ui';
import { toLinkProps } from '../../../routeHelpers';
import { getSearchUrl } from '../subjectPageHelpers';
import SubjectPageFlexChild from './SubjectPageFlexChild';
import { GQLSubjectPage } from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';

interface Props {
  subjectId: string;
  subjectpage: GQLSubjectPage;
  twoColumns: boolean;
  locale: LocaleType;
}

export const SubjectPageSidebar = ({
  subjectId,
  subjectpage,
  twoColumns = false,
}: Props) => {
  const { t } = useTranslation();
  const { mostRead, goTo } = subjectpage;

  return [
    goTo && goTo.length > 0 && (
      <SubjectPageFlexChild key="subjectpage_shortcuts" twoColumns={twoColumns}>
        <SubjectShortcuts
          // This heading level is possibly wrong. Hard to say, as the component is unused.
          headingLevel="h2"
          messages={{
            heading: t('subjectPage.subjectShortcuts.heading'),
            showMore: t('subjectPage.subjectShortcuts.showMore'),
            showLess: t('subjectPage.subjectShortcuts.showLess'),
          }}
          links={goTo.map(type => ({
            text: type?.name,
            url: getSearchUrl(subjectId, type!),
          }))}
        />
      </SubjectPageFlexChild>
    ),
    mostRead && mostRead.length > 0 && (
      <SubjectPageFlexChild key="subjectpage_mostread" twoColumns={twoColumns}>
        <SubjectLinks
          // This heading level is possibly wrong. Hard to say, as the component is unused.
          headingLevel="h2"
          heading={t('subjectPage.mostRead.heading')}
          links={mostRead.map(resource => ({
            text: resource?.name,
            url: toLinkProps(resource!).to,
            toLinkProps: () => toLinkProps(resource!),
          }))}
        />
      </SubjectPageFlexChild>
    ),
  ];
};

export default SubjectPageSidebar;

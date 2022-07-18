/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FileDocumentOutline, HashTag } from '@ndla/icons/common';
import { ActionBreadcrumb } from '@ndla/ui';
import { useTranslation } from 'react-i18next';

interface Props {
  tag?: string;
  tagCount?: number;
  resourceCount?: number;
}

const TagBreadcrumbWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const TagCountContainer = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

const TagsBreadcrumb = ({ tag, tagCount, resourceCount }: Props) => {
  const { t } = useTranslation();

  const baseCrumb = {
    name: t('myNdla.myTags'),
    to: '/minndla/tags',
  };

  const items = !tag
    ? [baseCrumb]
    : [baseCrumb, { name: `#${tag}`, to: `/minndla/tags/${tag}` }];

  return (
    <TagBreadcrumbWrapper>
      <ActionBreadcrumb actionItems={[]} items={items} />
      <TagCountContainer>
        {!resourceCount && (
          <>
            <HashTag />
            <span>{t('myNdla.tags', { count: tagCount })}</span>
          </>
        )}
        {resourceCount && (
          <>
            <FileDocumentOutline />
            <span>{t('myNdla.resources', { count: resourceCount })}</span>
          </>
        )}
      </TagCountContainer>
    </TagBreadcrumbWrapper>
  );
};

export default TagsBreadcrumb;

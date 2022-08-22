/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, colors, fonts, mq, spacing } from '@ndla/core';
import { Back, FileDocumentOutline, HashTag } from '@ndla/icons/common';
import SafeLink from '@ndla/safelink';
import { ActionBreadcrumb } from '@ndla/ui';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import IsMobileContext from '../../../IsMobileContext';

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

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledBackArrow = styled(SafeLink)`
  display: none;
  box-shadow: none;
  color: ${colors.brand.primary};

  svg {
    width: 22px;
    height: 22px;
  }

  ${mq.range({ until: breakpoints.tablet })} {
    display: block;
  }
`;

const StyledSpan = styled.span`
  color: ${colors.text.primary};
  font-weight: ${fonts.weight.bold};
`;

const TagsBreadcrumb = ({ tag, tagCount, resourceCount }: Props) => {
  const { t } = useTranslation();
  const isMobile = useContext(IsMobileContext);
  const backUrl = tag ? '/profile/tags' : '/profile/meny';

  const baseCrumb = {
    name: t('myNdla.myTags'),
    to: '/profile/tags',
  };

  const items = !tag
    ? [baseCrumb]
    : [baseCrumb, { name: `# ${tag}`, to: `/profile/tags/${tag}` }];

  const lastBreadcrumb = items[items.length - 1];

  return (
    <TagBreadcrumbWrapper>
      {isMobile ? (
        <BreadcrumbContainer>
          <StyledBackArrow to={backUrl}>
            <Back />
          </StyledBackArrow>
          <StyledSpan title={lastBreadcrumb?.name}>
            {lastBreadcrumb?.name}
          </StyledSpan>
        </BreadcrumbContainer>
      ) : (
        <ActionBreadcrumb actionItems={[]} items={items} />
      )}
      <TagCountContainer>
        {resourceCount ? (
          <>
            <FileDocumentOutline />
            <span>{t('myNdla.resources', { count: resourceCount })}</span>
          </>
        ) : (
          <>
            <HashTag />
            <span>{t('myNdla.tags', { count: tagCount })}</span>
          </>
        )}
      </TagCountContainer>
    </TagBreadcrumbWrapper>
  );
};

export default TagsBreadcrumb;

/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { ContentTypeBadge, resourceTypeColor } from '@ndla/ui';
import { contentTypeMapping } from '../../../util/getContentType';

const StyledResourceTypeList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface HeaderProps {
  backgroundColor: string;
}

const shouldForwardProp = (p: string) => p !== 'backgroundColor';

const ResourceTypeHeader = styled('li', { shouldForwardProp })<HeaderProps>`
  background-color: ${p => p.backgroundColor};
  display: flex;
  align-items: center;
  padding: ${spacing.xxsmall} 0 ${spacing.xxsmall} ${spacing.normal};
  gap: ${spacing.small};
  margin: 0;
  margin-top: ${spacing.small};
  list-style: none;
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.bold};
  text-transform: uppercase;
`;

interface Props {
  id: string;
  name: string;
  children: ReactNode;
}

const ResourceTypeList = ({ name, id, children }: Props) => {
  const contentType = contentTypeMapping[id];
  return (
    <StyledResourceTypeList
      id={id}
      role="group"
      data-resource-group
      aria-labelledby={`header-${id}`}>
      <ResourceTypeHeader
        id={`header-${id}`}
        backgroundColor={resourceTypeColor(contentType!)}>
        <ContentTypeBadge type={contentType!} border={false} />
        {name}
      </ResourceTypeHeader>
      {children}
    </StyledResourceTypeList>
  );
};

export default ResourceTypeList;

/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DrawerListItem } from "./DrawerPortion";

const StyledResourceTypeList = styled("ul", { base: { display: "flex", flexDirection: "column", gap: "xsmall" } });
const StyledHeading = styled(Heading, { base: { paddingInlineStart: "small", paddingBlockStart: "small" } });

interface Props {
  id: string;
  name: string;
  children: ReactNode;
}

const ResourceTypeList = ({ name, id, children }: Props) => {
  return (
    <DrawerListItem role="none" id={`li-${id}`} data-resource-group>
      <StyledResourceTypeList id={id} role="group" aria-labelledby={`header-${id}`}>
        <DrawerListItem role="none">
          <StyledHeading id={`header-${id}`} textStyle="label.medium" fontWeight="bold" asChild consumeCss>
            <span>{name}</span>
          </StyledHeading>
        </DrawerListItem>
        {children}
      </StyledResourceTypeList>
    </DrawerListItem>
  );
};

export default ResourceTypeList;

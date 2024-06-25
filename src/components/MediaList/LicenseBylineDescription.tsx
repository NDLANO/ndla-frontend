/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import LicenseBylineDescriptionList from "./LicenseBylineDescriptionList";

const StyledModelPermission = styled.div`
  margin-top: ${spacing.xsmall};
  padding-top: ${spacing.nsmall};
  border-top: 2px solid ${colors.brand.light};
`;

const LicenseBylineWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

interface Props {
  children?: ReactNode;
  licenseRights: string[];
  messages?: {
    modelPermission?: string;
  };
  locale?: string;
}

const LicenseBylineDescription = ({ children, licenseRights, messages, locale }: Props) => (
  <LicenseBylineWrapper>
    <div>
      <LicenseBylineDescriptionList licenseRights={licenseRights} locale={locale} />
      {!!messages?.modelPermission && <StyledModelPermission>{messages.modelPermission}</StyledModelPermission>}
    </div>
    {children}
  </LicenseBylineWrapper>
);

export default LicenseBylineDescription;

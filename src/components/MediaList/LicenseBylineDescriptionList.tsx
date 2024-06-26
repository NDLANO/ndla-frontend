/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { getLicenseRightByAbbreviation } from "@ndla/licenses";

interface LicenseDescriptionListProps {
  licenseRights: string[];
  locale?: string;
}

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style-type: disc;
`;

const StyledListItem = styled.li`
  padding: 0;
  margin: 0;
`;

const LicenseBylineDescriptionList = ({ licenseRights, locale }: LicenseDescriptionListProps) => (
  <StyledList>
    {/* Filter away the CC-rights description since it is now shown in MediaListLicense*/}
    {licenseRights
      .filter((right) => right !== "cc")
      .map((licenseRight) => {
        const { description } = getLicenseRightByAbbreviation(licenseRight, locale);
        return <StyledListItem key={licenseRight}>{description}</StyledListItem>;
      })}
  </StyledList>
);

export default LicenseBylineDescriptionList;

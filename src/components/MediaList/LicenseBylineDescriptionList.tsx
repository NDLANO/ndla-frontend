/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLicenseRightByAbbreviation } from "@ndla/licenses";
import { styled } from "@ndla/styled-system/jsx";

interface LicenseDescriptionListProps {
  licenseRights: string[];
  locale?: string;
}

const StyledList = styled("ul", {
  base: {
    listStyleType: "disc",
    listStylePosition: "inside",
    marginBlockEnd: "small",
  },
});

const LicenseBylineDescriptionList = ({ licenseRights, locale }: LicenseDescriptionListProps) => (
  <StyledList>
    {/* Filter away the CC-rights description since it is now shown in MediaListLicense*/}
    {licenseRights
      .filter((right) => right !== "cc")
      .map((licenseRight) => (
        <li key={licenseRight}>{getLicenseRightByAbbreviation(licenseRight, locale).description}</li>
      ))}
  </StyledList>
);

export default LicenseBylineDescriptionList;

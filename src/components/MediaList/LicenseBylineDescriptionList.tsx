/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { isLicenseRight } from "@ndla/licenses";
import { styled } from "@ndla/styled-system/jsx";

interface LicenseDescriptionListProps {
  licenseRights: string[];
}

const StyledList = styled("ul", {
  base: {
    listStyleType: "disc",
    marginInlineStart: "medium",
  },
});

const LicenseBylineDescriptionList = ({ licenseRights }: LicenseDescriptionListProps) => {
  const { t } = useTranslation();
  return (
    <StyledList>
      {/* Filter away the CC-rights description since it is now shown in MediaListLicense*/}
      {licenseRights
        .filter((right) => right !== "cc")
        .map((licenseRight) => (
          <li key={licenseRight}>
            {isLicenseRight(licenseRight) ? t(`licenses.rights.${licenseRight}.description`) : licenseRight}
          </li>
        ))}
    </StyledList>
  );
};
export default LicenseBylineDescriptionList;

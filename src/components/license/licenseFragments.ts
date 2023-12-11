/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { gql } from '@apollo/client';

export const licenseListCopyrightFragment = gql`
  fragment LicenseListCopyright on Copyright {
    license {
      license
    }
    creators {
      name
      type
    }
    processors {
      name
      type
    }
    rightsholders {
      name
      type
    }
    origin
    processed
  }
`;

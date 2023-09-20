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

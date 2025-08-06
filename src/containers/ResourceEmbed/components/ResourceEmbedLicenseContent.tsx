/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { gql } from "@apollo/client";
import { styled } from "@ndla/styled-system/jsx";
import AudioLicenseList from "../../../components/license/AudioLicenseList";
import ConceptLicenseList, { GlossLicenseList } from "../../../components/license/ConceptLicenseList";
import H5pLicenseList from "../../../components/license/H5pLicenseList";
import ImageLicenseList from "../../../components/license/ImageLicenseList";
import PodcastLicenseList from "../../../components/license/PodcastLicenseList";
import VideoLicenseList from "../../../components/license/VideoLicenseList";
import { GQLResourceEmbedLicenseContent_MetaFragment } from "../../../graphqlTypes";

interface Props {
  metaData: GQLResourceEmbedLicenseContent_MetaFragment;
}

const Container = styled("div", {
  base: {
    "& > :not(:last-child)": {
      paddingBlockEnd: "xlarge",
    },
    "& > :not(:first-child)": {
      paddingBlockStart: "xsmall",
      borderTop: "1px solid",
      borderTopColor: "stroke.subtle",
    },
  },
});

const buildLicenseTabList = (metaData: GQLResourceEmbedLicenseContent_MetaFragment) => {
  const licenseContent: ReactNode[] = [];

  if (metaData.podcasts?.length) {
    licenseContent.push(<PodcastLicenseList podcasts={metaData.podcasts} />);
  }
  if (metaData.audios?.length) {
    licenseContent.push(<AudioLicenseList audios={metaData.audios} />);
  }
  if (metaData.concepts?.length) {
    licenseContent.push(<ConceptLicenseList concepts={metaData.concepts} />);
  }
  if (metaData.images?.length) {
    licenseContent.push(<ImageLicenseList images={metaData.images} isResourcePage />);
  }
  if (metaData.brightcoves?.length) {
    licenseContent.push(<VideoLicenseList videos={metaData.brightcoves} isResourcePage />);
  }
  if (metaData.h5ps?.length) {
    licenseContent.push(<H5pLicenseList h5ps={metaData.h5ps} />);
  }
  if (metaData.glosses?.length) {
    licenseContent.push(<GlossLicenseList glosses={metaData.glosses} />);
  }

  return licenseContent;
};

const ResourceEmbedLicenseContent = ({ metaData }: Props) => {
  const licenseContent = useMemo(() => buildLicenseTabList(metaData), [metaData]);

  return (
    <Container>
      {licenseContent.map((content, index) => (
        <div key={index}>{content}</div>
      ))}
    </Container>
  );
};

ResourceEmbedLicenseContent.fragments = {
  metaData: gql`
    fragment ResourceEmbedLicenseContent_Meta on ResourceMetaData {
      concepts {
        content
        ...ConceptLicenseList_ConceptLicense
      }
      glosses {
        content
        ...GlossLicenseList_GlossLicense
      }
      h5ps {
        ...H5pLicenseList_H5pLicense
      }
      brightcoves {
        description
        ...VideoLicenseList_BrightcoveLicense
      }
      audios {
        ...AudioLicenseList_AudioLicense
      }
      podcasts {
        coverPhotoUrl
        ...PodcastLicenseList_PodcastLicense
      }
      images {
        altText
        ...ImageLicenseList_ImageLicense
      }
    }
    ${GlossLicenseList.fragments.gloss}
    ${ConceptLicenseList.fragments.concept}
    ${H5pLicenseList.fragments.h5p}
    ${VideoLicenseList.fragments.video}
    ${AudioLicenseList.fragments.audio}
    ${PodcastLicenseList.fragments.podcast}
    ${ImageLicenseList.fragments.image}
  `,
};

export default ResourceEmbedLicenseContent;

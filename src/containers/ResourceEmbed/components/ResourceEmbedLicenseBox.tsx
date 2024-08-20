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
import { GQLResourceEmbedLicenseBox_MetaFragment } from "../../../graphqlTypes";

interface Props {
  metaData: GQLResourceEmbedLicenseBox_MetaFragment;
}

const DividerWrapper = styled("div", {
  base: {
    "&[data-padding-top='true']": {
      paddingBlockStart: "xsmall",
    },
    "&[data-padding-bottom='true']": {
      paddingBlockEnd: "xlarge",
    },
  },
});

const Divider = styled("div", {
  base: {
    height: "1px",
    backgroundColor: "stroke.subtle",
  },
});

const buildLicenseTabList = (metaData: GQLResourceEmbedLicenseBox_MetaFragment) => {
  const licenseContent: ReactNode[] = [];

  if (metaData.podcasts?.length) {
    licenseContent.push(<PodcastLicenseList podcasts={metaData.podcasts} />);
  }
  if (metaData.audios?.length) {
    licenseContent.push(<AudioLicenseList audios={metaData.audios} />);
  }
  if (metaData.images?.length) {
    licenseContent.push(<ImageLicenseList images={metaData.images} />);
  }
  if (metaData.brightcoves?.length) {
    licenseContent.push(<VideoLicenseList videos={metaData.brightcoves} />);
  }
  if (metaData.h5ps?.length) {
    licenseContent.push(<H5pLicenseList h5ps={metaData.h5ps} />);
  }
  if (metaData.concepts?.length) {
    licenseContent.push(<ConceptLicenseList concepts={metaData.concepts} />);
  }
  if (metaData.glosses?.length) {
    licenseContent.push(<GlossLicenseList glosses={metaData.glosses} />);
  }

  return licenseContent;
};

const ResourceEmbedLicenseBox = ({ metaData }: Props) => {
  const licenseContent = useMemo(() => buildLicenseTabList(metaData), [metaData]);

  return (
    <>
      {licenseContent.map((content, index) => (
        <>
          {index + 1 >= licenseContent.length && <Divider />}
          <DividerWrapper
            key={index}
            data-padding-top={index + 1 >= licenseContent.length}
            data-padding-bottom={index < licenseContent.length - 1}
          >
            {content}
          </DividerWrapper>
        </>
      ))}
    </>
  );
};

ResourceEmbedLicenseBox.fragments = {
  metaData: gql`
    fragment ResourceEmbedLicenseBox_Meta on ResourceMetaData {
      concepts {
        content
        metaImageUrl
        ...ConceptLicenseList_ConceptLicense
      }
      glosses {
        content
        metaImageUrl
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

export default ResourceEmbedLicenseBox;

/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import AudioLicenseList from "./AudioLicenseList";
import ConceptLicenseList, { GlossLicenseList } from "./ConceptLicenseList";
import H5pLicenseList from "./H5pLicenseList";
import ImageLicenseList from "./ImageLicenseList";
import OembedItem from "./OembedItem";
import PodcastLicenseList from "./PodcastLicenseList";
import TextLicenseList, { TextItem } from "./TextLicenseList";
import VideoLicenseList from "./VideoLicenseList";
import { GQLLicenseBox_ArticleFragment } from "../../graphqlTypes";

const StyledTabsRoot = styled(TabsRoot, {
  base: {
    paddingBlockStart: "xsmall",
    paddingBlockEnd: "xlarge",
    paddingInline: "xxsmall",
  },
});

function buildLicenseTabList(
  article: GQLLicenseBox_ArticleFragment,
  t: TFunction,
  copyText?: string,
  printUrl?: string,
  oembed?: string | undefined,
) {
  const metaData = article.transformedContent?.metaData;
  const tabs = [];
  const articleTexts: TextItem[] = [
    {
      title: article.title,
      copyright: article.copyright,
      updated: article.published,
      copyText,
    },
  ];

  if (metaData?.textblocks.some((tb) => tb.copyright.license.license)) {
    metaData.textblocks.forEach((textblock) => {
      articleTexts.push({ title: textblock.title || "", copyright: textblock.copyright });
    });
  }

  tabs.push({
    title: t("license.tabs.text"),
    id: "text",
    content: <TextLicenseList printUrl={printUrl} texts={articleTexts} />,
  });

  if (metaData?.images.some((img) => img.copyright.license.license)) {
    tabs.push({
      title: t("license.tabs.images"),
      id: "images",
      content: <ImageLicenseList images={metaData.images} />,
    });
  }

  if (metaData?.brightcoves.some((brightcove) => brightcove.copyright?.license.license)) {
    tabs.push({
      title: t("license.tabs.video"),
      id: "video",
      content: <VideoLicenseList videos={metaData?.brightcoves} />,
    });
  }

  if (metaData?.audios.some((audio) => audio.copyright.license.license)) {
    tabs.push({
      title: t("license.tabs.audio"),
      id: "audio",
      content: <AudioLicenseList audios={metaData.audios} />,
    });
  }

  if (metaData?.podcasts.some((podcast) => podcast.copyright.license.license)) {
    tabs.push({
      title: t("license.tabs.podcast"),
      id: "podcast",
      content: <PodcastLicenseList podcasts={metaData.podcasts} />,
    });
  }

  if (metaData?.h5ps.some((h5p) => h5p.copyright?.license.license)) {
    tabs.push({
      title: t("license.tabs.h5p"),
      id: "h5p",
      content: <H5pLicenseList h5ps={metaData.h5ps} />,
    });
  }

  if (metaData?.concepts.some((concept) => concept.copyright?.license?.license)) {
    tabs.push({
      title: t("license.tabs.concept"),
      id: "concept",
      content: <ConceptLicenseList concepts={metaData.concepts} />,
    });
  }

  if (metaData?.glosses.some((gloss) => gloss.copyright?.license?.license)) {
    tabs.push({
      title: t("license.tabs.gloss"),
      id: "gloss",
      content: <GlossLicenseList glosses={metaData.glosses} />,
    });
  }

  if (oembed) {
    tabs.push({
      title: t("license.tabs.embedlink"),
      id: "embedLink",
      content: <OembedItem oembed={oembed} />,
    });
  }

  return tabs;
}

interface Props {
  article: GQLLicenseBox_ArticleFragment;
  copyText?: string;
  oembed: string | undefined;
  printUrl?: string;
}
const LicenseBox = ({ article, copyText, printUrl, oembed }: Props) => {
  const { t } = useTranslation();
  const tabs = buildLicenseTabList(article, t, copyText, printUrl, oembed);
  return (
    <StyledTabsRoot
      defaultValue={tabs[0]?.id}
      orientation="horizontal"
      variant="line"
      translations={{ listLabel: t("tabs.licenseBox") }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </StyledTabsRoot>
  );
};

LicenseBox.fragments = {
  article: gql`
    fragment LicenseBox_Article on Article {
      id
      title
      htmlTitle
      published
      copyright {
        ...TextLicenseList_Copyright
      }

      transformedContent(transformArgs: $transformArgs) {
        metaData {
          copyText
          concepts {
            ...ConceptLicenseList_ConceptLicense
          }
          glosses {
            ...GlossLicenseList_GlossLicense
          }
          h5ps {
            ...H5pLicenseList_H5pLicense
          }
          brightcoves {
            ...VideoLicenseList_BrightcoveLicense
          }
          audios {
            ...AudioLicenseList_AudioLicense
          }
          podcasts {
            ...PodcastLicenseList_PodcastLicense
          }
          images {
            ...ImageLicenseList_ImageLicense
          }
          textblocks {
            title
            copyright {
              ...TextLicenseList_Copyright
            }
          }
        }
      }
    }
    ${GlossLicenseList.fragments.gloss}
    ${ConceptLicenseList.fragments.concept}
    ${H5pLicenseList.fragments.h5p}
    ${VideoLicenseList.fragments.video}
    ${AudioLicenseList.fragments.audio}
    ${PodcastLicenseList.fragments.podcast}
    ${ImageLicenseList.fragments.image}
    ${TextLicenseList.fragments.copyright}
  `,
};

export default LicenseBox;

/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import config from '../config';
import { createApolloClient } from '../util/apiHelpers';
import { copyrightInfoFragment } from '../queries';
import { GQLPodcastSeriesQuery } from '../graphqlTypes';

let apolloClient: ApolloClient<NormalizedCacheObject>;
let storedLocale: string;

const getApolloClient = (locale: string) => {
  if (apolloClient && locale === storedLocale) {
    return apolloClient;
  } else {
    apolloClient = createApolloClient(locale);
    storedLocale = locale;
    return apolloClient;
  }
};

const podcastRssFeed = async (seriesId: number): Promise<string> => {
  const client = getApolloClient('nb');

  const { data: { podcastSeries } = {} } =
    await client.query<GQLPodcastSeriesQuery>({
      query: podcastSeriesQuery,
      variables: { id: seriesId },
    });

  try {
    const podcastUrl = `${config?.ndlaFrontendDomain}/podkast/${podcastSeries?.id}`;
    const ownerEmail = 'hjelp+podcast@ndla.no';

    const description = `
    <description>
      <![CDATA[
      ${podcastSeries?.description.description}
      ]]>
    </description>
    `;

    const episodes = podcastSeries?.episodes?.map((episode) => {
      const episodeLink = `${podcastUrl}#episode-${episode.id}`;
      const GUIDEnvPart =
        config.ndlaEnvironment === 'prod' ? '' : `${config.ndlaEnvironment}-`;
      const episodeGUID = `NDLA-${GUIDEnvPart}${episode.id}`;
      const episodePubDate = new Date(episode.created).toUTCString();
      const description = !episode.podcastMeta?.introduction
        ? ''
        : `
      <description>
      <![CDATA[
      ${episode.podcastMeta?.introduction}
      ]]>
      </description>
      <guid>${episodeGUID}</guid>
      <link>${episodeLink}</link>
      `;

      const coverPhoto = !episode.podcastMeta?.image?.imageUrl
        ? ''
        : `<itunes:image href="${episode.podcastMeta.image.imageUrl}" />`;
      return `
      <item>
        <title>${episode.title.title}</title>
        <enclosure
          url="${episode.audioFile.url}"
          length="${episode.audioFile.fileSize}"
          type="${episode.audioFile.mimeType}"
        />
        <pubDate>${episodePubDate}</pubDate>
        ${description}
        ${coverPhoto}
      </item>
      `;
    });

    // TODO: These are hardcoded right now.
    //       At some point we will probably want to store them in the audio-api
    const category = `<itunes:category text="Education"><itunes:category text="Courses" /></itunes:category>`;
    const explicitness = `false`;

    return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>${podcastSeries?.title.title}</title>
        ${description}
        <link>${podcastUrl}</link>
        <language>${podcastSeries?.title.language}</language>
        ${category}
        <itunes:explicit>${explicitness}</itunes:explicit>
        <itunes:author>NDLA</itunes:author>
        <itunes:owner>
          <itunes:name>NDLA</itunes:name>
          <itunes:email>${ownerEmail}</itunes:email>
        </itunes:owner>
        <itunes:image href="${podcastSeries?.image.imageUrl}" />
        ${episodes?.join('')}
      </channel>
    </rss>
      `;
  } catch (err) {
    return Promise.reject(err);
  }
};
const podcastSeriesQuery = gql`
  query podcastSeries($id: Int!) {
    podcastSeries(id: $id) {
      id
      title {
        title
        language
      }
      description {
        description
      }
      supportedLanguages
      image {
        imageUrl
      }
      coverPhoto {
        url
      }
      content {
        content
      }
      episodes {
        id
        created
        title {
          title
        }
        audioFile {
          url
          fileSize
          mimeType
        }
        podcastMeta {
          introduction
          image {
            imageUrl
          }
        }
        copyright {
        ...CopyrightInfo
        }
        tags {
          tags
        }
      }
      hasRSS
    }
    ${copyrightInfoFragment}
  }
`;

export default podcastRssFeed;

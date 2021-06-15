import config from 'config';
import { fetchSeries } from '../util/audioApi';

const podcastRssFeed = async (seriesId: number): Promise<string> => {
  try {
    const series = await fetchSeries(seriesId, 'nb');
    const podcastUrl = `${config?.ndlaFrontendDomain}/podcast/${series.id}`;
    const ownerEmail = 'support+podcast@ndla.no';

    // TODO: Finne ut om kategori burde lagres
    // TODO: Finne ut om vi burde lagre explicitness

    const authors = series.episodes
      .flatMap(ep => {
        return ep.copyright.creators
          .concat(ep.copyright.processors)
          .concat(ep.copyright.rightsholders);
      })
      .map(a => a.name);

    const uniqueAuthors = Array.from(new Set(authors)).map(
      a => `<itunes:author>${a}</itunes:author>`,
    );

    const episodes = series.episodes.map(episode => {
      const episodeLink = `${podcastUrl}#episode-${episode.id}`;
      const episodeGUID = `NDLA-${episode.id}`;
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

      const coverPhoto = !episode.podcastMeta?.coverPhoto.url
        ? ''
        : `<itunes:image href="${episode.podcastMeta.coverPhoto.url}" />`;
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

    return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>${series.title.title}</title>
        <link>${podcastUrl}</link>
        <language>${series.title.language}</language>
        <itunes:category text="Education" />
        <itunes:explicit>false</itunes:explicit>
        ${uniqueAuthors}
        <itunes:owner>
          <itunes:name>NDLA</itunes:name>
          <itunes:email>${ownerEmail}</itunes:email>
        </itunes:owner>
        <itunes:image href="${series.coverPhoto.url}" />
        ${episodes}
      </channel>
    </rss>
      `;
  } catch (err) {
    return Promise.reject(err);
  }
};

export default podcastRssFeed;

export type Maybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  StringRecord: any;
};

export type GQLAggregationResult = {
  __typename?: 'AggregationResult';
  docCountErrorUpperBound: Scalars['Int'];
  field: Scalars['String'];
  sumOtherDocCount: Scalars['Int'];
  values: Array<GQLBucketResult>;
};

export type GQLArticle = {
  __typename?: 'Article';
  articleType: Scalars['String'];
  availability?: Maybe<Scalars['String']>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  conceptIds?: Maybe<Array<Scalars['Int']>>;
  concepts?: Maybe<Array<GQLConcept>>;
  content: Scalars['String'];
  copyright: GQLCopyright;
  coreElements?: Maybe<Array<GQLCoreElement>>;
  created: Scalars['String'];
  crossSubjectTopics?: Maybe<Array<GQLCrossSubjectElement>>;
  grepCodes?: Maybe<Array<Scalars['String']>>;
  id: Scalars['Int'];
  introduction?: Maybe<Scalars['String']>;
  metaData?: Maybe<GQLArticleMetaData>;
  metaDescription: Scalars['String'];
  metaImage?: Maybe<GQLMetaImage>;
  oembed?: Maybe<Scalars['String']>;
  oldNdlaUrl?: Maybe<Scalars['String']>;
  published: Scalars['String'];
  relatedContent?: Maybe<Array<GQLRelatedContent>>;
  requiredLibraries?: Maybe<Array<GQLArticleRequiredLibrary>>;
  revision: Scalars['Int'];
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  updated: Scalars['String'];
  visualElement?: Maybe<GQLVisualElement>;
};

export type GQLArticleCrossSubjectTopicsArgs = {
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLArticleMetaData = {
  __typename?: 'ArticleMetaData';
  audios?: Maybe<Array<GQLAudioLicense>>;
  brightcoves?: Maybe<Array<GQLBrightcoveLicense>>;
  concepts?: Maybe<Array<GQLConceptLicense>>;
  copyText?: Maybe<Scalars['String']>;
  footnotes?: Maybe<Array<GQLFootNote>>;
  h5ps?: Maybe<Array<GQLH5pLicense>>;
  images?: Maybe<Array<GQLImageLicense>>;
};

export type GQLArticleRequiredLibrary = {
  __typename?: 'ArticleRequiredLibrary';
  mediaType: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['String'];
};

export type GQLArticleSearchResult = GQLSearchResult & {
  __typename?: 'ArticleSearchResult';
  contexts: Array<GQLSearchContext>;
  id: Scalars['Int'];
  metaDescription: Scalars['String'];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars['String']>;
  title: Scalars['String'];
  traits: Array<Scalars['String']>;
  url: Scalars['String'];
};

export type GQLAudio = GQLAudioBase & {
  __typename?: 'Audio';
  audioFile: GQLAudioFile;
  audioType: Scalars['String'];
  copyright: GQLCopyright;
  created: Scalars['String'];
  id: Scalars['Int'];
  manuscript?: Maybe<GQLManuscript>;
  podcastMeta?: Maybe<GQLPodcastMeta>;
  revision: Scalars['Int'];
  supportedLanguages: Array<Scalars['String']>;
  tags: GQLTags;
  title: GQLTitle;
  updated: Scalars['String'];
};

export type GQLAudioBase = {
  audioFile: GQLAudioFile;
  audioType: Scalars['String'];
  copyright: GQLCopyright;
  created: Scalars['String'];
  id: Scalars['Int'];
  manuscript?: Maybe<GQLManuscript>;
  podcastMeta?: Maybe<GQLPodcastMeta>;
  revision: Scalars['Int'];
  supportedLanguages: Array<Scalars['String']>;
  tags: GQLTags;
  title: GQLTitle;
  updated: Scalars['String'];
};

export type GQLAudioFile = {
  __typename?: 'AudioFile';
  fileSize: Scalars['Int'];
  language: Scalars['String'];
  mimeType: Scalars['String'];
  url: Scalars['String'];
};

export type GQLAudioLicense = {
  __typename?: 'AudioLicense';
  copyText?: Maybe<Scalars['String']>;
  copyright: GQLCopyright;
  src: Scalars['String'];
  title: Scalars['String'];
};

export type GQLAudioSearch = {
  __typename?: 'AudioSearch';
  language: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  pageSize: Scalars['Int'];
  results: Array<GQLAudioSummary>;
  totalCount: Scalars['Int'];
};

export type GQLAudioSummary = {
  __typename?: 'AudioSummary';
  audioType: Scalars['String'];
  id: Scalars['Int'];
  lastUpdated: Scalars['String'];
  license: Scalars['String'];
  manuscript?: Maybe<GQLManuscript>;
  podcastMeta?: Maybe<GQLPodcastMeta>;
  supportedLanguages: Array<Scalars['String']>;
  title: GQLTitle;
  url: Scalars['String'];
};

export type GQLAudioWithSeries = GQLAudioBase & {
  __typename?: 'AudioWithSeries';
  audioFile: GQLAudioFile;
  audioType: Scalars['String'];
  copyright: GQLCopyright;
  created: Scalars['String'];
  id: Scalars['Int'];
  manuscript?: Maybe<GQLManuscript>;
  podcastMeta?: Maybe<GQLPodcastMeta>;
  revision: Scalars['Int'];
  series?: Maybe<GQLPodcastSeries>;
  supportedLanguages: Array<Scalars['String']>;
  tags: GQLTags;
  title: GQLTitle;
  updated: Scalars['String'];
};

export type GQLBrightcoveElement = {
  __typename?: 'BrightcoveElement';
  account?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  cover?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  download?: Maybe<Scalars['String']>;
  iframe?: Maybe<GQLBrightcoveIframe>;
  player?: Maybe<Scalars['String']>;
  src?: Maybe<Scalars['String']>;
  uploadDate?: Maybe<Scalars['String']>;
  videoid?: Maybe<Scalars['String']>;
};

export type GQLBrightcoveIframe = {
  __typename?: 'BrightcoveIframe';
  height: Scalars['Int'];
  src: Scalars['String'];
  width: Scalars['Int'];
};

export type GQLBrightcoveLicense = {
  __typename?: 'BrightcoveLicense';
  copyright: GQLCopyright;
  cover?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  download?: Maybe<Scalars['String']>;
  iframe?: Maybe<GQLBrightcoveIframe>;
  src?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  uploadDate?: Maybe<Scalars['String']>;
};

export type GQLBucketResult = {
  __typename?: 'BucketResult';
  count: Scalars['Int'];
  value: Scalars['String'];
};

export type GQLCategory = {
  __typename?: 'Category';
  name: Scalars['String'];
  subjects: Array<GQLSubject>;
};

export type GQLCompetenceGoal = {
  __typename?: 'CompetenceGoal';
  code?: Maybe<Scalars['String']>;
  competenceAimSetId?: Maybe<Scalars['String']>;
  competenceGoalSet?: Maybe<GQLReference>;
  competenceGoalSetCode?: Maybe<Scalars['String']>;
  coreElements?: Maybe<Array<GQLElement>>;
  coreElementsCodes?: Maybe<Array<GQLElement>>;
  crossSubjectTopics?: Maybe<Array<GQLElement>>;
  crossSubjectTopicsCodes?: Maybe<Array<GQLElement>>;
  curriculum?: Maybe<GQLReference>;
  curriculumCode?: Maybe<Scalars['String']>;
  curriculumId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  language?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type GQLConcept = {
  __typename?: 'Concept';
  articleIds: Array<Scalars['Int']>;
  articles?: Maybe<Array<GQLMeta>>;
  content: Scalars['String'];
  copyright?: Maybe<GQLConceptCopyright>;
  created: Scalars['String'];
  id: Scalars['Int'];
  image?: Maybe<GQLImageLicense>;
  metaImage: GQLMetaImage;
  source?: Maybe<Scalars['String']>;
  subjectIds?: Maybe<Array<Scalars['String']>>;
  subjectNames?: Maybe<Array<Scalars['String']>>;
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  visualElement?: Maybe<GQLVisualElement>;
};

export type GQLConceptCopyright = {
  __typename?: 'ConceptCopyright';
  creators: Array<GQLContributor>;
  license?: Maybe<GQLLicense>;
  origin?: Maybe<Scalars['String']>;
  processors: Array<GQLContributor>;
  rightsholders: Array<GQLContributor>;
};

export type GQLConceptLicense = {
  __typename?: 'ConceptLicense';
  copyright?: Maybe<GQLConceptCopyright>;
  src?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type GQLConceptResult = {
  __typename?: 'ConceptResult';
  concepts: Array<GQLConcept>;
  language: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  pageSize: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type GQLContributor = {
  __typename?: 'Contributor';
  name: Scalars['String'];
  type: Scalars['String'];
};

export type GQLCopyright = {
  __typename?: 'Copyright';
  creators: Array<GQLContributor>;
  license: GQLLicense;
  origin?: Maybe<Scalars['String']>;
  processors: Array<GQLContributor>;
  rightsholders: Array<GQLContributor>;
};

export type GQLCoreElement = {
  __typename?: 'CoreElement';
  curriculum?: Maybe<GQLReference>;
  curriculumCode?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  language?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type GQLCoverPhoto = {
  __typename?: 'CoverPhoto';
  altText: Scalars['String'];
  id: Scalars['String'];
  url: Scalars['String'];
};

export type GQLCrossSubjectElement = {
  __typename?: 'CrossSubjectElement';
  code?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type GQLDescription = {
  __typename?: 'Description';
  description: Scalars['String'];
  language: Scalars['String'];
};

export type GQLElement = {
  __typename?: 'Element';
  explanation: Array<Maybe<Scalars['String']>>;
  reference: GQLReference;
};

export type GQLFilmFrontpage = {
  __typename?: 'FilmFrontpage';
  about: Array<GQLFilmPageAbout>;
  movieThemes: Array<GQLMovieTheme>;
  name: Scalars['String'];
  slideShow: Array<GQLMovie>;
};

export type GQLFilmPageAbout = {
  __typename?: 'FilmPageAbout';
  description: Scalars['String'];
  language: Scalars['String'];
  title: Scalars['String'];
  visualElement: GQLSubjectPageVisualElement;
};

export type GQLFootNote = {
  __typename?: 'FootNote';
  authors: Array<Scalars['String']>;
  edition?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  ref: Scalars['Int'];
  title: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  year: Scalars['String'];
};

export type GQLFrontPageResources = {
  __typename?: 'FrontPageResources';
  results: Array<GQLFrontpageSearchResult>;
  suggestions: Array<GQLSuggestionResult>;
  totalCount: Scalars['Int'];
};

export type GQLFrontpage = {
  __typename?: 'Frontpage';
  categories: Array<GQLCategory>;
  topical: Array<GQLResource>;
};

export type GQLFrontpageSearch = {
  __typename?: 'FrontpageSearch';
  learningResources: GQLFrontPageResources;
  topicResources: GQLFrontPageResources;
};

export type GQLFrontpageSearchResult = {
  __typename?: 'FrontpageSearchResult';
  filters: Array<GQLSearchContextFilter>;
  id: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  resourceTypes: Array<GQLSearchContextResourceTypes>;
  subject: Scalars['String'];
};

export type GQLGroupSearch = {
  __typename?: 'GroupSearch';
  aggregations: Array<GQLAggregationResult>;
  language: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  pageSize: Scalars['Int'];
  resourceType: Scalars['String'];
  resources: Array<GQLGroupSearchResult>;
  suggestions: Array<GQLSuggestionResult>;
  totalCount: Scalars['Int'];
};

export type GQLGroupSearchResult = {
  __typename?: 'GroupSearchResult';
  contexts: Array<GQLSearchContext>;
  id: Scalars['Int'];
  ingress: Scalars['String'];
  metaImage?: Maybe<GQLMetaImage>;
  name: Scalars['String'];
  path: Scalars['String'];
  traits: Array<Scalars['String']>;
  url: Scalars['String'];
};

export type GQLH5pElement = {
  __typename?: 'H5pElement';
  src?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
};

export type GQLH5pLicense = {
  __typename?: 'H5pLicense';
  copyright: GQLCopyright;
  src?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type GQLImageElement = {
  __typename?: 'ImageElement';
  alt?: Maybe<Scalars['String']>;
  altText: Scalars['String'];
  caption?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  copyText?: Maybe<Scalars['String']>;
  focalX?: Maybe<Scalars['Float']>;
  focalY?: Maybe<Scalars['Float']>;
  lowerRightX?: Maybe<Scalars['Float']>;
  lowerRightY?: Maybe<Scalars['Float']>;
  resourceid?: Maybe<Scalars['String']>;
  src: Scalars['String'];
  upperLeftX?: Maybe<Scalars['Float']>;
  upperLeftY?: Maybe<Scalars['Float']>;
};

export type GQLImageLicense = {
  __typename?: 'ImageLicense';
  altText: Scalars['String'];
  contentType?: Maybe<Scalars['String']>;
  copyText?: Maybe<Scalars['String']>;
  copyright: GQLCopyright;
  src: Scalars['String'];
  title: Scalars['String'];
};

export type GQLImageMetaInformation = {
  __typename?: 'ImageMetaInformation';
  altText: Scalars['String'];
  caption: Scalars['String'];
  contentType: Scalars['String'];
  copyright: GQLCopyright;
  created: Scalars['String'];
  createdBy: Scalars['String'];
  id: Scalars['String'];
  imageUrl: Scalars['String'];
  metaUrl: Scalars['String'];
  size: Scalars['Int'];
  supportedLanguages: Array<Scalars['String']>;
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type GQLLearningpath = {
  __typename?: 'Learningpath';
  canEdit: Scalars['Boolean'];
  copyright: GQLLearningpathCopyright;
  coverphoto?: Maybe<GQLLearningpathCoverphoto>;
  description: Scalars['String'];
  duration?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  isBasedOn?: Maybe<Scalars['Int']>;
  lastUpdated: Scalars['String'];
  learningstepUrl: Scalars['String'];
  learningsteps: Array<GQLLearningpathStep>;
  metaUrl: Scalars['String'];
  revision: Scalars['Int'];
  status: Scalars['String'];
  supportedLanguages: Array<Scalars['String']>;
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  verificationStatus: Scalars['String'];
};

export type GQLLearningpathCopyright = {
  __typename?: 'LearningpathCopyright';
  contributors: Array<GQLContributor>;
  license: GQLLicense;
};

export type GQLLearningpathCoverphoto = {
  __typename?: 'LearningpathCoverphoto';
  metaUrl: Scalars['String'];
  url: Scalars['String'];
};

export type GQLLearningpathSearchResult = GQLSearchResult & {
  __typename?: 'LearningpathSearchResult';
  contexts: Array<GQLSearchContext>;
  id: Scalars['Int'];
  metaDescription: Scalars['String'];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars['String']>;
  title: Scalars['String'];
  traits: Array<Scalars['String']>;
  url: Scalars['String'];
};

export type GQLLearningpathStep = {
  __typename?: 'LearningpathStep';
  article?: Maybe<GQLArticle>;
  description?: Maybe<Scalars['String']>;
  embedUrl?: Maybe<GQLLearningpathStepEmbedUrl>;
  id: Scalars['Int'];
  license?: Maybe<GQLLicense>;
  metaUrl: Scalars['String'];
  oembed?: Maybe<GQLLearningpathStepOembed>;
  resource?: Maybe<GQLResource>;
  revision: Scalars['Int'];
  seqNo: Scalars['Int'];
  showTitle: Scalars['Boolean'];
  status: Scalars['String'];
  supportedLanguages: Array<Scalars['String']>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type GQLLearningpathStepEmbedUrl = {
  __typename?: 'LearningpathStepEmbedUrl';
  embedType: Scalars['String'];
  url: Scalars['String'];
};

export type GQLLearningpathStepOembed = {
  __typename?: 'LearningpathStepOembed';
  height: Scalars['Int'];
  html: Scalars['String'];
  type: Scalars['String'];
  version: Scalars['String'];
  width: Scalars['Int'];
};

export type GQLLicense = {
  __typename?: 'License';
  description?: Maybe<Scalars['String']>;
  license: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type GQLListingPage = {
  __typename?: 'ListingPage';
  subjects?: Maybe<Array<GQLSubject>>;
  tags?: Maybe<Array<Scalars['String']>>;
};

export type GQLManuscript = {
  __typename?: 'Manuscript';
  language: Scalars['String'];
  manuscript: Scalars['String'];
};

export type GQLMeta = {
  __typename?: 'Meta';
  availability?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  introduction?: Maybe<Scalars['String']>;
  lastUpdated?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  title: Scalars['String'];
};

export type GQLMetaImage = {
  __typename?: 'MetaImage';
  alt: Scalars['String'];
  url: Scalars['String'];
};

export type GQLMovie = {
  __typename?: 'Movie';
  id: Scalars['String'];
  metaDescription: Scalars['String'];
  metaImage?: Maybe<GQLMetaImage>;
  path: Scalars['String'];
  resourceTypes: Array<GQLResourceType>;
  title: Scalars['String'];
};

export type GQLMovieMeta = {
  __typename?: 'MovieMeta';
  metaDescription?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  title: Scalars['String'];
};

export type GQLMoviePath = {
  __typename?: 'MoviePath';
  path?: Maybe<Scalars['String']>;
  paths?: Maybe<Array<Scalars['String']>>;
};

export type GQLMovieResourceTypes = {
  __typename?: 'MovieResourceTypes';
  resourceTypes?: Maybe<Array<GQLResourceType>>;
};

export type GQLMovieTheme = {
  __typename?: 'MovieTheme';
  movies: Array<GQLMovie>;
  name: Array<GQLName>;
};

export type GQLName = {
  __typename?: 'Name';
  language: Scalars['String'];
  name: Scalars['String'];
};

export type GQLPodcastMeta = {
  __typename?: 'PodcastMeta';
  image?: Maybe<GQLImageMetaInformation>;
  introduction: Scalars['String'];
  language: Scalars['String'];
};

export type GQLPodcastSeries = GQLPodcastSeriesBase & {
  __typename?: 'PodcastSeries';
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  id: Scalars['Int'];
  supportedLanguages: Array<Scalars['String']>;
  title: GQLTitle;
};

export type GQLPodcastSeriesBase = {
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  id: Scalars['Int'];
  supportedLanguages: Array<Scalars['String']>;
  title: GQLTitle;
};

export type GQLPodcastSeriesSearch = {
  __typename?: 'PodcastSeriesSearch';
  language: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  pageSize: Scalars['Int'];
  results: Array<GQLPodcastSeriesSummary>;
  totalCount: Scalars['Int'];
};

export type GQLPodcastSeriesSummary = {
  __typename?: 'PodcastSeriesSummary';
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  episodes?: Maybe<Array<GQLAudioSummary>>;
  id: Scalars['Int'];
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  title: GQLTitle;
};

export type GQLPodcastSeriesWithEpisodes = GQLPodcastSeriesBase & {
  __typename?: 'PodcastSeriesWithEpisodes';
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  episodes?: Maybe<Array<GQLAudio>>;
  id: Scalars['Int'];
  supportedLanguages: Array<Scalars['String']>;
  title: GQLTitle;
};

export type GQLQuery = {
  __typename?: 'Query';
  alerts?: Maybe<Array<Maybe<GQLUptimeAlert>>>;
  article?: Maybe<GQLArticle>;
  competenceGoal?: Maybe<GQLCompetenceGoal>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  concept?: Maybe<GQLConcept>;
  conceptSearch?: Maybe<GQLConceptResult>;
  coreElement?: Maybe<GQLCoreElement>;
  coreElements?: Maybe<Array<GQLCoreElement>>;
  filmfrontpage?: Maybe<GQLFilmFrontpage>;
  frontpage?: Maybe<GQLFrontpage>;
  frontpageSearch?: Maybe<GQLFrontpageSearch>;
  groupSearch?: Maybe<Array<GQLGroupSearch>>;
  learningpath?: Maybe<GQLLearningpath>;
  listingPage?: Maybe<GQLListingPage>;
  podcast?: Maybe<GQLAudioWithSeries>;
  podcastSearch?: Maybe<GQLAudioSearch>;
  podcastSeries?: Maybe<GQLPodcastSeriesWithEpisodes>;
  podcastSeriesSearch?: Maybe<GQLPodcastSeriesSearch>;
  resource?: Maybe<GQLResource>;
  resourceTypes?: Maybe<Array<GQLResourceTypeDefinition>>;
  search?: Maybe<GQLSearch>;
  searchWithoutPagination?: Maybe<GQLSearchWithoutPagination>;
  subject?: Maybe<GQLSubject>;
  subjectpage?: Maybe<GQLSubjectPage>;
  subjects?: Maybe<Array<GQLSubject>>;
  topic?: Maybe<GQLTopic>;
  topics?: Maybe<Array<GQLTopic>>;
};

export type GQLQueryArticleArgs = {
  id: Scalars['String'];
  isOembed?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  showVisualElement?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLQueryCompetenceGoalArgs = {
  code: Scalars['String'];
  language?: Maybe<Scalars['String']>;
};

export type GQLQueryCompetenceGoalsArgs = {
  codes?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
  nodeId?: Maybe<Scalars['String']>;
};

export type GQLQueryConceptArgs = {
  id: Scalars['Int'];
};

export type GQLQueryConceptSearchArgs = {
  exactMatch?: Maybe<Scalars['Boolean']>;
  fallback?: Maybe<Scalars['Boolean']>;
  ids?: Maybe<Array<Scalars['Int']>>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
};

export type GQLQueryCoreElementArgs = {
  code: Scalars['String'];
  language?: Maybe<Scalars['String']>;
};

export type GQLQueryCoreElementsArgs = {
  codes?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
};

export type GQLQueryFrontpageSearchArgs = {
  query?: Maybe<Scalars['String']>;
};

export type GQLQueryGroupSearchArgs = {
  aggregatePaths?: Maybe<Array<Scalars['String']>>;
  contextTypes?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  grepCodes?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  levels?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
  resourceTypes?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
};

export type GQLQueryLearningpathArgs = {
  pathId: Scalars['String'];
};

export type GQLQueryListingPageArgs = {
  subjects?: Maybe<Scalars['String']>;
};

export type GQLQueryPodcastArgs = {
  id: Scalars['Int'];
};

export type GQLQueryPodcastSearchArgs = {
  page: Scalars['Int'];
  pageSize: Scalars['Int'];
};

export type GQLQueryPodcastSeriesArgs = {
  id: Scalars['Int'];
};

export type GQLQueryPodcastSeriesSearchArgs = {
  page: Scalars['Int'];
  pageSize: Scalars['Int'];
};

export type GQLQueryResourceArgs = {
  id: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
  topicId?: Maybe<Scalars['String']>;
};

export type GQLQuerySearchArgs = {
  aggregatePaths?: Maybe<Array<Scalars['String']>>;
  contextFilters?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  grepCodes?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Scalars['Int']>>;
  language?: Maybe<Scalars['String']>;
  languageFilter?: Maybe<Scalars['String']>;
  levels?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
  relevance?: Maybe<Scalars['String']>;
  resourceTypes?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
};

export type GQLQuerySearchWithoutPaginationArgs = {
  contextFilters?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Scalars['Int']>>;
  language?: Maybe<Scalars['String']>;
  languageFilter?: Maybe<Scalars['String']>;
  levels?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  relevance?: Maybe<Scalars['String']>;
  resourceTypes?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
};

export type GQLQuerySubjectArgs = {
  id: Scalars['String'];
};

export type GQLQuerySubjectpageArgs = {
  id: Scalars['Int'];
};

export type GQLQuerySubjectsArgs = {
  filterVisible?: Maybe<Scalars['Boolean']>;
  metadataFilterKey?: Maybe<Scalars['String']>;
  metadataFilterValue?: Maybe<Scalars['String']>;
};

export type GQLQueryTopicArgs = {
  id: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLQueryTopicsArgs = {
  contentUri?: Maybe<Scalars['String']>;
  filterVisible?: Maybe<Scalars['Boolean']>;
};

export type GQLReference = {
  __typename?: 'Reference';
  code?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  title: Scalars['String'];
};

export type GQLRelatedContent = {
  __typename?: 'RelatedContent';
  title: Scalars['String'];
  url: Scalars['String'];
};

export type GQLResource = GQLTaxonomyEntity &
  GQLWithArticle & {
    __typename?: 'Resource';
    article?: Maybe<GQLArticle>;
    availability?: Maybe<Scalars['String']>;
    breadcrumbs?: Maybe<Array<Array<Scalars['String']>>>;
    contentUri?: Maybe<Scalars['String']>;
    id: Scalars['String'];
    learningpath?: Maybe<GQLLearningpath>;
    meta?: Maybe<GQLMeta>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars['String'];
    parentTopics?: Maybe<Array<GQLTopic>>;
    path: Scalars['String'];
    paths: Array<Scalars['String']>;
    rank?: Maybe<Scalars['Int']>;
    relevanceId?: Maybe<Scalars['String']>;
    resourceTypes?: Maybe<Array<GQLResourceType>>;
    supportedLanguages: Array<Scalars['String']>;
  };

export type GQLResourceArticleArgs = {
  isOembed?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLResourceType = {
  __typename?: 'ResourceType';
  id: Scalars['String'];
  name: Scalars['String'];
  resources?: Maybe<Array<GQLResource>>;
};

export type GQLResourceTypeResourcesArgs = {
  topicId: Scalars['String'];
};

export type GQLResourceTypeDefinition = {
  __typename?: 'ResourceTypeDefinition';
  id: Scalars['String'];
  name: Scalars['String'];
  subtypes?: Maybe<Array<GQLResourceTypeDefinition>>;
};

export type GQLSearch = {
  __typename?: 'Search';
  aggregations: Array<GQLAggregationResult>;
  concepts?: Maybe<GQLConceptResult>;
  language: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  pageSize: Scalars['Int'];
  results: Array<GQLSearchResult>;
  suggestions: Array<GQLSuggestionResult>;
  totalCount: Scalars['Int'];
};

export type GQLSearchContext = {
  __typename?: 'SearchContext';
  breadcrumbs: Array<Scalars['String']>;
  filters: Array<GQLSearchContextFilter>;
  id: Scalars['String'];
  language: Scalars['String'];
  learningResourceType: Scalars['String'];
  path: Scalars['String'];
  relevance: Scalars['String'];
  resourceTypes: Array<GQLSearchContextResourceTypes>;
  subject: Scalars['String'];
  subjectId: Scalars['String'];
};

export type GQLSearchContextFilter = {
  __typename?: 'SearchContextFilter';
  id: Scalars['String'];
  name: Scalars['String'];
  relevance: Scalars['String'];
};

export type GQLSearchContextResourceTypes = {
  __typename?: 'SearchContextResourceTypes';
  id: Scalars['String'];
  language: Scalars['String'];
  name: Scalars['String'];
};

export type GQLSearchResult = {
  contexts: Array<GQLSearchContext>;
  id: Scalars['Int'];
  metaDescription: Scalars['String'];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars['String']>;
  title: Scalars['String'];
  traits: Array<Scalars['String']>;
  url: Scalars['String'];
};

export type GQLSearchSuggestion = {
  __typename?: 'SearchSuggestion';
  length: Scalars['Int'];
  offset: Scalars['Int'];
  options: Array<GQLSuggestOption>;
  text: Scalars['String'];
};

export type GQLSearchWithoutPagination = {
  __typename?: 'SearchWithoutPagination';
  results: Array<GQLSearchResult>;
};

export type GQLSubject = GQLTaxonomyEntity & {
  __typename?: 'Subject';
  allTopics?: Maybe<Array<GQLTopic>>;
  contentUri?: Maybe<Scalars['String']>;
  grepCodes: Array<Scalars['String']>;
  id: Scalars['String'];
  metadata: GQLTaxonomyMetadata;
  name: Scalars['String'];
  path: Scalars['String'];
  paths: Array<Scalars['String']>;
  rank?: Maybe<Scalars['Int']>;
  relevanceId: Scalars['String'];
  subjectpage?: Maybe<GQLSubjectPage>;
  supportedLanguages: Array<Scalars['String']>;
  topics?: Maybe<Array<GQLTopic>>;
};

export type GQLSubjectTopicsArgs = {
  all?: Maybe<Scalars['Boolean']>;
};

export type GQLSubjectPage = {
  __typename?: 'SubjectPage';
  about?: Maybe<GQLSubjectPageAbout>;
  banner: GQLSubjectPageBanner;
  editorsChoices: Array<GQLTaxonomyEntity>;
  facebook?: Maybe<Scalars['String']>;
  goTo: Array<GQLResourceTypeDefinition>;
  id: Scalars['Int'];
  latestContent?: Maybe<Array<GQLTaxonomyEntity>>;
  layout: Scalars['String'];
  metaDescription?: Maybe<Scalars['String']>;
  mostRead: Array<GQLTaxonomyEntity>;
  name: Scalars['String'];
  supportedLanguages: Array<Scalars['String']>;
  topical?: Maybe<GQLTaxonomyEntity>;
  twitter?: Maybe<Scalars['String']>;
};

export type GQLSubjectPageEditorsChoicesArgs = {
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLSubjectPageLatestContentArgs = {
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLSubjectPageMostReadArgs = {
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLSubjectPageTopicalArgs = {
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLSubjectPageAbout = {
  __typename?: 'SubjectPageAbout';
  description: Scalars['String'];
  title: Scalars['String'];
  visualElement: GQLSubjectPageVisualElement;
};

export type GQLSubjectPageBanner = {
  __typename?: 'SubjectPageBanner';
  desktopId: Scalars['String'];
  desktopUrl: Scalars['String'];
  mobileId?: Maybe<Scalars['String']>;
  mobileUrl?: Maybe<Scalars['String']>;
};

export type GQLSubjectPageVisualElement = {
  __typename?: 'SubjectPageVisualElement';
  alt?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  url: Scalars['String'];
};

export type GQLSuggestOption = {
  __typename?: 'SuggestOption';
  score: Scalars['Float'];
  text: Scalars['String'];
};

export type GQLSuggestionResult = {
  __typename?: 'SuggestionResult';
  name: Scalars['String'];
  suggestions: Array<GQLSearchSuggestion>;
};

export type GQLTags = {
  __typename?: 'Tags';
  language: Scalars['String'];
  tags: Array<Scalars['String']>;
};

export type GQLTaxonomyEntity = {
  contentUri?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  metadata: GQLTaxonomyMetadata;
  name: Scalars['String'];
  path: Scalars['String'];
  paths: Array<Scalars['String']>;
  rank?: Maybe<Scalars['Int']>;
  relevanceId?: Maybe<Scalars['String']>;
  supportedLanguages: Array<Scalars['String']>;
};

export type GQLTaxonomyMetadata = {
  __typename?: 'TaxonomyMetadata';
  customFields: Scalars['StringRecord'];
  grepCodes: Array<Scalars['String']>;
  visible: Scalars['Boolean'];
};

export type GQLTitle = {
  __typename?: 'Title';
  language: Scalars['String'];
  title: Scalars['String'];
};

export type GQLTopic = GQLTaxonomyEntity &
  GQLWithArticle & {
    __typename?: 'Topic';
    alternateTopics?: Maybe<Array<GQLTopic>>;
    article?: Maybe<GQLArticle>;
    availability?: Maybe<Scalars['String']>;
    breadcrumbs?: Maybe<Array<Array<Scalars['String']>>>;
    contentUri?: Maybe<Scalars['String']>;
    coreResources?: Maybe<Array<GQLResource>>;
    id: Scalars['String'];
    isPrimary?: Maybe<Scalars['Boolean']>;
    meta?: Maybe<GQLMeta>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars['String'];
    parent?: Maybe<Scalars['String']>;
    path: Scalars['String'];
    pathTopics?: Maybe<Array<Array<GQLTopic>>>;
    paths: Array<Scalars['String']>;
    rank?: Maybe<Scalars['Int']>;
    relevanceId?: Maybe<Scalars['String']>;
    subtopics?: Maybe<Array<GQLTopic>>;
    supplementaryResources?: Maybe<Array<GQLResource>>;
    supportedLanguages: Array<Scalars['String']>;
  };

export type GQLTopicArticleArgs = {
  showVisualElement?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLTopicCoreResourcesArgs = {
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLTopicSupplementaryResourcesArgs = {
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLUptimeAlert = {
  __typename?: 'UptimeAlert';
  body?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type GQLVisualElement = {
  __typename?: 'VisualElement';
  brightcove?: Maybe<GQLBrightcoveElement>;
  copyright?: Maybe<GQLCopyright>;
  embed?: Maybe<Scalars['String']>;
  h5p?: Maybe<GQLH5pElement>;
  image?: Maybe<GQLImageElement>;
  language?: Maybe<Scalars['String']>;
  oembed?: Maybe<GQLVisualElementOembed>;
  resource?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type GQLVisualElementOembed = {
  __typename?: 'VisualElementOembed';
  fullscreen?: Maybe<Scalars['Boolean']>;
  html?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type GQLWithArticle = {
  availability?: Maybe<Scalars['String']>;
  meta?: Maybe<GQLMeta>;
};

export type GQLEmbedVisualelement = {
  __typename?: 'embedVisualelement';
  visualElement?: Maybe<GQLVisualElement>;
};

export type GQLArticle_ConceptFragment = {
  __typename?: 'Concept';
  subjectNames?: Maybe<Array<string>>;
  id: number;
  title: string;
  content: string;
  copyright?: Maybe<{
    __typename?: 'ConceptCopyright';
    license?: Maybe<{ __typename?: 'License'; license: string }>;
    creators: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
  }>;
  visualElement?: Maybe<
    {
      __typename?: 'VisualElement';
    } & GQLVisualElementWrapper_VisualElementFragment
  >;
};

export type GQLArticleConceptsQueryVariables = Exact<{
  conceptIds: Array<Scalars['Int']> | Scalars['Int'];
}>;

export type GQLArticleConceptsQuery = {
  __typename?: 'Query';
  conceptSearch?: Maybe<{
    __typename?: 'ConceptResult';
    concepts: Array<{ __typename?: 'Concept' } & GQLArticle_ConceptFragment>;
  }>;
};

export type GQLArticle_ArticleFragment = {
  __typename?: 'Article';
  id: number;
  content: string;
  supportedLanguages?: Maybe<Array<string>>;
  grepCodes?: Maybe<Array<string>>;
  oldNdlaUrl?: Maybe<string>;
  introduction?: Maybe<string>;
  conceptIds?: Maybe<Array<number>>;
  metaData?: Maybe<{
    __typename?: 'ArticleMetaData';
    footnotes?: Maybe<
      Array<{
        __typename?: 'FootNote';
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition?: Maybe<string>;
        publisher?: Maybe<string>;
        url?: Maybe<string>;
      }>
    >;
  }>;
  relatedContent?: Maybe<
    Array<{ __typename?: 'RelatedContent'; title: string; url: string }>
  >;
  competenceGoals?: Maybe<
    Array<{ __typename?: 'CompetenceGoal'; type: string }>
  >;
} & GQLLicenseBox_ArticleFragment;

export type GQLArticleContents_TopicFragment = {
  __typename?: 'Topic';
  article?: Maybe<
    {
      __typename?: 'Article';
      id: number;
      content: string;
      created: string;
      updated: string;
      introduction?: Maybe<string>;
      metaData?: Maybe<{
        __typename?: 'ArticleMetaData';
        footnotes?: Maybe<
          Array<{
            __typename?: 'FootNote';
            ref: number;
            authors: Array<string>;
            edition?: Maybe<string>;
            publisher?: Maybe<string>;
            year: string;
            url?: Maybe<string>;
            title: string;
          }>
        >;
      }>;
    } & GQLLicenseBox_ArticleFragment
  >;
};

export type GQLLastLearningpathStepInfo_TopicFragment = {
  __typename?: 'Topic';
  id: string;
} & GQLResources_TopicFragment;

export type GQLLastLearningpathStepInfo_SubjectFragment = {
  __typename?: 'Subject';
  path: string;
  name: string;
};

export type GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLLastLearningpathStepInfo_TopicPathFragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  path: string;
};

export type GQLLearningpath_TopicFragment = {
  __typename?: 'Topic';
} & GQLLastLearningpathStepInfo_TopicFragment &
  GQLLearningpathEmbed_TopicFragment;

export type GQLLearningpath_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment;

export type GQLLearningpath_SubjectFragment = {
  __typename?: 'Subject';
} & GQLLastLearningpathStepInfo_SubjectFragment;

export type GQLLearningpath_LearningpathStepFragment = {
  __typename?: 'LearningpathStep';
  seqNo: number;
  id: number;
  showTitle: boolean;
  title: string;
  description?: Maybe<string>;
  license?: Maybe<{ __typename?: 'License'; license: string }>;
} & GQLLearningpathEmbed_LearningpathStepFragment;

export type GQLLearningpath_ResourceFragment = {
  __typename?: 'Resource';
  path: string;
};

export type GQLLearningpath_TopicPathFragment = {
  __typename?: 'Topic';
} & GQLLastLearningpathStepInfo_TopicPathFragment;

export type GQLLearningpath_LearningpathFragment = {
  __typename?: 'Learningpath';
  id: number;
  title: string;
  lastUpdated: string;
  copyright: {
    __typename?: 'LearningpathCopyright';
    license: { __typename?: 'License'; license: string };
    contributors: Array<{
      __typename?: 'Contributor';
      type: string;
      name: string;
    }>;
  };
  learningsteps: Array<{
    __typename?: 'LearningpathStep';
    title: string;
    id: number;
    resource?: Maybe<{
      __typename?: 'Resource';
      id: string;
      resourceTypes?: Maybe<
        Array<{ __typename?: 'ResourceType'; id: string; name: string }>
      >;
    }>;
  }>;
};

export type GQLLearningpathEmbed_TopicFragment = {
  __typename?: 'Topic';
  supplementaryResources?: Maybe<
    Array<{ __typename?: 'Resource'; id: string }>
  >;
};

export type GQLLearningpathEmbed_LearningpathStepFragment = {
  __typename?: 'LearningpathStep';
  resource?: Maybe<{
    __typename?: 'Resource';
    id: string;
    article?: Maybe<
      {
        __typename?: 'Article';
        id: number;
        metaDescription: string;
        created: string;
        updated: string;
        requiredLibraries?: Maybe<
          Array<{
            __typename?: 'ArticleRequiredLibrary';
            name: string;
            url: string;
            mediaType: string;
          }>
        >;
      } & GQLStructuredArticleDataFragment &
        GQLArticle_ArticleFragment
    >;
  }>;
  embedUrl?: Maybe<{
    __typename?: 'LearningpathStepEmbedUrl';
    embedType: string;
    url: string;
  }>;
  oembed?: Maybe<{
    __typename?: 'LearningpathStepOembed';
    html: string;
    width: number;
    height: number;
  }>;
};

export type GQLSubjectLinkListSubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
};

export type GQLVisualElement_VisualElementFragment = {
  __typename?: 'VisualElement';
  url?: Maybe<string>;
  title?: Maybe<string>;
  image?: Maybe<{
    __typename?: 'ImageElement';
    alt?: Maybe<string>;
    altText: string;
    src: string;
    focalX?: Maybe<number>;
    focalY?: Maybe<number>;
    lowerRightX?: Maybe<number>;
    lowerRightY?: Maybe<number>;
    upperLeftX?: Maybe<number>;
    upperLeftY?: Maybe<number>;
  }>;
  oembed?: Maybe<{
    __typename?: 'VisualElementOembed';
    html?: Maybe<string>;
    fullscreen?: Maybe<boolean>;
    title?: Maybe<string>;
  }>;
  brightcove?: Maybe<{
    __typename?: 'BrightcoveElement';
    iframe?: Maybe<{
      __typename?: 'BrightcoveIframe';
      height: number;
      width: number;
    }>;
  }>;
  h5p?: Maybe<{ __typename?: 'H5pElement'; src?: Maybe<string> }>;
};

export type GQLVisualElementLicenseButtons_VisualElementFragment = {
  __typename?: 'VisualElement';
  copyright?: Maybe<{
    __typename?: 'Copyright';
    license: { __typename?: 'License'; license: string };
  }>;
  image?: Maybe<{
    __typename?: 'ImageElement';
    src: string;
    copyText?: Maybe<string>;
  }>;
  brightcove?: Maybe<{
    __typename?: 'BrightcoveElement';
    download?: Maybe<string>;
    iframe?: Maybe<{
      __typename?: 'BrightcoveIframe';
      width: number;
      height: number;
      src: string;
    }>;
  }>;
};

export type GQLVisualElementWrapper_VisualElementFragment = {
  __typename?: 'VisualElement';
  resource?: Maybe<string>;
  copyright?: Maybe<{
    __typename?: 'Copyright';
    origin?: Maybe<string>;
    license: { __typename?: 'License'; license: string };
    creators: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
    processors: Array<{
      __typename?: 'Contributor';
      name: string;
      type: string;
    }>;
    rightsholders: Array<{
      __typename?: 'Contributor';
      name: string;
      type: string;
    }>;
  }>;
  image?: Maybe<{ __typename?: 'ImageElement'; caption?: Maybe<string> }>;
  brightcove?: Maybe<{
    __typename?: 'BrightcoveElement';
    caption?: Maybe<string>;
  }>;
} & GQLVisualElement_VisualElementFragment &
  GQLVisualElementLicenseButtons_VisualElementFragment;

export type GQLAudioLicenseList_AudioLicenseFragment = {
  __typename?: 'AudioLicense';
  src: string;
  copyText?: Maybe<string>;
  title: string;
  copyright: {
    __typename?: 'Copyright';
    origin?: Maybe<string>;
  } & GQLLicenseListCopyrightFragment;
};

export type GQLConceptLicenseList_ConceptLicenseFragment = {
  __typename?: 'ConceptLicense';
  title: string;
  src?: Maybe<string>;
  copyright?: Maybe<{
    __typename?: 'ConceptCopyright';
    license?: Maybe<{ __typename?: 'License'; license: string }>;
    creators: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
    processors: Array<{
      __typename?: 'Contributor';
      name: string;
      type: string;
    }>;
    rightsholders: Array<{
      __typename?: 'Contributor';
      name: string;
      type: string;
    }>;
  }>;
};

export type GQLH5pLicenseList_H5pLicenseFragment = {
  __typename?: 'H5pLicense';
  title: string;
  src?: Maybe<string>;
  copyright: { __typename?: 'Copyright' } & GQLLicenseListCopyrightFragment;
};

export type GQLImageLicenseList_ImageLicenseFragment = {
  __typename?: 'ImageLicense';
  title: string;
  altText: string;
  src: string;
  copyText?: Maybe<string>;
  copyright: {
    __typename?: 'Copyright';
    origin?: Maybe<string>;
  } & GQLLicenseListCopyrightFragment;
};

export type GQLLicenseBox_ArticleFragment = {
  __typename?: 'Article';
  title: string;
  oembed?: Maybe<string>;
  published: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLTextLicenseList_CopyrightFragment;
  metaData?: Maybe<{
    __typename?: 'ArticleMetaData';
    copyText?: Maybe<string>;
    concepts?: Maybe<
      Array<
        {
          __typename?: 'ConceptLicense';
        } & GQLConceptLicenseList_ConceptLicenseFragment
      >
    >;
    h5ps?: Maybe<
      Array<
        { __typename?: 'H5pLicense' } & GQLH5pLicenseList_H5pLicenseFragment
      >
    >;
    brightcoves?: Maybe<
      Array<
        {
          __typename?: 'BrightcoveLicense';
        } & GQLVideoLicenseList_BrightcoveLicenseFragment
      >
    >;
    audios?: Maybe<
      Array<
        {
          __typename?: 'AudioLicense';
        } & GQLAudioLicenseList_AudioLicenseFragment
      >
    >;
    images?: Maybe<
      Array<
        {
          __typename?: 'ImageLicense';
        } & GQLImageLicenseList_ImageLicenseFragment
      >
    >;
  }>;
};

export type GQLTextLicenseList_CopyrightFragment = {
  __typename?: 'Copyright';
} & GQLLicenseListCopyrightFragment;

export type GQLVideoLicenseList_BrightcoveLicenseFragment = {
  __typename?: 'BrightcoveLicense';
  title: string;
  download?: Maybe<string>;
  src?: Maybe<string>;
  cover?: Maybe<string>;
  iframe?: Maybe<{
    __typename?: 'BrightcoveIframe';
    width: number;
    height: number;
    src: string;
  }>;
  copyright: { __typename?: 'Copyright' } & GQLLicenseListCopyrightFragment;
};

export type GQLLicenseListCopyrightFragment = {
  __typename?: 'Copyright';
  license: { __typename?: 'License'; license: string };
  creators: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
  processors: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
  rightsholders: Array<{
    __typename?: 'Contributor';
    name: string;
    type: string;
  }>;
};

export type GQLAllSubjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAllSubjectsQuery = {
  __typename?: 'Query';
  subjects?: Maybe<
    Array<{ __typename?: 'Subject' } & GQLSubjectLinkListSubjectFragment>
  >;
};

export type GQLArticlePage_ResourceTypeFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLArticlePage_SubjectFragment = {
  __typename?: 'Subject';
  name: string;
} & GQLArticleHero_SubjectFragment;

export type GQLArticlePage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  article?: Maybe<
    {
      __typename?: 'Article';
      created: string;
      updated: string;
      metaDescription: string;
      metaImage?: Maybe<
        { __typename?: 'MetaImage' } & GQLArticleHero_MetaImageFragment
      >;
    } & GQLStructuredArticleDataFragment &
      GQLArticle_ArticleFragment
  >;
};

export type GQLArticlePage_TopicFragment = {
  __typename?: 'Topic';
  path: string;
} & GQLResources_TopicFragment;

export type GQLArticlePage_TopicPathFragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
};

export type GQLArticleHero_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
};

export type GQLArticleHero_MetaImageFragment = {
  __typename?: 'MetaImage';
  url: string;
  alt: string;
};

export type GQLLearningpathPage_TopicFragment = {
  __typename?: 'Topic';
} & GQLLearningpath_TopicFragment;

export type GQLLearningpathPage_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
} & GQLLearningpath_SubjectFragment;

export type GQLLearningpathPage_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLLearningpath_ResourceTypeDefinitionFragment;

export type GQLLearningpathPage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  learningpath?: Maybe<
    {
      __typename?: 'Learningpath';
      supportedLanguages: Array<string>;
      tags: Array<string>;
      description: string;
      coverphoto?: Maybe<{
        __typename?: 'LearningpathCoverphoto';
        url: string;
        metaUrl: string;
      }>;
      learningsteps: Array<
        {
          __typename?: 'LearningpathStep';
          type: string;
        } & GQLLearningpath_LearningpathStepFragment
      >;
    } & GQLLearningpath_LearningpathFragment
  >;
} & GQLLearningpath_ResourceFragment;

export type GQLLearningpathPage_TopicPathFragment = {
  __typename?: 'Topic';
} & GQLLearningpath_TopicPathFragment;

export type GQLMovedResourcePage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  path: string;
  paths: Array<string>;
  breadcrumbs?: Maybe<Array<Array<string>>>;
  article?: Maybe<{
    __typename?: 'Article';
    id: number;
    metaDescription: string;
    metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
  }>;
  learningpath?: Maybe<{
    __typename?: 'Learningpath';
    id: number;
    description: string;
    coverphoto?: Maybe<{ __typename?: 'LearningpathCoverphoto'; url: string }>;
  }>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

export type GQLResourcePageQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId: Scalars['String'];
  resourceId: Scalars['String'];
}>;

export type GQLResourcePageQuery = {
  __typename?: 'Query';
  subject?: Maybe<
    {
      __typename?: 'Subject';
      topics?: Maybe<
        Array<
          { __typename?: 'Topic' } & GQLLearningpathPage_TopicPathFragment &
            GQLArticlePage_TopicPathFragment
        >
      >;
    } & GQLLearningpathPage_SubjectFragment &
      GQLArticlePage_SubjectFragment
  >;
  resourceTypes?: Maybe<
    Array<
      {
        __typename?: 'ResourceTypeDefinition';
      } & GQLArticlePage_ResourceTypeFragment &
        GQLLearningpathPage_ResourceTypeDefinitionFragment
    >
  >;
  topic?: Maybe<
    { __typename?: 'Topic' } & GQLLearningpathPage_TopicFragment &
      GQLArticlePage_TopicFragment
  >;
  resource?: Maybe<
    {
      __typename?: 'Resource';
      relevanceId?: Maybe<string>;
      paths: Array<string>;
    } & GQLMovedResourcePage_ResourceFragment &
      GQLArticlePage_ResourceFragment &
      GQLLearningpathPage_ResourceFragment
  >;
};

export type GQLResources_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path: string;
  paths: Array<string>;
  rank?: Maybe<number>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

export type GQLResources_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
  id: string;
  name: string;
};

export type GQLResources_TopicFragment = {
  __typename?: 'Topic';
  name: string;
  coreResources?: Maybe<
    Array<{ __typename?: 'Resource' } & GQLResources_ResourceFragment>
  >;
  supplementaryResources?: Maybe<
    Array<{ __typename?: 'Resource' } & GQLResources_ResourceFragment>
  >;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
};

export type GQLSubjectContainer_SubjectFragment = {
  __typename?: 'Subject';
  grepCodes: Array<string>;
  topics?: Maybe<
    Array<{
      __typename?: 'Topic';
      id: string;
      supportedLanguages: Array<string>;
    }>
  >;
  allTopics?: Maybe<
    Array<{
      __typename?: 'Topic';
      id: string;
      name: string;
      meta?: Maybe<{
        __typename?: 'Meta';
        metaDescription?: Maybe<string>;
        metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string }>;
      }>;
    }>
  >;
  subjectpage?: Maybe<{
    __typename?: 'SubjectPage';
    metaDescription?: Maybe<string>;
    about?: Maybe<{
      __typename?: 'SubjectPageAbout';
      title: string;
      visualElement: { __typename?: 'SubjectPageVisualElement'; url: string };
    }>;
    banner: { __typename?: 'SubjectPageBanner'; desktopUrl: string };
  }>;
} & GQLSubjectPageContent_SubjectFragment;

export type GQLSubjectPageTestQueryVariables = Exact<{
  subjectId: Scalars['String'];
  topicId: Scalars['String'];
  includeTopic: Scalars['Boolean'];
  metadataFilterKey?: Maybe<Scalars['String']>;
  metadataFilterValue?: Maybe<Scalars['String']>;
}>;

export type GQLSubjectPageTestQuery = {
  __typename?: 'Query';
  subject?: Maybe<
    { __typename?: 'Subject' } & GQLSubjectContainer_SubjectFragment
  >;
  topic?: Maybe<{
    __typename?: 'Topic';
    alternateTopics?: Maybe<
      Array<{ __typename?: 'Topic' } & GQLMovedTopicPage_TopicFragment>
    >;
  }>;
  subjects?: Maybe<
    Array<{
      __typename?: 'Subject';
      path: string;
      metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
    }>
  >;
};

export type GQLMovedTopicPage_TopicFragment = {
  __typename?: 'Topic';
  id: string;
  path: string;
  name: string;
  breadcrumbs?: Maybe<Array<Array<string>>>;
  meta?: Maybe<{
    __typename?: 'Meta';
    metaDescription?: Maybe<string>;
    metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
  }>;
};

export type GQLSubjectPageAbout_SubjectPageAboutFragment = {
  __typename?: 'SubjectPageAbout';
  title: string;
  description: string;
  visualElement: {
    __typename?: 'SubjectPageVisualElement';
    type: string;
    url: string;
    alt?: Maybe<string>;
  };
};

export type GQLSubjectPageContent_SubjectFragment = {
  __typename?: 'Subject';
  topics?: Maybe<
    Array<{
      __typename?: 'Topic';
      name: string;
      id: string;
      availability?: Maybe<string>;
      relevanceId?: Maybe<string>;
    }>
  >;
} & GQLTopicWrapper_SubjectFragment;

export type GQLSubjectPageInformation_SubjectPageFragment = {
  __typename?: 'SubjectPage';
  topical?: Maybe<
    | ({ __typename?: 'Resource' } & GQLSubjectTopical_TaxonomyEntityFragment)
    | { __typename?: 'Subject' }
    | { __typename?: 'Topic' }
  >;
  about?: Maybe<
    {
      __typename?: 'SubjectPageAbout';
    } & GQLSubjectPageAbout_SubjectPageAboutFragment
  >;
};

export type GQLSubjectTopical_TaxonomyEntityFragment = {
  __typename?: 'Resource';
  path: string;
  meta?: Maybe<{
    __typename?: 'Meta';
    title: string;
    metaDescription?: Maybe<string>;
    metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
  }>;
};

export type GQLTopic_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  allTopics?: Maybe<Array<{ __typename?: 'Topic'; id: string; name: string }>>;
};

export type GQLTopic_TopicFragment = {
  __typename?: 'Topic';
  path: string;
  name: string;
  relevanceId?: Maybe<string>;
  subtopics?: Maybe<
    Array<{
      __typename?: 'Topic';
      id: string;
      name: string;
      relevanceId?: Maybe<string>;
    }>
  >;
  article?: Maybe<{
    __typename?: 'Article';
    metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
    visualElement?: Maybe<
      {
        __typename?: 'VisualElement';
      } & GQLVisualElementWrapper_VisualElementFragment
    >;
  }>;
} & GQLArticleContents_TopicFragment &
  GQLResources_TopicFragment;

export type GQLTopic_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLTopicWrapperQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
}>;

export type GQLTopicWrapperQuery = {
  __typename?: 'Query';
  topic?: Maybe<{ __typename?: 'Topic'; id: string } & GQLTopic_TopicFragment>;
  resourceTypes?: Maybe<
    Array<
      {
        __typename?: 'ResourceTypeDefinition';
      } & GQLTopic_ResourceTypeDefinitionFragment
    >
  >;
};

export type GQLTopicWrapper_SubjectFragment = {
  __typename?: 'Subject';
} & GQLTopic_SubjectFragment;

export type GQLIframeArticlePage_ArticleFragment = {
  __typename?: 'Article';
  created: string;
  updated: string;
  metaDescription: string;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string }>;
} & GQLArticle_ArticleFragment;

export type GQLIframeArticlePage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  path: string;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

export type GQLIframePageQueryVariables = Exact<{
  articleId: Scalars['String'];
  isOembed?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  taxonomyId: Scalars['String'];
  includeResource: Scalars['Boolean'];
  includeTopic: Scalars['Boolean'];
}>;

export type GQLIframePageQuery = {
  __typename?: 'Query';
  article?: Maybe<
    { __typename?: 'Article' } & GQLIframeTopicPage_ArticleFragment &
      GQLIframeArticlePage_ArticleFragment
  >;
  resource?: Maybe<
    { __typename?: 'Resource' } & GQLIframeArticlePage_ResourceFragment
  >;
  topic?: Maybe<{ __typename?: 'Topic' } & GQLIframeTopicPage_TopicFragment>;
};

export type GQLIframeTopicPage_ArticleFragment = {
  __typename?: 'Article';
  created: string;
} & GQLArticle_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLIframeTopicPage_TopicFragment = {
  __typename?: 'Topic';
  path: string;
};

export type GQLContributorInfoFragment = {
  __typename?: 'Contributor';
  name: string;
  type: string;
};

export type GQLSearchQueryVariables = Exact<{
  query?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  contextTypes?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Scalars['Int']> | Scalars['Int']>;
  resourceTypes?: Maybe<Scalars['String']>;
  contextFilters?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  languageFilter?: Maybe<Scalars['String']>;
  relevance?: Maybe<Scalars['String']>;
  grepCodes?: Maybe<Scalars['String']>;
}>;

export type GQLSearchQuery = {
  __typename?: 'Query';
  search?: Maybe<{
    __typename?: 'Search';
    language: string;
    page?: Maybe<number>;
    pageSize: number;
    totalCount: number;
    results: Array<
      | {
          __typename?: 'ArticleSearchResult';
          id: number;
          url: string;
          metaDescription: string;
          title: string;
          supportedLanguages: Array<string>;
          traits: Array<string>;
          metaImage?: Maybe<{
            __typename?: 'MetaImage';
            url: string;
            alt: string;
          }>;
          contexts: Array<{
            __typename?: 'SearchContext';
            id: string;
            breadcrumbs: Array<string>;
            relevance: string;
            language: string;
            learningResourceType: string;
            path: string;
            subject: string;
            subjectId: string;
            resourceTypes: Array<{
              __typename?: 'SearchContextResourceTypes';
              id: string;
              name: string;
              language: string;
            }>;
          }>;
        }
      | {
          __typename?: 'LearningpathSearchResult';
          id: number;
          url: string;
          metaDescription: string;
          title: string;
          supportedLanguages: Array<string>;
          traits: Array<string>;
          metaImage?: Maybe<{
            __typename?: 'MetaImage';
            url: string;
            alt: string;
          }>;
          contexts: Array<{
            __typename?: 'SearchContext';
            id: string;
            breadcrumbs: Array<string>;
            relevance: string;
            language: string;
            learningResourceType: string;
            path: string;
            subject: string;
            subjectId: string;
            resourceTypes: Array<{
              __typename?: 'SearchContextResourceTypes';
              id: string;
              name: string;
              language: string;
            }>;
          }>;
        }
    >;
    suggestions: Array<{
      __typename?: 'SuggestionResult';
      name: string;
      suggestions: Array<{
        __typename?: 'SearchSuggestion';
        text: string;
        offset: number;
        length: number;
        options: Array<{
          __typename?: 'SuggestOption';
          text: string;
          score: number;
        }>;
      }>;
    }>;
  }>;
};

export type GQLSearchFilmArticleSearchResultFragment = {
  __typename?: 'ArticleSearchResult';
  id: number;
  url: string;
  metaDescription: string;
  title: string;
  supportedLanguages: Array<string>;
  traits: Array<string>;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
  contexts: Array<{
    __typename?: 'SearchContext';
    breadcrumbs: Array<string>;
    relevance: string;
    language: string;
    learningResourceType: string;
    path: string;
    subject: string;
    resourceTypes: Array<{
      __typename?: 'SearchContextResourceTypes';
      id: string;
      name: string;
      language: string;
    }>;
  }>;
};

export type GQLSearchFilmLearningpathSearchResultFragment = {
  __typename?: 'LearningpathSearchResult';
  id: number;
  url: string;
  metaDescription: string;
  title: string;
  supportedLanguages: Array<string>;
  traits: Array<string>;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
  contexts: Array<{
    __typename?: 'SearchContext';
    breadcrumbs: Array<string>;
    relevance: string;
    language: string;
    learningResourceType: string;
    path: string;
    subject: string;
    resourceTypes: Array<{
      __typename?: 'SearchContextResourceTypes';
      id: string;
      name: string;
      language: string;
    }>;
  }>;
};

export type GQLSearchWithoutPaginationQueryVariables = Exact<{
  query?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Scalars['Int']> | Scalars['Int']>;
  resourceTypes?: Maybe<Scalars['String']>;
  contextFilters?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  languageFilter?: Maybe<Scalars['String']>;
  relevance?: Maybe<Scalars['String']>;
}>;

export type GQLSearchWithoutPaginationQuery = {
  __typename?: 'Query';
  searchWithoutPagination?: Maybe<{
    __typename?: 'SearchWithoutPagination';
    results: Array<
      | ({
          __typename?: 'ArticleSearchResult';
        } & GQLSearchFilmArticleSearchResultFragment)
      | ({
          __typename?: 'LearningpathSearchResult';
        } & GQLSearchFilmLearningpathSearchResultFragment)
    >;
  }>;
};

export type GQLGroupSearchResourceFragment = {
  __typename?: 'GroupSearchResult';
  id: number;
  path: string;
  name: string;
  ingress: string;
  traits: Array<string>;
  contexts: Array<{
    __typename?: 'SearchContext';
    language: string;
    path: string;
    breadcrumbs: Array<string>;
    subjectId: string;
    subject: string;
    relevance: string;
    resourceTypes: Array<{
      __typename?: 'SearchContextResourceTypes';
      id: string;
      name: string;
    }>;
  }>;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
};

export type GQLGroupSearchQueryVariables = Exact<{
  resourceTypes?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  language?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  grepCodes?: Maybe<Scalars['String']>;
  aggregatePaths?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  grepCodesList?: Maybe<
    Array<Maybe<Scalars['String']>> | Maybe<Scalars['String']>
  >;
}>;

export type GQLGroupSearchQuery = {
  __typename?: 'Query';
  groupSearch?: Maybe<
    Array<{
      __typename?: 'GroupSearch';
      resourceType: string;
      totalCount: number;
      language: string;
      resources: Array<
        { __typename?: 'GroupSearchResult' } & GQLGroupSearchResourceFragment
      >;
      aggregations: Array<{
        __typename?: 'AggregationResult';
        values: Array<{ __typename?: 'BucketResult'; value: string }>;
      }>;
      suggestions: Array<{
        __typename?: 'SuggestionResult';
        suggestions: Array<{
          __typename?: 'SearchSuggestion';
          options: Array<{ __typename?: 'SuggestOption'; text: string }>;
        }>;
      }>;
    }>
  >;
  competenceGoals?: Maybe<
    Array<{
      __typename?: 'CompetenceGoal';
      id: string;
      type: string;
      name: string;
      curriculum?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
      competenceGoalSet?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
    }>
  >;
};

export type GQLConceptSearchConceptFragment = {
  __typename?: 'Concept';
  id: number;
  title: string;
  text: string;
  image: { __typename?: 'MetaImage'; url: string; alt: string };
};

export type GQLConceptSearchQueryVariables = Exact<{
  query?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  exactMatch?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['Boolean']>;
}>;

export type GQLConceptSearchQuery = {
  __typename?: 'Query';
  conceptSearch?: Maybe<{
    __typename?: 'ConceptResult';
    concepts: Array<
      { __typename?: 'Concept' } & GQLConceptSearchConceptFragment
    >;
  }>;
};

export type GQLFrontpageSearchQueryVariables = Exact<{
  query?: Maybe<Scalars['String']>;
}>;

export type GQLFrontpageSearchQuery = {
  __typename?: 'Query';
  frontpageSearch?: Maybe<{
    __typename?: 'FrontpageSearch';
    topicResources: {
      __typename?: 'FrontPageResources';
      totalCount: number;
      results: Array<{
        __typename?: 'FrontpageSearchResult';
        id: string;
        name: string;
        path: string;
        subject: string;
        resourceTypes: Array<{
          __typename?: 'SearchContextResourceTypes';
          name: string;
        }>;
      }>;
      suggestions: Array<{
        __typename?: 'SuggestionResult';
        suggestions: Array<{
          __typename?: 'SearchSuggestion';
          options: Array<{
            __typename?: 'SuggestOption';
            text: string;
            score: number;
          }>;
        }>;
      }>;
    };
    learningResources: {
      __typename?: 'FrontPageResources';
      totalCount: number;
      results: Array<{
        __typename?: 'FrontpageSearchResult';
        id: string;
        name: string;
        path: string;
        subject: string;
        resourceTypes: Array<{
          __typename?: 'SearchContextResourceTypes';
          name: string;
        }>;
      }>;
      suggestions: Array<{
        __typename?: 'SuggestionResult';
        suggestions: Array<{
          __typename?: 'SearchSuggestion';
          options: Array<{
            __typename?: 'SuggestOption';
            text: string;
            score: number;
          }>;
        }>;
      }>;
    };
  }>;
};

export type GQLConceptCopyrightInfoFragment = {
  __typename?: 'ConceptCopyright';
  origin?: Maybe<string>;
  license?: Maybe<{
    __typename?: 'License';
    license: string;
    url?: Maybe<string>;
  }>;
  creators: Array<{ __typename?: 'Contributor' } & GQLContributorInfoFragment>;
  processors: Array<
    { __typename?: 'Contributor' } & GQLContributorInfoFragment
  >;
  rightsholders: Array<
    { __typename?: 'Contributor' } & GQLContributorInfoFragment
  >;
};

export type GQLCopyrightInfoFragment = {
  __typename?: 'Copyright';
  origin?: Maybe<string>;
  license: { __typename?: 'License'; license: string; url?: Maybe<string> };
  creators: Array<{ __typename?: 'Contributor' } & GQLContributorInfoFragment>;
  processors: Array<
    { __typename?: 'Contributor' } & GQLContributorInfoFragment
  >;
  rightsholders: Array<
    { __typename?: 'Contributor' } & GQLContributorInfoFragment
  >;
};

export type GQLMetaInfoFragment = {
  __typename?: 'Meta';
  id: number;
  title: string;
  introduction?: Maybe<string>;
  metaDescription?: Maybe<string>;
  lastUpdated?: Maybe<string>;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
};

export type GQLTopicInfoFragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path: string;
  parent?: Maybe<string>;
  relevanceId?: Maybe<string>;
  supportedLanguages: Array<string>;
  meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
};

export type GQLSubjectInfoFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  path: string;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
};

export type GQLResourceInfoFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path: string;
  paths: Array<string>;
  relevanceId?: Maybe<string>;
  rank?: Maybe<number>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

export type GQLVisualElementInfoFragment = {
  __typename?: 'VisualElement';
  title?: Maybe<string>;
  resource?: Maybe<string>;
  url?: Maybe<string>;
  language?: Maybe<string>;
  embed?: Maybe<string>;
  copyright?: Maybe<{ __typename?: 'Copyright' } & GQLCopyrightInfoFragment>;
  brightcove?: Maybe<{
    __typename?: 'BrightcoveElement';
    videoid?: Maybe<string>;
    player?: Maybe<string>;
    account?: Maybe<string>;
    caption?: Maybe<string>;
    description?: Maybe<string>;
    cover?: Maybe<string>;
    src?: Maybe<string>;
    download?: Maybe<string>;
    uploadDate?: Maybe<string>;
    iframe?: Maybe<{
      __typename?: 'BrightcoveIframe';
      src: string;
      height: number;
      width: number;
    }>;
  }>;
  h5p?: Maybe<{
    __typename?: 'H5pElement';
    src?: Maybe<string>;
    thumbnail?: Maybe<string>;
  }>;
  oembed?: Maybe<{
    __typename?: 'VisualElementOembed';
    title?: Maybe<string>;
    html?: Maybe<string>;
    fullscreen?: Maybe<boolean>;
  }>;
  image?: Maybe<{
    __typename?: 'ImageElement';
    resourceid?: Maybe<string>;
    alt?: Maybe<string>;
    caption?: Maybe<string>;
    lowerRightX?: Maybe<number>;
    lowerRightY?: Maybe<number>;
    upperLeftX?: Maybe<number>;
    upperLeftY?: Maybe<number>;
    focalX?: Maybe<number>;
    focalY?: Maybe<number>;
    src: string;
    altText: string;
    contentType?: Maybe<string>;
    copyText?: Maybe<string>;
  }>;
};

export type GQLArticleInfoFragment = {
  __typename?: 'Article';
  id: number;
  title: string;
  introduction?: Maybe<string>;
  content: string;
  articleType: string;
  revision: number;
  metaDescription: string;
  supportedLanguages?: Maybe<Array<string>>;
  tags?: Maybe<Array<string>>;
  created: string;
  updated: string;
  published: string;
  oldNdlaUrl?: Maybe<string>;
  grepCodes?: Maybe<Array<string>>;
  oembed?: Maybe<string>;
  conceptIds?: Maybe<Array<number>>;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string; alt: string }>;
  requiredLibraries?: Maybe<
    Array<{
      __typename?: 'ArticleRequiredLibrary';
      name: string;
      url: string;
      mediaType: string;
    }>
  >;
  metaData?: Maybe<{
    __typename?: 'ArticleMetaData';
    copyText?: Maybe<string>;
    footnotes?: Maybe<
      Array<{
        __typename?: 'FootNote';
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition?: Maybe<string>;
        publisher?: Maybe<string>;
        url?: Maybe<string>;
      }>
    >;
    images?: Maybe<
      Array<{
        __typename?: 'ImageLicense';
        title: string;
        altText: string;
        src: string;
        copyText?: Maybe<string>;
        copyright: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
      }>
    >;
    h5ps?: Maybe<
      Array<{
        __typename?: 'H5pLicense';
        title: string;
        src?: Maybe<string>;
        copyright: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
      }>
    >;
    audios?: Maybe<
      Array<{
        __typename?: 'AudioLicense';
        title: string;
        src: string;
        copyText?: Maybe<string>;
        copyright: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
      }>
    >;
    brightcoves?: Maybe<
      Array<{
        __typename?: 'BrightcoveLicense';
        title: string;
        description?: Maybe<string>;
        cover?: Maybe<string>;
        src?: Maybe<string>;
        download?: Maybe<string>;
        uploadDate?: Maybe<string>;
        iframe?: Maybe<{
          __typename?: 'BrightcoveIframe';
          height: number;
          src: string;
          width: number;
        }>;
        copyright: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
      }>
    >;
    concepts?: Maybe<
      Array<{
        __typename?: 'ConceptLicense';
        title: string;
        src?: Maybe<string>;
        copyright?: Maybe<
          { __typename?: 'ConceptCopyright' } & GQLConceptCopyrightInfoFragment
        >;
      }>
    >;
  }>;
  competenceGoals?: Maybe<
    Array<{
      __typename?: 'CompetenceGoal';
      id: string;
      title: string;
      type: string;
      curriculum?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
      competenceGoalSet?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
    }>
  >;
  coreElements?: Maybe<
    Array<{
      __typename?: 'CoreElement';
      id: string;
      title: string;
      description?: Maybe<string>;
      curriculum?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
    }>
  >;
  copyright: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
  visualElement?: Maybe<
    { __typename?: 'VisualElement' } & GQLVisualElementInfoFragment
  >;
  concepts?: Maybe<
    Array<{
      __typename?: 'Concept';
      id: number;
      title: string;
      content: string;
      subjectNames?: Maybe<Array<string>>;
      copyright?: Maybe<
        { __typename?: 'ConceptCopyright' } & GQLConceptCopyrightInfoFragment
      >;
      visualElement?: Maybe<
        { __typename?: 'VisualElement' } & GQLVisualElementInfoFragment
      >;
    }>
  >;
  relatedContent?: Maybe<
    Array<{ __typename?: 'RelatedContent'; title: string; url: string }>
  >;
};

type GQLTaxonomyEntityInfo_Resource_Fragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path: string;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

type GQLTaxonomyEntityInfo_Subject_Fragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path: string;
};

type GQLTaxonomyEntityInfo_Topic_Fragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path: string;
};

export type GQLTaxonomyEntityInfoFragment =
  | GQLTaxonomyEntityInfo_Resource_Fragment
  | GQLTaxonomyEntityInfo_Subject_Fragment
  | GQLTaxonomyEntityInfo_Topic_Fragment;

type GQLWithArticleInfo_Resource_Fragment = {
  __typename?: 'Resource';
  meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
};

type GQLWithArticleInfo_Topic_Fragment = {
  __typename?: 'Topic';
  meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
};

export type GQLWithArticleInfoFragment =
  | GQLWithArticleInfo_Resource_Fragment
  | GQLWithArticleInfo_Topic_Fragment;

export type GQLSubjectPageInfoFragment = {
  __typename?: 'SubjectPage';
  id: number;
  metaDescription?: Maybe<string>;
  topical?: Maybe<
    | ({ __typename?: 'Resource' } & GQLTaxonomyEntityInfo_Resource_Fragment)
    | ({ __typename?: 'Subject' } & GQLTaxonomyEntityInfo_Subject_Fragment)
    | ({ __typename?: 'Topic' } & GQLTaxonomyEntityInfo_Topic_Fragment)
  >;
  banner: { __typename?: 'SubjectPageBanner'; desktopUrl: string };
  about?: Maybe<{
    __typename?: 'SubjectPageAbout';
    title: string;
    description: string;
    visualElement: {
      __typename?: 'SubjectPageVisualElement';
      type: string;
      url: string;
      alt?: Maybe<string>;
    };
  }>;
  editorsChoices: Array<
    | ({ __typename?: 'Resource' } & GQLTaxonomyEntityInfo_Resource_Fragment)
    | ({ __typename?: 'Subject' } & GQLTaxonomyEntityInfo_Subject_Fragment)
    | ({ __typename?: 'Topic' } & GQLTaxonomyEntityInfo_Topic_Fragment)
  >;
};

export type GQLSubjectPageWithTopicsQueryVariables = Exact<{
  subjectId: Scalars['String'];
  topicId: Scalars['String'];
  includeTopic: Scalars['Boolean'];
  metadataFilterKey?: Maybe<Scalars['String']>;
  metadataFilterValue?: Maybe<Scalars['String']>;
}>;

export type GQLSubjectPageWithTopicsQuery = {
  __typename?: 'Query';
  subject?: Maybe<
    {
      __typename?: 'Subject';
      grepCodes: Array<string>;
      topics?: Maybe<
        Array<
          {
            __typename?: 'Topic';
            supportedLanguages: Array<string>;
            availability?: Maybe<string>;
          } & GQLTopicInfoFragment
        >
      >;
      allTopics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
      subjectpage?: Maybe<
        { __typename?: 'SubjectPage' } & GQLSubjectPageInfoFragment
      >;
    } & GQLSubjectInfoFragment
  >;
  topic?: Maybe<
    {
      __typename?: 'Topic';
      alternateTopics?: Maybe<
        Array<{
          __typename?: 'Topic';
          id: string;
          name: string;
          path: string;
          supportedLanguages: Array<string>;
          breadcrumbs?: Maybe<Array<Array<string>>>;
          meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
        }>
      >;
    } & GQLTopicInfoFragment
  >;
  subjects?: Maybe<
    Array<
      {
        __typename?: 'Subject';
        metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
      } & GQLSubjectInfoFragment
    >
  >;
};

export type GQLSubjectPageQueryInfoFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  path: string;
  topics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
};

export type GQLSubjectPageQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLSubjectPageQuery = {
  __typename?: 'Query';
  subject?: Maybe<
    {
      __typename?: 'Subject';
      allTopics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
      subjectpage?: Maybe<
        { __typename?: 'SubjectPage' } & GQLSubjectPageInfoFragment
      >;
    } & GQLSubjectPageQueryInfoFragment
  >;
};

export type GQLMultiDisciplinarySubjectPageQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLMultiDisciplinarySubjectPageQuery = {
  __typename?: 'Query';
  subject?: Maybe<
    {
      __typename?: 'Subject';
      allTopics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
    } & GQLSubjectPageQueryInfoFragment
  >;
};

export type GQLFilmSubjectPageQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLFilmSubjectPageQuery = {
  __typename?: 'Query';
  subject?: Maybe<{ __typename?: 'Subject' } & GQLSubjectPageQueryInfoFragment>;
};

export type GQLSearchPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSearchPageQuery = {
  __typename?: 'Query';
  subjects?: Maybe<Array<{ __typename?: 'Subject' } & GQLSubjectInfoFragment>>;
  resourceTypes?: Maybe<
    Array<{
      __typename?: 'ResourceTypeDefinition';
      id: string;
      name: string;
      subtypes?: Maybe<
        Array<{
          __typename?: 'ResourceTypeDefinition';
          id: string;
          name: string;
        }>
      >;
    }>
  >;
};

export type GQLLearningpathInfoFragment = {
  __typename?: 'Learningpath';
  id: number;
  title: string;
  description: string;
  duration?: Maybe<number>;
  lastUpdated: string;
  supportedLanguages: Array<string>;
  tags: Array<string>;
  copyright: {
    __typename?: 'LearningpathCopyright';
    license: {
      __typename?: 'License';
      license: string;
      url?: Maybe<string>;
      description?: Maybe<string>;
    };
    contributors: Array<
      { __typename?: 'Contributor' } & GQLContributorInfoFragment
    >;
  };
  coverphoto?: Maybe<{
    __typename?: 'LearningpathCoverphoto';
    url: string;
    metaUrl: string;
  }>;
  learningsteps: Array<{
    __typename?: 'LearningpathStep';
    id: number;
    title: string;
    description?: Maybe<string>;
    seqNo: number;
    type: string;
    showTitle: boolean;
    oembed?: Maybe<{
      __typename?: 'LearningpathStepOembed';
      type: string;
      version: string;
      height: number;
      html: string;
      width: number;
    }>;
    embedUrl?: Maybe<{
      __typename?: 'LearningpathStepEmbedUrl';
      url: string;
      embedType: string;
    }>;
    resource?: Maybe<
      {
        __typename?: 'Resource';
        article?: Maybe<
          {
            __typename?: 'Article';
            oembed?: Maybe<string>;
          } & GQLArticleInfoFragment
        >;
      } & GQLResourceInfoFragment
    >;
    license?: Maybe<{
      __typename?: 'License';
      license: string;
      url?: Maybe<string>;
      description?: Maybe<string>;
    }>;
  }>;
};

export type GQLMovedResourceQueryVariables = Exact<{
  resourceId: Scalars['String'];
}>;

export type GQLMovedResourceQuery = {
  __typename?: 'Query';
  resource?: Maybe<{
    __typename?: 'Resource';
    breadcrumbs?: Maybe<Array<Array<string>>>;
  }>;
};

export type GQLPlainArticleQueryVariables = Exact<{
  articleId: Scalars['String'];
  isOembed?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
}>;

export type GQLPlainArticleQuery = {
  __typename?: 'Query';
  article?: Maybe<{ __typename?: 'Article' } & GQLArticleInfoFragment>;
};

export type GQLIframeResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  path: string;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

export type GQLIframeArticleQueryVariables = Exact<{
  articleId: Scalars['String'];
  isOembed?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  taxonomyId: Scalars['String'];
  includeResource: Scalars['Boolean'];
  includeTopic: Scalars['Boolean'];
}>;

export type GQLIframeArticleQuery = {
  __typename?: 'Query';
  article?: Maybe<{ __typename?: 'Article' } & GQLArticleInfoFragment>;
  resource?: Maybe<{ __typename?: 'Resource' } & GQLIframeResourceFragment>;
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path: string;
  }>;
};

export type GQLTopicWithPathTopicsQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId: Scalars['String'];
  showVisualElement?: Maybe<Scalars['String']>;
}>;

export type GQLTopicWithPathTopicsQuery = {
  __typename?: 'Query';
  subject?: Maybe<{
    __typename?: 'Subject';
    id: string;
    name: string;
    path: string;
    topics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
    allTopics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
  }>;
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path: string;
    relevanceId?: Maybe<string>;
    pathTopics?: Maybe<
      Array<
        Array<{ __typename?: 'Topic'; id: string; name: string; path: string }>
      >
    >;
    meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
    metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
    subtopics?: Maybe<
      Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        relevanceId?: Maybe<string>;
      }>
    >;
    article?: Maybe<
      {
        __typename?: 'Article';
        crossSubjectTopics?: Maybe<
          Array<{
            __typename?: 'CrossSubjectElement';
            code?: Maybe<string>;
            title: string;
            path?: Maybe<string>;
          }>
        >;
      } & GQLArticleInfoFragment
    >;
    coreResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
    supplementaryResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
  }>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceTypeDefinition'; id: string; name: string }>
  >;
};

export type GQLTopicQueryTopicFragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  path: string;
  parent?: Maybe<string>;
  relevanceId?: Maybe<string>;
  meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
  subtopics?: Maybe<
    Array<{
      __typename?: 'Topic';
      id: string;
      name: string;
      relevanceId?: Maybe<string>;
    }>
  >;
  article?: Maybe<{ __typename?: 'Article' } & GQLArticleInfoFragment>;
  coreResources?: Maybe<
    Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
  >;
  supplementaryResources?: Maybe<
    Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
  >;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
};

export type GQLTopicQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
}>;

export type GQLTopicQuery = {
  __typename?: 'Query';
  topic?: Maybe<{ __typename?: 'Topic' } & GQLTopicQueryTopicFragment>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceTypeDefinition'; id: string; name: string }>
  >;
};

export type GQLLearningPathStepQueryVariables = Exact<{
  pathId: Scalars['String'];
}>;

export type GQLLearningPathStepQuery = {
  __typename?: 'Query';
  learningpath?: Maybe<
    { __typename?: 'Learningpath' } & GQLLearningpathInfoFragment
  >;
};

export type GQLCompetenceGoalsQueryVariables = Exact<{
  codes?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  nodeId?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
}>;

export type GQLCompetenceGoalsQuery = {
  __typename?: 'Query';
  competenceGoals?: Maybe<
    Array<{
      __typename?: 'CompetenceGoal';
      id: string;
      type: string;
      name: string;
      curriculum?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
      competenceGoalSet?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
    }>
  >;
  coreElements?: Maybe<
    Array<{
      __typename?: 'CoreElement';
      id: string;
      name: string;
      text?: Maybe<string>;
      curriculum?: Maybe<{
        __typename?: 'Reference';
        id: string;
        title: string;
      }>;
    }>
  >;
};

export type GQLMovieInfoFragment = {
  __typename?: 'Movie';
  id: string;
  title: string;
  metaDescription: string;
  path: string;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; alt: string; url: string }>;
  resourceTypes: Array<{
    __typename?: 'ResourceType';
    id: string;
    name: string;
  }>;
};

export type GQLFilmFrontPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLFilmFrontPageQuery = {
  __typename?: 'Query';
  filmfrontpage?: Maybe<{
    __typename?: 'FilmFrontpage';
    name: string;
    about: Array<{
      __typename?: 'FilmPageAbout';
      title: string;
      description: string;
      language: string;
      visualElement: {
        __typename?: 'SubjectPageVisualElement';
        type: string;
        alt?: Maybe<string>;
        url: string;
      };
    }>;
    movieThemes: Array<{
      __typename?: 'MovieTheme';
      name: Array<{ __typename?: 'Name'; name: string; language: string }>;
      movies: Array<{ __typename?: 'Movie' } & GQLMovieInfoFragment>;
    }>;
    slideShow: Array<{ __typename?: 'Movie' } & GQLMovieInfoFragment>;
  }>;
};

export type GQLMastHeadQueryVariables = Exact<{
  subjectId: Scalars['String'];
  topicId: Scalars['String'];
  resourceId: Scalars['String'];
  skipTopic: Scalars['Boolean'];
  skipResource: Scalars['Boolean'];
}>;

export type GQLMastHeadQuery = {
  __typename?: 'Query';
  subject?: Maybe<{
    __typename?: 'Subject';
    id: string;
    name: string;
    path: string;
    topics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
  }>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceTypeDefinition'; id: string; name: string }>
  >;
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
    coreResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
    supplementaryResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
  }>;
  resource?: Maybe<
    {
      __typename?: 'Resource';
      article?: Maybe<{ __typename?: 'Article' } & GQLArticleInfoFragment>;
      learningpath?: Maybe<
        { __typename?: 'Learningpath' } & GQLLearningpathInfoFragment
      >;
    } & GQLResourceInfoFragment
  >;
};

export type GQLAlertsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAlertsQuery = {
  __typename?: 'Query';
  alerts?: Maybe<
    Array<
      Maybe<{ __typename?: 'UptimeAlert'; title: string; body?: Maybe<string> }>
    >
  >;
};

export type GQLStructuredArticleData_CopyrightFragment = {
  __typename?: 'Copyright';
  license: { __typename?: 'License'; url?: Maybe<string> };
  creators: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
  processors: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
  rightsholders: Array<{
    __typename?: 'Contributor';
    name: string;
    type: string;
  }>;
};

export type GQLStructuredArticleData_ImageLicenseFragment = {
  __typename?: 'ImageLicense';
  src: string;
  title: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleData_AudioLicenseFragment = {
  __typename?: 'AudioLicense';
  src: string;
  title: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleData_BrightcoveLicenseFragment = {
  __typename?: 'BrightcoveLicense';
  src?: Maybe<string>;
  title: string;
  cover?: Maybe<string>;
  description?: Maybe<string>;
  download?: Maybe<string>;
  uploadDate?: Maybe<string>;
  copyright: {
    __typename?: 'Copyright';
  } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleDataFragment = {
  __typename?: 'Article';
  title: string;
  metaDescription: string;
  published: string;
  updated: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLStructuredArticleData_CopyrightFragment;
  metaImage?: Maybe<{ __typename?: 'MetaImage'; url: string }>;
  metaData?: Maybe<{
    __typename?: 'ArticleMetaData';
    images?: Maybe<
      Array<
        {
          __typename?: 'ImageLicense';
        } & GQLStructuredArticleData_ImageLicenseFragment
      >
    >;
    audios?: Maybe<
      Array<
        {
          __typename?: 'AudioLicense';
        } & GQLStructuredArticleData_AudioLicenseFragment
      >
    >;
    brightcoves?: Maybe<
      Array<
        {
          __typename?: 'BrightcoveLicense';
        } & GQLStructuredArticleData_BrightcoveLicenseFragment
      >
    >;
  }>;
};

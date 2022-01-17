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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type GQLAggregationResult = {
  __typename?: 'AggregationResult';
  docCountErrorUpperBound?: Maybe<Scalars['Int']>;
  field?: Maybe<Scalars['String']>;
  sumOtherDocCount?: Maybe<Scalars['Int']>;
  values?: Maybe<Array<GQLBucketResult>>;
};

export type GQLArticle = {
  __typename?: 'Article';
  articleType: Scalars['String'];
  availability?: Maybe<Scalars['String']>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  conceptIds?: Maybe<Array<Scalars['String']>>;
  concepts?: Maybe<Array<GQLDetailedConcept>>;
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
  contentType?: Maybe<Scalars['String']>;
  contexts?: Maybe<Array<GQLSearchContext>>;
  id: Scalars['Int'];
  metaDescription?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<Scalars['String']>>;
  url?: Maybe<Scalars['String']>;
};

export type GQLAudio = {
  __typename?: 'Audio';
  audioFile: GQLAudioFile;
  audioType: Scalars['String'];
  copyright: GQLCopyright;
  id: Scalars['String'];
  podcastMeta?: Maybe<GQLPodcastMeta>;
  revision: Scalars['Int'];
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  tags?: Maybe<GQLTags>;
  title: GQLTitle;
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
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<GQLAudio>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type GQLBrightcoveElement = {
  __typename?: 'BrightcoveElement';
  account?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  copyText?: Maybe<Scalars['String']>;
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
  copyText?: Maybe<Scalars['String']>;
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
  count?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
};

export type GQLCategory = {
  __typename?: 'Category';
  name?: Maybe<Scalars['String']>;
  subjects?: Maybe<Array<Maybe<GQLSubject>>>;
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
  content?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  metaImage?: Maybe<GQLMetaImage>;
  tags?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
};

export type GQLConceptLicense = {
  __typename?: 'ConceptLicense';
  copyText?: Maybe<Scalars['String']>;
  copyright?: Maybe<GQLCopyright>;
  src?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type GQLConceptResult = {
  __typename?: 'ConceptResult';
  concepts?: Maybe<Array<GQLConcept>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type GQLContributor = {
  __typename?: 'Contributor';
  name: Scalars['String'];
  type: Scalars['String'];
};

export type GQLCopyright = {
  __typename?: 'Copyright';
  creators?: Maybe<Array<GQLContributor>>;
  license?: Maybe<GQLLicense>;
  origin?: Maybe<Scalars['String']>;
  processors?: Maybe<Array<GQLContributor>>;
  rightsholders?: Maybe<Array<GQLContributor>>;
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

export type GQLDetailedConcept = {
  __typename?: 'DetailedConcept';
  articleIds?: Maybe<Array<Scalars['String']>>;
  articles?: Maybe<Array<GQLMeta>>;
  content?: Maybe<Scalars['String']>;
  copyright?: Maybe<GQLCopyright>;
  created?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  image?: Maybe<GQLImageLicense>;
  subjectIds?: Maybe<Array<Scalars['String']>>;
  subjectNames?: Maybe<Array<Scalars['String']>>;
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  visualElement?: Maybe<GQLVisualElement>;
};

export type GQLElement = {
  __typename?: 'Element';
  explanation: Array<Maybe<Scalars['String']>>;
  reference: GQLReference;
};

export type GQLFilmFrontpage = {
  __typename?: 'FilmFrontpage';
  about?: Maybe<Array<GQLFilmPageAbout>>;
  movieThemes?: Maybe<Array<GQLMovieTheme>>;
  name?: Maybe<Scalars['String']>;
  slideShow?: Maybe<Array<GQLMovie>>;
};

export type GQLFilmPageAbout = {
  __typename?: 'FilmPageAbout';
  description?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visualElement?: Maybe<GQLSubjectPageVisualElement>;
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
  results?: Maybe<Array<GQLFrontpageSearchResult>>;
  suggestions?: Maybe<Array<GQLSuggestionResult>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type GQLFrontpage = {
  __typename?: 'Frontpage';
  categories?: Maybe<Array<GQLCategory>>;
  topical?: Maybe<Array<GQLResource>>;
};

export type GQLFrontpageSearch = {
  __typename?: 'FrontpageSearch';
  learningResources?: Maybe<GQLFrontPageResources>;
  topicResources?: Maybe<GQLFrontPageResources>;
};

export type GQLFrontpageSearchResult = {
  __typename?: 'FrontpageSearchResult';
  filters?: Maybe<Array<GQLSearchContextFilter>>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  resourceTypes?: Maybe<Array<GQLSearchContextResourceTypes>>;
  subject?: Maybe<Scalars['String']>;
};

export type GQLGroupSearch = {
  __typename?: 'GroupSearch';
  aggregations?: Maybe<Array<GQLAggregationResult>>;
  language?: Maybe<Scalars['String']>;
  resourceType: Scalars['String'];
  resources: Array<GQLGroupSearchResult>;
  suggestions?: Maybe<Array<GQLSuggestionResult>>;
  totalCount: Scalars['Int'];
};

export type GQLGroupSearchResult = {
  __typename?: 'GroupSearchResult';
  contexts?: Maybe<Array<GQLSearchContext>>;
  id: Scalars['Int'];
  ingress?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  name: Scalars['String'];
  path: Scalars['String'];
  traits?: Maybe<Array<Scalars['String']>>;
};

export type GQLH5pElement = {
  __typename?: 'H5pElement';
  copyText?: Maybe<Scalars['String']>;
  src?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
};

export type GQLH5pLicense = {
  __typename?: 'H5pLicense';
  copyText?: Maybe<Scalars['String']>;
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

export type GQLLearningpath = {
  __typename?: 'Learningpath';
  canEdit?: Maybe<Scalars['Boolean']>;
  copyright?: Maybe<GQLLearningpathCopyright>;
  coverphoto?: Maybe<GQLLearningpathCoverphoto>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  isBasedOn?: Maybe<Scalars['Int']>;
  lastUpdated?: Maybe<Scalars['String']>;
  learningstepUrl?: Maybe<Scalars['String']>;
  learningsteps?: Maybe<Array<GQLLearningpathStep>>;
  metaUrl?: Maybe<Scalars['String']>;
  revision?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  verificationStatus?: Maybe<Scalars['String']>;
};

export type GQLLearningpathCopyright = {
  __typename?: 'LearningpathCopyright';
  contributors?: Maybe<Array<GQLContributor>>;
  license?: Maybe<GQLLicense>;
};

export type GQLLearningpathCoverphoto = {
  __typename?: 'LearningpathCoverphoto';
  metaUrl?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type GQLLearningpathSearchResult = GQLSearchResult & {
  __typename?: 'LearningpathSearchResult';
  contentType?: Maybe<Scalars['String']>;
  contexts?: Maybe<Array<GQLSearchContext>>;
  id: Scalars['Int'];
  metaDescription?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<Scalars['String']>>;
  url?: Maybe<Scalars['String']>;
};

export type GQLLearningpathStep = {
  __typename?: 'LearningpathStep';
  article?: Maybe<GQLArticle>;
  description?: Maybe<Scalars['String']>;
  embedUrl?: Maybe<GQLLearningpathStepEmbedUrl>;
  id: Scalars['Int'];
  license?: Maybe<GQLLicense>;
  metaUrl?: Maybe<Scalars['String']>;
  oembed?: Maybe<GQLLearningpathStepOembed>;
  resource?: Maybe<GQLResource>;
  revision?: Maybe<Scalars['Int']>;
  seqNo: Scalars['Int'];
  showTitle?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type GQLLearningpathStepEmbedUrl = {
  __typename?: 'LearningpathStepEmbedUrl';
  embedType?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
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
  alt?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type GQLMovie = {
  __typename?: 'Movie';
  id: Scalars['String'];
  metaDescription?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  path?: Maybe<Scalars['String']>;
  resourceTypes?: Maybe<Array<GQLResourceType>>;
  title?: Maybe<Scalars['String']>;
};

export type GQLMovieMeta = {
  __typename?: 'MovieMeta';
  metaDescription?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  title?: Maybe<Scalars['String']>;
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
  movies?: Maybe<Array<GQLMovie>>;
  name?: Maybe<Array<GQLName>>;
};

export type GQLName = {
  __typename?: 'Name';
  language?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type GQLPodcastMeta = {
  __typename?: 'PodcastMeta';
  coverPhoto: GQLCoverPhoto;
  header: Scalars['String'];
  introduction: Scalars['String'];
  language: Scalars['String'];
  manuscript: Scalars['String'];
};

export type GQLQuery = {
  __typename?: 'Query';
  article?: Maybe<GQLArticle>;
  competenceGoal?: Maybe<GQLCompetenceGoal>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  conceptSearch?: Maybe<GQLConceptResult>;
  concepts?: Maybe<Array<GQLConcept>>;
  coreElement?: Maybe<GQLCoreElement>;
  coreElements?: Maybe<Array<GQLCoreElement>>;
  detailedConcept?: Maybe<GQLDetailedConcept>;
  filmfrontpage?: Maybe<GQLFilmFrontpage>;
  frontpage?: Maybe<GQLFrontpage>;
  frontpageSearch?: Maybe<GQLFrontpageSearch>;
  groupSearch?: Maybe<Array<GQLGroupSearch>>;
  learningpath?: Maybe<GQLLearningpath>;
  learningpathStep?: Maybe<GQLLearningpathStep>;
  listingPage?: Maybe<GQLListingPage>;
  podcast?: Maybe<GQLAudio>;
  podcastSearch?: Maybe<GQLAudioSearch>;
  resource?: Maybe<GQLResource>;
  resourceTypes?: Maybe<Array<GQLResourceTypeDefinition>>;
  search?: Maybe<GQLSearch>;
  searchWithoutPagination?: Maybe<GQLSearch>;
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

export type GQLQueryConceptSearchArgs = {
  exactMatch?: Maybe<Scalars['Boolean']>;
  fallback?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
};

export type GQLQueryConceptsArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
};

export type GQLQueryCoreElementArgs = {
  code: Scalars['String'];
  language?: Maybe<Scalars['String']>;
};

export type GQLQueryCoreElementsArgs = {
  codes?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
};

export type GQLQueryDetailedConceptArgs = {
  id?: Maybe<Scalars['String']>;
};

export type GQLQueryFrontpageSearchArgs = {
  query?: Maybe<Scalars['String']>;
};

export type GQLQueryGroupSearchArgs = {
  aggregatePaths?: Maybe<Array<Maybe<Scalars['String']>>>;
  contextTypes?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  grepCodes?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  levels?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  resourceTypes?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
};

export type GQLQueryLearningpathArgs = {
  pathId: Scalars['String'];
};

export type GQLQueryLearningpathStepArgs = {
  pathId: Scalars['String'];
  stepId: Scalars['String'];
};

export type GQLQueryPodcastArgs = {
  id?: Maybe<Scalars['String']>;
};

export type GQLQueryPodcastSearchArgs = {
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
};

export type GQLQueryResourceArgs = {
  id: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
  topicId?: Maybe<Scalars['String']>;
};

export type GQLQuerySearchArgs = {
  aggregatePaths?: Maybe<Array<Maybe<Scalars['String']>>>;
  contextFilters?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['String']>;
  grepCodes?: Maybe<Scalars['String']>;
  ids?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  languageFilter?: Maybe<Scalars['String']>;
  levels?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
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
  ids?: Maybe<Scalars['String']>;
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
  id: Scalars['String'];
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
    metadata?: Maybe<GQLTaxonomyMetadata>;
    name: Scalars['String'];
    parentTopics?: Maybe<Array<GQLTopic>>;
    path?: Maybe<Scalars['String']>;
    paths?: Maybe<Array<Scalars['String']>>;
    rank?: Maybe<Scalars['Int']>;
    relevanceId?: Maybe<Scalars['String']>;
    resourceTypes?: Maybe<Array<GQLResourceType>>;
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
  aggregations?: Maybe<Array<GQLAggregationResult>>;
  concepts?: Maybe<GQLConceptResult>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<GQLSearchResult>>;
  suggestions?: Maybe<Array<GQLSuggestionResult>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type GQLSearchContext = {
  __typename?: 'SearchContext';
  breadcrumbs?: Maybe<Array<Scalars['String']>>;
  filters?: Maybe<Array<GQLSearchContextFilter>>;
  id?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  learningResourceType?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  relevance?: Maybe<Scalars['String']>;
  resourceTypes?: Maybe<Array<GQLSearchContextResourceTypes>>;
  subject?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLSearchContextFilter = {
  __typename?: 'SearchContextFilter';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  relevance?: Maybe<Scalars['String']>;
};

export type GQLSearchContextResourceTypes = {
  __typename?: 'SearchContextResourceTypes';
  id?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type GQLSearchResult = {
  contentType?: Maybe<Scalars['String']>;
  contexts?: Maybe<Array<GQLSearchContext>>;
  id: Scalars['Int'];
  metaDescription?: Maybe<Scalars['String']>;
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<Scalars['String']>>;
  url?: Maybe<Scalars['String']>;
};

export type GQLSearchSuggestion = {
  __typename?: 'SearchSuggestion';
  length?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  options?: Maybe<Array<GQLSuggestOption>>;
  text?: Maybe<Scalars['String']>;
};

export type GQLSubject = GQLTaxonomyEntity & {
  __typename?: 'Subject';
  allTopics?: Maybe<Array<GQLTopic>>;
  contentUri?: Maybe<Scalars['String']>;
  grepCodes?: Maybe<Array<Scalars['String']>>;
  id: Scalars['String'];
  metadata?: Maybe<GQLTaxonomyMetadata>;
  name: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  paths?: Maybe<Array<Scalars['String']>>;
  rank?: Maybe<Scalars['Int']>;
  relevanceId?: Maybe<Scalars['String']>;
  subjectpage?: Maybe<GQLSubjectPage>;
  topics?: Maybe<Array<GQLTopic>>;
};

export type GQLSubjectTopicsArgs = {
  all?: Maybe<Scalars['Boolean']>;
};

export type GQLSubjectPage = {
  __typename?: 'SubjectPage';
  about?: Maybe<GQLSubjectPageAbout>;
  banner?: Maybe<GQLSubjectPageBanner>;
  editorsChoices?: Maybe<Array<GQLTaxonomyEntity>>;
  facebook?: Maybe<Scalars['String']>;
  goTo?: Maybe<Array<GQLResourceTypeDefinition>>;
  id: Scalars['Int'];
  latestContent?: Maybe<Array<GQLTaxonomyEntity>>;
  layout?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  mostRead?: Maybe<Array<GQLTaxonomyEntity>>;
  name?: Maybe<Scalars['String']>;
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
  description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visualElement?: Maybe<GQLSubjectPageVisualElement>;
};

export type GQLSubjectPageBanner = {
  __typename?: 'SubjectPageBanner';
  desktopId?: Maybe<Scalars['String']>;
  desktopUrl?: Maybe<Scalars['String']>;
  mobileId?: Maybe<Scalars['String']>;
  mobileUrl?: Maybe<Scalars['String']>;
};

export type GQLSubjectPageVisualElement = {
  __typename?: 'SubjectPageVisualElement';
  alt?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type GQLSuggestOption = {
  __typename?: 'SuggestOption';
  score?: Maybe<Scalars['Float']>;
  text?: Maybe<Scalars['String']>;
};

export type GQLSuggestionResult = {
  __typename?: 'SuggestionResult';
  name?: Maybe<Scalars['String']>;
  suggestions?: Maybe<Array<GQLSearchSuggestion>>;
};

export type GQLTags = {
  __typename?: 'Tags';
  language: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
};

export type GQLTaxonomyEntity = {
  contentUri?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  metadata?: Maybe<GQLTaxonomyMetadata>;
  name: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  paths?: Maybe<Array<Scalars['String']>>;
  rank?: Maybe<Scalars['Int']>;
  relevanceId?: Maybe<Scalars['String']>;
};

export type GQLTaxonomyMetadata = {
  __typename?: 'TaxonomyMetadata';
  customFields?: Maybe<Scalars['JSON']>;
  grepCodes?: Maybe<Array<Scalars['String']>>;
  visible?: Maybe<Scalars['Boolean']>;
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
    metadata?: Maybe<GQLTaxonomyMetadata>;
    name: Scalars['String'];
    parent?: Maybe<Scalars['String']>;
    path?: Maybe<Scalars['String']>;
    pathTopics?: Maybe<Array<Array<GQLTopic>>>;
    paths?: Maybe<Array<Scalars['String']>>;
    rank?: Maybe<Scalars['Int']>;
    relevanceId?: Maybe<Scalars['String']>;
    subtopics?: Maybe<Array<GQLTopic>>;
    supplementaryResources?: Maybe<Array<GQLResource>>;
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

export type GQLContributorInfoFragment = {
  __typename?: 'Contributor';
  name: string;
  type: string;
};

export type GQLSearchQueryVariables = Exact<{
  query?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  ids?: Maybe<Scalars['String']>;
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
    language?: Maybe<string>;
    page?: Maybe<number>;
    pageSize?: Maybe<number>;
    totalCount?: Maybe<number>;
    results?: Maybe<
      Array<
        | {
            __typename?: 'ArticleSearchResult';
            id: number;
            url?: Maybe<string>;
            metaDescription?: Maybe<string>;
            title?: Maybe<string>;
            supportedLanguages?: Maybe<Array<string>>;
            traits?: Maybe<Array<string>>;
            metaImage?: Maybe<{
              __typename?: 'MetaImage';
              url?: Maybe<string>;
              alt?: Maybe<string>;
            }>;
            contexts?: Maybe<
              Array<{
                __typename?: 'SearchContext';
                id?: Maybe<string>;
                breadcrumbs?: Maybe<Array<string>>;
                relevance?: Maybe<string>;
                language?: Maybe<string>;
                learningResourceType?: Maybe<string>;
                path?: Maybe<string>;
                subject?: Maybe<string>;
                subjectId?: Maybe<string>;
                resourceTypes?: Maybe<
                  Array<{
                    __typename?: 'SearchContextResourceTypes';
                    id?: Maybe<string>;
                    name?: Maybe<string>;
                    language?: Maybe<string>;
                  }>
                >;
              }>
            >;
          }
        | {
            __typename?: 'LearningpathSearchResult';
            id: number;
            url?: Maybe<string>;
            metaDescription?: Maybe<string>;
            title?: Maybe<string>;
            supportedLanguages?: Maybe<Array<string>>;
            traits?: Maybe<Array<string>>;
            metaImage?: Maybe<{
              __typename?: 'MetaImage';
              url?: Maybe<string>;
              alt?: Maybe<string>;
            }>;
            contexts?: Maybe<
              Array<{
                __typename?: 'SearchContext';
                id?: Maybe<string>;
                breadcrumbs?: Maybe<Array<string>>;
                relevance?: Maybe<string>;
                language?: Maybe<string>;
                learningResourceType?: Maybe<string>;
                path?: Maybe<string>;
                subject?: Maybe<string>;
                subjectId?: Maybe<string>;
                resourceTypes?: Maybe<
                  Array<{
                    __typename?: 'SearchContextResourceTypes';
                    id?: Maybe<string>;
                    name?: Maybe<string>;
                    language?: Maybe<string>;
                  }>
                >;
              }>
            >;
          }
      >
    >;
    suggestions?: Maybe<
      Array<{
        __typename?: 'SuggestionResult';
        name?: Maybe<string>;
        suggestions?: Maybe<
          Array<{
            __typename?: 'SearchSuggestion';
            text?: Maybe<string>;
            offset?: Maybe<number>;
            length?: Maybe<number>;
            options?: Maybe<
              Array<{
                __typename?: 'SuggestOption';
                text?: Maybe<string>;
                score?: Maybe<number>;
              }>
            >;
          }>
        >;
      }>
    >;
  }>;
};

export type GQLSearchWithoutPaginationQueryVariables = Exact<{
  query?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  ids?: Maybe<Scalars['String']>;
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
    __typename?: 'Search';
    language?: Maybe<string>;
    page?: Maybe<number>;
    pageSize?: Maybe<number>;
    totalCount?: Maybe<number>;
    results?: Maybe<
      Array<
        | {
            __typename?: 'ArticleSearchResult';
            id: number;
            url?: Maybe<string>;
            metaDescription?: Maybe<string>;
            title?: Maybe<string>;
            supportedLanguages?: Maybe<Array<string>>;
            traits?: Maybe<Array<string>>;
            metaImage?: Maybe<{
              __typename?: 'MetaImage';
              url?: Maybe<string>;
              alt?: Maybe<string>;
            }>;
            contexts?: Maybe<
              Array<{
                __typename?: 'SearchContext';
                breadcrumbs?: Maybe<Array<string>>;
                relevance?: Maybe<string>;
                language?: Maybe<string>;
                learningResourceType?: Maybe<string>;
                path?: Maybe<string>;
                subject?: Maybe<string>;
                resourceTypes?: Maybe<
                  Array<{
                    __typename?: 'SearchContextResourceTypes';
                    id?: Maybe<string>;
                    name?: Maybe<string>;
                    language?: Maybe<string>;
                  }>
                >;
              }>
            >;
          }
        | {
            __typename?: 'LearningpathSearchResult';
            id: number;
            url?: Maybe<string>;
            metaDescription?: Maybe<string>;
            title?: Maybe<string>;
            supportedLanguages?: Maybe<Array<string>>;
            traits?: Maybe<Array<string>>;
            metaImage?: Maybe<{
              __typename?: 'MetaImage';
              url?: Maybe<string>;
              alt?: Maybe<string>;
            }>;
            contexts?: Maybe<
              Array<{
                __typename?: 'SearchContext';
                breadcrumbs?: Maybe<Array<string>>;
                relevance?: Maybe<string>;
                language?: Maybe<string>;
                learningResourceType?: Maybe<string>;
                path?: Maybe<string>;
                subject?: Maybe<string>;
                resourceTypes?: Maybe<
                  Array<{
                    __typename?: 'SearchContextResourceTypes';
                    id?: Maybe<string>;
                    name?: Maybe<string>;
                    language?: Maybe<string>;
                  }>
                >;
              }>
            >;
          }
      >
    >;
  }>;
};

export type GQLGroupSearchQueryVariables = Exact<{
  resourceTypes?: Maybe<Scalars['String']>;
  contextTypes?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
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
      language?: Maybe<string>;
      resources: Array<{
        __typename?: 'GroupSearchResult';
        id: number;
        path: string;
        name: string;
        ingress?: Maybe<string>;
        traits?: Maybe<Array<string>>;
        contexts?: Maybe<
          Array<{
            __typename?: 'SearchContext';
            language?: Maybe<string>;
            path?: Maybe<string>;
            breadcrumbs?: Maybe<Array<string>>;
            subjectId?: Maybe<string>;
            subject?: Maybe<string>;
            relevance?: Maybe<string>;
            resourceTypes?: Maybe<
              Array<{
                __typename?: 'SearchContextResourceTypes';
                id?: Maybe<string>;
                name?: Maybe<string>;
              }>
            >;
          }>
        >;
        metaImage?: Maybe<{
          __typename?: 'MetaImage';
          url?: Maybe<string>;
          alt?: Maybe<string>;
        }>;
      }>;
      aggregations?: Maybe<
        Array<{
          __typename?: 'AggregationResult';
          values?: Maybe<
            Array<{ __typename?: 'BucketResult'; value?: Maybe<string> }>
          >;
        }>
      >;
      suggestions?: Maybe<
        Array<{
          __typename?: 'SuggestionResult';
          suggestions?: Maybe<
            Array<{
              __typename?: 'SearchSuggestion';
              options?: Maybe<
                Array<{ __typename?: 'SuggestOption'; text?: Maybe<string> }>
              >;
            }>
          >;
        }>
      >;
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
    concepts?: Maybe<
      Array<{
        __typename?: 'Concept';
        id?: Maybe<number>;
        title?: Maybe<string>;
        text?: Maybe<string>;
        image?: Maybe<{
          __typename?: 'MetaImage';
          url?: Maybe<string>;
          alt?: Maybe<string>;
        }>;
      }>
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
    topicResources?: Maybe<{
      __typename?: 'FrontPageResources';
      totalCount?: Maybe<number>;
      results?: Maybe<
        Array<{
          __typename?: 'FrontpageSearchResult';
          id: string;
          name?: Maybe<string>;
          path?: Maybe<string>;
          subject?: Maybe<string>;
          resourceTypes?: Maybe<
            Array<{
              __typename?: 'SearchContextResourceTypes';
              name?: Maybe<string>;
            }>
          >;
        }>
      >;
      suggestions?: Maybe<
        Array<{
          __typename?: 'SuggestionResult';
          suggestions?: Maybe<
            Array<{
              __typename?: 'SearchSuggestion';
              options?: Maybe<
                Array<{
                  __typename?: 'SuggestOption';
                  text?: Maybe<string>;
                  score?: Maybe<number>;
                }>
              >;
            }>
          >;
        }>
      >;
    }>;
    learningResources?: Maybe<{
      __typename?: 'FrontPageResources';
      totalCount?: Maybe<number>;
      results?: Maybe<
        Array<{
          __typename?: 'FrontpageSearchResult';
          id: string;
          name?: Maybe<string>;
          path?: Maybe<string>;
          subject?: Maybe<string>;
          resourceTypes?: Maybe<
            Array<{
              __typename?: 'SearchContextResourceTypes';
              name?: Maybe<string>;
            }>
          >;
        }>
      >;
      suggestions?: Maybe<
        Array<{
          __typename?: 'SuggestionResult';
          suggestions?: Maybe<
            Array<{
              __typename?: 'SearchSuggestion';
              options?: Maybe<
                Array<{
                  __typename?: 'SuggestOption';
                  text?: Maybe<string>;
                  score?: Maybe<number>;
                }>
              >;
            }>
          >;
        }>
      >;
    }>;
  }>;
};

export type GQLCopyrightInfoFragment = {
  __typename?: 'Copyright';
  origin?: Maybe<string>;
  license?: Maybe<{
    __typename?: 'License';
    license: string;
    url?: Maybe<string>;
  }>;
  creators?: Maybe<
    Array<{ __typename?: 'Contributor' } & GQLContributorInfoFragment>
  >;
  processors?: Maybe<
    Array<{ __typename?: 'Contributor' } & GQLContributorInfoFragment>
  >;
  rightsholders?: Maybe<
    Array<{ __typename?: 'Contributor' } & GQLContributorInfoFragment>
  >;
};

export type GQLMetaInfoFragment = {
  __typename?: 'Meta';
  id: number;
  title: string;
  introduction?: Maybe<string>;
  metaDescription?: Maybe<string>;
  lastUpdated?: Maybe<string>;
  metaImage?: Maybe<{
    __typename?: 'MetaImage';
    url?: Maybe<string>;
    alt?: Maybe<string>;
  }>;
};

export type GQLTopicInfoFragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path?: Maybe<string>;
  availability?: Maybe<string>;
  parent?: Maybe<string>;
  relevanceId?: Maybe<string>;
  meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
  metadata?: Maybe<{
    __typename?: 'TaxonomyMetadata';
    customFields?: Maybe<any>;
  }>;
};

export type GQLSubjectInfoFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  path?: Maybe<string>;
  metadata?: Maybe<{
    __typename?: 'TaxonomyMetadata';
    customFields?: Maybe<any>;
  }>;
};

export type GQLResourceInfoFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path?: Maybe<string>;
  paths?: Maybe<Array<string>>;
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
    copyText?: Maybe<string>;
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
    copyText?: Maybe<string>;
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
  conceptIds?: Maybe<Array<string>>;
  metaImage?: Maybe<{
    __typename?: 'MetaImage';
    url?: Maybe<string>;
    alt?: Maybe<string>;
  }>;
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
        copyText?: Maybe<string>;
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
        copyText?: Maybe<string>;
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
        copyText?: Maybe<string>;
        copyright?: Maybe<
          { __typename?: 'Copyright' } & GQLCopyrightInfoFragment
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
      __typename?: 'DetailedConcept';
      id: number;
      title: string;
      content?: Maybe<string>;
      subjectNames?: Maybe<Array<string>>;
      copyright?: Maybe<
        { __typename?: 'Copyright' } & GQLCopyrightInfoFragment
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
  path?: Maybe<string>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

type GQLTaxonomyEntityInfo_Subject_Fragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path?: Maybe<string>;
};

type GQLTaxonomyEntityInfo_Topic_Fragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  contentUri?: Maybe<string>;
  path?: Maybe<string>;
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
  banner?: Maybe<{
    __typename?: 'SubjectPageBanner';
    desktopUrl?: Maybe<string>;
  }>;
  about?: Maybe<{
    __typename?: 'SubjectPageAbout';
    title?: Maybe<string>;
    description?: Maybe<string>;
    visualElement?: Maybe<{
      __typename?: 'SubjectPageVisualElement';
      type?: Maybe<string>;
      url?: Maybe<string>;
      alt?: Maybe<string>;
    }>;
  }>;
  editorsChoices?: Maybe<
    Array<
      | ({ __typename?: 'Resource' } & GQLTaxonomyEntityInfo_Resource_Fragment)
      | ({ __typename?: 'Subject' } & GQLTaxonomyEntityInfo_Subject_Fragment)
      | ({ __typename?: 'Topic' } & GQLTaxonomyEntityInfo_Topic_Fragment)
    >
  >;
};

export type GQLSubjectTopicsQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLSubjectTopicsQuery = {
  __typename?: 'Query';
  subject?: Maybe<{
    __typename?: 'Subject';
    id: string;
    name: string;
    path?: Maybe<string>;
    topics?: Maybe<
      Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        parent?: Maybe<string>;
        path?: Maybe<string>;
        relevanceId?: Maybe<string>;
        meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
        metadata?: Maybe<{
          __typename?: 'TaxonomyMetadata';
          customFields?: Maybe<any>;
        }>;
      }>
    >;
  }>;
};

export type GQLTopicsWithBreadcrumbsQueryVariables = Exact<{
  contentUri?: Maybe<Scalars['String']>;
  filterVisible?: Maybe<Scalars['Boolean']>;
}>;

export type GQLTopicsWithBreadcrumbsQuery = {
  __typename?: 'Query';
  topics?: Maybe<
    Array<
      {
        __typename?: 'Topic';
        breadcrumbs?: Maybe<Array<Array<string>>>;
      } & GQLTopicInfoFragment
    >
  >;
};

export type GQLSubjectPageWithTopicsQueryVariables = Exact<{
  subjectId: Scalars['String'];
  topicId: Scalars['String'];
  includeTopic: Scalars['Boolean'];
}>;

export type GQLSubjectPageWithTopicsQuery = {
  __typename?: 'Query';
  subject?: Maybe<
    {
      __typename?: 'Subject';
      grepCodes?: Maybe<Array<string>>;
      topics?: Maybe<
        Array<
          {
            __typename?: 'Topic';
            article?: Maybe<{
              __typename?: 'Article';
              supportedLanguages?: Maybe<Array<string>>;
            }>;
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
          path?: Maybe<string>;
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
        metadata?: Maybe<{
          __typename?: 'TaxonomyMetadata';
          customFields?: Maybe<any>;
        }>;
      } & GQLSubjectInfoFragment
    >
  >;
};

export type GQLSubjectPageQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLSubjectPageQuery = {
  __typename?: 'Query';
  subject?: Maybe<{
    __typename?: 'Subject';
    id: string;
    name: string;
    path?: Maybe<string>;
    topics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
    allTopics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
    subjectpage?: Maybe<
      { __typename?: 'SubjectPage' } & GQLSubjectPageInfoFragment
    >;
  }>;
};

export type GQLSubjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSubjectsQuery = {
  __typename?: 'Query';
  subjects?: Maybe<Array<{ __typename?: 'Subject' } & GQLSubjectInfoFragment>>;
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

export type GQLResourceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type GQLResourceTypesQuery = {
  __typename?: 'Query';
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceTypeDefinition'; id: string; name: string }>
  >;
};

export type GQLTopicResourcesQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
}>;

export type GQLTopicResourcesQuery = {
  __typename?: 'Query';
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    coreResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
    supplementaryResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
  }>;
};

export type GQLLearningpathInfoFragment = {
  __typename?: 'Learningpath';
  id: number;
  title: string;
  description?: Maybe<string>;
  duration?: Maybe<number>;
  lastUpdated?: Maybe<string>;
  supportedLanguages?: Maybe<Array<string>>;
  tags?: Maybe<Array<string>>;
  copyright?: Maybe<{
    __typename?: 'LearningpathCopyright';
    license?: Maybe<{
      __typename?: 'License';
      license: string;
      url?: Maybe<string>;
      description?: Maybe<string>;
    }>;
    contributors?: Maybe<
      Array<{ __typename?: 'Contributor' } & GQLContributorInfoFragment>
    >;
  }>;
  coverphoto?: Maybe<{
    __typename?: 'LearningpathCoverphoto';
    url?: Maybe<string>;
    metaUrl?: Maybe<string>;
  }>;
  learningsteps?: Maybe<
    Array<{
      __typename?: 'LearningpathStep';
      id: number;
      title: string;
      description?: Maybe<string>;
      seqNo: number;
      type?: Maybe<string>;
      showTitle?: Maybe<boolean>;
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
        url?: Maybe<string>;
        embedType?: Maybe<string>;
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
    }>
  >;
};

export type GQLResourceQueryVariables = Exact<{
  resourceId: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
}>;

export type GQLResourceQuery = {
  __typename?: 'Query';
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
  resource?: Maybe<{
    __typename?: 'Resource';
    id: string;
    name: string;
    path?: Maybe<string>;
    resourceTypes?: Maybe<
      Array<{ __typename?: 'ResourceType'; id: string; name: string }>
    >;
  }>;
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path?: Maybe<string>;
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
    path?: Maybe<string>;
    topics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
    allTopics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
  }>;
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path?: Maybe<string>;
    relevanceId?: Maybe<string>;
    pathTopics?: Maybe<
      Array<
        Array<{
          __typename?: 'Topic';
          id: string;
          name: string;
          path?: Maybe<string>;
        }>
      >
    >;
    meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
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

export type GQLTopicQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
}>;

export type GQLTopicQuery = {
  __typename?: 'Query';
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path?: Maybe<string>;
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
    metadata?: Maybe<{
      __typename?: 'TaxonomyMetadata';
      customFields?: Maybe<any>;
    }>;
  }>;
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
  title?: Maybe<string>;
  metaDescription?: Maybe<string>;
  path?: Maybe<string>;
  metaImage?: Maybe<{
    __typename?: 'MetaImage';
    alt?: Maybe<string>;
    url?: Maybe<string>;
  }>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceType'; id: string; name: string }>
  >;
};

export type GQLFilmFrontPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLFilmFrontPageQuery = {
  __typename?: 'Query';
  filmfrontpage?: Maybe<{
    __typename?: 'FilmFrontpage';
    name?: Maybe<string>;
    about?: Maybe<
      Array<{
        __typename?: 'FilmPageAbout';
        title?: Maybe<string>;
        description?: Maybe<string>;
        language?: Maybe<string>;
        visualElement?: Maybe<{
          __typename?: 'SubjectPageVisualElement';
          type?: Maybe<string>;
          alt?: Maybe<string>;
          url?: Maybe<string>;
        }>;
      }>
    >;
    movieThemes?: Maybe<
      Array<{
        __typename?: 'MovieTheme';
        name?: Maybe<
          Array<{
            __typename?: 'Name';
            name?: Maybe<string>;
            language?: Maybe<string>;
          }>
        >;
        movies?: Maybe<Array<{ __typename?: 'Movie' } & GQLMovieInfoFragment>>;
      }>
    >;
    slideShow?: Maybe<Array<{ __typename?: 'Movie' } & GQLMovieInfoFragment>>;
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
    path?: Maybe<string>;
    topics?: Maybe<Array<{ __typename?: 'Topic' } & GQLTopicInfoFragment>>;
  }>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceTypeDefinition'; id: string; name: string }>
  >;
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    metadata?: Maybe<{
      __typename?: 'TaxonomyMetadata';
      customFields?: Maybe<any>;
    }>;
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

export type GQLTopicPageQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId: Scalars['String'];
}>;

export type GQLTopicPageQuery = {
  __typename?: 'Query';
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path?: Maybe<string>;
    relevanceId?: Maybe<string>;
    meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
    article?: Maybe<{ __typename?: 'Article' } & GQLArticleInfoFragment>;
    coreResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
    supplementaryResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
  }>;
  subject?: Maybe<{
    __typename?: 'Subject';
    id: string;
    name: string;
    path?: Maybe<string>;
    topics?: Maybe<
      Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        parent?: Maybe<string>;
        path?: Maybe<string>;
        relevanceId?: Maybe<string>;
        meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
      }>
    >;
  }>;
  resourceTypes?: Maybe<
    Array<{ __typename?: 'ResourceTypeDefinition'; id: string; name: string }>
  >;
};

export type GQLResourcePageQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId: Scalars['String'];
  resourceId: Scalars['String'];
}>;

export type GQLResourcePageQuery = {
  __typename?: 'Query';
  subject?: Maybe<{
    __typename?: 'Subject';
    id: string;
    name: string;
    path?: Maybe<string>;
    topics?: Maybe<
      Array<{
        __typename?: 'Topic';
        id: string;
        name: string;
        parent?: Maybe<string>;
        path?: Maybe<string>;
        relevanceId?: Maybe<string>;
        meta?: Maybe<{ __typename?: 'Meta' } & GQLMetaInfoFragment>;
      }>
    >;
  }>;
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
  topic?: Maybe<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path?: Maybe<string>;
    relevanceId?: Maybe<string>;
    coreResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
    supplementaryResources?: Maybe<
      Array<{ __typename?: 'Resource' } & GQLResourceInfoFragment>
    >;
    metadata?: Maybe<{
      __typename?: 'TaxonomyMetadata';
      customFields?: Maybe<any>;
    }>;
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

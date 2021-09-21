export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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


export type GQLArticleGQLcrossSubjectTopicsArgs = {
  filterIds?: Maybe<Scalars['String']>;
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
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<GQLImageLicense>;
  subjectIds?: Maybe<Array<Scalars['String']>>;
  subjectNames?: Maybe<Array<Scalars['String']>>;
  tags?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
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

export type GQLFilter = {
  __typename?: 'Filter';
  connectionId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  metadata?: Maybe<GQLTaxonomyMetadata>;
  name: Scalars['String'];
  relevanceId?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
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
  resourceType?: Maybe<Scalars['String']>;
  resources?: Maybe<Array<GQLGroupSearchResult>>;
  suggestions?: Maybe<Array<GQLSuggestionResult>>;
  totalCount?: Maybe<Scalars['Int']>;
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
  focalX?: Maybe<Scalars['Int']>;
  focalY?: Maybe<Scalars['Int']>;
  lowerRightX?: Maybe<Scalars['Int']>;
  lowerRightY?: Maybe<Scalars['Int']>;
  resourceid?: Maybe<Scalars['String']>;
  src: Scalars['String'];
  upperLeftX?: Maybe<Scalars['Int']>;
  upperLeftY?: Maybe<Scalars['Int']>;
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
  filters?: Maybe<Array<GQLSubjectFilter>>;
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


export type GQLQueryGQLarticleArgs = {
  filterIds?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isOembed?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLcompetenceGoalArgs = {
  code: Scalars['String'];
  language?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLcompetenceGoalsArgs = {
  codes?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
  nodeId?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLconceptSearchArgs = {
  exactMatch?: Maybe<Scalars['Boolean']>;
  fallback?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  subjects?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLconceptsArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
};


export type GQLQueryGQLcoreElementArgs = {
  code: Scalars['String'];
  language?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLcoreElementsArgs = {
  codes?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLdetailedConceptArgs = {
  id?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLfrontpageSearchArgs = {
  query?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLgroupSearchArgs = {
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


export type GQLQueryGQLlearningpathArgs = {
  pathId: Scalars['String'];
};


export type GQLQueryGQLlearningpathStepArgs = {
  pathId: Scalars['String'];
  stepId: Scalars['String'];
};


export type GQLQueryGQLpodcastArgs = {
  id?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLpodcastSearchArgs = {
  page?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLresourceArgs = {
  id: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLsearchArgs = {
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


export type GQLQueryGQLsearchWithoutPaginationArgs = {
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


export type GQLQueryGQLsubjectArgs = {
  id: Scalars['String'];
};


export type GQLQueryGQLsubjectpageArgs = {
  id: Scalars['String'];
};


export type GQLQueryGQLtopicArgs = {
  id: Scalars['String'];
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLQueryGQLtopicsArgs = {
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

export type GQLResource = GQLTaxonomyEntity & {
  __typename?: 'Resource';
  article?: Maybe<GQLArticle>;
  breadcrumbs?: Maybe<Array<Array<Scalars['String']>>>;
  contentUri?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<GQLFilter>>;
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


export type GQLResourceGQLarticleArgs = {
  filterIds?: Maybe<Scalars['String']>;
  isOembed?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};

export type GQLResourceType = {
  __typename?: 'ResourceType';
  id: Scalars['String'];
  name: Scalars['String'];
  resources?: Maybe<Array<GQLResource>>;
};


export type GQLResourceTypeGQLresourcesArgs = {
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

export type GQLSubject = {
  __typename?: 'Subject';
  contentUri?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<GQLSubjectFilter>>;
  frontpageFilters?: Maybe<Array<GQLSubjectFilter>>;
  id: Scalars['String'];
  metadata?: Maybe<GQLTaxonomyMetadata>;
  name: Scalars['String'];
  path: Scalars['String'];
  subjectpage?: Maybe<GQLSubjectPage>;
  topics?: Maybe<Array<GQLTopic>>;
};


export type GQLSubjectGQLtopicsArgs = {
  all?: Maybe<Scalars['Boolean']>;
  filterIds?: Maybe<Scalars['String']>;
};

export type GQLSubjectFilter = {
  __typename?: 'SubjectFilter';
  contentUri?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  metadata?: Maybe<GQLTaxonomyMetadata>;
  name: Scalars['String'];
  subjectId: Scalars['String'];
  subjectpage?: Maybe<GQLSubjectPage>;
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


export type GQLSubjectPageGQLeditorsChoicesArgs = {
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLSubjectPageGQLlatestContentArgs = {
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLSubjectPageGQLmostReadArgs = {
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLSubjectPageGQLtopicalArgs = {
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
  article?: Maybe<GQLArticle>;
  contentUri?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<GQLFilter>>;
  id: Scalars['String'];
  meta?: Maybe<GQLMeta>;
  metadata?: Maybe<GQLTaxonomyMetadata>;
  name: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  paths?: Maybe<Array<Scalars['String']>>;
  rank?: Maybe<Scalars['Int']>;
  relevanceId?: Maybe<Scalars['String']>;
};


export type GQLTaxonomyEntityGQLarticleArgs = {
  filterIds?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
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

export type GQLTopic = GQLTaxonomyEntity & {
  __typename?: 'Topic';
  alternateTopics?: Maybe<Array<GQLTopic>>;
  article?: Maybe<GQLArticle>;
  breadcrumbs?: Maybe<Array<Array<Scalars['String']>>>;
  contentUri?: Maybe<Scalars['String']>;
  coreResources?: Maybe<Array<GQLResource>>;
  filters?: Maybe<Array<GQLFilter>>;
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


export type GQLTopicGQLarticleArgs = {
  filterIds?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLTopicGQLcoreResourcesArgs = {
  filterIds?: Maybe<Scalars['String']>;
  subjectId?: Maybe<Scalars['String']>;
};


export type GQLTopicGQLsubtopicsArgs = {
  filterIds?: Maybe<Scalars['String']>;
};


export type GQLTopicGQLsupplementaryResourcesArgs = {
  filterIds?: Maybe<Scalars['String']>;
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

export type GQLembedVisualelement = {
  __typename?: 'embedVisualelement';
  visualElement?: Maybe<GQLVisualElement>;
};

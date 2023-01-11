export type Maybe<T> = T;
export type InputMaybe<T> = T;
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
  revisionDate?: Maybe<Scalars['String']>;
  supportedLanguages?: Maybe<Array<Scalars['String']>>;
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  updated: Scalars['String'];
  visualElement?: Maybe<GQLVisualElement>;
};

export type GQLArticleCrossSubjectTopicsArgs = {
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLArticleFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: 'ArticleFolderResourceMeta';
  description: Scalars['String'];
  id: Scalars['Int'];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars['String'];
  type: Scalars['String'];
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
  podcasts?: Maybe<Array<GQLPodcastLicense>>;
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

export type GQLBreadcrumb = {
  __typename?: 'Breadcrumb';
  id: Scalars['String'];
  name: Scalars['String'];
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
  metaImage?: Maybe<GQLMetaImage>;
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

export type GQLEmbedVisualelement = {
  __typename?: 'EmbedVisualelement';
  visualElement?: Maybe<GQLVisualElement>;
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

export type GQLFolder = {
  __typename?: 'Folder';
  breadcrumbs: Array<GQLBreadcrumb>;
  id: Scalars['String'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['String']>;
  resources: Array<GQLFolderResource>;
  status: Scalars['String'];
  subfolders: Array<GQLFolder>;
};

export type GQLFolderResource = {
  __typename?: 'FolderResource';
  created: Scalars['String'];
  id: Scalars['String'];
  path: Scalars['String'];
  resourceId: Scalars['Int'];
  resourceType: Scalars['String'];
  tags: Array<Scalars['String']>;
};

export type GQLFolderResourceMeta = {
  description: Scalars['String'];
  id: Scalars['Int'];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type GQLFolderResourceMetaSearchInput = {
  id: Scalars['Int'];
  path: Scalars['String'];
  resourceType: Scalars['String'];
};

export type GQLFolderResourceResourceType = {
  __typename?: 'FolderResourceResourceType';
  id: Scalars['String'];
  name: Scalars['String'];
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

export type GQLLearningpathFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: 'LearningpathFolderResourceMeta';
  description: Scalars['String'];
  id: Scalars['Int'];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars['String'];
  type: Scalars['String'];
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

export type GQLMutation = {
  __typename?: 'Mutation';
  addFolder: GQLFolder;
  addFolderResource: GQLFolderResource;
  deleteFolder: Scalars['String'];
  deleteFolderResource: Scalars['String'];
  deletePersonalData: Scalars['Boolean'];
  sortFolders: GQLSortResult;
  sortResources: GQLSortResult;
  updateFolder: GQLFolder;
  updateFolderResource: GQLFolderResource;
  updatePersonalData: GQLMyNdlaPersonalData;
};

export type GQLMutationAddFolderArgs = {
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type GQLMutationAddFolderResourceArgs = {
  folderId: Scalars['String'];
  path: Scalars['String'];
  resourceId: Scalars['Int'];
  resourceType: Scalars['String'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type GQLMutationDeleteFolderArgs = {
  id: Scalars['String'];
};

export type GQLMutationDeleteFolderResourceArgs = {
  folderId: Scalars['String'];
  resourceId: Scalars['String'];
};

export type GQLMutationSortFoldersArgs = {
  parentId?: InputMaybe<Scalars['String']>;
  sortedIds: Array<Scalars['String']>;
};

export type GQLMutationSortResourcesArgs = {
  parentId: Scalars['String'];
  sortedIds: Array<Scalars['String']>;
};

export type GQLMutationUpdateFolderArgs = {
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type GQLMutationUpdateFolderResourceArgs = {
  id: Scalars['String'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type GQLMutationUpdatePersonalDataArgs = {
  favoriteSubjects: Array<Scalars['String']>;
};

export type GQLMyNdlaPersonalData = {
  __typename?: 'MyNdlaPersonalData';
  favoriteSubjects: Array<Scalars['String']>;
  id: Scalars['Int'];
  role: Scalars['String'];
};

export type GQLName = {
  __typename?: 'Name';
  language: Scalars['String'];
  name: Scalars['String'];
};

export type GQLNewFolder = {
  __typename?: 'NewFolder';
  name: Scalars['String'];
  parentId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type GQLNewFolderResource = {
  __typename?: 'NewFolderResource';
  path: Scalars['String'];
  resourceType: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
};

export type GQLPodcastLicense = {
  __typename?: 'PodcastLicense';
  copyText?: Maybe<Scalars['String']>;
  copyright: GQLCopyright;
  description?: Maybe<Scalars['String']>;
  src: Scalars['String'];
  title: Scalars['String'];
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
  allFolderResources: Array<GQLFolderResource>;
  article?: Maybe<GQLArticle>;
  competenceGoal?: Maybe<GQLCompetenceGoal>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  concept?: Maybe<GQLConcept>;
  conceptSearch?: Maybe<GQLConceptResult>;
  coreElement?: Maybe<GQLCoreElement>;
  coreElements?: Maybe<Array<GQLCoreElement>>;
  filmfrontpage?: Maybe<GQLFilmFrontpage>;
  folder: GQLFolder;
  folderResourceMeta?: Maybe<GQLFolderResourceMeta>;
  folderResourceMetaSearch: Array<GQLFolderResourceMeta>;
  folders: Array<GQLFolder>;
  frontpage?: Maybe<GQLFrontpage>;
  frontpageSearch?: Maybe<GQLFrontpageSearch>;
  groupSearch?: Maybe<Array<GQLGroupSearch>>;
  learningpath?: Maybe<GQLLearningpath>;
  listingPage?: Maybe<GQLListingPage>;
  personalData: GQLMyNdlaPersonalData;
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

export type GQLQueryAllFolderResourcesArgs = {
  size?: InputMaybe<Scalars['Int']>;
};

export type GQLQueryArticleArgs = {
  id: Scalars['String'];
  isOembed?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
  showVisualElement?: InputMaybe<Scalars['String']>;
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLQueryCompetenceGoalArgs = {
  code: Scalars['String'];
  language?: InputMaybe<Scalars['String']>;
};

export type GQLQueryCompetenceGoalsArgs = {
  codes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language?: InputMaybe<Scalars['String']>;
};

export type GQLQueryConceptArgs = {
  id: Scalars['Int'];
};

export type GQLQueryConceptSearchArgs = {
  exactMatch?: InputMaybe<Scalars['Boolean']>;
  fallback?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<Scalars['Int']>>;
  language?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  subjects?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['String']>;
};

export type GQLQueryCoreElementArgs = {
  code: Scalars['String'];
  language?: InputMaybe<Scalars['String']>;
};

export type GQLQueryCoreElementsArgs = {
  codes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language?: InputMaybe<Scalars['String']>;
};

export type GQLQueryFolderArgs = {
  id: Scalars['Int'];
  includeResources?: InputMaybe<Scalars['Boolean']>;
  includeSubfolders?: InputMaybe<Scalars['Boolean']>;
};

export type GQLQueryFolderResourceMetaArgs = {
  resource: GQLFolderResourceMetaSearchInput;
};

export type GQLQueryFolderResourceMetaSearchArgs = {
  resources: Array<GQLFolderResourceMetaSearchInput>;
};

export type GQLQueryFoldersArgs = {
  includeResources?: InputMaybe<Scalars['Boolean']>;
  includeSubfolders?: InputMaybe<Scalars['Boolean']>;
};

export type GQLQueryFrontpageSearchArgs = {
  query?: InputMaybe<Scalars['String']>;
};

export type GQLQueryGroupSearchArgs = {
  aggregatePaths?: InputMaybe<Array<Scalars['String']>>;
  contextTypes?: InputMaybe<Scalars['String']>;
  fallback?: InputMaybe<Scalars['String']>;
  grepCodes?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
  levels?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  resourceTypes?: InputMaybe<Scalars['String']>;
  subjects?: InputMaybe<Scalars['String']>;
};

export type GQLQueryLearningpathArgs = {
  pathId: Scalars['String'];
};

export type GQLQueryListingPageArgs = {
  subjects?: InputMaybe<Scalars['String']>;
};

export type GQLQueryPodcastArgs = {
  id: Scalars['Int'];
};

export type GQLQueryPodcastSearchArgs = {
  fallback?: InputMaybe<Scalars['Boolean']>;
  page: Scalars['Int'];
  pageSize: Scalars['Int'];
};

export type GQLQueryPodcastSeriesArgs = {
  id: Scalars['Int'];
};

export type GQLQueryPodcastSeriesSearchArgs = {
  fallback?: InputMaybe<Scalars['Boolean']>;
  page: Scalars['Int'];
  pageSize: Scalars['Int'];
};

export type GQLQueryResourceArgs = {
  id: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
  topicId?: InputMaybe<Scalars['String']>;
};

export type GQLQuerySearchArgs = {
  aggregatePaths?: InputMaybe<Array<Scalars['String']>>;
  contextFilters?: InputMaybe<Scalars['String']>;
  contextTypes?: InputMaybe<Scalars['String']>;
  fallback?: InputMaybe<Scalars['String']>;
  grepCodes?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['Int']>>;
  language?: InputMaybe<Scalars['String']>;
  languageFilter?: InputMaybe<Scalars['String']>;
  levels?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  relevance?: InputMaybe<Scalars['String']>;
  resourceTypes?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  subjects?: InputMaybe<Scalars['String']>;
};

export type GQLQuerySearchWithoutPaginationArgs = {
  contextFilters?: InputMaybe<Scalars['String']>;
  contextTypes?: InputMaybe<Scalars['String']>;
  fallback?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['Int']>>;
  language?: InputMaybe<Scalars['String']>;
  languageFilter?: InputMaybe<Scalars['String']>;
  levels?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
  relevance?: InputMaybe<Scalars['String']>;
  resourceTypes?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  subjects?: InputMaybe<Scalars['String']>;
};

export type GQLQuerySubjectArgs = {
  id: Scalars['String'];
};

export type GQLQuerySubjectpageArgs = {
  id: Scalars['Int'];
};

export type GQLQuerySubjectsArgs = {
  filterVisible?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<Scalars['String']>>;
  metadataFilterKey?: InputMaybe<Scalars['String']>;
  metadataFilterValue?: InputMaybe<Scalars['String']>;
};

export type GQLQueryTopicArgs = {
  id: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLQueryTopicsArgs = {
  contentUri?: InputMaybe<Scalars['String']>;
  filterVisible?: InputMaybe<Scalars['Boolean']>;
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
    parents?: Maybe<Array<GQLTopic>>;
    path: Scalars['String'];
    paths: Array<Scalars['String']>;
    rank?: Maybe<Scalars['Int']>;
    relevanceId?: Maybe<Scalars['String']>;
    resourceTypes?: Maybe<Array<GQLResourceType>>;
    supportedLanguages: Array<Scalars['String']>;
  };

export type GQLResourceArticleArgs = {
  isOembed?: InputMaybe<Scalars['String']>;
  subjectId?: InputMaybe<Scalars['String']>;
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

export type GQLSortResult = {
  __typename?: 'SortResult';
  parentId?: Maybe<Scalars['String']>;
  sortedIds: Array<Scalars['String']>;
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
  all?: InputMaybe<Scalars['Boolean']>;
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
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLSubjectPageLatestContentArgs = {
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLSubjectPageMostReadArgs = {
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLSubjectPageTopicalArgs = {
  subjectId?: InputMaybe<Scalars['String']>;
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
  showVisualElement?: InputMaybe<Scalars['String']>;
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLTopicCoreResourcesArgs = {
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLTopicSupplementaryResourcesArgs = {
  subjectId?: InputMaybe<Scalars['String']>;
};

export type GQLUpdatedFolder = {
  __typename?: 'UpdatedFolder';
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type GQLUpdatedFolderResource = {
  __typename?: 'UpdatedFolderResource';
  tags?: Maybe<Array<Scalars['String']>>;
};

export type GQLUptimeAlert = {
  __typename?: 'UptimeAlert';
  body?: Maybe<Scalars['String']>;
  closable: Scalars['Boolean'];
  number: Scalars['Int'];
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

export type GQLArticle_ConceptFragment = {
  __typename?: 'Concept';
  subjectNames?: Array<string>;
  id: number;
  title: string;
  content: string;
  copyright?: {
    __typename?: 'ConceptCopyright';
    license?: { __typename?: 'License'; license: string };
    creators: Array<{ __typename?: 'Contributor'; name: string; type: string }>;
  };
  image?: { __typename?: 'ImageLicense'; src: string; altText: string };
  visualElement?: {
    __typename?: 'VisualElement';
    resource?: string;
    title?: string;
    url?: string;
    copyright?: {
      __typename?: 'Copyright';
      origin?: string;
      license: { __typename?: 'License'; license: string };
      creators: Array<{
        __typename?: 'Contributor';
        name: string;
        type: string;
      }>;
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
    };
    image?: { __typename?: 'ImageElement'; src: string; alt?: string };
  };
};

export type GQLArticleConceptsQueryVariables = Exact<{
  conceptIds: Array<Scalars['Int']> | Scalars['Int'];
}>;

export type GQLArticleConceptsQuery = {
  __typename?: 'Query';
  conceptSearch?: {
    __typename?: 'ConceptResult';
    concepts: Array<{ __typename?: 'Concept' } & GQLArticle_ConceptFragment>;
  };
};

export type GQLArticle_ArticleFragment = {
  __typename?: 'Article';
  id: number;
  content: string;
  supportedLanguages?: Array<string>;
  grepCodes?: Array<string>;
  oldNdlaUrl?: string;
  introduction?: string;
  conceptIds?: Array<number>;
  revisionDate?: string;
  metaData?: {
    __typename?: 'ArticleMetaData';
    copyText?: string;
    footnotes?: Array<{
      __typename?: 'FootNote';
      ref: number;
      title: string;
      year: string;
      authors: Array<string>;
      edition?: string;
      publisher?: string;
      url?: string;
    }>;
  };
  relatedContent?: Array<{
    __typename?: 'RelatedContent';
    title: string;
    url: string;
  }>;
} & GQLLicenseBox_ArticleFragment;

export type GQLArticleContents_TopicFragment = {
  __typename?: 'Topic';
  article?: {
    __typename?: 'Article';
    id: number;
    content: string;
    created: string;
    updated: string;
    introduction?: string;
    metaData?: {
      __typename?: 'ArticleMetaData';
      footnotes?: Array<{
        __typename?: 'FootNote';
        ref: number;
        authors: Array<string>;
        edition?: string;
        publisher?: string;
        year: string;
        url?: string;
        title: string;
      }>;
    };
  } & GQLLicenseBox_ArticleFragment;
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
  description?: string;
  license?: { __typename?: 'License'; license: string };
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
    resource?: {
      __typename?: 'Resource';
      id: string;
      resourceTypes?: Array<{
        __typename?: 'ResourceType';
        id: string;
        name: string;
      }>;
    };
  }>;
};

export type GQLLearningpathEmbed_TopicFragment = {
  __typename?: 'Topic';
  supplementaryResources?: Array<{ __typename?: 'Resource'; id: string }>;
};

export type GQLLearningpathEmbed_LearningpathStepFragment = {
  __typename?: 'LearningpathStep';
  resource?: {
    __typename?: 'Resource';
    id: string;
    article?: {
      __typename?: 'Article';
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      requiredLibraries?: Array<{
        __typename?: 'ArticleRequiredLibrary';
        name: string;
        url: string;
        mediaType: string;
      }>;
    } & GQLStructuredArticleDataFragment &
      GQLArticle_ArticleFragment;
  };
  embedUrl?: {
    __typename?: 'LearningpathStepEmbedUrl';
    embedType: string;
    url: string;
  };
  oembed?: {
    __typename?: 'LearningpathStepOembed';
    html: string;
    width: number;
    height: number;
  };
};

export type GQLSubjectLinkListSubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
};

export type GQLVisualElement_VisualElementFragment = {
  __typename?: 'VisualElement';
  url?: string;
  title?: string;
  image?: {
    __typename?: 'ImageElement';
    alt?: string;
    altText: string;
    src: string;
    focalX?: number;
    focalY?: number;
    lowerRightX?: number;
    lowerRightY?: number;
    upperLeftX?: number;
    upperLeftY?: number;
  };
  oembed?: {
    __typename?: 'VisualElementOembed';
    html?: string;
    fullscreen?: boolean;
    title?: string;
  };
  brightcove?: {
    __typename?: 'BrightcoveElement';
    iframe?: { __typename?: 'BrightcoveIframe'; height: number; width: number };
  };
  h5p?: { __typename?: 'H5pElement'; src?: string };
};

export type GQLVisualElementLicenseButtons_VisualElementFragment = {
  __typename?: 'VisualElement';
  copyright?: {
    __typename?: 'Copyright';
    license: { __typename?: 'License'; license: string };
  };
  image?: { __typename?: 'ImageElement'; src: string; copyText?: string };
  brightcove?: {
    __typename?: 'BrightcoveElement';
    download?: string;
    iframe?: {
      __typename?: 'BrightcoveIframe';
      width: number;
      height: number;
      src: string;
    };
  };
};

export type GQLVisualElementWrapper_VisualElementFragment = {
  __typename?: 'VisualElement';
  resource?: string;
  copyright?: {
    __typename?: 'Copyright';
    origin?: string;
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
  };
  image?: { __typename?: 'ImageElement'; caption?: string };
  brightcove?: { __typename?: 'BrightcoveElement'; caption?: string };
} & GQLVisualElement_VisualElementFragment &
  GQLVisualElementLicenseButtons_VisualElementFragment;

export type GQLAudioLicenseList_AudioLicenseFragment = {
  __typename?: 'AudioLicense';
  src: string;
  copyText?: string;
  title: string;
  copyright: {
    __typename?: 'Copyright';
    origin?: string;
  } & GQLLicenseListCopyrightFragment;
};

export type GQLConceptLicenseList_ConceptLicenseFragment = {
  __typename?: 'ConceptLicense';
  title: string;
  src?: string;
  copyright?: {
    __typename?: 'ConceptCopyright';
    license?: { __typename?: 'License'; license: string };
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
  };
};

export type GQLH5pLicenseList_H5pLicenseFragment = {
  __typename?: 'H5pLicense';
  title: string;
  src?: string;
  copyright: { __typename?: 'Copyright' } & GQLLicenseListCopyrightFragment;
};

export type GQLImageLicenseList_ImageLicenseFragment = {
  __typename?: 'ImageLicense';
  title: string;
  altText: string;
  src: string;
  copyText?: string;
  copyright: {
    __typename?: 'Copyright';
    origin?: string;
  } & GQLLicenseListCopyrightFragment;
};

export type GQLLicenseBox_ArticleFragment = {
  __typename?: 'Article';
  title: string;
  oembed?: string;
  published: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLTextLicenseList_CopyrightFragment;
  metaData?: {
    __typename?: 'ArticleMetaData';
    copyText?: string;
    concepts?: Array<
      {
        __typename?: 'ConceptLicense';
      } & GQLConceptLicenseList_ConceptLicenseFragment
    >;
    h5ps?: Array<
      { __typename?: 'H5pLicense' } & GQLH5pLicenseList_H5pLicenseFragment
    >;
    brightcoves?: Array<
      {
        __typename?: 'BrightcoveLicense';
      } & GQLVideoLicenseList_BrightcoveLicenseFragment
    >;
    audios?: Array<
      { __typename?: 'AudioLicense' } & GQLAudioLicenseList_AudioLicenseFragment
    >;
    podcasts?: Array<
      {
        __typename?: 'PodcastLicense';
      } & GQLPodcastLicenseList_PodcastLicenseFragment
    >;
    images?: Array<
      { __typename?: 'ImageLicense' } & GQLImageLicenseList_ImageLicenseFragment
    >;
  };
};

export type GQLPodcastLicenseList_PodcastLicenseFragment = {
  __typename?: 'PodcastLicense';
  src: string;
  copyText?: string;
  title: string;
  description?: string;
  copyright: {
    __typename?: 'Copyright';
    origin?: string;
  } & GQLLicenseListCopyrightFragment;
};

export type GQLTextLicenseList_CopyrightFragment = {
  __typename?: 'Copyright';
} & GQLLicenseListCopyrightFragment;

export type GQLVideoLicenseList_BrightcoveLicenseFragment = {
  __typename?: 'BrightcoveLicense';
  title: string;
  download?: string;
  src?: string;
  cover?: string;
  iframe?: {
    __typename?: 'BrightcoveIframe';
    width: number;
    height: number;
    src: string;
  };
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

export type GQLArticlePage_ResourceTypeFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLArticlePage_SubjectFragment = {
  __typename?: 'Subject';
  name: string;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
  subjectpage?: {
    __typename?: 'SubjectPage';
    about?: { __typename?: 'SubjectPageAbout'; title: string };
  };
} & GQLArticleHero_SubjectFragment;

export type GQLArticlePage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  path: string;
  contentUri?: string;
  article?: {
    __typename?: 'Article';
    created: string;
    updated: string;
    metaDescription: string;
    tags?: Array<string>;
    metaImage?: { __typename?: 'MetaImage' } & GQLArticleHero_MetaImageFragment;
  } & GQLStructuredArticleDataFragment &
    GQLArticle_ArticleFragment;
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

export type GQLFilmFrontpage_SubjectFragment = {
  __typename?: 'Subject';
  name: string;
  topics?: Array<{
    __typename?: 'Topic';
    id: string;
    path: string;
    name: string;
  }>;
};

export type GQLFilmFrontpage_FilmFrontpageFragment = {
  __typename?: 'FilmFrontpage';
  slideShow: Array<{ __typename?: 'Movie' } & GQLMovieInfoFragment>;
  movieThemes: Array<
    { __typename?: 'MovieTheme' } & GQLMovieCategory_MovieThemeFragment
  >;
  about: Array<{
    __typename?: 'FilmPageAbout';
    title: string;
    description: string;
    language: string;
    visualElement: {
      __typename?: 'SubjectPageVisualElement';
      alt?: string;
      url: string;
      type: string;
    };
  }>;
};

export type GQLMovieCategory_MovieThemeFragment = {
  __typename?: 'MovieTheme';
  name: Array<{ __typename?: 'Name'; name: string; language: string }>;
  movies: Array<{ __typename?: 'Movie' } & GQLMovieInfoFragment>;
};

export type GQLFilmFrontPageQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLFilmFrontPageQuery = {
  __typename?: 'Query';
  filmfrontpage?: {
    __typename?: 'FilmFrontpage';
  } & GQLFilmFrontpage_FilmFrontpageFragment;
  subject?: {
    __typename?: 'Subject';
    id: string;
  } & GQLFilmFrontpage_SubjectFragment;
};

export type GQLLearningpathPage_TopicFragment = {
  __typename?: 'Topic';
} & GQLLearningpath_TopicFragment;

export type GQLLearningpathPage_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
  subjectpage?: {
    __typename?: 'SubjectPage';
    about?: { __typename?: 'SubjectPageAbout'; title: string };
  };
} & GQLLearningpath_SubjectFragment;

export type GQLLearningpathPage_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLLearningpath_ResourceTypeDefinitionFragment;

export type GQLLearningpathPage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  learningpath?: {
    __typename?: 'Learningpath';
    supportedLanguages: Array<string>;
    tags: Array<string>;
    description: string;
    coverphoto?: {
      __typename?: 'LearningpathCoverphoto';
      url: string;
      metaUrl: string;
    };
    learningsteps: Array<
      {
        __typename?: 'LearningpathStep';
        type: string;
      } & GQLLearningpath_LearningpathStepFragment
    >;
  } & GQLLearningpath_LearningpathFragment;
} & GQLLearningpath_ResourceFragment;

export type GQLLearningpathPage_TopicPathFragment = {
  __typename?: 'Topic';
} & GQLLearningpath_TopicPathFragment;

export type GQLMastHeadQueryVariables = Exact<{
  subjectId: Scalars['String'];
  resourceId: Scalars['String'];
  skipResource: Scalars['Boolean'];
}>;

export type GQLMastHeadQuery = {
  __typename?: 'Query';
  subject?: { __typename?: 'Subject' } & GQLMastheadDrawer_SubjectFragment;
  resource?: { __typename?: 'Resource'; id: string; name: string };
};

export type GQLMastheadSearch_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
};

export type GQLDefaultMenu_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
};

export type GQLDrawerContent_SubjectFragment = {
  __typename?: 'Subject';
} & GQLSubjectMenu_SubjectFragment;

export type GQLMastheadDrawer_SubjectFragment = {
  __typename?: 'Subject';
} & GQLDefaultMenu_SubjectFragment &
  GQLDrawerContent_SubjectFragment;

export type GQLSubjectMenu_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  allTopics?: Array<{
    __typename?: 'Topic';
    id: string;
    name: string;
    parent?: string;
    path: string;
  }>;
} & GQLTopicMenu_SubjectFragment;

export type GQLTopicMenu_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
};

export type GQLTopicMenu_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  path: string;
};

export type GQLTopicMenuResourcesQueryVariables = Exact<{
  subjectId: Scalars['String'];
  topicId: Scalars['String'];
}>;

export type GQLTopicMenuResourcesQuery = {
  __typename?: 'Query';
  topic?: {
    __typename?: 'Topic';
    metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
    coreResources?: Array<
      {
        __typename?: 'Resource';
        rank?: number;
        resourceTypes?: Array<{
          __typename?: 'ResourceType';
          id: string;
          name: string;
        }>;
      } & GQLTopicMenu_ResourceFragment
    >;
    supplementaryResources?: Array<
      {
        __typename?: 'Resource';
        rank?: number;
        resourceTypes?: Array<{
          __typename?: 'ResourceType';
          id: string;
          name: string;
        }>;
      } & GQLTopicMenu_ResourceFragment
    >;
  };
  resourceTypes?: Array<{
    __typename?: 'ResourceTypeDefinition';
    id: string;
    name: string;
  }>;
};

export type GQLMovedResourcePage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  path: string;
  paths: Array<string>;
  breadcrumbs?: Array<Array<string>>;
  article?: {
    __typename?: 'Article';
    id: number;
    metaDescription: string;
    metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
  };
  learningpath?: {
    __typename?: 'Learningpath';
    id: number;
    description: string;
    coverphoto?: { __typename?: 'LearningpathCoverphoto'; url: string };
  };
  resourceTypes?: Array<{
    __typename?: 'ResourceType';
    id: string;
    name: string;
  }>;
};

export type GQLMultidisciplinarySubjectArticlePageQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId: Scalars['String'];
}>;

export type GQLMultidisciplinarySubjectArticlePageQuery = {
  __typename?: 'Query';
  subject?: {
    __typename?: 'Subject';
  } & GQLMultidisciplinarySubjectArticle_SubjectFragment;
  topic?: {
    __typename?: 'Topic';
    id: string;
    article?: {
      __typename?: 'Article';
      metaDescription: string;
      tags?: Array<string>;
      metaImage?: { __typename?: 'MetaImage'; url: string };
    };
  } & GQLMultidisciplinarySubjectArticle_TopicFragment;
  resourceTypes?: Array<
    {
      __typename?: 'ResourceTypeDefinition';
    } & GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment
  >;
};

export type GQLMultidisciplinarySubjectPageQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLMultidisciplinarySubjectPageQuery = {
  __typename?: 'Query';
  subject?: {
    __typename?: 'Subject';
    subjectpage?: {
      __typename?: 'SubjectPage';
      about?: { __typename?: 'SubjectPageAbout'; title: string };
    };
    topics?: Array<{ __typename?: 'Topic'; id: string; name: string }>;
    allTopics?: Array<{
      __typename?: 'Topic';
      name: string;
      id: string;
      parent?: string;
      path: string;
      meta?: {
        __typename?: 'Meta';
        title: string;
        introduction?: string;
        metaDescription?: string;
        metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
      };
    }>;
  } & GQLMultidisciplinaryTopicWrapper_SubjectFragment;
};

export type GQLMultidisciplinarySubjectArticle_TopicFragment = {
  __typename?: 'Topic';
  path: string;
  article?: {
    __typename?: 'Article';
    created: string;
    updated: string;
    crossSubjectTopics?: Array<{
      __typename?: 'CrossSubjectElement';
      title: string;
      path?: string;
    }>;
  } & GQLArticle_ArticleFragment;
} & GQLResources_TopicFragment;

export type GQLMultidisciplinarySubjectArticle_SubjectFragment = {
  __typename?: 'Subject';
  name: string;
  id: string;
  path: string;
  allTopics?: Array<{ __typename?: 'Topic'; id: string; name: string }>;
  subjectpage?: {
    __typename?: 'SubjectPage';
    about?: { __typename?: 'SubjectPageAbout'; title: string };
  };
};

export type GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLMultidisciplinaryTopic_TopicFragment = {
  __typename?: 'Topic';
  path: string;
  subtopics?: Array<{ __typename?: 'Topic'; id: string; name: string }>;
  article?: {
    __typename?: 'Article';
    metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
    visualElement?: {
      __typename?: 'VisualElement';
    } & GQLVisualElementWrapper_VisualElementFragment;
  };
} & GQLArticleContents_TopicFragment &
  GQLResources_TopicFragment;

export type GQLMultidisciplinaryTopic_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  allTopics?: Array<{ __typename?: 'Topic'; id: string; name: string }>;
};

export type GQLMultidisciplinaryTopicWrapperQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
}>;

export type GQLMultidisciplinaryTopicWrapperQuery = {
  __typename?: 'Query';
  topic?: {
    __typename?: 'Topic';
    id: string;
  } & GQLMultidisciplinaryTopic_TopicFragment;
};

export type GQLMultidisciplinaryTopicWrapper_SubjectFragment = {
  __typename?: 'Subject';
} & GQLMultidisciplinaryTopic_SubjectFragment;

export type GQLFolderResourceFragmentFragment = {
  __typename: 'FolderResource';
  resourceId: number;
  id: string;
  resourceType: string;
  path: string;
  created: string;
  tags: Array<string>;
};

export type GQLFolderFragmentFragment = {
  __typename: 'Folder';
  id: string;
  name: string;
  status: string;
  parentId?: string;
  breadcrumbs: Array<{ __typename: 'Breadcrumb'; id: string; name: string }>;
  resources: Array<
    { __typename?: 'FolderResource' } & GQLFolderResourceFragmentFragment
  >;
};

export type GQLDeleteFolderMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type GQLDeleteFolderMutation = {
  __typename?: 'Mutation';
  deleteFolder: string;
};

export type GQLFoldersPageQueryFragmentFragment = {
  __typename?: 'Folder';
  subfolders: Array<
    {
      __typename?: 'Folder';
      subfolders: Array<
        {
          __typename?: 'Folder';
          subfolders: Array<
            {
              __typename?: 'Folder';
              subfolders: Array<
                {
                  __typename?: 'Folder';
                  subfolders: Array<
                    {
                      __typename?: 'Folder';
                      subfolders: Array<
                        {
                          __typename?: 'Folder';
                          subfolders: Array<
                            {
                              __typename?: 'Folder';
                              subfolders: Array<
                                {
                                  __typename?: 'Folder';
                                  subfolders: Array<
                                    {
                                      __typename?: 'Folder';
                                    } & GQLFolderFragmentFragment
                                  >;
                                } & GQLFolderFragmentFragment
                              >;
                            } & GQLFolderFragmentFragment
                          >;
                        } & GQLFolderFragmentFragment
                      >;
                    } & GQLFolderFragmentFragment
                  >;
                } & GQLFolderFragmentFragment
              >;
            } & GQLFolderFragmentFragment
          >;
        } & GQLFolderFragmentFragment
      >;
    } & GQLFolderFragmentFragment
  >;
} & GQLFolderFragmentFragment;

export type GQLFoldersPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLFoldersPageQuery = {
  __typename?: 'Query';
  folders: Array<
    { __typename?: 'Folder' } & GQLFoldersPageQueryFragmentFragment
  >;
};

export type GQLUpdateFolderResourceMutationVariables = Exact<{
  id: Scalars['String'];
  tags: Array<Scalars['String']> | Scalars['String'];
}>;

export type GQLUpdateFolderResourceMutation = {
  __typename?: 'Mutation';
  updateFolderResource: {
    __typename?: 'FolderResource';
  } & GQLFolderResourceFragmentFragment;
};

export type GQLAddFolderMutationVariables = Exact<{
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
}>;

export type GQLAddFolderMutation = {
  __typename?: 'Mutation';
  addFolder: { __typename?: 'Folder' } & GQLFoldersPageQueryFragmentFragment;
};

export type GQLUpdateFolderMutationVariables = Exact<{
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
}>;

export type GQLUpdateFolderMutation = {
  __typename?: 'Mutation';
  updateFolder: { __typename?: 'Folder' } & GQLFoldersPageQueryFragmentFragment;
};

export type GQLSortFoldersMutationVariables = Exact<{
  parentId?: InputMaybe<Scalars['String']>;
  sortedIds: Array<Scalars['String']> | Scalars['String'];
}>;

export type GQLSortFoldersMutation = {
  __typename?: 'Mutation';
  sortFolders: {
    __typename?: 'SortResult';
    parentId?: string;
    sortedIds: Array<string>;
  };
};

export type GQLSortResourcesMutationVariables = Exact<{
  parentId: Scalars['String'];
  sortedIds: Array<Scalars['String']> | Scalars['String'];
}>;

export type GQLSortResourcesMutation = {
  __typename?: 'Mutation';
  sortResources: {
    __typename?: 'SortResult';
    parentId?: string;
    sortedIds: Array<string>;
  };
};

type GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment = {
  __typename: 'ArticleFolderResourceMeta';
  id: number;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
  resourceTypes: Array<{
    __typename?: 'FolderResourceResourceType';
    id: string;
    name: string;
  }>;
};

type GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment = {
  __typename: 'LearningpathFolderResourceMeta';
  id: number;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
  resourceTypes: Array<{
    __typename?: 'FolderResourceResourceType';
    id: string;
    name: string;
  }>;
};

export type GQLFolderResourceMetaFragment =
  | GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment
  | GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment;

export type GQLFolderResourceMetaQueryVariables = Exact<{
  resource: GQLFolderResourceMetaSearchInput;
}>;

export type GQLFolderResourceMetaQuery = {
  __typename?: 'Query';
  folderResourceMeta?:
    | ({
        __typename?: 'ArticleFolderResourceMeta';
      } & GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment)
    | ({
        __typename?: 'LearningpathFolderResourceMeta';
      } & GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment);
};

export type GQLFolderResourceMetaSearchQueryVariables = Exact<{
  resources:
    | Array<GQLFolderResourceMetaSearchInput>
    | GQLFolderResourceMetaSearchInput;
}>;

export type GQLFolderResourceMetaSearchQuery = {
  __typename?: 'Query';
  folderResourceMetaSearch: Array<
    | ({
        __typename?: 'ArticleFolderResourceMeta';
      } & GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment)
    | ({
        __typename?: 'LearningpathFolderResourceMeta';
      } & GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment)
  >;
};

export type GQLRecentlyUsedQueryVariables = Exact<{ [key: string]: never }>;

export type GQLRecentlyUsedQuery = {
  __typename?: 'Query';
  allFolderResources: Array<{
    __typename?: 'FolderResource';
    id: string;
    resourceId: number;
    path: string;
    tags: Array<string>;
    resourceType: string;
    created: string;
  }>;
};

export type GQLAddResourceToFolderMutationVariables = Exact<{
  resourceId: Scalars['Int'];
  folderId: Scalars['String'];
  resourceType: Scalars['String'];
  path: Scalars['String'];
  tags?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type GQLAddResourceToFolderMutation = {
  __typename?: 'Mutation';
  addFolderResource: {
    __typename?: 'FolderResource';
  } & GQLFolderResourceFragmentFragment;
};

export type GQLDeleteFolderResourceMutationVariables = Exact<{
  folderId: Scalars['String'];
  resourceId: Scalars['String'];
}>;

export type GQLDeleteFolderResourceMutation = {
  __typename?: 'Mutation';
  deleteFolderResource: string;
};

export type GQLMySubjectsSubjectFragmentFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
};

export type GQLAllSubjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAllSubjectsQuery = {
  __typename?: 'Query';
  subjects?: Array<
    { __typename?: 'Subject' } & GQLMySubjectsSubjectFragmentFragment
  >;
};

export type GQLDeletePersonalDataMutationVariables = Exact<{
  [key: string]: never;
}>;

export type GQLDeletePersonalDataMutation = {
  __typename?: 'Mutation';
  deletePersonalData: boolean;
};

export type GQLMySubjectMyNdlaPersonalDataFragmentFragment = {
  __typename?: 'MyNdlaPersonalData';
  id: number;
  favoriteSubjects: Array<string>;
  role: string;
};

export type GQLPersonalDataQueryVariables = Exact<{ [key: string]: never }>;

export type GQLPersonalDataQuery = {
  __typename?: 'Query';
  personalData: {
    __typename?: 'MyNdlaPersonalData';
  } & GQLMySubjectMyNdlaPersonalDataFragmentFragment;
};

export type GQLUpdatePersonalDataMutationVariables = Exact<{
  favoriteSubjects: Array<Scalars['String']> | Scalars['String'];
}>;

export type GQLUpdatePersonalDataMutation = {
  __typename?: 'Mutation';
  updatePersonalData: {
    __typename?: 'MyNdlaPersonalData';
  } & GQLMySubjectMyNdlaPersonalDataFragmentFragment;
};

export type GQLPlainArticleContainer_ArticleFragment = {
  __typename?: 'Article';
  created: string;
  tags?: Array<string>;
} & GQLArticle_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLPlainArticlePageQueryVariables = Exact<{
  articleId: Scalars['String'];
  isOembed?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
  showVisualElement?: InputMaybe<Scalars['String']>;
}>;

export type GQLPlainArticlePageQuery = {
  __typename?: 'Query';
  article?: {
    __typename?: 'Article';
  } & GQLPlainArticleContainer_ArticleFragment;
};

export type GQLPlainLearningpathContainer_LearningpathFragment = {
  __typename?: 'Learningpath';
  supportedLanguages: Array<string>;
  tags: Array<string>;
  description: string;
  coverphoto?: { __typename?: 'LearningpathCoverphoto'; url: string };
  learningsteps: Array<
    {
      __typename?: 'LearningpathStep';
    } & GQLLearningpath_LearningpathStepFragment
  >;
} & GQLLearningpath_LearningpathFragment;

export type GQLPlainLearningpathPageQueryVariables = Exact<{
  pathId: Scalars['String'];
}>;

export type GQLPlainLearningpathPageQuery = {
  __typename?: 'Query';
  learningpath?: {
    __typename?: 'Learningpath';
  } & GQLPlainLearningpathContainer_LearningpathFragment;
};

export type GQLPodcast_AudioFragment = {
  __typename?: 'Audio';
  id: number;
  created: string;
  audioType: string;
  title: { __typename?: 'Title'; title: string };
  audioFile: { __typename?: 'AudioFile'; url: string };
  copyright: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
  manuscript?: { __typename?: 'Manuscript'; manuscript: string };
  podcastMeta?: {
    __typename?: 'PodcastMeta';
    introduction: string;
    image?: {
      __typename?: 'ImageMetaInformation';
      id: string;
      imageUrl: string;
      title: string;
      altText: string;
      copyright: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
    };
  };
};

export type GQLPodcastSeries_PodcastSeriesSummaryFragment = {
  __typename?: 'PodcastSeriesSummary';
  id: number;
  title: { __typename?: 'Title'; title: string };
  description: { __typename?: 'Description'; description: string };
  coverPhoto: { __typename?: 'CoverPhoto'; url: string; altText: string };
};

export type GQLPodcastSeriesListPageQueryVariables = Exact<{
  page: Scalars['Int'];
  pageSize: Scalars['Int'];
  fallback?: InputMaybe<Scalars['Boolean']>;
}>;

export type GQLPodcastSeriesListPageQuery = {
  __typename?: 'Query';
  podcastSeriesSearch?: {
    __typename?: 'PodcastSeriesSearch';
    totalCount: number;
    results: Array<
      {
        __typename?: 'PodcastSeriesSummary';
      } & GQLPodcastSeries_PodcastSeriesSummaryFragment
    >;
  };
};

export type GQLPodcastSeriesPageQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type GQLPodcastSeriesPageQuery = {
  __typename?: 'Query';
  podcastSeries?: {
    __typename?: 'PodcastSeriesWithEpisodes';
    id: number;
    supportedLanguages: Array<string>;
    title: { __typename?: 'Title'; title: string };
    description: { __typename?: 'Description'; description: string };
    coverPhoto: { __typename?: 'CoverPhoto'; url: string };
    episodes?: Array<
      {
        __typename?: 'Audio';
        tags: { __typename?: 'Tags'; tags: Array<string> };
      } & GQLPodcast_AudioFragment
    >;
  };
};

export type GQLResourcePageQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId: Scalars['String'];
  resourceId: Scalars['String'];
}>;

export type GQLResourcePageQuery = {
  __typename?: 'Query';
  subject?: {
    __typename?: 'Subject';
    topics?: Array<
      {
        __typename?: 'Topic';
        parent?: string;
      } & GQLLearningpathPage_TopicPathFragment &
        GQLArticlePage_TopicPathFragment
    >;
  } & GQLLearningpathPage_SubjectFragment &
    GQLArticlePage_SubjectFragment;
  resourceTypes?: Array<
    {
      __typename?: 'ResourceTypeDefinition';
    } & GQLArticlePage_ResourceTypeFragment &
      GQLLearningpathPage_ResourceTypeDefinitionFragment
  >;
  topic?: { __typename?: 'Topic' } & GQLLearningpathPage_TopicFragment &
    GQLArticlePage_TopicFragment;
  resource?: {
    __typename?: 'Resource';
    relevanceId?: string;
    paths: Array<string>;
  } & GQLMovedResourcePage_ResourceFragment &
    GQLArticlePage_ResourceFragment &
    GQLLearningpathPage_ResourceFragment;
};

export type GQLResources_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: string;
  path: string;
  paths: Array<string>;
  rank?: number;
  resourceTypes?: Array<{
    __typename?: 'ResourceType';
    id: string;
    name: string;
  }>;
};

export type GQLResources_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
  id: string;
  name: string;
};

export type GQLResources_TopicFragment = {
  __typename?: 'Topic';
  name: string;
  coreResources?: Array<
    { __typename?: 'Resource' } & GQLResources_ResourceFragment
  >;
  supplementaryResources?: Array<
    { __typename?: 'Resource' } & GQLResources_ResourceFragment
  >;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
};

export type GQLSubjectContainer_SubjectFragment = {
  __typename?: 'Subject';
  grepCodes: Array<string>;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
  topics?: Array<{
    __typename?: 'Topic';
    id: string;
    supportedLanguages: Array<string>;
  }>;
  allTopics?: Array<{
    __typename?: 'Topic';
    id: string;
    name: string;
    meta?: {
      __typename?: 'Meta';
      metaDescription?: string;
      metaImage?: { __typename?: 'MetaImage'; url: string };
    };
  }>;
  subjectpage?: {
    __typename?: 'SubjectPage';
    metaDescription?: string;
    about?: {
      __typename?: 'SubjectPageAbout';
      title: string;
      visualElement: { __typename?: 'SubjectPageVisualElement'; url: string };
    };
    banner: { __typename?: 'SubjectPageBanner'; desktopUrl: string };
  };
} & GQLSubjectPageContent_SubjectFragment;

export type GQLSubjectPageTestQueryVariables = Exact<{
  subjectId: Scalars['String'];
  topicId: Scalars['String'];
  includeTopic: Scalars['Boolean'];
  metadataFilterKey?: InputMaybe<Scalars['String']>;
  metadataFilterValue?: InputMaybe<Scalars['String']>;
}>;

export type GQLSubjectPageTestQuery = {
  __typename?: 'Query';
  subject?: { __typename?: 'Subject' } & GQLSubjectContainer_SubjectFragment;
  topic?: {
    __typename?: 'Topic';
    alternateTopics?: Array<
      { __typename?: 'Topic' } & GQLMovedTopicPage_TopicFragment
    >;
  };
  subjects?: Array<{
    __typename?: 'Subject';
    path: string;
    metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
  }>;
};

export type GQLMovedTopicPage_TopicFragment = {
  __typename?: 'Topic';
  id: string;
  path: string;
  name: string;
  breadcrumbs?: Array<Array<string>>;
  meta?: {
    __typename?: 'Meta';
    metaDescription?: string;
    metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
  };
};

export type GQLSubjectPageContent_SubjectFragment = {
  __typename?: 'Subject';
  topics?: Array<{
    __typename?: 'Topic';
    name: string;
    id: string;
    availability?: string;
    relevanceId?: string;
  }>;
} & GQLTopicWrapper_SubjectFragment;

export type GQLTopic_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  allTopics?: Array<{ __typename?: 'Topic'; id: string; name: string }>;
};

export type GQLTopic_TopicFragment = {
  __typename?: 'Topic';
  path: string;
  name: string;
  relevanceId?: string;
  subtopics?: Array<{
    __typename?: 'Topic';
    id: string;
    name: string;
    relevanceId?: string;
  }>;
  article?: {
    __typename?: 'Article';
    revisionDate?: string;
    metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
    visualElement?: {
      __typename?: 'VisualElement';
    } & GQLVisualElementWrapper_VisualElementFragment;
  };
} & GQLArticleContents_TopicFragment &
  GQLResources_TopicFragment;

export type GQLTopic_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLTopicWrapperQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
}>;

export type GQLTopicWrapperQuery = {
  __typename?: 'Query';
  topic?: { __typename?: 'Topic'; id: string } & GQLTopic_TopicFragment;
  resourceTypes?: Array<
    {
      __typename?: 'ResourceTypeDefinition';
    } & GQLTopic_ResourceTypeDefinitionFragment
  >;
};

export type GQLTopicWrapper_SubjectFragment = {
  __typename?: 'Subject';
} & GQLTopic_SubjectFragment;

export type GQLToolboxSubjectContainer_SubjectFragment = {
  __typename?: 'Subject';
  topics?: Array<{ __typename?: 'Topic'; name: string; id: string }>;
  allTopics?: Array<{
    __typename?: 'Topic';
    id: string;
    name: string;
    meta?: {
      __typename?: 'Meta';
      metaDescription?: string;
      introduction?: string;
      title: string;
      metaImage?: { __typename?: 'MetaImage'; url: string };
    };
  }>;
  subjectpage?: {
    __typename?: 'SubjectPage';
    metaDescription?: string;
    about?: {
      __typename?: 'SubjectPageAbout';
      title: string;
      description: string;
      visualElement: { __typename?: 'SubjectPageVisualElement'; url: string };
    };
    banner: { __typename?: 'SubjectPageBanner'; desktopUrl: string };
  };
} & GQLToolboxTopicContainer_SubjectFragment;

export type GQLToolboxSubjectPageQueryVariables = Exact<{
  subjectId: Scalars['String'];
}>;

export type GQLToolboxSubjectPageQuery = {
  __typename?: 'Query';
  subject?: {
    __typename?: 'Subject';
  } & GQLToolboxSubjectContainer_SubjectFragment;
};

export type GQLToolboxTopicContainerQueryVariables = Exact<{
  topicId: Scalars['String'];
  subjectId: Scalars['String'];
}>;

export type GQLToolboxTopicContainerQuery = {
  __typename?: 'Query';
  topic?: {
    __typename?: 'Topic';
    id: string;
  } & GQLToolboxTopicWrapper_TopicFragment;
  resourceTypes?: Array<
    {
      __typename?: 'ResourceTypeDefinition';
    } & GQLToolboxTopicWrapper_ResourceTypeDefinitionFragment
  >;
};

export type GQLToolboxTopicContainer_SubjectFragment = {
  __typename?: 'Subject';
} & GQLToolboxTopicWrapper_SubjectFragment;

export type GQLToolboxTopicWrapper_SubjectFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  allTopics?: Array<{ __typename?: 'Topic'; id: string; name: string }>;
};

export type GQLToolboxTopicWrapper_ResourceTypeDefinitionFragment = {
  __typename?: 'ResourceTypeDefinition';
  id: string;
  name: string;
};

export type GQLToolboxTopicWrapper_TopicFragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  path: string;
  article?: {
    __typename?: 'Article';
    title: string;
    introduction?: string;
    copyright: {
      __typename?: 'Copyright';
      license: { __typename?: 'License'; license: string };
      creators: Array<{
        __typename?: 'Contributor';
        name: string;
        type: string;
      }>;
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
    };
    metaImage?: { __typename?: 'MetaImage'; alt: string; url: string };
    visualElement?: {
      __typename?: 'VisualElement';
      resource?: string;
      image?: {
        __typename?: 'ImageElement';
        src: string;
        alt?: string;
        lowerRightX?: number;
        lowerRightY?: number;
        upperLeftX?: number;
        upperLeftY?: number;
        focalX?: number;
        focalY?: number;
      };
    } & GQLVisualElementWrapper_VisualElementFragment;
  };
  subtopics?: Array<{
    __typename?: 'Topic';
    id: string;
    name: string;
    path: string;
  }>;
} & GQLResources_TopicFragment;

export type GQLIframeArticlePage_ArticleFragment = {
  __typename?: 'Article';
  created: string;
  updated: string;
  metaDescription: string;
  tags?: Array<string>;
  metaImage?: { __typename?: 'MetaImage'; url: string };
} & GQLArticle_ArticleFragment;

export type GQLIframeArticlePage_ResourceFragment = {
  __typename?: 'Resource';
  id: string;
  path: string;
  resourceTypes?: Array<{
    __typename?: 'ResourceType';
    id: string;
    name: string;
  }>;
};

export type GQLIframePageQueryVariables = Exact<{
  articleId: Scalars['String'];
  isOembed?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
  taxonomyId: Scalars['String'];
  includeResource: Scalars['Boolean'];
  includeTopic: Scalars['Boolean'];
  showVisualElement?: InputMaybe<Scalars['String']>;
}>;

export type GQLIframePageQuery = {
  __typename?: 'Query';
  article?: { __typename?: 'Article' } & GQLIframeTopicPage_ArticleFragment &
    GQLIframeArticlePage_ArticleFragment;
  resource?: {
    __typename?: 'Resource';
  } & GQLIframeArticlePage_ResourceFragment;
  topic?: { __typename?: 'Topic' } & GQLIframeTopicPage_TopicFragment;
};

export type GQLIframeTopicPage_ArticleFragment = {
  __typename?: 'Article';
  created: string;
  tags?: Array<string>;
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
  query?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  contextTypes?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['Int']> | Scalars['Int']>;
  resourceTypes?: InputMaybe<Scalars['String']>;
  contextFilters?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  fallback?: InputMaybe<Scalars['String']>;
  subjects?: InputMaybe<Scalars['String']>;
  languageFilter?: InputMaybe<Scalars['String']>;
  relevance?: InputMaybe<Scalars['String']>;
  grepCodes?: InputMaybe<Scalars['String']>;
}>;

export type GQLSearchQuery = {
  __typename?: 'Query';
  search?: {
    __typename?: 'Search';
    language: string;
    page?: number;
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
          metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
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
          metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
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
  };
};

export type GQLSearchFilmArticleSearchResultFragment = {
  __typename?: 'ArticleSearchResult';
  id: number;
  url: string;
  metaDescription: string;
  title: string;
  supportedLanguages: Array<string>;
  traits: Array<string>;
  metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
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
  metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
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
  query?: InputMaybe<Scalars['String']>;
  contextTypes?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['Int']> | Scalars['Int']>;
  resourceTypes?: InputMaybe<Scalars['String']>;
  contextFilters?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  fallback?: InputMaybe<Scalars['String']>;
  subjects?: InputMaybe<Scalars['String']>;
  languageFilter?: InputMaybe<Scalars['String']>;
  relevance?: InputMaybe<Scalars['String']>;
}>;

export type GQLSearchWithoutPaginationQuery = {
  __typename?: 'Query';
  searchWithoutPagination?: {
    __typename?: 'SearchWithoutPagination';
    results: Array<
      | ({
          __typename?: 'ArticleSearchResult';
        } & GQLSearchFilmArticleSearchResultFragment)
      | ({
          __typename?: 'LearningpathSearchResult';
        } & GQLSearchFilmLearningpathSearchResultFragment)
    >;
  };
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
  metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
};

export type GQLGroupSearchQueryVariables = Exact<{
  resourceTypes?: InputMaybe<Scalars['String']>;
  contextTypes?: InputMaybe<Scalars['String']>;
  subjects?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  language?: InputMaybe<Scalars['String']>;
  fallback?: InputMaybe<Scalars['String']>;
  grepCodes?: InputMaybe<Scalars['String']>;
  aggregatePaths?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  grepCodesList?: InputMaybe<
    Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>
  >;
}>;

export type GQLGroupSearchQuery = {
  __typename?: 'Query';
  groupSearch?: Array<{
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
  }>;
  competenceGoals?: Array<{
    __typename?: 'CompetenceGoal';
    id: string;
    type: string;
    name: string;
    curriculum?: { __typename?: 'Reference'; id: string; title: string };
    competenceGoalSet?: { __typename?: 'Reference'; id: string; title: string };
  }>;
};

export type GQLCopyrightInfoFragment = {
  __typename?: 'Copyright';
  origin?: string;
  license: { __typename?: 'License'; license: string; url?: string };
  creators: Array<{ __typename?: 'Contributor' } & GQLContributorInfoFragment>;
  processors: Array<
    { __typename?: 'Contributor' } & GQLContributorInfoFragment
  >;
  rightsholders: Array<
    { __typename?: 'Contributor' } & GQLContributorInfoFragment
  >;
};

export type GQLVisualElementInfoFragment = {
  __typename?: 'VisualElement';
  title?: string;
  resource?: string;
  url?: string;
  language?: string;
  embed?: string;
  copyright?: { __typename?: 'Copyright' } & GQLCopyrightInfoFragment;
  brightcove?: {
    __typename?: 'BrightcoveElement';
    videoid?: string;
    player?: string;
    account?: string;
    caption?: string;
    description?: string;
    cover?: string;
    src?: string;
    download?: string;
    uploadDate?: string;
    iframe?: {
      __typename?: 'BrightcoveIframe';
      src: string;
      height: number;
      width: number;
    };
  };
  h5p?: { __typename?: 'H5pElement'; src?: string; thumbnail?: string };
  oembed?: {
    __typename?: 'VisualElementOembed';
    title?: string;
    html?: string;
    fullscreen?: boolean;
  };
  image?: {
    __typename?: 'ImageElement';
    resourceid?: string;
    alt?: string;
    caption?: string;
    lowerRightX?: number;
    lowerRightY?: number;
    upperLeftX?: number;
    upperLeftY?: number;
    focalX?: number;
    focalY?: number;
    src: string;
    altText: string;
    contentType?: string;
    copyText?: string;
  };
};

export type GQLConceptSearchConceptFragment = {
  __typename?: 'Concept';
  id: number;
  title: string;
  subjectNames?: Array<string>;
  text: string;
  visualElement?: {
    __typename?: 'VisualElement';
  } & GQLVisualElementInfoFragment;
  copyright?: {
    __typename?: 'ConceptCopyright';
    origin?: string;
    license?: { __typename?: 'License'; license: string };
    creators: Array<
      { __typename?: 'Contributor' } & GQLContributorInfoFragment
    >;
    processors: Array<
      { __typename?: 'Contributor' } & GQLContributorInfoFragment
    >;
    rightsholders: Array<
      { __typename?: 'Contributor' } & GQLContributorInfoFragment
    >;
  };
  image?: { __typename?: 'MetaImage'; url: string; alt: string };
};

export type GQLFrontpageSearchQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
}>;

export type GQLFrontpageSearchQuery = {
  __typename?: 'Query';
  frontpageSearch?: {
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
  };
};

export type GQLMetaInfoFragment = {
  __typename?: 'Meta';
  id: number;
  title: string;
  introduction?: string;
  metaDescription?: string;
  lastUpdated?: string;
  metaImage?: { __typename?: 'MetaImage'; url: string; alt: string };
};

export type GQLTopicInfoFragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  contentUri?: string;
  path: string;
  parent?: string;
  relevanceId?: string;
  supportedLanguages: Array<string>;
  meta?: { __typename?: 'Meta' } & GQLMetaInfoFragment;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
};

export type GQLSubjectInfoFragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  path: string;
  metadata: { __typename?: 'TaxonomyMetadata'; customFields: any };
  subjectpage?: {
    __typename?: 'SubjectPage';
    about?: { __typename?: 'SubjectPageAbout'; title: string };
    banner: { __typename?: 'SubjectPageBanner'; desktopUrl: string };
  };
};

export type GQLResourceInfoFragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: string;
  path: string;
  paths: Array<string>;
  relevanceId?: string;
  rank?: number;
  resourceTypes?: Array<{
    __typename?: 'ResourceType';
    id: string;
    name: string;
  }>;
};

type GQLTaxonomyEntityInfo_Resource_Fragment = {
  __typename?: 'Resource';
  id: string;
  name: string;
  contentUri?: string;
  path: string;
  resourceTypes?: Array<{
    __typename?: 'ResourceType';
    id: string;
    name: string;
  }>;
};

type GQLTaxonomyEntityInfo_Subject_Fragment = {
  __typename?: 'Subject';
  id: string;
  name: string;
  contentUri?: string;
  path: string;
};

type GQLTaxonomyEntityInfo_Topic_Fragment = {
  __typename?: 'Topic';
  id: string;
  name: string;
  contentUri?: string;
  path: string;
};

export type GQLTaxonomyEntityInfoFragment =
  | GQLTaxonomyEntityInfo_Resource_Fragment
  | GQLTaxonomyEntityInfo_Subject_Fragment
  | GQLTaxonomyEntityInfo_Topic_Fragment;

export type GQLSearchPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSearchPageQuery = {
  __typename?: 'Query';
  subjects?: Array<{ __typename?: 'Subject' } & GQLSubjectInfoFragment>;
  resourceTypes?: Array<{
    __typename?: 'ResourceTypeDefinition';
    id: string;
    name: string;
    subtypes?: Array<{
      __typename?: 'ResourceTypeDefinition';
      id: string;
      name: string;
    }>;
  }>;
};

export type GQLSubjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSubjectsQuery = {
  __typename?: 'Query';
  subjects?: Array<{ __typename?: 'Subject' } & GQLSubjectInfoFragment>;
};

export type GQLMovedResourceQueryVariables = Exact<{
  resourceId: Scalars['String'];
}>;

export type GQLMovedResourceQuery = {
  __typename?: 'Query';
  resource?: { __typename?: 'Resource'; breadcrumbs?: Array<Array<string>> };
};

export type GQLCompetenceGoalsQueryVariables = Exact<{
  codes?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
}>;

export type GQLCompetenceGoalsQuery = {
  __typename?: 'Query';
  competenceGoals?: Array<{
    __typename?: 'CompetenceGoal';
    id: string;
    type: string;
    name: string;
    curriculum?: { __typename?: 'Reference'; id: string; title: string };
    competenceGoalSet?: { __typename?: 'Reference'; id: string; title: string };
  }>;
  coreElements?: Array<{
    __typename?: 'CoreElement';
    id: string;
    name: string;
    text?: string;
    curriculum?: { __typename?: 'Reference'; id: string; title: string };
  }>;
};

export type GQLMovieInfoFragment = {
  __typename?: 'Movie';
  id: string;
  title: string;
  metaDescription: string;
  path: string;
  metaImage?: { __typename?: 'MetaImage'; alt: string; url: string };
  resourceTypes: Array<{
    __typename?: 'ResourceType';
    id: string;
    name: string;
  }>;
};

export type GQLAlertsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAlertsQuery = {
  __typename?: 'Query';
  alerts?: Array<{
    __typename?: 'UptimeAlert';
    title: string;
    body?: string;
    closable: boolean;
    number: number;
  }>;
};

export type GQLConceptQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type GQLConceptQuery = {
  __typename?: 'Query';
  concept?: {
    __typename?: 'Concept';
    id: number;
    title: string;
    subjectNames?: Array<string>;
    content: string;
    source?: string;
    articles?: Array<{ __typename?: 'Meta'; title: string; id: number }>;
    visualElement?: {
      __typename?: 'VisualElement';
    } & GQLVisualElementInfoFragment;
    copyright?: {
      __typename?: 'ConceptCopyright';
      origin?: string;
      license?: { __typename?: 'License'; license: string };
      creators: Array<
        { __typename?: 'Contributor' } & GQLContributorInfoFragment
      >;
      processors: Array<
        { __typename?: 'Contributor' } & GQLContributorInfoFragment
      >;
      rightsholders: Array<
        { __typename?: 'Contributor' } & GQLContributorInfoFragment
      >;
    };
    image?: { __typename?: 'MetaImage'; url: string; alt: string };
  };
};

export type GQLStructuredArticleData_CopyrightFragment = {
  __typename?: 'Copyright';
  license: { __typename?: 'License'; url?: string };
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

export type GQLStructuredArticleData_PodcastLicenseFragment = {
  __typename?: 'PodcastLicense';
  src: string;
  title: string;
  description?: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleData_BrightcoveLicenseFragment = {
  __typename?: 'BrightcoveLicense';
  src?: string;
  title: string;
  cover?: string;
  description?: string;
  download?: string;
  uploadDate?: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleDataFragment = {
  __typename?: 'Article';
  id: number;
  title: string;
  metaDescription: string;
  published: string;
  updated: string;
  supportedLanguages?: Array<string>;
  availability?: string;
  copyright: {
    __typename?: 'Copyright';
  } & GQLStructuredArticleData_CopyrightFragment;
  metaImage?: { __typename?: 'MetaImage'; url: string };
  competenceGoals?: Array<{
    __typename?: 'CompetenceGoal';
    id: string;
    code?: string;
    title: string;
    type: string;
  }>;
  coreElements?: Array<{
    __typename?: 'CoreElement';
    id: string;
    title: string;
  }>;
  metaData?: {
    __typename?: 'ArticleMetaData';
    images?: Array<
      {
        __typename?: 'ImageLicense';
      } & GQLStructuredArticleData_ImageLicenseFragment
    >;
    audios?: Array<
      {
        __typename?: 'AudioLicense';
      } & GQLStructuredArticleData_AudioLicenseFragment
    >;
    podcasts?: Array<
      {
        __typename?: 'PodcastLicense';
      } & GQLStructuredArticleData_PodcastLicenseFragment
    >;
    brightcoves?: Array<
      {
        __typename?: 'BrightcoveLicense';
      } & GQLStructuredArticleData_BrightcoveLicenseFragment
    >;
  };
};

export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  StringRecord: { input: any; output: any };
};

export type GQLAggregationResult = {
  __typename?: "AggregationResult";
  docCountErrorUpperBound: Scalars["Int"]["output"];
  field: Scalars["String"]["output"];
  sumOtherDocCount: Scalars["Int"]["output"];
  values: Array<GQLBucketResult>;
};

export type GQLArenaBreadcrumb = {
  __typename?: "ArenaBreadcrumb";
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLArenaCategory = {
  __typename?: "ArenaCategory";
  description: Scalars["String"]["output"];
  disabled: Scalars["Boolean"]["output"];
  htmlDescription: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  postCount: Scalars["Int"]["output"];
  slug: Scalars["String"]["output"];
  topicCount: Scalars["Int"]["output"];
  topics?: Maybe<Array<GQLArenaTopic>>;
};

export type GQLArenaCategoryV2 = {
  __typename?: "ArenaCategoryV2";
  description: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  isFollowing: Scalars["Boolean"]["output"];
  postCount: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  topicCount: Scalars["Int"]["output"];
  topics?: Maybe<Array<GQLArenaTopicV2>>;
  visible: Scalars["Boolean"]["output"];
};

export type GQLArenaFlag = {
  __typename?: "ArenaFlag";
  created: Scalars["String"]["output"];
  flagger?: Maybe<GQLArenaUserV2>;
  id: Scalars["Int"]["output"];
  isResolved: Scalars["Boolean"]["output"];
  reason: Scalars["String"]["output"];
  resolved?: Maybe<Scalars["String"]["output"]>;
};

export type GQLArenaNewPostNotificationV2 = {
  __typename?: "ArenaNewPostNotificationV2";
  id: Scalars["Int"]["output"];
  isRead: Scalars["Boolean"]["output"];
  notificationTime: Scalars["String"]["output"];
  post: GQLArenaPostV2;
  topicId: Scalars["Int"]["output"];
  topicTitle: Scalars["String"]["output"];
};

export type GQLArenaNotification = {
  __typename?: "ArenaNotification";
  bodyShort: Scalars["String"]["output"];
  datetimeISO: Scalars["String"]["output"];
  from: Scalars["Int"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  importance: Scalars["Int"]["output"];
  notificationId: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  postId: Scalars["Int"]["output"];
  read: Scalars["Boolean"]["output"];
  readClass: Scalars["String"]["output"];
  subject: Scalars["String"]["output"];
  topicId: Scalars["Int"]["output"];
  topicTitle: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  user: GQLArenaUser;
};

export type GQLArenaPost = {
  __typename?: "ArenaPost";
  content: Scalars["String"]["output"];
  deleted: Scalars["Boolean"]["output"];
  flagId?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["Int"]["output"];
  isMainPost: Scalars["Boolean"]["output"];
  timestamp: Scalars["String"]["output"];
  topicId: Scalars["Int"]["output"];
  user: GQLArenaUser;
};

export type GQLArenaPostV2 = {
  __typename?: "ArenaPostV2";
  content: Scalars["String"]["output"];
  contentAsHTML?: Maybe<Scalars["String"]["output"]>;
  created: Scalars["String"]["output"];
  flags?: Maybe<Array<GQLArenaFlag>>;
  id: Scalars["Int"]["output"];
  owner?: Maybe<GQLArenaUserV2>;
  topicId: Scalars["Int"]["output"];
  updated: Scalars["String"]["output"];
};

export type GQLArenaTopic = {
  __typename?: "ArenaTopic";
  breadcrumbs: Array<GQLArenaBreadcrumb>;
  categoryId: Scalars["Int"]["output"];
  deleted: Scalars["Boolean"]["output"];
  id: Scalars["Int"]["output"];
  isFollowing?: Maybe<Scalars["Boolean"]["output"]>;
  locked: Scalars["Boolean"]["output"];
  pinned: Scalars["Boolean"]["output"];
  postCount: Scalars["Int"]["output"];
  posts: Array<GQLArenaPost>;
  slug: Scalars["String"]["output"];
  timestamp: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type GQLArenaTopicV2 = {
  __typename?: "ArenaTopicV2";
  categoryId: Scalars["Int"]["output"];
  created: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  isFollowing: Scalars["Boolean"]["output"];
  isLocked: Scalars["Boolean"]["output"];
  isPinned: Scalars["Boolean"]["output"];
  postCount: Scalars["Int"]["output"];
  posts?: Maybe<GQLPaginatedPosts>;
  title: Scalars["String"]["output"];
  updated: Scalars["String"]["output"];
};

export type GQLArenaUser = {
  __typename?: "ArenaUser";
  displayName: Scalars["String"]["output"];
  groupTitleArray?: Maybe<Array<Scalars["String"]["output"]>>;
  id: Scalars["Int"]["output"];
  location?: Maybe<Scalars["String"]["output"]>;
  profilePicture?: Maybe<Scalars["String"]["output"]>;
  slug: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type GQLArenaUserV2 = {
  __typename?: "ArenaUserV2";
  displayName: Scalars["String"]["output"];
  groups: Array<Scalars["String"]["output"]>;
  id: Scalars["Int"]["output"];
  location: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type GQLArenaUserV2Input = {
  arenaEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  arenaGroups?: InputMaybe<Array<Scalars["String"]["input"]>>;
  favoriteSubjects?: InputMaybe<Array<Scalars["String"]["input"]>>;
  shareName?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLArticle = {
  __typename?: "Article";
  articleType: Scalars["String"]["output"];
  availability?: Maybe<Scalars["String"]["output"]>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  conceptIds?: Maybe<Array<Scalars["Int"]["output"]>>;
  concepts?: Maybe<Array<GQLConcept>>;
  content: Scalars["String"]["output"];
  copyright: GQLCopyright;
  coreElements?: Maybe<Array<GQLCoreElement>>;
  created: Scalars["String"]["output"];
  crossSubjectTopics?: Maybe<Array<GQLCrossSubjectElement>>;
  grepCodes?: Maybe<Array<Scalars["String"]["output"]>>;
  htmlIntroduction?: Maybe<Scalars["String"]["output"]>;
  htmlTitle: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  introduction?: Maybe<Scalars["String"]["output"]>;
  language: Scalars["String"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  oembed?: Maybe<Scalars["String"]["output"]>;
  oldNdlaUrl?: Maybe<Scalars["String"]["output"]>;
  published: Scalars["String"]["output"];
  relatedContent?: Maybe<Array<GQLRelatedContent>>;
  requiredLibraries?: Maybe<Array<GQLArticleRequiredLibrary>>;
  revision: Scalars["Int"]["output"];
  revisionDate?: Maybe<Scalars["String"]["output"]>;
  slug?: Maybe<Scalars["String"]["output"]>;
  supportedLanguages?: Maybe<Array<Scalars["String"]["output"]>>;
  tags?: Maybe<Array<Scalars["String"]["output"]>>;
  title: Scalars["String"]["output"];
  transformedContent: GQLTransformedArticleContent;
  updated: Scalars["String"]["output"];
};

export type GQLArticleCrossSubjectTopicsArgs = {
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLArticleRelatedContentArgs = {
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLArticleTransformedContentArgs = {
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
};

export type GQLArticleFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: "ArticleFolderResourceMeta";
  description: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLArticleMetaData = {
  __typename?: "ArticleMetaData";
  audios?: Maybe<Array<GQLAudioLicense>>;
  brightcoves?: Maybe<Array<GQLBrightcoveLicense>>;
  concepts?: Maybe<Array<GQLConceptLicense>>;
  copyText?: Maybe<Scalars["String"]["output"]>;
  footnotes?: Maybe<Array<GQLFootNote>>;
  glosses?: Maybe<Array<GQLGlossLicense>>;
  h5ps?: Maybe<Array<GQLH5pLicense>>;
  images?: Maybe<Array<GQLImageLicense>>;
  podcasts?: Maybe<Array<GQLPodcastLicense>>;
  textblocks?: Maybe<Array<GQLTextblockLicense>>;
};

export type GQLArticleRequiredLibrary = {
  __typename?: "ArticleRequiredLibrary";
  mediaType: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLArticleSearchResult = GQLSearchResult & {
  __typename?: "ArticleSearchResult";
  contexts: Array<GQLSearchContext>;
  id: Scalars["Int"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  traits: Array<Scalars["String"]["output"]>;
  url: Scalars["String"]["output"];
};

export type GQLAudio = {
  __typename?: "Audio";
  audioFile: GQLAudioFile;
  audioType: Scalars["String"]["output"];
  copyright: GQLCopyright;
  created: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  manuscript?: Maybe<GQLManuscript>;
  podcastMeta?: Maybe<GQLPodcastMeta>;
  revision: Scalars["Int"]["output"];
  series?: Maybe<GQLPodcastSeries>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  tags: GQLTags;
  title: GQLTitle;
  updated: Scalars["String"]["output"];
};

export type GQLAudioFile = {
  __typename?: "AudioFile";
  fileSize: Scalars["Int"]["output"];
  language: Scalars["String"]["output"];
  mimeType: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLAudioFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: "AudioFolderResourceMeta";
  description: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLAudioLicense = {
  __typename?: "AudioLicense";
  copyText?: Maybe<Scalars["String"]["output"]>;
  copyright: GQLCopyright;
  id: Scalars["String"]["output"];
  src: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type GQLAudioSearch = {
  __typename?: "AudioSearch";
  language: Scalars["String"]["output"];
  page?: Maybe<Scalars["Int"]["output"]>;
  pageSize: Scalars["Int"]["output"];
  results: Array<GQLAudioSummary>;
  totalCount: Scalars["Int"]["output"];
};

export type GQLAudioSummary = {
  __typename?: "AudioSummary";
  audioType: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  lastUpdated: Scalars["String"]["output"];
  license: Scalars["String"]["output"];
  manuscript?: Maybe<GQLManuscript>;
  podcastMeta?: Maybe<GQLPodcastMeta>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: GQLTitle;
  url: Scalars["String"]["output"];
};

export type GQLBreadcrumb = {
  __typename?: "Breadcrumb";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type GQLBrightcoveCustomFields = {
  __typename?: "BrightcoveCustomFields";
  accountId?: Maybe<Scalars["String"]["output"]>;
  license: Scalars["String"]["output"];
  licenseInfo: Array<Scalars["String"]["output"]>;
};

export type GQLBrightcoveElement = {
  __typename?: "BrightcoveElement";
  account?: Maybe<Scalars["String"]["output"]>;
  caption?: Maybe<Scalars["String"]["output"]>;
  cover?: Maybe<Scalars["String"]["output"]>;
  customFields?: Maybe<GQLBrightcoveCustomFields>;
  description?: Maybe<Scalars["String"]["output"]>;
  download?: Maybe<Scalars["String"]["output"]>;
  iframe?: Maybe<GQLBrightcoveIframe>;
  name?: Maybe<Scalars["String"]["output"]>;
  player?: Maybe<Scalars["String"]["output"]>;
  src?: Maybe<Scalars["String"]["output"]>;
  uploadDate?: Maybe<Scalars["String"]["output"]>;
  videoid?: Maybe<Scalars["String"]["output"]>;
};

export type GQLBrightcoveIframe = {
  __typename?: "BrightcoveIframe";
  height: Scalars["Int"]["output"];
  src: Scalars["String"]["output"];
  width: Scalars["Int"]["output"];
};

export type GQLBrightcoveLicense = {
  __typename?: "BrightcoveLicense";
  copyright?: Maybe<GQLCopyright>;
  cover?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  download?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  iframe?: Maybe<GQLBrightcoveIframe>;
  src?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  uploadDate?: Maybe<Scalars["String"]["output"]>;
};

export type GQLBucketResult = {
  __typename?: "BucketResult";
  count: Scalars["Int"]["output"];
  value: Scalars["String"]["output"];
};

export type GQLCaption = {
  __typename?: "Caption";
  caption: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
};

export type GQLCategory = {
  __typename?: "Category";
  id: Scalars["String"]["output"];
  isProgrammeSubject: Scalars["Boolean"]["output"];
  subjects?: Maybe<Array<GQLSubject>>;
  title: GQLTitle;
};

export type GQLCompetenceGoal = {
  __typename?: "CompetenceGoal";
  code?: Maybe<Scalars["String"]["output"]>;
  competenceGoalSet?: Maybe<GQLReference>;
  competenceGoalSetCode?: Maybe<Scalars["String"]["output"]>;
  coreElements?: Maybe<Array<GQLElement>>;
  coreElementsCodes?: Maybe<Array<GQLElement>>;
  crossSubjectTopics?: Maybe<Array<GQLElement>>;
  crossSubjectTopicsCodes?: Maybe<Array<GQLElement>>;
  curriculum?: Maybe<GQLReference>;
  curriculumCode?: Maybe<Scalars["String"]["output"]>;
  curriculumId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  language?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLConcept = {
  __typename?: "Concept";
  articleIds: Array<Scalars["Int"]["output"]>;
  articles?: Maybe<Array<GQLMeta>>;
  conceptType: Scalars["String"]["output"];
  content: Scalars["String"]["output"];
  copyright?: Maybe<GQLConceptCopyright>;
  created: Scalars["String"]["output"];
  glossData?: Maybe<GQLGloss>;
  id: Scalars["Int"]["output"];
  image?: Maybe<GQLImageLicense>;
  metaImage?: Maybe<GQLMetaImage>;
  source?: Maybe<Scalars["String"]["output"]>;
  subjectIds?: Maybe<Array<Scalars["String"]["output"]>>;
  subjectNames?: Maybe<Array<Scalars["String"]["output"]>>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  tags: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  visualElement?: Maybe<GQLVisualElement>;
};

export type GQLConceptCopyright = {
  __typename?: "ConceptCopyright";
  creators: Array<GQLContributor>;
  license?: Maybe<GQLLicense>;
  origin?: Maybe<Scalars["String"]["output"]>;
  processed?: Maybe<Scalars["Boolean"]["output"]>;
  processors: Array<GQLContributor>;
  rightsholders: Array<GQLContributor>;
};

export type GQLConceptFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: "ConceptFolderResourceMeta";
  description: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLConceptLicense = {
  __typename?: "ConceptLicense";
  content?: Maybe<Scalars["String"]["output"]>;
  copyright?: Maybe<GQLConceptCopyright>;
  id: Scalars["String"]["output"];
  metaImageUrl?: Maybe<Scalars["String"]["output"]>;
  src?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export type GQLConceptResult = {
  __typename?: "ConceptResult";
  concepts: Array<GQLConcept>;
  language: Scalars["String"]["output"];
  page?: Maybe<Scalars["Int"]["output"]>;
  pageSize: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type GQLConfigMetaBoolean = {
  __typename?: "ConfigMetaBoolean";
  key: Scalars["String"]["output"];
  value: Scalars["Boolean"]["output"];
};

export type GQLConfigMetaStringList = {
  __typename?: "ConfigMetaStringList";
  key: Scalars["String"]["output"];
  value: Array<Scalars["String"]["output"]>;
};

export type GQLContributor = {
  __typename?: "Contributor";
  name: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLCopyright = {
  __typename?: "Copyright";
  creators: Array<GQLContributor>;
  license: GQLLicense;
  origin?: Maybe<Scalars["String"]["output"]>;
  processed?: Maybe<Scalars["Boolean"]["output"]>;
  processors: Array<GQLContributor>;
  rightsholders: Array<GQLContributor>;
};

export type GQLCoreElement = {
  __typename?: "CoreElement";
  curriculum?: Maybe<GQLReference>;
  curriculumCode?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  language?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export type GQLCoverPhoto = {
  __typename?: "CoverPhoto";
  altText: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLCrossSubjectElement = {
  __typename?: "CrossSubjectElement";
  code?: Maybe<Scalars["String"]["output"]>;
  path?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export type GQLDescription = {
  __typename?: "Description";
  description: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
};

export type GQLEditorNote = {
  __typename?: "EditorNote";
  note: Scalars["String"]["output"];
  timestamp: Scalars["String"]["output"];
  updatedBy: Scalars["String"]["output"];
};

export type GQLElement = {
  __typename?: "Element";
  explanation: Array<Maybe<Scalars["String"]["output"]>>;
  reference: GQLReference;
};

export type GQLEmbedVisualelement = {
  __typename?: "EmbedVisualelement";
  visualElement?: Maybe<GQLVisualElement>;
};

export type GQLExamples = {
  __typename?: "Examples";
  example: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
  transcriptions: GQLTranscription;
};

export type GQLFilmFrontpage = {
  __typename?: "FilmFrontpage";
  about: Array<GQLFilmPageAbout>;
  article?: Maybe<GQLArticle>;
  movieThemes: Array<GQLMovieTheme>;
  name: Scalars["String"]["output"];
  slideShow: Array<GQLMovie>;
};

export type GQLFilmPageAbout = {
  __typename?: "FilmPageAbout";
  description: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  visualElement: GQLSubjectPageVisualElement;
};

export type GQLFolder = {
  __typename?: "Folder";
  breadcrumbs: Array<GQLBreadcrumb>;
  created: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  owner?: Maybe<GQLOwner>;
  parentId?: Maybe<Scalars["String"]["output"]>;
  resources: Array<GQLFolderResource>;
  status: Scalars["String"]["output"];
  subfolders: Array<GQLFolder>;
  updated: Scalars["String"]["output"];
};

export type GQLFolderResource = {
  __typename?: "FolderResource";
  created: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  tags: Array<Scalars["String"]["output"]>;
};

export type GQLFolderResourceMeta = {
  description: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLFolderResourceMetaSearchInput = {
  id: Scalars["String"]["input"];
  path: Scalars["String"]["input"];
  resourceType: Scalars["String"]["input"];
};

export type GQLFolderResourceResourceType = {
  __typename?: "FolderResourceResourceType";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type GQLFootNote = {
  __typename?: "FootNote";
  authors: Array<Scalars["String"]["output"]>;
  edition?: Maybe<Scalars["String"]["output"]>;
  publisher?: Maybe<Scalars["String"]["output"]>;
  ref: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  url?: Maybe<Scalars["String"]["output"]>;
  year: Scalars["String"]["output"];
};

export type GQLFrontpageMenu = {
  __typename?: "FrontpageMenu";
  article: GQLArticle;
  articleId: Scalars["Int"]["output"];
  hideLevel?: Maybe<Scalars["Boolean"]["output"]>;
  menu?: Maybe<Array<Maybe<GQLFrontpageMenu>>>;
};

export type GQLGloss = {
  __typename?: "Gloss";
  examples?: Maybe<Array<Array<GQLExamples>>>;
  gloss: Scalars["String"]["output"];
  originalLanguage: Scalars["String"]["output"];
  transcriptions: GQLTranscription;
  wordClass: Scalars["String"]["output"];
};

export type GQLGlossLicense = {
  __typename?: "GlossLicense";
  content?: Maybe<Scalars["String"]["output"]>;
  copyright?: Maybe<GQLConceptCopyright>;
  id: Scalars["String"]["output"];
  metaImageUrl?: Maybe<Scalars["String"]["output"]>;
  src?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export type GQLGrade = {
  __typename?: "Grade";
  categories?: Maybe<Array<GQLCategory>>;
  id: Scalars["String"]["output"];
  title: GQLTitle;
  url: Scalars["String"]["output"];
};

export type GQLGroupSearch = {
  __typename?: "GroupSearch";
  aggregations: Array<GQLAggregationResult>;
  language: Scalars["String"]["output"];
  page?: Maybe<Scalars["Int"]["output"]>;
  pageSize: Scalars["Int"]["output"];
  resourceType: Scalars["String"]["output"];
  resources: Array<GQLGroupSearchResult>;
  suggestions: Array<GQLSuggestionResult>;
  totalCount: Scalars["Int"]["output"];
};

export type GQLGroupSearchResult = {
  __typename?: "GroupSearchResult";
  contexts: Array<GQLSearchContext>;
  id: Scalars["Int"]["output"];
  ingress: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  name: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  traits: Array<Scalars["String"]["output"]>;
  url: Scalars["String"]["output"];
};

export type GQLH5pElement = {
  __typename?: "H5pElement";
  src?: Maybe<Scalars["String"]["output"]>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
};

export type GQLH5pLicense = {
  __typename?: "H5pLicense";
  copyright?: Maybe<GQLCopyright>;
  id: Scalars["String"]["output"];
  src?: Maybe<Scalars["String"]["output"]>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export type GQLImageAltText = {
  __typename?: "ImageAltText";
  alttext: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
};

export type GQLImageDimensions = {
  __typename?: "ImageDimensions";
  height: Scalars["Int"]["output"];
  width: Scalars["Int"]["output"];
};

export type GQLImageElement = {
  __typename?: "ImageElement";
  alt?: Maybe<Scalars["String"]["output"]>;
  altText: Scalars["String"]["output"];
  caption?: Maybe<Scalars["String"]["output"]>;
  contentType?: Maybe<Scalars["String"]["output"]>;
  copyText?: Maybe<Scalars["String"]["output"]>;
  focalX?: Maybe<Scalars["Float"]["output"]>;
  focalY?: Maybe<Scalars["Float"]["output"]>;
  lowerRightX?: Maybe<Scalars["Float"]["output"]>;
  lowerRightY?: Maybe<Scalars["Float"]["output"]>;
  resourceid?: Maybe<Scalars["String"]["output"]>;
  src: Scalars["String"]["output"];
  upperLeftX?: Maybe<Scalars["Float"]["output"]>;
  upperLeftY?: Maybe<Scalars["Float"]["output"]>;
};

export type GQLImageFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: "ImageFolderResourceMeta";
  description: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLImageLicense = {
  __typename?: "ImageLicense";
  altText: Scalars["String"]["output"];
  contentType?: Maybe<Scalars["String"]["output"]>;
  copyText?: Maybe<Scalars["String"]["output"]>;
  copyright: GQLCopyright;
  id: Scalars["String"]["output"];
  src: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type GQLImageMetaInformation = {
  __typename?: "ImageMetaInformation";
  altText: Scalars["String"]["output"];
  caption: Scalars["String"]["output"];
  contentType: Scalars["String"]["output"];
  copyright: GQLCopyright;
  created: Scalars["String"]["output"];
  createdBy: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  imageUrl: Scalars["String"]["output"];
  metaUrl: Scalars["String"]["output"];
  size: Scalars["Int"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  tags: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export type GQLImageMetaInformationV2 = {
  __typename?: "ImageMetaInformationV2";
  alttext: GQLImageAltText;
  caption: GQLCaption;
  contentType: Scalars["String"]["output"];
  copyright: GQLCopyright;
  created: Scalars["String"]["output"];
  createdBy: Scalars["String"]["output"];
  editorNotes?: Maybe<Array<GQLEditorNote>>;
  id: Scalars["String"]["output"];
  imageDimensions?: Maybe<GQLImageDimensions>;
  imageUrl: Scalars["String"]["output"];
  metaUrl: Scalars["String"]["output"];
  modelRelease: Scalars["String"]["output"];
  size: Scalars["Int"]["output"];
  supportedLanguages?: Maybe<Array<Scalars["String"]["output"]>>;
  tags: GQLTags;
  title: GQLTitle;
};

export type GQLLearningpath = {
  __typename?: "Learningpath";
  canEdit: Scalars["Boolean"]["output"];
  copyright: GQLLearningpathCopyright;
  coverphoto?: Maybe<GQLLearningpathCoverphoto>;
  description: Scalars["String"]["output"];
  duration?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["Int"]["output"];
  isBasedOn?: Maybe<Scalars["Int"]["output"]>;
  lastUpdated: Scalars["String"]["output"];
  learningstepUrl: Scalars["String"]["output"];
  learningsteps: Array<GQLLearningpathStep>;
  metaUrl: Scalars["String"]["output"];
  revision: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  tags: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  verificationStatus: Scalars["String"]["output"];
};

export type GQLLearningpathCopyright = {
  __typename?: "LearningpathCopyright";
  contributors: Array<GQLContributor>;
  license: GQLLicense;
};

export type GQLLearningpathCoverphoto = {
  __typename?: "LearningpathCoverphoto";
  metaUrl: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLLearningpathFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: "LearningpathFolderResourceMeta";
  description: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLLearningpathSearchResult = GQLSearchResult & {
  __typename?: "LearningpathSearchResult";
  contexts: Array<GQLSearchContext>;
  id: Scalars["Int"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  traits: Array<Scalars["String"]["output"]>;
  url: Scalars["String"]["output"];
};

export type GQLLearningpathStep = {
  __typename?: "LearningpathStep";
  article?: Maybe<GQLArticle>;
  description?: Maybe<Scalars["String"]["output"]>;
  embedUrl?: Maybe<GQLLearningpathStepEmbedUrl>;
  id: Scalars["Int"]["output"];
  license?: Maybe<GQLLicense>;
  metaUrl: Scalars["String"]["output"];
  oembed?: Maybe<GQLLearningpathStepOembed>;
  resource?: Maybe<GQLResource>;
  revision: Scalars["Int"]["output"];
  seqNo: Scalars["Int"]["output"];
  showTitle: Scalars["Boolean"]["output"];
  status: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLLearningpathStepEmbedUrl = {
  __typename?: "LearningpathStepEmbedUrl";
  embedType: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLLearningpathStepOembed = {
  __typename?: "LearningpathStepOembed";
  height: Scalars["Int"]["output"];
  html: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
  width: Scalars["Int"]["output"];
};

export type GQLLicense = {
  __typename?: "License";
  description?: Maybe<Scalars["String"]["output"]>;
  license: Scalars["String"]["output"];
  url?: Maybe<Scalars["String"]["output"]>;
};

export type GQLListingPage = {
  __typename?: "ListingPage";
  subjects?: Maybe<Array<GQLSubject>>;
  tags?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GQLManuscript = {
  __typename?: "Manuscript";
  language: Scalars["String"]["output"];
  manuscript: Scalars["String"]["output"];
};

export type GQLMeta = {
  __typename?: "Meta";
  availability?: Maybe<Scalars["String"]["output"]>;
  htmlIntroduction?: Maybe<Scalars["String"]["output"]>;
  htmlTitle: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  introduction?: Maybe<Scalars["String"]["output"]>;
  language?: Maybe<Scalars["String"]["output"]>;
  lastUpdated?: Maybe<Scalars["String"]["output"]>;
  metaDescription?: Maybe<Scalars["String"]["output"]>;
  metaImage?: Maybe<GQLMetaImage>;
  title: Scalars["String"]["output"];
};

export type GQLMetaImage = {
  __typename?: "MetaImage";
  alt: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLMovie = {
  __typename?: "Movie";
  id: Scalars["String"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  path: Scalars["String"]["output"];
  resourceTypes: Array<GQLResourceType>;
  title: Scalars["String"]["output"];
};

export type GQLMovieMeta = {
  __typename?: "MovieMeta";
  metaDescription?: Maybe<Scalars["String"]["output"]>;
  metaImage?: Maybe<GQLMetaImage>;
  title: Scalars["String"]["output"];
};

export type GQLMoviePath = {
  __typename?: "MoviePath";
  path?: Maybe<Scalars["String"]["output"]>;
  paths?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GQLMovieResourceTypes = {
  __typename?: "MovieResourceTypes";
  resourceTypes?: Maybe<Array<GQLResourceType>>;
};

export type GQLMovieTheme = {
  __typename?: "MovieTheme";
  movies: Array<GQLMovie>;
  name: Array<GQLName>;
};

export type GQLMutation = {
  __typename?: "Mutation";
  addFolder: GQLFolder;
  addFolderResource: GQLFolderResource;
  copySharedFolder: GQLFolder;
  deleteCategory: Scalars["Int"]["output"];
  deleteFolder: Scalars["String"]["output"];
  deleteFolderResource: Scalars["String"]["output"];
  deletePersonalData: Scalars["Boolean"]["output"];
  deletePost: Scalars["Int"]["output"];
  deletePostV2: Scalars["Int"]["output"];
  deleteTopic: Scalars["Int"]["output"];
  deleteTopicV2: Scalars["Int"]["output"];
  followCategory: GQLArenaCategoryV2;
  followTopic: GQLArenaTopicV2;
  markAllNotificationsAsRead: Scalars["Boolean"]["output"];
  markNotificationAsRead: Array<Scalars["Int"]["output"]>;
  markNotificationsAsReadV2: Array<Scalars["Int"]["output"]>;
  newArenaCategory: GQLArenaCategoryV2;
  newArenaTopic: GQLArenaTopic;
  newArenaTopicV2: GQLArenaTopicV2;
  newFlag: Scalars["Int"]["output"];
  newFlagV2: Scalars["Int"]["output"];
  replyToTopic: GQLArenaPost;
  replyToTopicV2: GQLArenaPostV2;
  resolveFlag: GQLArenaFlag;
  sortArenaCategories: Array<GQLArenaCategoryV2>;
  sortFolders: GQLSortResult;
  sortResources: GQLSortResult;
  subscribeToTopic: Scalars["Int"]["output"];
  transformArticleContent: Scalars["String"]["output"];
  unfollowCategory: GQLArenaCategoryV2;
  unfollowTopic: GQLArenaTopicV2;
  unsubscribeFromTopic: Scalars["Int"]["output"];
  updateArenaCategory: GQLArenaCategoryV2;
  updateFolder: GQLFolder;
  updateFolderResource: GQLFolderResource;
  updateFolderStatus: Array<Scalars["String"]["output"]>;
  updateOtherArenaUser: GQLMyNdlaPersonalData;
  updatePersonalData: GQLMyNdlaPersonalData;
  updatePost: GQLArenaPost;
  updatePostV2: GQLArenaPostV2;
  updateTopicV2: GQLArenaTopicV2;
};

export type GQLMutationAddFolderArgs = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLMutationAddFolderResourceArgs = {
  folderId: Scalars["String"]["input"];
  path: Scalars["String"]["input"];
  resourceId: Scalars["String"]["input"];
  resourceType: Scalars["String"]["input"];
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type GQLMutationCopySharedFolderArgs = {
  destinationFolderId?: InputMaybe<Scalars["String"]["input"]>;
  folderId: Scalars["String"]["input"];
};

export type GQLMutationDeleteCategoryArgs = {
  categoryId: Scalars["Int"]["input"];
};

export type GQLMutationDeleteFolderArgs = {
  id: Scalars["String"]["input"];
};

export type GQLMutationDeleteFolderResourceArgs = {
  folderId: Scalars["String"]["input"];
  resourceId: Scalars["String"]["input"];
};

export type GQLMutationDeletePostArgs = {
  postId: Scalars["Int"]["input"];
};

export type GQLMutationDeletePostV2Args = {
  postId: Scalars["Int"]["input"];
};

export type GQLMutationDeleteTopicArgs = {
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationDeleteTopicV2Args = {
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationFollowCategoryArgs = {
  categoryId: Scalars["Int"]["input"];
};

export type GQLMutationFollowTopicArgs = {
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationMarkNotificationAsReadArgs = {
  topicIds: Array<Scalars["Int"]["input"]>;
};

export type GQLMutationMarkNotificationsAsReadV2Args = {
  notificationIds: Array<Scalars["Int"]["input"]>;
};

export type GQLMutationNewArenaCategoryArgs = {
  description: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  visible: Scalars["Boolean"]["input"];
};

export type GQLMutationNewArenaTopicArgs = {
  categoryId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type GQLMutationNewArenaTopicV2Args = {
  categoryId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
  isLocked?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPinned?: InputMaybe<Scalars["Boolean"]["input"]>;
  title: Scalars["String"]["input"];
};

export type GQLMutationNewFlagArgs = {
  id: Scalars["Int"]["input"];
  reason: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type GQLMutationNewFlagV2Args = {
  postId: Scalars["Int"]["input"];
  reason: Scalars["String"]["input"];
};

export type GQLMutationReplyToTopicArgs = {
  content: Scalars["String"]["input"];
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationReplyToTopicV2Args = {
  content: Scalars["String"]["input"];
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationResolveFlagArgs = {
  flagId: Scalars["Int"]["input"];
};

export type GQLMutationSortArenaCategoriesArgs = {
  sortedIds: Array<Scalars["Int"]["input"]>;
};

export type GQLMutationSortFoldersArgs = {
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  sortedIds: Array<Scalars["String"]["input"]>;
};

export type GQLMutationSortResourcesArgs = {
  parentId: Scalars["String"]["input"];
  sortedIds: Array<Scalars["String"]["input"]>;
};

export type GQLMutationSubscribeToTopicArgs = {
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationTransformArticleContentArgs = {
  absoluteUrl?: InputMaybe<Scalars["Boolean"]["input"]>;
  content: Scalars["String"]["input"];
  draftConcept?: InputMaybe<Scalars["Boolean"]["input"]>;
  previewH5p?: InputMaybe<Scalars["Boolean"]["input"]>;
  subject?: InputMaybe<Scalars["String"]["input"]>;
  visualElement?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLMutationUnfollowCategoryArgs = {
  categoryId: Scalars["Int"]["input"];
};

export type GQLMutationUnfollowTopicArgs = {
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationUnsubscribeFromTopicArgs = {
  topicId: Scalars["Int"]["input"];
};

export type GQLMutationUpdateArenaCategoryArgs = {
  categoryId: Scalars["Int"]["input"];
  description: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  visible: Scalars["Boolean"]["input"];
};

export type GQLMutationUpdateFolderArgs = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLMutationUpdateFolderResourceArgs = {
  id: Scalars["String"]["input"];
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type GQLMutationUpdateFolderStatusArgs = {
  folderId: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};

export type GQLMutationUpdateOtherArenaUserArgs = {
  data: GQLArenaUserV2Input;
  userId: Scalars["Int"]["input"];
};

export type GQLMutationUpdatePersonalDataArgs = {
  favoriteSubjects?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  shareName?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLMutationUpdatePostArgs = {
  content: Scalars["String"]["input"];
  postId: Scalars["Int"]["input"];
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLMutationUpdatePostV2Args = {
  content: Scalars["String"]["input"];
  postId: Scalars["Int"]["input"];
};

export type GQLMutationUpdateTopicV2Args = {
  content: Scalars["String"]["input"];
  isLocked?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPinned?: InputMaybe<Scalars["Boolean"]["input"]>;
  title: Scalars["String"]["input"];
  topicId: Scalars["Int"]["input"];
};

export type GQLMyNdlaGroup = {
  __typename?: "MyNdlaGroup";
  displayName: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  isPrimarySchool: Scalars["Boolean"]["output"];
  parentId?: Maybe<Scalars["String"]["output"]>;
};

export type GQLMyNdlaPersonalData = {
  __typename?: "MyNdlaPersonalData";
  arenaEnabled: Scalars["Boolean"]["output"];
  arenaGroups: Array<Scalars["String"]["output"]>;
  displayName: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  favoriteSubjects: Array<Scalars["String"]["output"]>;
  feideId: Scalars["String"]["output"];
  groups: Array<GQLMyNdlaGroup>;
  id: Scalars["Int"]["output"];
  organization: Scalars["String"]["output"];
  role: Scalars["String"]["output"];
  shareName: Scalars["Boolean"]["output"];
  username: Scalars["String"]["output"];
};

export type GQLName = {
  __typename?: "Name";
  language: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type GQLNewFolder = {
  __typename?: "NewFolder";
  name: Scalars["String"]["output"];
  parentId?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
};

export type GQLNewFolderResource = {
  __typename?: "NewFolderResource";
  path: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  tags?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GQLOwner = {
  __typename?: "Owner";
  name: Scalars["String"]["output"];
};

export type GQLPaginatedArenaNewPostNotificationV2 = {
  __typename?: "PaginatedArenaNewPostNotificationV2";
  items: Array<GQLArenaNewPostNotificationV2>;
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type GQLPaginatedArenaUsers = {
  __typename?: "PaginatedArenaUsers";
  items: Array<GQLArenaUserV2>;
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type GQLPaginatedPosts = {
  __typename?: "PaginatedPosts";
  items: Array<GQLArenaPostV2>;
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type GQLPaginatedTopics = {
  __typename?: "PaginatedTopics";
  items: Array<GQLArenaTopicV2>;
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type GQLPodcastLicense = {
  __typename?: "PodcastLicense";
  copyText?: Maybe<Scalars["String"]["output"]>;
  copyright: GQLCopyright;
  coverPhotoUrl?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  src: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type GQLPodcastMeta = {
  __typename?: "PodcastMeta";
  image?: Maybe<GQLImageMetaInformation>;
  introduction: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
};

export type GQLPodcastSeries = GQLPodcastSeriesBase & {
  __typename?: "PodcastSeries";
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  hasRSS: Scalars["Boolean"]["output"];
  id: Scalars["Int"]["output"];
  image: GQLImageMetaInformation;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: GQLTitle;
};

export type GQLPodcastSeriesBase = {
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  hasRSS: Scalars["Boolean"]["output"];
  id: Scalars["Int"]["output"];
  image: GQLImageMetaInformation;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: GQLTitle;
};

export type GQLPodcastSeriesSearch = {
  __typename?: "PodcastSeriesSearch";
  language: Scalars["String"]["output"];
  page?: Maybe<Scalars["Int"]["output"]>;
  pageSize: Scalars["Int"]["output"];
  results: Array<GQLPodcastSeriesSummary>;
  totalCount: Scalars["Int"]["output"];
};

export type GQLPodcastSeriesSummary = {
  __typename?: "PodcastSeriesSummary";
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  episodes?: Maybe<Array<GQLAudioSummary>>;
  id: Scalars["Int"]["output"];
  supportedLanguages?: Maybe<Array<Scalars["String"]["output"]>>;
  title: GQLTitle;
};

export type GQLPodcastSeriesWithEpisodes = GQLPodcastSeriesBase & {
  __typename?: "PodcastSeriesWithEpisodes";
  content?: Maybe<GQLResourceEmbed>;
  coverPhoto: GQLCoverPhoto;
  description: GQLDescription;
  episodes?: Maybe<Array<GQLAudio>>;
  hasRSS: Scalars["Boolean"]["output"];
  id: Scalars["Int"]["output"];
  image: GQLImageMetaInformation;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: GQLTitle;
};

export type GQLProgrammePage = {
  __typename?: "ProgrammePage";
  contentUri?: Maybe<Scalars["String"]["output"]>;
  desktopImage?: Maybe<GQLMetaImage>;
  grades?: Maybe<Array<GQLGrade>>;
  id: Scalars["String"]["output"];
  metaDescription?: Maybe<Scalars["String"]["output"]>;
  mobileImage?: Maybe<GQLMetaImage>;
  title: GQLTitle;
  url: Scalars["String"]["output"];
};

export type GQLQuery = {
  __typename?: "Query";
  aiEnabledOrgs?: Maybe<GQLConfigMetaStringList>;
  alerts?: Maybe<Array<Maybe<GQLUptimeAlert>>>;
  allFolderResources: Array<GQLFolderResource>;
  arenaAllFlags: GQLPaginatedPosts;
  arenaCategories: Array<GQLArenaCategory>;
  arenaCategoriesV2: Array<GQLArenaCategoryV2>;
  arenaCategory?: Maybe<GQLArenaCategory>;
  arenaCategoryV2?: Maybe<GQLArenaCategoryV2>;
  arenaEnabledOrgs?: Maybe<GQLConfigMetaStringList>;
  arenaNotifications: Array<GQLArenaNotification>;
  arenaNotificationsV2: GQLPaginatedArenaNewPostNotificationV2;
  arenaPostInContext?: Maybe<GQLArenaTopicV2>;
  arenaRecentTopics: Array<GQLArenaTopic>;
  arenaRecentTopicsV2: GQLPaginatedTopics;
  arenaTopic?: Maybe<GQLArenaTopic>;
  arenaTopicV2?: Maybe<GQLArenaTopicV2>;
  arenaTopicsByUser: Array<GQLArenaTopic>;
  arenaTopicsByUserV2: GQLPaginatedTopics;
  arenaUser?: Maybe<GQLArenaUser>;
  arenaUserV2?: Maybe<GQLArenaUserV2>;
  article?: Maybe<GQLArticle>;
  articleResource?: Maybe<GQLResource>;
  audio?: Maybe<GQLAudio>;
  competenceGoal?: Maybe<GQLCompetenceGoal>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  concept?: Maybe<GQLConcept>;
  conceptSearch?: Maybe<GQLConceptResult>;
  coreElement?: Maybe<GQLCoreElement>;
  coreElements?: Maybe<Array<GQLCoreElement>>;
  examLockStatus: GQLConfigMetaBoolean;
  filmfrontpage?: Maybe<GQLFilmFrontpage>;
  folder: GQLFolder;
  folderResourceMeta?: Maybe<GQLFolderResourceMeta>;
  folderResourceMetaSearch: Array<GQLFolderResourceMeta>;
  folders: Array<GQLFolder>;
  frontpage?: Maybe<GQLFrontpageMenu>;
  groupSearch?: Maybe<Array<GQLGroupSearch>>;
  image?: Maybe<GQLImageMetaInformationV2>;
  learningpath?: Maybe<GQLLearningpath>;
  listArenaUserV2: GQLPaginatedArenaUsers;
  listingPage?: Maybe<GQLListingPage>;
  personalData?: Maybe<GQLMyNdlaPersonalData>;
  podcastSearch?: Maybe<GQLAudioSearch>;
  podcastSeries?: Maybe<GQLPodcastSeriesWithEpisodes>;
  podcastSeriesSearch?: Maybe<GQLPodcastSeriesSearch>;
  programme?: Maybe<GQLProgrammePage>;
  programmes?: Maybe<Array<GQLProgrammePage>>;
  resource?: Maybe<GQLResource>;
  resourceEmbed: GQLResourceEmbed;
  resourceEmbeds: GQLResourceEmbed;
  resourceTypes?: Maybe<Array<GQLResourceTypeDefinition>>;
  search?: Maybe<GQLSearch>;
  searchWithoutPagination?: Maybe<GQLSearchWithoutPagination>;
  sharedFolder: GQLSharedFolder;
  subject?: Maybe<GQLSubject>;
  subjectpage?: Maybe<GQLSubjectPage>;
  subjects?: Maybe<Array<GQLSubject>>;
  topic?: Maybe<GQLTopic>;
  topics?: Maybe<Array<GQLTopic>>;
};

export type GQLQueryAllFolderResourcesArgs = {
  size?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GQLQueryArenaAllFlagsArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GQLQueryArenaCategoriesV2Args = {
  filterFollowed?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLQueryArenaCategoryArgs = {
  categoryId: Scalars["Int"]["input"];
  page: Scalars["Int"]["input"];
};

export type GQLQueryArenaCategoryV2Args = {
  categoryId: Scalars["Int"]["input"];
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GQLQueryArenaNotificationsV2Args = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GQLQueryArenaPostInContextArgs = {
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  postId: Scalars["Int"]["input"];
};

export type GQLQueryArenaRecentTopicsV2Args = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GQLQueryArenaTopicArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  topicId: Scalars["Int"]["input"];
};

export type GQLQueryArenaTopicV2Args = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  topicId: Scalars["Int"]["input"];
};

export type GQLQueryArenaTopicsByUserArgs = {
  userSlug: Scalars["String"]["input"];
};

export type GQLQueryArenaTopicsByUserV2Args = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  userId: Scalars["Int"]["input"];
};

export type GQLQueryArenaUserArgs = {
  username: Scalars["String"]["input"];
};

export type GQLQueryArenaUserV2Args = {
  username: Scalars["String"]["input"];
};

export type GQLQueryArticleArgs = {
  id: Scalars["String"]["input"];
};

export type GQLQueryArticleResourceArgs = {
  articleId?: InputMaybe<Scalars["String"]["input"]>;
  taxonomyId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryAudioArgs = {
  id: Scalars["Int"]["input"];
};

export type GQLQueryCompetenceGoalArgs = {
  code: Scalars["String"]["input"];
  language?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryCompetenceGoalsArgs = {
  codes?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  language?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryConceptArgs = {
  id: Scalars["Int"]["input"];
};

export type GQLQueryConceptSearchArgs = {
  conceptType?: InputMaybe<Scalars["String"]["input"]>;
  exactMatch?: InputMaybe<Scalars["Boolean"]["input"]>;
  fallback?: InputMaybe<Scalars["Boolean"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
  tags?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryCoreElementArgs = {
  code: Scalars["String"]["input"];
  language?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryCoreElementsArgs = {
  codes?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  language?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryFolderArgs = {
  id: Scalars["String"]["input"];
  includeResources?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeSubfolders?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLQueryFolderResourceMetaArgs = {
  resource: GQLFolderResourceMetaSearchInput;
};

export type GQLQueryFolderResourceMetaSearchArgs = {
  resources: Array<GQLFolderResourceMetaSearchInput>;
};

export type GQLQueryFoldersArgs = {
  includeResources?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeSubfolders?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLQueryGroupSearchArgs = {
  aggregatePaths?: InputMaybe<Array<Scalars["String"]["input"]>>;
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  filterInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  grepCodes?: InputMaybe<Scalars["String"]["input"]>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  levels?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryImageArgs = {
  id: Scalars["String"]["input"];
};

export type GQLQueryLearningpathArgs = {
  pathId: Scalars["String"]["input"];
};

export type GQLQueryListArenaUserV2Args = {
  filterTeachers?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryListingPageArgs = {
  subjects?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryPodcastSearchArgs = {
  fallback?: InputMaybe<Scalars["Boolean"]["input"]>;
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
};

export type GQLQueryPodcastSeriesArgs = {
  id: Scalars["Int"]["input"];
};

export type GQLQueryPodcastSeriesSearchArgs = {
  fallback?: InputMaybe<Scalars["Boolean"]["input"]>;
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
};

export type GQLQueryProgrammeArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryResourceArgs = {
  id: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  topicId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryResourceEmbedArgs = {
  id: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type GQLQueryResourceEmbedsArgs = {
  resources: Array<GQLResourceEmbedInput>;
};

export type GQLQuerySearchArgs = {
  aggregatePaths?: InputMaybe<Array<Scalars["String"]["input"]>>;
  contextFilters?: InputMaybe<Scalars["String"]["input"]>;
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  filterInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  grepCodes?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  languageFilter?: InputMaybe<Scalars["String"]["input"]>;
  levels?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  relevance?: InputMaybe<Scalars["String"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQuerySearchWithoutPaginationArgs = {
  contextFilters?: InputMaybe<Scalars["String"]["input"]>;
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  languageFilter?: InputMaybe<Scalars["String"]["input"]>;
  levels?: InputMaybe<Scalars["String"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  relevance?: InputMaybe<Scalars["String"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQuerySharedFolderArgs = {
  id: Scalars["String"]["input"];
  includeResources?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeSubfolders?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLQuerySubjectArgs = {
  id: Scalars["String"]["input"];
};

export type GQLQuerySubjectpageArgs = {
  id: Scalars["Int"]["input"];
};

export type GQLQuerySubjectsArgs = {
  filterVisible?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadataFilterKey?: InputMaybe<Scalars["String"]["input"]>;
  metadataFilterValue?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryTopicArgs = {
  id: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryTopicsArgs = {
  contentUri?: InputMaybe<Scalars["String"]["input"]>;
  filterVisible?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLReference = {
  __typename?: "Reference";
  code?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type GQLRelatedContent = {
  __typename?: "RelatedContent";
  title: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLResource = GQLTaxonomyEntity &
  GQLWithArticle & {
    __typename?: "Resource";
    article?: Maybe<GQLArticle>;
    availability?: Maybe<Scalars["String"]["output"]>;
    breadcrumbs: Array<Scalars["String"]["output"]>;
    contentUri?: Maybe<Scalars["String"]["output"]>;
    contexts: Array<GQLTaxonomyContext>;
    id: Scalars["String"]["output"];
    language?: Maybe<Scalars["String"]["output"]>;
    learningpath?: Maybe<GQLLearningpath>;
    meta?: Maybe<GQLMeta>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars["String"]["output"];
    parents?: Maybe<Array<GQLTopic>>;
    path: Scalars["String"]["output"];
    paths: Array<Scalars["String"]["output"]>;
    rank?: Maybe<Scalars["Int"]["output"]>;
    relevanceId?: Maybe<Scalars["String"]["output"]>;
    resourceTypes?: Maybe<Array<GQLResourceType>>;
    supportedLanguages: Array<Scalars["String"]["output"]>;
    url?: Maybe<Scalars["String"]["output"]>;
  };

export type GQLResourceEmbed = {
  __typename?: "ResourceEmbed";
  content: Scalars["String"]["output"];
  meta: GQLResourceMetaData;
};

export type GQLResourceEmbedInput = {
  conceptType?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type GQLResourceMetaData = {
  __typename?: "ResourceMetaData";
  audios?: Maybe<Array<GQLAudioLicense>>;
  brightcoves?: Maybe<Array<GQLBrightcoveLicense>>;
  concepts?: Maybe<Array<GQLConceptLicense>>;
  glosses?: Maybe<Array<GQLGlossLicense>>;
  h5ps?: Maybe<Array<GQLH5pLicense>>;
  images?: Maybe<Array<GQLImageLicense>>;
  podcasts?: Maybe<Array<GQLPodcastLicense>>;
};

export type GQLResourceType = {
  __typename?: "ResourceType";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  resources?: Maybe<Array<GQLResource>>;
};

export type GQLResourceTypeResourcesArgs = {
  topicId: Scalars["String"]["input"];
};

export type GQLResourceTypeDefinition = {
  __typename?: "ResourceTypeDefinition";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  subtypes?: Maybe<Array<GQLResourceTypeDefinition>>;
};

export type GQLSearch = {
  __typename?: "Search";
  aggregations: Array<GQLAggregationResult>;
  concepts?: Maybe<GQLConceptResult>;
  language: Scalars["String"]["output"];
  page?: Maybe<Scalars["Int"]["output"]>;
  pageSize: Scalars["Int"]["output"];
  results: Array<GQLSearchResult>;
  suggestions: Array<GQLSuggestionResult>;
  totalCount: Scalars["Int"]["output"];
};

export type GQLSearchContext = {
  __typename?: "SearchContext";
  breadcrumbs: Array<Scalars["String"]["output"]>;
  contextId: Scalars["String"]["output"];
  contextType: Scalars["String"]["output"];
  isActive: Scalars["Boolean"]["output"];
  isPrimary: Scalars["Boolean"]["output"];
  isVisible: Scalars["Boolean"]["output"];
  language: Scalars["String"]["output"];
  parentIds: Array<Scalars["String"]["output"]>;
  path: Scalars["String"]["output"];
  publicId: Scalars["String"]["output"];
  relevance: Scalars["String"]["output"];
  relevanceId: Scalars["String"]["output"];
  resourceTypes: Array<GQLSearchContextResourceTypes>;
  root: Scalars["String"]["output"];
  rootId: Scalars["String"]["output"];
};

export type GQLSearchContextResourceTypes = {
  __typename?: "SearchContextResourceTypes";
  id: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type GQLSearchResult = {
  contexts: Array<GQLSearchContext>;
  id: Scalars["Int"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  traits: Array<Scalars["String"]["output"]>;
  url: Scalars["String"]["output"];
};

export type GQLSearchSuggestion = {
  __typename?: "SearchSuggestion";
  length: Scalars["Int"]["output"];
  offset: Scalars["Int"]["output"];
  options: Array<GQLSuggestOption>;
  text: Scalars["String"]["output"];
};

export type GQLSearchWithoutPagination = {
  __typename?: "SearchWithoutPagination";
  results: Array<GQLSearchResult>;
};

export type GQLSharedFolder = {
  __typename?: "SharedFolder";
  breadcrumbs: Array<GQLBreadcrumb>;
  created: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  owner?: Maybe<GQLOwner>;
  parentId?: Maybe<Scalars["String"]["output"]>;
  resources: Array<GQLFolderResource>;
  status: Scalars["String"]["output"];
  subfolders: Array<GQLSharedFolder>;
  updated: Scalars["String"]["output"];
};

export type GQLSortResult = {
  __typename?: "SortResult";
  parentId?: Maybe<Scalars["String"]["output"]>;
  sortedIds: Array<Scalars["String"]["output"]>;
};

export type GQLSubject = GQLTaxonomyEntity & {
  __typename?: "Subject";
  allTopics?: Maybe<Array<GQLTopic>>;
  breadcrumbs: Array<Scalars["String"]["output"]>;
  contentUri?: Maybe<Scalars["String"]["output"]>;
  contexts: Array<GQLTaxonomyContext>;
  grepCodes?: Maybe<Array<Scalars["String"]["output"]>>;
  id: Scalars["String"]["output"];
  language?: Maybe<Scalars["String"]["output"]>;
  metadata: GQLTaxonomyMetadata;
  name: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  paths: Array<Scalars["String"]["output"]>;
  relevanceId?: Maybe<Scalars["String"]["output"]>;
  resourceTypes?: Maybe<Array<GQLResourceType>>;
  subjectpage?: Maybe<GQLSubjectPage>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  topics?: Maybe<Array<GQLTopic>>;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type GQLSubjectTopicsArgs = {
  all?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLSubjectLink = {
  __typename?: "SubjectLink";
  name?: Maybe<Scalars["String"]["output"]>;
  path?: Maybe<Scalars["String"]["output"]>;
};

export type GQLSubjectPage = {
  __typename?: "SubjectPage";
  about?: Maybe<GQLSubjectPageAbout>;
  banner: GQLSubjectPageBanner;
  buildsOn: Array<Maybe<GQLSubjectLink>>;
  connectedTo: Array<Maybe<GQLSubjectLink>>;
  id: Scalars["Int"]["output"];
  leadsTo: Array<Maybe<GQLSubjectLink>>;
  metaDescription?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
};

export type GQLSubjectPageAbout = {
  __typename?: "SubjectPageAbout";
  description: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  visualElement: GQLSubjectPageVisualElement;
};

export type GQLSubjectPageBanner = {
  __typename?: "SubjectPageBanner";
  desktopId: Scalars["String"]["output"];
  desktopUrl: Scalars["String"]["output"];
  mobileId?: Maybe<Scalars["String"]["output"]>;
  mobileUrl?: Maybe<Scalars["String"]["output"]>;
};

export type GQLSubjectPageVisualElement = {
  __typename?: "SubjectPageVisualElement";
  alt?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLSuggestOption = {
  __typename?: "SuggestOption";
  score: Scalars["Float"]["output"];
  text: Scalars["String"]["output"];
};

export type GQLSuggestionResult = {
  __typename?: "SuggestionResult";
  name: Scalars["String"]["output"];
  suggestions: Array<GQLSearchSuggestion>;
};

export type GQLTags = {
  __typename?: "Tags";
  language: Scalars["String"]["output"];
  tags: Array<Scalars["String"]["output"]>;
};

export type GQLTaxonomyContext = {
  __typename?: "TaxonomyContext";
  breadcrumbs: Array<Scalars["String"]["output"]>;
  parentIds: Array<Scalars["String"]["output"]>;
  path: Scalars["String"]["output"];
};

export type GQLTaxonomyEntity = {
  breadcrumbs: Array<Scalars["String"]["output"]>;
  contentUri?: Maybe<Scalars["String"]["output"]>;
  contexts: Array<GQLTaxonomyContext>;
  id: Scalars["String"]["output"];
  language?: Maybe<Scalars["String"]["output"]>;
  metadata: GQLTaxonomyMetadata;
  name: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  paths: Array<Scalars["String"]["output"]>;
  relevanceId?: Maybe<Scalars["String"]["output"]>;
  resourceTypes?: Maybe<Array<GQLResourceType>>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type GQLTaxonomyMetadata = {
  __typename?: "TaxonomyMetadata";
  customFields: Scalars["StringRecord"]["output"];
  grepCodes: Array<Scalars["String"]["output"]>;
  visible: Scalars["Boolean"]["output"];
};

export type GQLTextblockLicense = {
  __typename?: "TextblockLicense";
  copyright: GQLCopyright;
  title?: Maybe<Scalars["String"]["output"]>;
};

export type GQLTitle = {
  __typename?: "Title";
  language: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type GQLTopic = GQLTaxonomyEntity &
  GQLWithArticle & {
    __typename?: "Topic";
    alternateTopics?: Maybe<Array<GQLTopic>>;
    article?: Maybe<GQLArticle>;
    availability?: Maybe<Scalars["String"]["output"]>;
    breadcrumbs: Array<Scalars["String"]["output"]>;
    contentUri?: Maybe<Scalars["String"]["output"]>;
    contexts: Array<GQLTaxonomyContext>;
    coreResources?: Maybe<Array<GQLResource>>;
    id: Scalars["String"]["output"];
    isPrimary?: Maybe<Scalars["Boolean"]["output"]>;
    language?: Maybe<Scalars["String"]["output"]>;
    meta?: Maybe<GQLMeta>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars["String"]["output"];
    parent?: Maybe<Scalars["String"]["output"]>;
    parentId?: Maybe<Scalars["String"]["output"]>;
    path: Scalars["String"]["output"];
    pathTopics?: Maybe<Array<Array<GQLTopic>>>;
    paths: Array<Scalars["String"]["output"]>;
    relevanceId?: Maybe<Scalars["String"]["output"]>;
    resourceTypes?: Maybe<Array<GQLResourceType>>;
    subtopics?: Maybe<Array<GQLTopic>>;
    supplementaryResources?: Maybe<Array<GQLResource>>;
    supportedLanguages: Array<Scalars["String"]["output"]>;
    url?: Maybe<Scalars["String"]["output"]>;
  };

export type GQLTopicCoreResourcesArgs = {
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLTopicSupplementaryResourcesArgs = {
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLTranscription = {
  __typename?: "Transcription";
  pinyin?: Maybe<Scalars["String"]["output"]>;
  traditional?: Maybe<Scalars["String"]["output"]>;
};

export type GQLTransformedArticleContent = {
  __typename?: "TransformedArticleContent";
  content: Scalars["String"]["output"];
  metaData?: Maybe<GQLArticleMetaData>;
  visualElement?: Maybe<GQLVisualElement>;
  visualElementEmbed?: Maybe<GQLResourceEmbed>;
};

export type GQLTransformedArticleContentInput = {
  absoluteUrl?: InputMaybe<Scalars["Boolean"]["input"]>;
  draftConcept?: InputMaybe<Scalars["Boolean"]["input"]>;
  isOembed?: InputMaybe<Scalars["String"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
  previewH5p?: InputMaybe<Scalars["Boolean"]["input"]>;
  showVisualElement?: InputMaybe<Scalars["String"]["input"]>;
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLUpdatedFolder = {
  __typename?: "UpdatedFolder";
  name?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
};

export type GQLUpdatedFolderResource = {
  __typename?: "UpdatedFolderResource";
  tags?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GQLUptimeAlert = {
  __typename?: "UptimeAlert";
  body?: Maybe<Scalars["String"]["output"]>;
  closable: Scalars["Boolean"]["output"];
  number: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
};

export type GQLVideoFolderResourceMeta = GQLFolderResourceMeta & {
  __typename?: "VideoFolderResourceMeta";
  description: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLFolderResourceResourceType>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLVisualElement = {
  __typename?: "VisualElement";
  brightcove?: Maybe<GQLBrightcoveElement>;
  copyright?: Maybe<GQLCopyright>;
  embed?: Maybe<Scalars["String"]["output"]>;
  h5p?: Maybe<GQLH5pElement>;
  image?: Maybe<GQLImageElement>;
  language?: Maybe<Scalars["String"]["output"]>;
  oembed?: Maybe<GQLVisualElementOembed>;
  resource?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type GQLVisualElementOembed = {
  __typename?: "VisualElementOembed";
  fullscreen?: Maybe<Scalars["Boolean"]["output"]>;
  html?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
};

export type GQLWithArticle = {
  availability?: Maybe<Scalars["String"]["output"]>;
  meta?: Maybe<GQLMeta>;
};

export type GQLArticleConceptEmbedsQueryVariables = Exact<{
  resources: Array<GQLResourceEmbedInput> | GQLResourceEmbedInput;
}>;

export type GQLArticleConceptEmbedsQuery = {
  __typename?: "Query";
  resourceEmbeds: {
    __typename?: "ResourceEmbed";
    content: string;
    meta: { __typename?: "ResourceMetaData" } & GQLNotionsContent_MetaFragment;
  };
};

export type GQLArticle_ArticleFragment = {
  __typename?: "Article";
  id: number;
  created: string;
  updated: string;
  supportedLanguages?: Array<string>;
  grepCodes?: Array<string>;
  oldNdlaUrl?: string;
  introduction?: string;
  conceptIds?: Array<number>;
  revisionDate?: string;
  language: string;
  transformedContent: {
    __typename?: "TransformedArticleContent";
    content: string;
    metaData?: {
      __typename?: "ArticleMetaData";
      copyText?: string;
      footnotes?: Array<{
        __typename?: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition?: string;
        publisher?: string;
        url?: string;
      }>;
    };
  };
  relatedContent?: Array<{ __typename?: "RelatedContent"; title: string; url: string }>;
} & GQLLicenseBox_ArticleFragment;

export type GQLArticleContents_ArticleFragment = {
  __typename?: "Article";
  id: number;
  created: string;
  updated: string;
  introduction?: string;
  transformedContent: {
    __typename?: "TransformedArticleContent";
    content: string;
    metaData?: {
      __typename?: "ArticleMetaData";
      footnotes?: Array<{
        __typename?: "FootNote";
        ref: number;
        authors: Array<string>;
        edition?: string;
        publisher?: string;
        year: string;
        url?: string;
        title: string;
      }>;
    };
  };
} & GQLLicenseBox_ArticleFragment;

export type GQLNotionsContent_MetaFragment = {
  __typename?: "ResourceMetaData";
} & GQLResourceEmbedLicenseBox_MetaFragment;

export type GQLMyNdlaPersonalDataFragmentFragment = {
  __typename: "MyNdlaPersonalData";
  id: number;
  username: string;
  email: string;
  displayName: string;
  organization: string;
  favoriteSubjects: Array<string>;
  role: string;
  arenaEnabled: boolean;
  arenaGroups: Array<string>;
  shareName: boolean;
  groups: Array<{
    __typename?: "MyNdlaGroup";
    id: string;
    displayName: string;
    isPrimarySchool: boolean;
    parentId?: string;
  }>;
};

export type GQLMyNdlaDataQueryVariables = Exact<{ [key: string]: never }>;

export type GQLMyNdlaDataQuery = {
  __typename?: "Query";
  examLockStatus: { __typename?: "ConfigMetaBoolean"; key: string; value: boolean };
  personalData?: { __typename?: "MyNdlaPersonalData" } & GQLMyNdlaPersonalDataFragmentFragment;
};

export type GQLLastLearningpathStepInfo_TopicFragment = {
  __typename?: "Topic";
  id: string;
} & GQLResources_TopicFragment;

export type GQLLastLearningpathStepInfo_SubjectFragment = { __typename?: "Subject"; path: string; name: string };

export type GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLLearningpath_TopicFragment = { __typename?: "Topic" } & GQLLastLearningpathStepInfo_TopicFragment &
  GQLLearningpathEmbed_TopicFragment;

export type GQLLearningpath_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment;

export type GQLLearningpath_SubjectFragment = {
  __typename?: "Subject";
  id: string;
} & GQLLastLearningpathStepInfo_SubjectFragment;

export type GQLLearningpath_LearningpathStepFragment = {
  __typename?: "LearningpathStep";
  seqNo: number;
  id: number;
  showTitle: boolean;
  title: string;
  description?: string;
  license?: { __typename?: "License"; license: string };
} & GQLLearningpathEmbed_LearningpathStepFragment;

export type GQLLearningpath_ResourceFragment = { __typename?: "Resource"; path: string };

export type GQLLearningpath_LearningpathFragment = {
  __typename?: "Learningpath";
  id: number;
  title: string;
  lastUpdated: string;
  copyright: {
    __typename?: "LearningpathCopyright";
    license: { __typename?: "License"; license: string };
    contributors: Array<{ __typename?: "Contributor"; type: string; name: string }>;
  };
  learningsteps: Array<{
    __typename?: "LearningpathStep";
    title: string;
    id: number;
    resource?: {
      __typename?: "Resource";
      id: string;
      resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
    };
  }>;
};

export type GQLLearningpathEmbed_ArticleFragment = {
  __typename?: "Article";
  id: number;
  metaDescription: string;
  created: string;
  updated: string;
  requiredLibraries?: Array<{ __typename?: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
} & GQLStructuredArticleDataFragment &
  GQLArticle_ArticleFragment;

export type GQLLearningpathEmbed_TopicFragment = {
  __typename?: "Topic";
  supplementaryResources?: Array<{ __typename?: "Resource"; id: string }>;
};

export type GQLLearningpathEmbed_LearningpathStepFragment = {
  __typename?: "LearningpathStep";
  resource?: {
    __typename?: "Resource";
    id: string;
    path: string;
    article?: { __typename?: "Article" } & GQLLearningpathEmbed_ArticleFragment;
  };
  embedUrl?: { __typename?: "LearningpathStepEmbedUrl"; embedType: string; url: string };
  oembed?: { __typename?: "LearningpathStepOembed"; html: string; width: number; height: number };
};

export type GQLLearningpathStepQueryVariables = Exact<{
  articleId: Scalars["String"]["input"];
  resourceId: Scalars["String"]["input"];
  includeResource: Scalars["Boolean"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLLearningpathStepQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article"; oembed?: string } & GQLLearningpathEmbed_ArticleFragment;
  resource?: {
    __typename?: "Resource";
    id: string;
    path: string;
    resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
  };
};

export type GQLAudioLicenseList_AudioLicenseFragment = {
  __typename?: "AudioLicense";
  id: string;
  src: string;
  title: string;
  copyright: { __typename?: "Copyright"; origin?: string } & GQLLicenseListCopyrightFragment;
};

export type GQLGlossLicenseList_GlossLicenseFragment = {
  __typename?: "GlossLicense";
  id: string;
  title: string;
  src?: string;
  copyright?: {
    __typename?: "ConceptCopyright";
    origin?: string;
    processed?: boolean;
    license?: { __typename?: "License"; license: string };
    creators: Array<{ __typename?: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename?: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename?: "Contributor"; name: string; type: string }>;
  };
};

export type GQLConceptLicenseList_ConceptLicenseFragment = {
  __typename?: "ConceptLicense";
  id: string;
  title: string;
  src?: string;
  copyright?: {
    __typename?: "ConceptCopyright";
    origin?: string;
    processed?: boolean;
    license?: { __typename?: "License"; license: string };
    creators: Array<{ __typename?: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename?: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename?: "Contributor"; name: string; type: string }>;
  };
};

export type GQLH5pLicenseList_H5pLicenseFragment = {
  __typename?: "H5pLicense";
  id: string;
  title: string;
  src?: string;
  copyright?: { __typename?: "Copyright" } & GQLLicenseListCopyrightFragment;
};

export type GQLImageLicenseList_ImageLicenseFragment = {
  __typename?: "ImageLicense";
  id: string;
  title: string;
  altText: string;
  src: string;
  copyText?: string;
  copyright: { __typename?: "Copyright"; origin?: string } & GQLLicenseListCopyrightFragment;
};

export type GQLLicenseBox_ArticleFragment = {
  __typename?: "Article";
  id: number;
  title: string;
  htmlTitle: string;
  published: string;
  copyright: { __typename?: "Copyright" } & GQLTextLicenseList_CopyrightFragment;
  transformedContent: {
    __typename?: "TransformedArticleContent";
    metaData?: {
      __typename?: "ArticleMetaData";
      copyText?: string;
      concepts?: Array<{ __typename?: "ConceptLicense" } & GQLConceptLicenseList_ConceptLicenseFragment>;
      glosses?: Array<{ __typename?: "GlossLicense" } & GQLGlossLicenseList_GlossLicenseFragment>;
      h5ps?: Array<{ __typename?: "H5pLicense" } & GQLH5pLicenseList_H5pLicenseFragment>;
      brightcoves?: Array<{ __typename?: "BrightcoveLicense" } & GQLVideoLicenseList_BrightcoveLicenseFragment>;
      audios?: Array<{ __typename?: "AudioLicense" } & GQLAudioLicenseList_AudioLicenseFragment>;
      podcasts?: Array<{ __typename?: "PodcastLicense" } & GQLPodcastLicenseList_PodcastLicenseFragment>;
      images?: Array<{ __typename?: "ImageLicense" } & GQLImageLicenseList_ImageLicenseFragment>;
      textblocks?: Array<{
        __typename?: "TextblockLicense";
        title?: string;
        copyright: { __typename?: "Copyright" } & GQLTextLicenseList_CopyrightFragment;
      }>;
    };
  };
};

export type GQLPodcastLicenseList_PodcastLicenseFragment = {
  __typename?: "PodcastLicense";
  id: string;
  src: string;
  copyText?: string;
  title: string;
  description?: string;
  copyright: { __typename?: "Copyright"; origin?: string } & GQLLicenseListCopyrightFragment;
};

export type GQLTextLicenseList_CopyrightFragment = { __typename?: "Copyright" } & GQLLicenseListCopyrightFragment;

export type GQLVideoLicenseList_BrightcoveLicenseFragment = {
  __typename?: "BrightcoveLicense";
  id: string;
  title: string;
  download?: string;
  src?: string;
  cover?: string;
  iframe?: { __typename?: "BrightcoveIframe"; width: number; height: number; src: string };
  copyright?: { __typename?: "Copyright" } & GQLLicenseListCopyrightFragment;
};

export type GQLLicenseListCopyrightFragment = {
  __typename?: "Copyright";
  origin?: string;
  processed?: boolean;
  license: { __typename?: "License"; license: string };
  creators: Array<{ __typename?: "Contributor"; name: string; type: string }>;
  processors: Array<{ __typename?: "Contributor"; name: string; type: string }>;
  rightsholders: Array<{ __typename?: "Contributor"; name: string; type: string }>;
};

export type GQLAboutPageQueryVariables = Exact<{
  slug: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLAboutPageQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article" } & GQLAboutPage_ArticleFragment;
  frontpage?: { __typename?: "FrontpageMenu" } & GQLAboutPage_FrontpageMenuFragment;
};

export type GQLAboutPage_ArticleFragment = {
  __typename?: "Article";
  id: number;
  introduction?: string;
  created: string;
  updated: string;
  slug?: string;
  published: string;
  transformedContent: {
    __typename?: "TransformedArticleContent";
    content: string;
    metaData?: { __typename?: "ArticleMetaData"; copyText?: string };
  };
} & GQLLicenseBox_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLAboutPage_FrontpageMenuFragment = {
  __typename?: "FrontpageMenu";
  menu?: Array<{ __typename?: "FrontpageMenu" } & GQLAboutPageFooter_FrontpageMenuFragment>;
} & GQLFrontpageMenuFragmentFragment;

export type GQLFrontpageMenuFragmentFragment = {
  __typename?: "FrontpageMenu";
  articleId: number;
  article: { __typename?: "Article"; title: string; slug?: string };
};

export type GQLAboutPageFooter_FrontpageMenuFragment = {
  __typename?: "FrontpageMenu";
  menu?: Array<
    {
      __typename?: "FrontpageMenu";
      menu?: Array<
        {
          __typename?: "FrontpageMenu";
          menu?: Array<{ __typename?: "FrontpageMenu" } & GQLFrontpageMenuFragmentFragment>;
        } & GQLFrontpageMenuFragmentFragment
      >;
    } & GQLFrontpageMenuFragmentFragment
  >;
} & GQLFrontpageMenuFragmentFragment;

export type GQLArticlePage_ResourceTypeFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLArticlePage_SubjectFragment = {
  __typename?: "Subject";
  name: string;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  subjectpage?: { __typename?: "SubjectPage"; about?: { __typename?: "SubjectPageAbout"; title: string } };
} & GQLArticleHero_SubjectFragment;

export type GQLArticlePage_ResourceFragment = {
  __typename?: "Resource";
  id: string;
  name: string;
  path: string;
  contentUri?: string;
  article?: {
    __typename?: "Article";
    created: string;
    updated: string;
    metaDescription: string;
    oembed?: string;
    tags?: Array<string>;
    metaImage?: { __typename?: "MetaImage" } & GQLArticleHero_MetaImageFragment;
  } & GQLStructuredArticleDataFragment &
    GQLArticle_ArticleFragment;
};

export type GQLArticlePage_TopicFragment = { __typename?: "Topic"; path: string } & GQLResources_TopicFragment;

export type GQLArticleHero_SubjectFragment = { __typename?: "Subject"; id: string };

export type GQLArticleHero_MetaImageFragment = { __typename?: "MetaImage"; url: string; alt: string };

export type GQLFilmFrontpage_SubjectFragment = {
  __typename?: "Subject";
  name: string;
  topics?: Array<{ __typename?: "Topic"; id: string; path: string; name: string }>;
};

export type GQLFilmFrontpage_FilmFrontpageFragment = {
  __typename?: "FilmFrontpage";
  slideShow: Array<{ __typename?: "Movie" } & GQLMovieInfoFragment>;
  movieThemes: Array<{ __typename?: "MovieTheme" } & GQLMovieCategory_MovieThemeFragment>;
  about: Array<{
    __typename?: "FilmPageAbout";
    title: string;
    description: string;
    language: string;
    visualElement: { __typename?: "SubjectPageVisualElement"; alt?: string; url: string; type: string };
  }>;
  article?: { __typename?: "Article" } & GQLArticle_ArticleFragment;
};

export type GQLMovieCategory_MovieThemeFragment = {
  __typename?: "MovieTheme";
  name: Array<{ __typename?: "Name"; name: string; language: string }>;
  movies: Array<{ __typename?: "Movie" } & GQLMovieInfoFragment>;
};

export type GQLFilmFrontPageQueryVariables = Exact<{
  subjectId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLFilmFrontPageQuery = {
  __typename?: "Query";
  filmfrontpage?: { __typename?: "FilmFrontpage" } & GQLFilmFrontpage_FilmFrontpageFragment;
  subject?: { __typename?: "Subject"; id: string } & GQLFilmFrontpage_SubjectFragment;
};

export type GQLLearningpathPage_TopicFragment = { __typename?: "Topic" } & GQLLearningpath_TopicFragment;

export type GQLLearningpathPage_SubjectFragment = {
  __typename?: "Subject";
  id: string;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  subjectpage?: { __typename?: "SubjectPage"; about?: { __typename?: "SubjectPageAbout"; title: string } };
} & GQLLearningpath_SubjectFragment;

export type GQLLearningpathPage_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLLearningpath_ResourceTypeDefinitionFragment;

export type GQLLearningpathPage_ResourceFragment = {
  __typename?: "Resource";
  id: string;
  learningpath?: {
    __typename?: "Learningpath";
    supportedLanguages: Array<string>;
    tags: Array<string>;
    description: string;
    coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string; metaUrl: string };
    learningsteps: Array<{ __typename?: "LearningpathStep"; type: string } & GQLLearningpath_LearningpathStepFragment>;
  } & GQLLearningpath_LearningpathFragment;
} & GQLLearningpath_ResourceFragment;

export type GQLMastHeadQueryVariables = Exact<{
  subjectId: Scalars["String"]["input"];
}>;

export type GQLMastHeadQuery = {
  __typename?: "Query";
  subject?: { __typename?: "Subject" } & GQLMastheadDrawer_SubjectFragment;
};

export type GQLMastheadSearch_SubjectFragment = { __typename?: "Subject"; id: string; name: string };

export type GQLAboutMenuFragment = {
  __typename?: "FrontpageMenu";
  articleId: number;
  hideLevel?: boolean;
  article: { __typename?: "Article"; id: number; title: string; slug?: string };
};

export type GQLAboutMenu_FrontpageMenuFragment = {
  __typename?: "FrontpageMenu";
  menu?: Array<
    {
      __typename?: "FrontpageMenu";
      menu?: Array<
        {
          __typename?: "FrontpageMenu";
          menu?: Array<
            {
              __typename?: "FrontpageMenu";
              menu?: Array<{ __typename?: "FrontpageMenu" } & GQLAboutMenuFragment>;
            } & GQLAboutMenuFragment
          >;
        } & GQLAboutMenuFragment
      >;
    } & GQLAboutMenuFragment
  >;
} & GQLAboutMenuFragment;

export type GQLDefaultMenu_SubjectFragment = { __typename?: "Subject"; id: string; name: string };

export type GQLDrawerContent_SubjectFragment = { __typename?: "Subject" } & GQLSubjectMenu_SubjectFragment;

export type GQLDrawerContent_FrontpageMenuFragment = {
  __typename?: "FrontpageMenu";
} & GQLAboutMenu_FrontpageMenuFragment;

export type GQLDrawerContent_ProgrammePageFragment = {
  __typename?: "ProgrammePage";
} & GQLProgrammeMenu_ProgrammePageFragment;

export type GQLMastheadFrontpageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLMastheadFrontpageQuery = {
  __typename?: "Query";
  frontpage?: { __typename?: "FrontpageMenu" } & GQLDrawerContent_FrontpageMenuFragment;
};

export type GQLMastheadProgrammeQueryVariables = Exact<{ [key: string]: never }>;

export type GQLMastheadProgrammeQuery = {
  __typename?: "Query";
  programmes?: Array<{ __typename?: "ProgrammePage" } & GQLDrawerContent_ProgrammePageFragment>;
};

export type GQLMastheadDrawer_SubjectFragment = { __typename?: "Subject" } & GQLDefaultMenu_SubjectFragment &
  GQLDrawerContent_SubjectFragment;

export type GQLProgrammeMenu_ProgrammePageFragment = {
  __typename?: "ProgrammePage";
  id: string;
  url: string;
  contentUri?: string;
  title: { __typename?: "Title"; title: string };
};

export type GQLSubjectMenu_SubjectFragment = {
  __typename?: "Subject";
  id: string;
  name: string;
  allTopics?: Array<{ __typename?: "Topic"; id: string; name: string; parentId?: string; path: string }>;
} & GQLTopicMenu_SubjectFragment;

export type GQLTopicMenu_SubjectFragment = { __typename?: "Subject"; id: string; name: string };

export type GQLTopicMenu_ResourceFragment = { __typename?: "Resource"; id: string; name: string; path: string };

export type GQLTopicMenuResourcesQueryVariables = Exact<{
  subjectId: Scalars["String"]["input"];
  topicId: Scalars["String"]["input"];
}>;

export type GQLTopicMenuResourcesQuery = {
  __typename?: "Query";
  topic?: {
    __typename?: "Topic";
    metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
    coreResources?: Array<
      {
        __typename?: "Resource";
        rank?: number;
        resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
      } & GQLTopicMenu_ResourceFragment
    >;
    supplementaryResources?: Array<
      {
        __typename?: "Resource";
        rank?: number;
        resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
      } & GQLTopicMenu_ResourceFragment
    >;
  };
  resourceTypes?: Array<{ __typename?: "ResourceTypeDefinition"; id: string; name: string }>;
};

export type GQLMovedResourcePage_ResourceFragment = {
  __typename?: "Resource";
  id: string;
  name: string;
  path: string;
  paths: Array<string>;
  contexts: Array<{ __typename?: "TaxonomyContext"; path: string; breadcrumbs: Array<string> }>;
  article?: {
    __typename?: "Article";
    id: number;
    metaDescription: string;
    metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  };
  learningpath?: {
    __typename?: "Learningpath";
    id: number;
    description: string;
    coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string };
  };
  resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
};

export type GQLMultidisciplinarySubjectArticlePageQueryVariables = Exact<{
  topicId: Scalars["String"]["input"];
  subjectId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLMultidisciplinarySubjectArticlePageQuery = {
  __typename?: "Query";
  subject?: { __typename?: "Subject" } & GQLMultidisciplinarySubjectArticle_SubjectFragment;
  topic?: {
    __typename?: "Topic";
    id: string;
    article?: {
      __typename?: "Article";
      metaDescription: string;
      tags?: Array<string>;
      metaImage?: { __typename?: "MetaImage"; url: string };
    };
  } & GQLMultidisciplinarySubjectArticle_TopicFragment;
  resourceTypes?: Array<
    { __typename?: "ResourceTypeDefinition" } & GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment
  >;
};

export type GQLMultidisciplinarySubjectPageQueryVariables = Exact<{
  subjectId: Scalars["String"]["input"];
}>;

export type GQLMultidisciplinarySubjectPageQuery = {
  __typename?: "Query";
  subject?: {
    __typename?: "Subject";
    subjectpage?: { __typename?: "SubjectPage"; about?: { __typename?: "SubjectPageAbout"; title: string } };
    topics?: Array<{ __typename?: "Topic"; id: string; name: string }>;
  } & GQLMultidisciplinaryTopicWrapper_SubjectFragment;
};

export type GQLMultidisciplinaryArticleList_TopicFragment = {
  __typename?: "Topic";
  name: string;
  id: string;
  path: string;
  meta?: {
    __typename?: "Meta";
    metaDescription?: string;
    metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  };
};

export type GQLMultidisciplinarySubjectArticle_TopicFragment = {
  __typename?: "Topic";
  path: string;
  id: string;
  contexts: Array<{
    __typename?: "TaxonomyContext";
    breadcrumbs: Array<string>;
    parentIds: Array<string>;
    path: string;
  }>;
  article?: {
    __typename?: "Article";
    created: string;
    updated: string;
    oembed?: string;
    crossSubjectTopics?: Array<{ __typename?: "CrossSubjectElement"; title: string; path?: string }>;
  } & GQLArticle_ArticleFragment;
} & GQLResources_TopicFragment;

export type GQLMultidisciplinarySubjectArticle_SubjectFragment = {
  __typename?: "Subject";
  name: string;
  id: string;
  path: string;
  subjectpage?: { __typename?: "SubjectPage"; about?: { __typename?: "SubjectPageAbout"; title: string } };
};

export type GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLMultidisciplinaryTopic_TopicFragment = {
  __typename?: "Topic";
  path: string;
  subtopics?: Array<{ __typename?: "Topic"; id: string; name: string }>;
  meta?: {
    __typename?: "Meta";
    title: string;
    metaDescription?: string;
    introduction?: string;
    metaImage?: { __typename?: "MetaImage"; url: string };
  };
  article?: {
    __typename?: "Article";
    oembed?: string;
    metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
    transformedContent: {
      __typename?: "TransformedArticleContent";
      visualElementEmbed?: {
        __typename?: "ResourceEmbed";
        content: string;
        meta: { __typename?: "ResourceMetaData" } & GQLTopicVisualElementContent_MetaFragment;
      };
    };
  } & GQLArticleContents_ArticleFragment;
} & GQLResources_TopicFragment;

export type GQLMultidisciplinaryTopic_SubjectFragment = { __typename?: "Subject"; id: string; name: string };

export type GQLMultidisciplinaryTopicWrapperQueryVariables = Exact<{
  topicId: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  showSubtopics: Scalars["Boolean"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLMultidisciplinaryTopicWrapperQuery = {
  __typename?: "Query";
  topic?: {
    __typename?: "Topic";
    id: string;
    subtopics?: Array<{ __typename?: "Topic" } & GQLMultidisciplinaryArticleList_TopicFragment>;
  } & GQLMultidisciplinaryTopic_TopicFragment;
};

export type GQLMultidisciplinaryTopicWrapper_SubjectFragment = {
  __typename?: "Subject";
} & GQLMultidisciplinaryTopic_SubjectFragment;

export type GQLNewFlagV2MutationVariables = Exact<{
  id: Scalars["Int"]["input"];
  reason: Scalars["String"]["input"];
}>;

export type GQLNewFlagV2Mutation = { __typename?: "Mutation"; newFlagV2: number };

export type GQLReplyToTopicV2MutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
}>;

export type GQLReplyToTopicV2Mutation = {
  __typename?: "Mutation";
  replyToTopicV2: { __typename?: "ArenaPostV2" } & GQLArenaPostV2Fragment;
};

export type GQLUpdatePostV2MutationVariables = Exact<{
  postId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
}>;

export type GQLUpdatePostV2Mutation = {
  __typename?: "Mutation";
  updatePostV2: { __typename?: "ArenaPostV2" } & GQLArenaPostV2Fragment;
};

export type GQLUpdateTopicV2MutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  isLocked?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPinned?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLUpdateTopicV2Mutation = {
  __typename?: "Mutation";
  updateTopicV2: { __typename?: "ArenaTopicV2" } & GQLArenaTopicV2Fragment;
};

export type GQLDeletePostV2MutationVariables = Exact<{
  postId: Scalars["Int"]["input"];
}>;

export type GQLDeletePostV2Mutation = { __typename?: "Mutation"; deletePostV2: number };

export type GQLDeleteTopicV2MutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
}>;

export type GQLDeleteTopicV2Mutation = { __typename?: "Mutation"; deleteTopicV2: number };

export type GQLNewArenaTopicV2MutationVariables = Exact<{
  categoryId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  isLocked?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLNewArenaTopicV2Mutation = {
  __typename?: "Mutation";
  newArenaTopicV2: { __typename?: "ArenaTopicV2" } & GQLArenaTopicV2Fragment;
};

export type GQLNewArenaCategoryMutationVariables = Exact<{
  title: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  visible: Scalars["Boolean"]["input"];
}>;

export type GQLNewArenaCategoryMutation = {
  __typename?: "Mutation";
  newArenaCategory: { __typename?: "ArenaCategoryV2" } & GQLArenaCategoryV2Fragment;
};

export type GQLUpdateArenaCategoryMutationVariables = Exact<{
  categoryId: Scalars["Int"]["input"];
  title: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  visible: Scalars["Boolean"]["input"];
}>;

export type GQLUpdateArenaCategoryMutation = {
  __typename?: "Mutation";
  updateArenaCategory: { __typename?: "ArenaCategoryV2" } & GQLArenaCategoryV2Fragment;
};

export type GQLSortArenaCategoriesMutationVariables = Exact<{
  categoryIds: Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"];
}>;

export type GQLSortArenaCategoriesMutation = {
  __typename?: "Mutation";
  sortArenaCategories: Array<{ __typename?: "ArenaCategoryV2" } & GQLArenaCategoryV2Fragment>;
};

export type GQLDeleteArenaCategoryMutationVariables = Exact<{
  categoryId: Scalars["Int"]["input"];
}>;

export type GQLDeleteArenaCategoryMutation = { __typename?: "Mutation"; deleteCategory: number };

export type GQLMarkAllNotificationsAsReadMutationVariables = Exact<{ [key: string]: never }>;

export type GQLMarkAllNotificationsAsReadMutation = { __typename?: "Mutation"; markAllNotificationsAsRead: boolean };

export type GQLResolveFlagMutationVariables = Exact<{
  flagId: Scalars["Int"]["input"];
}>;

export type GQLResolveFlagMutation = {
  __typename?: "Mutation";
  resolveFlag: { __typename?: "ArenaFlag" } & GQLArenaFlagFragment;
};

export type GQLUpdateOtherUserMutationVariables = Exact<{
  userId: Scalars["Int"]["input"];
  user: GQLArenaUserV2Input;
}>;

export type GQLUpdateOtherUserMutation = {
  __typename?: "Mutation";
  updateOtherArenaUser: { __typename?: "MyNdlaPersonalData" } & GQLMyNdlaPersonalDataFragmentFragment;
};

export type GQLFollowTopicMutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
}>;

export type GQLFollowTopicMutation = {
  __typename?: "Mutation";
  followTopic: { __typename?: "ArenaTopicV2" } & GQLArenaTopicV2Fragment;
};

export type GQLUnfollowTopicMutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
}>;

export type GQLUnfollowTopicMutation = {
  __typename?: "Mutation";
  unfollowTopic: { __typename?: "ArenaTopicV2" } & GQLArenaTopicV2Fragment;
};

export type GQLArenaUserV2Fragment = {
  __typename?: "ArenaUserV2";
  displayName: string;
  id: number;
  groups: Array<string>;
  location: string;
  username: string;
};

export type GQLArenaCategoryV2Fragment = {
  __typename: "ArenaCategoryV2";
  id: number;
  title: string;
  description: string;
  topicCount: number;
  postCount: number;
  visible: boolean;
};

export type GQLArenaTopicV2Fragment = {
  __typename: "ArenaTopicV2";
  id: number;
  postCount: number;
  created: string;
  updated: string;
  title: string;
  isFollowing: boolean;
  categoryId: number;
  isLocked: boolean;
};

export type GQLArenaFlagFragment = {
  __typename: "ArenaFlag";
  id: number;
  reason: string;
  created: string;
  resolved?: string;
  isResolved: boolean;
  flagger?: { __typename?: "ArenaUserV2" } & GQLArenaUserV2Fragment;
};

export type GQLArenaPostV2Fragment = {
  __typename: "ArenaPostV2";
  content: string;
  contentAsHTML?: string;
  id: number;
  created: string;
  updated: string;
  topicId: number;
  owner?: { __typename?: "ArenaUserV2" } & GQLArenaUserV2Fragment;
  flags?: Array<{ __typename?: "ArenaFlag" } & GQLArenaFlagFragment>;
};

export type GQLPaginatedPostsFragment = {
  __typename: "PaginatedPosts";
  totalCount: number;
  page: number;
  pageSize: number;
  items: Array<{ __typename?: "ArenaPostV2" } & GQLArenaPostV2Fragment>;
};

export type GQLPaginatedTopicsFragment = {
  __typename: "PaginatedTopics";
  totalCount: number;
  page: number;
  pageSize: number;
  items: Array<{ __typename?: "ArenaTopicV2" } & GQLArenaTopicV2Fragment>;
};

export type GQLArenaUserV2QueryVariables = Exact<{
  username: Scalars["String"]["input"];
}>;

export type GQLArenaUserV2Query = {
  __typename?: "Query";
  arenaUserV2?: { __typename?: "ArenaUserV2" } & GQLArenaUserV2Fragment;
};

export type GQLArenaPage2QueryVariables = Exact<{ [key: string]: never }>;

export type GQLArenaPage2Query = {
  __typename?: "Query";
  arenaCategoriesV2: Array<{ __typename?: "ArenaCategoryV2" } & GQLArenaCategoryV2Fragment>;
};

export type GQLArenaCategoryV2QueryVariables = Exact<{
  categoryId: Scalars["Int"]["input"];
  page: Scalars["Int"]["input"];
}>;

export type GQLArenaCategoryV2Query = {
  __typename?: "Query";
  arenaCategoryV2?: {
    __typename?: "ArenaCategoryV2";
    topics?: Array<{ __typename?: "ArenaTopicV2" } & GQLArenaTopicV2Fragment>;
  } & GQLArenaCategoryV2Fragment;
};

export type GQLArenaTopicByIdV2QueryVariables = Exact<{
  topicId: Scalars["Int"]["input"];
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
}>;

export type GQLArenaTopicByIdV2Query = {
  __typename?: "Query";
  arenaTopicV2?: {
    __typename?: "ArenaTopicV2";
    posts?: { __typename?: "PaginatedPosts" } & GQLPaginatedPostsFragment;
  } & GQLArenaTopicV2Fragment;
};

export type GQLArenaTopicsByUserV2QueryVariables = Exact<{
  userId: Scalars["Int"]["input"];
}>;

export type GQLArenaTopicsByUserV2Query = {
  __typename?: "Query";
  arenaTopicsByUserV2: { __typename?: "PaginatedTopics" } & GQLPaginatedTopicsFragment;
};

export type GQLArenaRecentTopicsV2QueryVariables = Exact<{
  pageSize: Scalars["Int"]["input"];
}>;

export type GQLArenaRecentTopicsV2Query = {
  __typename?: "Query";
  arenaRecentTopicsV2: { __typename?: "PaginatedTopics" } & GQLPaginatedTopicsFragment;
};

export type GQLArenaNotificationV2Fragment = {
  __typename: "ArenaNewPostNotificationV2";
  id: number;
  topicId: number;
  topicTitle: string;
  notificationTime: string;
  isRead: boolean;
  post: { __typename?: "ArenaPostV2" } & GQLArenaPostV2Fragment;
};

export type GQLPaginatedNotificationsFragment = {
  __typename: "PaginatedArenaNewPostNotificationV2";
  totalCount: number;
  page: number;
  pageSize: number;
  items: Array<{ __typename?: "ArenaNewPostNotificationV2" } & GQLArenaNotificationV2Fragment>;
};

export type GQLArenaNotificationsV2QueryVariables = Exact<{ [key: string]: never }>;

export type GQLArenaNotificationsV2Query = {
  __typename?: "Query";
  arenaNotificationsV2: { __typename?: "PaginatedArenaNewPostNotificationV2" } & GQLPaginatedNotificationsFragment;
};

export type GQLAllFlagsV2QueryVariables = Exact<{
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GQLAllFlagsV2Query = {
  __typename?: "Query";
  arenaAllFlags: { __typename?: "PaginatedPosts" } & GQLPaginatedPostsFragment;
};

export type GQLArenaPostInContextQueryVariables = Exact<{
  postId: Scalars["Int"]["input"];
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GQLArenaPostInContextQuery = {
  __typename?: "Query";
  arenaPostInContext?: {
    __typename?: "ArenaTopicV2";
    posts?: { __typename?: "PaginatedPosts" } & GQLPaginatedPostsFragment;
  } & GQLArenaTopicV2Fragment;
};

export type GQLArenaUsersQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
  filterTeachers?: InputMaybe<Scalars["Boolean"]["input"]>;
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
}>;

export type GQLArenaUsersQuery = {
  __typename?: "Query";
  listArenaUserV2: {
    __typename: "PaginatedArenaUsers";
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<{ __typename?: "ArenaUserV2" } & GQLArenaUserV2Fragment>;
  };
};

export type GQLAiOrganizationsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAiOrganizationsQuery = {
  __typename?: "Query";
  aiEnabledOrgs?: { __typename?: "ConfigMetaStringList"; key: string; value: Array<string> };
};

export type GQLFolderResourceFragmentFragment = {
  __typename: "FolderResource";
  resourceId: string;
  id: string;
  resourceType: string;
  path: string;
  created: string;
  tags: Array<string>;
};

export type GQLFolderFragmentFragment = {
  __typename: "Folder";
  id: string;
  name: string;
  status: string;
  parentId?: string;
  created: string;
  updated: string;
  description?: string;
  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
  owner?: { __typename: "Owner"; name: string };
  resources: Array<{ __typename?: "FolderResource" } & GQLFolderResourceFragmentFragment>;
};

export type GQLSharedFolderFragmentFragment = {
  __typename: "SharedFolder";
  id: string;
  name: string;
  status: string;
  parentId?: string;
  created: string;
  updated: string;
  description?: string;
  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
  owner?: { __typename: "Owner"; name: string };
  resources: Array<{ __typename?: "FolderResource" } & GQLFolderResourceFragmentFragment>;
};

export type GQLDeleteFolderMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GQLDeleteFolderMutation = { __typename?: "Mutation"; deleteFolder: string };

export type GQLFoldersPageQueryFragmentFragment = {
  __typename?: "Folder";
  subfolders: Array<
    {
      __typename?: "Folder";
      subfolders: Array<
        {
          __typename?: "Folder";
          subfolders: Array<
            {
              __typename?: "Folder";
              subfolders: Array<
                {
                  __typename?: "Folder";
                  subfolders: Array<
                    {
                      __typename?: "Folder";
                      subfolders: Array<
                        {
                          __typename?: "Folder";
                          subfolders: Array<
                            {
                              __typename?: "Folder";
                              subfolders: Array<
                                {
                                  __typename?: "Folder";
                                  subfolders: Array<{ __typename?: "Folder" } & GQLFolderFragmentFragment>;
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

export type GQLSharedFoldersPageQueryFragmentFragment = {
  __typename?: "SharedFolder";
  subfolders: Array<
    {
      __typename?: "SharedFolder";
      subfolders: Array<
        {
          __typename?: "SharedFolder";
          subfolders: Array<
            {
              __typename?: "SharedFolder";
              subfolders: Array<
                {
                  __typename?: "SharedFolder";
                  subfolders: Array<
                    {
                      __typename?: "SharedFolder";
                      subfolders: Array<
                        {
                          __typename?: "SharedFolder";
                          subfolders: Array<
                            {
                              __typename?: "SharedFolder";
                              subfolders: Array<
                                {
                                  __typename?: "SharedFolder";
                                  subfolders: Array<{ __typename?: "SharedFolder" } & GQLSharedFolderFragmentFragment>;
                                } & GQLSharedFolderFragmentFragment
                              >;
                            } & GQLSharedFolderFragmentFragment
                          >;
                        } & GQLSharedFolderFragmentFragment
                      >;
                    } & GQLSharedFolderFragmentFragment
                  >;
                } & GQLSharedFolderFragmentFragment
              >;
            } & GQLSharedFolderFragmentFragment
          >;
        } & GQLSharedFolderFragmentFragment
      >;
    } & GQLSharedFolderFragmentFragment
  >;
} & GQLSharedFolderFragmentFragment;

export type GQLFoldersPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLFoldersPageQuery = {
  __typename?: "Query";
  folders: Array<{ __typename?: "Folder" } & GQLFoldersPageQueryFragmentFragment>;
};

export type GQLUpdateFolderResourceMutationVariables = Exact<{
  id: Scalars["String"]["input"];
  tags: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type GQLUpdateFolderResourceMutation = {
  __typename?: "Mutation";
  updateFolderResource: { __typename?: "FolderResource" } & GQLFolderResourceFragmentFragment;
};

export type GQLAddFolderMutationVariables = Exact<{
  name: Scalars["String"]["input"];
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLAddFolderMutation = {
  __typename?: "Mutation";
  addFolder: { __typename?: "Folder" } & GQLFoldersPageQueryFragmentFragment;
};

export type GQLUpdateFolderMutationVariables = Exact<{
  id: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLUpdateFolderMutation = {
  __typename?: "Mutation";
  updateFolder: { __typename?: "Folder" } & GQLFoldersPageQueryFragmentFragment;
};

export type GQLSortFoldersMutationVariables = Exact<{
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  sortedIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type GQLSortFoldersMutation = {
  __typename?: "Mutation";
  sortFolders: { __typename?: "SortResult"; parentId?: string; sortedIds: Array<string> };
};

export type GQLSortResourcesMutationVariables = Exact<{
  parentId: Scalars["String"]["input"];
  sortedIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type GQLSortResourcesMutation = {
  __typename?: "Mutation";
  sortResources: { __typename?: "SortResult"; parentId?: string; sortedIds: Array<string> };
};

export type GQLUpdateFolderStatusMutationVariables = Exact<{
  folderId: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
}>;

export type GQLUpdateFolderStatusMutation = { __typename?: "Mutation"; updateFolderStatus: Array<string> };

export type GQLCopySharedFolderMutationVariables = Exact<{
  folderId: Scalars["String"]["input"];
  destinationFolderId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLCopySharedFolderMutation = {
  __typename?: "Mutation";
  copySharedFolder: {
    __typename?: "Folder";
    subfolders: Array<{ __typename?: "Folder" } & GQLFoldersPageQueryFragmentFragment>;
  } & GQLFolderFragmentFragment;
};

type GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment = {
  __typename: "ArticleFolderResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  resourceTypes: Array<{ __typename?: "FolderResourceResourceType"; id: string; name: string }>;
};

type GQLFolderResourceMeta_AudioFolderResourceMeta_Fragment = {
  __typename: "AudioFolderResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  resourceTypes: Array<{ __typename?: "FolderResourceResourceType"; id: string; name: string }>;
};

type GQLFolderResourceMeta_ConceptFolderResourceMeta_Fragment = {
  __typename: "ConceptFolderResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  resourceTypes: Array<{ __typename?: "FolderResourceResourceType"; id: string; name: string }>;
};

type GQLFolderResourceMeta_ImageFolderResourceMeta_Fragment = {
  __typename: "ImageFolderResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  resourceTypes: Array<{ __typename?: "FolderResourceResourceType"; id: string; name: string }>;
};

type GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment = {
  __typename: "LearningpathFolderResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  resourceTypes: Array<{ __typename?: "FolderResourceResourceType"; id: string; name: string }>;
};

type GQLFolderResourceMeta_VideoFolderResourceMeta_Fragment = {
  __typename: "VideoFolderResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  resourceTypes: Array<{ __typename?: "FolderResourceResourceType"; id: string; name: string }>;
};

export type GQLFolderResourceMetaFragment =
  | GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment
  | GQLFolderResourceMeta_AudioFolderResourceMeta_Fragment
  | GQLFolderResourceMeta_ConceptFolderResourceMeta_Fragment
  | GQLFolderResourceMeta_ImageFolderResourceMeta_Fragment
  | GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment
  | GQLFolderResourceMeta_VideoFolderResourceMeta_Fragment;

export type GQLSharedFolderQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  includeSubfolders?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeResources?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLSharedFolderQuery = {
  __typename?: "Query";
  sharedFolder: { __typename?: "SharedFolder" } & GQLSharedFoldersPageQueryFragmentFragment;
};

export type GQLFolderResourceMetaQueryVariables = Exact<{
  resource: GQLFolderResourceMetaSearchInput;
}>;

export type GQLFolderResourceMetaQuery = {
  __typename?: "Query";
  folderResourceMeta?:
    | ({ __typename?: "ArticleFolderResourceMeta" } & GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment)
    | ({ __typename?: "AudioFolderResourceMeta" } & GQLFolderResourceMeta_AudioFolderResourceMeta_Fragment)
    | ({ __typename?: "ConceptFolderResourceMeta" } & GQLFolderResourceMeta_ConceptFolderResourceMeta_Fragment)
    | ({ __typename?: "ImageFolderResourceMeta" } & GQLFolderResourceMeta_ImageFolderResourceMeta_Fragment)
    | ({
        __typename?: "LearningpathFolderResourceMeta";
      } & GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment)
    | ({ __typename?: "VideoFolderResourceMeta" } & GQLFolderResourceMeta_VideoFolderResourceMeta_Fragment);
};

export type GQLFolderResourceMetaSearchQueryVariables = Exact<{
  resources: Array<GQLFolderResourceMetaSearchInput> | GQLFolderResourceMetaSearchInput;
}>;

export type GQLFolderResourceMetaSearchQuery = {
  __typename?: "Query";
  folderResourceMetaSearch: Array<
    | ({ __typename?: "ArticleFolderResourceMeta" } & GQLFolderResourceMeta_ArticleFolderResourceMeta_Fragment)
    | ({ __typename?: "AudioFolderResourceMeta" } & GQLFolderResourceMeta_AudioFolderResourceMeta_Fragment)
    | ({ __typename?: "ConceptFolderResourceMeta" } & GQLFolderResourceMeta_ConceptFolderResourceMeta_Fragment)
    | ({ __typename?: "ImageFolderResourceMeta" } & GQLFolderResourceMeta_ImageFolderResourceMeta_Fragment)
    | ({
        __typename?: "LearningpathFolderResourceMeta";
      } & GQLFolderResourceMeta_LearningpathFolderResourceMeta_Fragment)
    | ({ __typename?: "VideoFolderResourceMeta" } & GQLFolderResourceMeta_VideoFolderResourceMeta_Fragment)
  >;
};

export type GQLRecentlyUsedQueryVariables = Exact<{ [key: string]: never }>;

export type GQLRecentlyUsedQuery = {
  __typename?: "Query";
  allFolderResources: Array<{
    __typename?: "FolderResource";
    id: string;
    resourceId: string;
    path: string;
    tags: Array<string>;
    resourceType: string;
    created: string;
  }>;
};

export type GQLAddResourceToFolderMutationVariables = Exact<{
  resourceId: Scalars["String"]["input"];
  folderId: Scalars["String"]["input"];
  resourceType: Scalars["String"]["input"];
  path: Scalars["String"]["input"];
  tags?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type GQLAddResourceToFolderMutation = {
  __typename?: "Mutation";
  addFolderResource: { __typename?: "FolderResource" } & GQLFolderResourceFragmentFragment;
};

export type GQLDeleteFolderResourceMutationVariables = Exact<{
  folderId: Scalars["String"]["input"];
  resourceId: Scalars["String"]["input"];
}>;

export type GQLDeleteFolderResourceMutation = { __typename?: "Mutation"; deleteFolderResource: string };

export type GQLNewFlagMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
  reason: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
}>;

export type GQLNewFlagMutation = { __typename?: "Mutation"; newFlag: number };

export type GQLReplyToTopicMutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
}>;

export type GQLReplyToTopicMutation = {
  __typename?: "Mutation";
  replyToTopic: { __typename?: "ArenaPost" } & GQLArenaPostFragment;
};

export type GQLUpdatePostMutationVariables = Exact<{
  postId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
  title?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLUpdatePostMutation = {
  __typename?: "Mutation";
  updatePost: { __typename?: "ArenaPost" } & GQLArenaPostFragment;
};

export type GQLDeletePostMutationVariables = Exact<{
  postId: Scalars["Int"]["input"];
}>;

export type GQLDeletePostMutation = { __typename?: "Mutation"; deletePost: number };

export type GQLDeleteTopicMutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
}>;

export type GQLDeleteTopicMutation = { __typename?: "Mutation"; deleteTopic: number };

export type GQLNewArenaTopicMutationVariables = Exact<{
  categoryId: Scalars["Int"]["input"];
  content: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
}>;

export type GQLNewArenaTopicMutation = {
  __typename?: "Mutation";
  newArenaTopic: { __typename?: "ArenaTopic" } & GQLArenaTopicFragment;
};

export type GQLMarkNotificationAsReadMutationVariables = Exact<{
  topicIds: Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"];
}>;

export type GQLMarkNotificationAsReadMutation = { __typename?: "Mutation"; markNotificationAsRead: Array<number> };

export type GQLSubscribeToTopicMutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
}>;

export type GQLSubscribeToTopicMutation = { __typename?: "Mutation"; subscribeToTopic: number };

export type GQLUnsubscribeFromTopicMutationVariables = Exact<{
  topicId: Scalars["Int"]["input"];
}>;

export type GQLUnsubscribeFromTopicMutation = { __typename?: "Mutation"; unsubscribeFromTopic: number };

export type GQLArenaUserFragment = {
  __typename?: "ArenaUser";
  displayName: string;
  id: number;
  profilePicture?: string;
  slug: string;
  groupTitleArray?: Array<string>;
  location?: string;
  username: string;
};

export type GQLArenaCategoriesFragment = {
  __typename: "ArenaCategory";
  description: string;
  disabled: boolean;
  htmlDescription: string;
  id: number;
  name: string;
  topicCount: number;
  slug: string;
};

export type GQLArenaCategoryFragment = {
  __typename: "ArenaCategory";
  description: string;
  disabled: boolean;
  htmlDescription: string;
  id: number;
  name: string;
  topicCount: number;
  slug: string;
};

export type GQLArenaTopicFragment = {
  __typename: "ArenaTopic";
  categoryId: number;
  id: number;
  locked: boolean;
  postCount: number;
  slug: string;
  timestamp: string;
  title: string;
  deleted: boolean;
  isFollowing?: boolean;
};

export type GQLArenaPostFragment = {
  __typename: "ArenaPost";
  content: string;
  id: number;
  timestamp: string;
  topicId: number;
  isMainPost: boolean;
  deleted: boolean;
  user: { __typename?: "ArenaUser"; displayName: string; profilePicture?: string; username: string; location?: string };
};

export type GQLArenaUserQueryVariables = Exact<{
  username: Scalars["String"]["input"];
}>;

export type GQLArenaUserQuery = {
  __typename?: "Query";
  arenaUser?: { __typename?: "ArenaUser" } & GQLArenaUserFragment;
};

export type GQLArenaPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLArenaPageQuery = {
  __typename?: "Query";
  arenaCategories: Array<{ __typename?: "ArenaCategory" } & GQLArenaCategoriesFragment>;
};

export type GQLArenaCategoryQueryVariables = Exact<{
  categoryId: Scalars["Int"]["input"];
  page: Scalars["Int"]["input"];
}>;

export type GQLArenaCategoryQuery = {
  __typename?: "Query";
  arenaCategory?: {
    __typename?: "ArenaCategory";
    topicCount: number;
    topics?: Array<{ __typename?: "ArenaTopic" } & GQLArenaTopicFragment>;
  } & GQLArenaCategoryFragment;
};

export type GQLArenaTopicByIdQueryVariables = Exact<{
  topicId: Scalars["Int"]["input"];
  page: Scalars["Int"]["input"];
}>;

export type GQLArenaTopicByIdQuery = {
  __typename?: "Query";
  arenaTopic?: {
    __typename?: "ArenaTopic";
    posts: Array<{ __typename?: "ArenaPost" } & GQLArenaPostFragment>;
  } & GQLArenaTopicFragment;
};

export type GQLArenaTopicsByUserQueryVariables = Exact<{
  userSlug: Scalars["String"]["input"];
}>;

export type GQLArenaTopicsByUserQuery = {
  __typename?: "Query";
  arenaTopicsByUser: Array<{ __typename?: "ArenaTopic" } & GQLArenaTopicFragment>;
};

export type GQLArenaRecentTopicsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLArenaRecentTopicsQuery = {
  __typename?: "Query";
  arenaRecentTopics: Array<{ __typename?: "ArenaTopic" } & GQLArenaTopicFragment>;
};

export type GQLArenaNotificationFragment = {
  __typename: "ArenaNotification";
  bodyShort: string;
  datetimeISO: string;
  from: number;
  importance: number;
  path: string;
  read: boolean;
  topicId: number;
  postId: number;
  notificationId: string;
  topicTitle: string;
  subject: string;
  type: string;
  user: { __typename?: "ArenaUser"; displayName: string; id: number; slug: string };
};

export type GQLArenaNotificationsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLArenaNotificationsQuery = {
  __typename?: "Query";
  arenaNotifications: Array<{ __typename?: "ArenaNotification" } & GQLArenaNotificationFragment>;
};

export type GQLMySubjectsSubjectFragmentFragment = {
  __typename?: "Subject";
  id: string;
  name: string;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
};

export type GQLAllSubjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAllSubjectsQuery = {
  __typename?: "Query";
  subjects?: Array<{ __typename?: "Subject" } & GQLMySubjectsSubjectFragmentFragment>;
};

export type GQLDeletePersonalDataMutationVariables = Exact<{ [key: string]: never }>;

export type GQLDeletePersonalDataMutation = { __typename?: "Mutation"; deletePersonalData: boolean };

export type GQLMySubjectMyNdlaPersonalDataFragmentFragment = {
  __typename?: "MyNdlaPersonalData";
  id: number;
  favoriteSubjects: Array<string>;
  role: string;
  arenaEnabled: boolean;
  shareName: boolean;
};

export type GQLUpdatePersonalDataMutationVariables = Exact<{
  favoriteSubjects?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  shareName?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLUpdatePersonalDataMutation = {
  __typename?: "Mutation";
  updatePersonalData: { __typename?: "MyNdlaPersonalData" } & GQLMySubjectMyNdlaPersonalDataFragmentFragment;
};

export type GQLPlainArticleContainer_ArticleFragment = {
  __typename?: "Article";
  created: string;
  tags?: Array<string>;
} & GQLArticle_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLPlainArticlePageQueryVariables = Exact<{
  articleId: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLPlainArticlePageQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article" } & GQLPlainArticleContainer_ArticleFragment;
};

export type GQLPlainLearningpathContainer_LearningpathFragment = {
  __typename?: "Learningpath";
  supportedLanguages: Array<string>;
  tags: Array<string>;
  description: string;
  coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string };
  learningsteps: Array<{ __typename?: "LearningpathStep" } & GQLLearningpath_LearningpathStepFragment>;
} & GQLLearningpath_LearningpathFragment;

export type GQLPlainLearningpathPageQueryVariables = Exact<{
  pathId: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLPlainLearningpathPageQuery = {
  __typename?: "Query";
  learningpath?: { __typename?: "Learningpath" } & GQLPlainLearningpathContainer_LearningpathFragment;
};

export type GQLPodcastSeries_PodcastSeriesSummaryFragment = {
  __typename?: "PodcastSeriesSummary";
  id: number;
  title: { __typename?: "Title"; title: string };
  description: { __typename?: "Description"; description: string };
  coverPhoto: { __typename?: "CoverPhoto"; url: string; altText: string };
};

export type GQLPodcastSeriesListPageQueryVariables = Exact<{
  page: Scalars["Int"]["input"];
  pageSize: Scalars["Int"]["input"];
  fallback?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLPodcastSeriesListPageQuery = {
  __typename?: "Query";
  podcastSeriesSearch?: {
    __typename?: "PodcastSeriesSearch";
    totalCount: number;
    results: Array<{ __typename?: "PodcastSeriesSummary" } & GQLPodcastSeries_PodcastSeriesSummaryFragment>;
  };
};

export type GQLPodcastSeriesPageQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GQLPodcastSeriesPageQuery = {
  __typename?: "Query";
  podcastSeries?: {
    __typename?: "PodcastSeriesWithEpisodes";
    id: number;
    supportedLanguages: Array<string>;
    hasRSS: boolean;
    title: { __typename?: "Title"; title: string };
    description: { __typename?: "Description"; description: string };
    coverPhoto: { __typename?: "CoverPhoto"; url: string; altText: string };
    content?: {
      __typename?: "ResourceEmbed";
      content: string;
      meta: { __typename?: "ResourceMetaData" } & GQLResourceEmbedLicenseBox_MetaFragment;
    };
    episodes?: Array<{
      __typename?: "Audio";
      id: number;
      title: { __typename?: "Title"; title: string };
      audioFile: { __typename?: "AudioFile"; url: string };
      podcastMeta?: { __typename?: "PodcastMeta"; introduction: string };
      copyright: { __typename?: "Copyright" } & GQLCopyrightInfoFragment;
      tags: { __typename?: "Tags"; tags: Array<string> };
    }>;
  };
};

export type GQLProgrammePageQueryVariables = Exact<{
  path: Scalars["String"]["input"];
}>;

export type GQLProgrammePageQuery = {
  __typename?: "Query";
  programme?: {
    __typename?: "ProgrammePage";
    metaDescription?: string;
    grades?: Array<{
      __typename?: "Grade";
      id: string;
      url: string;
      title: { __typename?: "Title"; title: string };
      categories?: Array<{
        __typename?: "Category";
        id: string;
        isProgrammeSubject: boolean;
        title: { __typename?: "Title"; title: string };
        subjects?: Array<{ __typename?: "Subject" } & GQLSubjectInfoFragment>;
      }>;
    }>;
  } & GQLProgrammeFragmentFragment;
};

export type GQLResourceEmbedQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
}>;

export type GQLResourceEmbedQuery = {
  __typename?: "Query";
  resourceEmbed: {
    __typename?: "ResourceEmbed";
    content: string;
    meta: { __typename?: "ResourceMetaData" } & GQLResourceEmbedLicenseBox_MetaFragment;
  };
};

export type GQLResourceEmbedLicenseBox_MetaFragment = {
  __typename?: "ResourceMetaData";
  concepts?: Array<
    {
      __typename?: "ConceptLicense";
      content?: string;
      metaImageUrl?: string;
    } & GQLConceptLicenseList_ConceptLicenseFragment
  >;
  glosses?: Array<
    { __typename?: "GlossLicense"; content?: string; metaImageUrl?: string } & GQLGlossLicenseList_GlossLicenseFragment
  >;
  h5ps?: Array<{ __typename?: "H5pLicense" } & GQLH5pLicenseList_H5pLicenseFragment>;
  brightcoves?: Array<
    { __typename?: "BrightcoveLicense"; description?: string } & GQLVideoLicenseList_BrightcoveLicenseFragment
  >;
  audios?: Array<{ __typename?: "AudioLicense" } & GQLAudioLicenseList_AudioLicenseFragment>;
  podcasts?: Array<
    { __typename?: "PodcastLicense"; coverPhotoUrl?: string } & GQLPodcastLicenseList_PodcastLicenseFragment
  >;
  images?: Array<{ __typename?: "ImageLicense"; altText: string } & GQLImageLicenseList_ImageLicenseFragment>;
};

export type GQLResourcePageQueryVariables = Exact<{
  topicId: Scalars["String"]["input"];
  subjectId: Scalars["String"]["input"];
  resourceId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLResourcePageQuery = {
  __typename?: "Query";
  subject?: { __typename?: "Subject" } & GQLLearningpathPage_SubjectFragment & GQLArticlePage_SubjectFragment;
  resourceTypes?: Array<
    { __typename?: "ResourceTypeDefinition" } & GQLArticlePage_ResourceTypeFragment &
      GQLLearningpathPage_ResourceTypeDefinitionFragment
  >;
  topic?: { __typename?: "Topic" } & GQLLearningpathPage_TopicFragment & GQLArticlePage_TopicFragment;
  resource?: {
    __typename?: "Resource";
    relevanceId?: string;
    paths: Array<string>;
    contexts: Array<{
      __typename?: "TaxonomyContext";
      breadcrumbs: Array<string>;
      parentIds: Array<string>;
      path: string;
    }>;
  } & GQLMovedResourcePage_ResourceFragment &
    GQLArticlePage_ResourceFragment &
    GQLLearningpathPage_ResourceFragment;
};

export type GQLResources_ResourceFragment = {
  __typename?: "Resource";
  id: string;
  name: string;
  contentUri?: string;
  path: string;
  paths: Array<string>;
  rank?: number;
  language?: string;
  resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
};

export type GQLResources_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
  id: string;
  name: string;
};

export type GQLResources_TopicFragment = {
  __typename?: "Topic";
  name: string;
  coreResources?: Array<{ __typename?: "Resource" } & GQLResources_ResourceFragment>;
  supplementaryResources?: Array<{ __typename?: "Resource" } & GQLResources_ResourceFragment>;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
};

export type GQLSharedResourceArticlePageQueryVariables = Exact<{
  articleId: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLSharedResourceArticlePageQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article" } & GQLSharedResourceArticleContainer_ArticleFragment;
};

export type GQLSharedResourceArticleContainer_ArticleFragment = {
  __typename?: "Article";
  created: string;
  tags?: Array<string>;
} & GQLArticle_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLSubjectContainer_SubjectFragment = {
  __typename?: "Subject";
  supportedLanguages: Array<string>;
  grepCodes?: Array<string>;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  subjectpage?: {
    __typename?: "SubjectPage";
    metaDescription?: string;
    about?: {
      __typename?: "SubjectPageAbout";
      title: string;
      visualElement: { __typename?: "SubjectPageVisualElement"; url: string };
    };
    banner: { __typename?: "SubjectPageBanner"; desktopUrl: string };
  } & GQLSubjectLinks_SubjectFragment;
} & GQLSubjectPageContent_SubjectFragment;

export type GQLSubjectPageTestQueryVariables = Exact<{
  subjectId: Scalars["String"]["input"];
  topicId: Scalars["String"]["input"];
  includeTopic: Scalars["Boolean"]["input"];
  metadataFilterKey?: InputMaybe<Scalars["String"]["input"]>;
  metadataFilterValue?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLSubjectPageTestQuery = {
  __typename?: "Query";
  subject?: { __typename?: "Subject" } & GQLSubjectContainer_SubjectFragment;
  topic?: { __typename?: "Topic"; alternateTopics?: Array<{ __typename?: "Topic" } & GQLMovedTopicPage_TopicFragment> };
  subjects?: Array<{
    __typename?: "Subject";
    path: string;
    metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  }>;
};

export type GQLMovedTopicPage_TopicFragment = {
  __typename?: "Topic";
  id: string;
  path: string;
  name: string;
  meta?: {
    __typename?: "Meta";
    metaDescription?: string;
    metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  };
  contexts: Array<{ __typename?: "TaxonomyContext"; breadcrumbs: Array<string> }>;
};

export type GQLSubjectLinks_SubjectFragment = {
  __typename?: "SubjectPage";
  buildsOn: Array<{ __typename?: "SubjectLink"; name?: string; path?: string }>;
  connectedTo: Array<{ __typename?: "SubjectLink"; name?: string; path?: string }>;
  leadsTo: Array<{ __typename?: "SubjectLink"; name?: string; path?: string }>;
};

export type GQLSubjectPageContent_SubjectFragment = {
  __typename?: "Subject";
  topics?: Array<{ __typename?: "Topic"; name: string; id: string; availability?: string; relevanceId?: string }>;
} & GQLTopicWrapper_SubjectFragment;

export type GQLTopic_SubjectFragment = { __typename?: "Subject"; id: string; name: string };

export type GQLTopic_TopicFragment = {
  __typename?: "Topic";
  id: string;
  path: string;
  name: string;
  relevanceId?: string;
  supportedLanguages: Array<string>;
  subtopics?: Array<{ __typename?: "Topic"; id: string; name: string; relevanceId?: string }>;
  meta?: { __typename?: "Meta"; metaDescription?: string; metaImage?: { __typename?: "MetaImage"; url: string } };
  contexts: Array<{
    __typename?: "TaxonomyContext";
    breadcrumbs: Array<string>;
    parentIds: Array<string>;
    path: string;
  }>;
  article?: {
    __typename?: "Article";
    oembed?: string;
    revisionDate?: string;
    metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
    transformedContent: {
      __typename?: "TransformedArticleContent";
      visualElementEmbed?: {
        __typename?: "ResourceEmbed";
        content: string;
        meta: { __typename?: "ResourceMetaData" } & GQLTopicVisualElementContent_MetaFragment;
      };
    };
  } & GQLArticleContents_ArticleFragment;
} & GQLResources_TopicFragment;

export type GQLTopic_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLTopicVisualElementContent_MetaFragment = {
  __typename?: "ResourceMetaData";
} & GQLResourceEmbedLicenseBox_MetaFragment;

export type GQLTopicWrapperQueryVariables = Exact<{
  topicId: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLTopicWrapperQuery = {
  __typename?: "Query";
  topic?: { __typename?: "Topic"; id: string } & GQLTopic_TopicFragment;
  resourceTypes?: Array<{ __typename?: "ResourceTypeDefinition" } & GQLTopic_ResourceTypeDefinitionFragment>;
};

export type GQLTopicWrapper_SubjectFragment = { __typename?: "Subject" } & GQLTopic_SubjectFragment;

export type GQLToolboxSubjectContainer_SubjectFragment = {
  __typename?: "Subject";
  topics?: Array<{ __typename?: "Topic"; name: string; id: string }>;
  subjectpage?: {
    __typename?: "SubjectPage";
    metaDescription?: string;
    about?: {
      __typename?: "SubjectPageAbout";
      title: string;
      description: string;
      visualElement: { __typename?: "SubjectPageVisualElement"; url: string };
    };
    banner: { __typename?: "SubjectPageBanner"; desktopUrl: string };
  };
} & GQLToolboxTopicContainer_SubjectFragment;

export type GQLToolboxSubjectPageQueryVariables = Exact<{
  subjectId: Scalars["String"]["input"];
}>;

export type GQLToolboxSubjectPageQuery = {
  __typename?: "Query";
  subject?: { __typename?: "Subject" } & GQLToolboxSubjectContainer_SubjectFragment;
};

export type GQLToolboxTopicContainerQueryVariables = Exact<{
  topicId: Scalars["String"]["input"];
  subjectId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLToolboxTopicContainerQuery = {
  __typename?: "Query";
  topic?: { __typename?: "Topic"; id: string } & GQLToolboxTopicWrapper_TopicFragment;
  resourceTypes?: Array<
    { __typename?: "ResourceTypeDefinition" } & GQLToolboxTopicWrapper_ResourceTypeDefinitionFragment
  >;
};

export type GQLToolboxTopicContainer_SubjectFragment = {
  __typename?: "Subject";
} & GQLToolboxTopicWrapper_SubjectFragment;

export type GQLToolboxTopicWrapper_SubjectFragment = { __typename?: "Subject"; id: string; name: string };

export type GQLToolboxTopicWrapper_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
  id: string;
  name: string;
};

export type GQLToolboxTopicWrapper_TopicFragment = {
  __typename?: "Topic";
  id: string;
  name: string;
  path: string;
  contexts: Array<{
    __typename?: "TaxonomyContext";
    breadcrumbs: Array<string>;
    parentIds: Array<string>;
    path: string;
  }>;
  meta?: {
    __typename?: "Meta";
    metaDescription?: string;
    introduction?: string;
    title: string;
    metaImage?: { __typename?: "MetaImage"; url: string };
  };
  article?: {
    __typename?: "Article";
    title: string;
    introduction?: string;
    copyright: {
      __typename?: "Copyright";
      license: { __typename?: "License"; license: string };
      creators: Array<{ __typename?: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename?: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename?: "Contributor"; name: string; type: string }>;
    };
    metaImage?: { __typename?: "MetaImage"; alt: string; url: string };
    transformedContent: {
      __typename?: "TransformedArticleContent";
      visualElementEmbed?: {
        __typename?: "ResourceEmbed";
        content: string;
        meta: { __typename?: "ResourceMetaData" } & GQLTopicVisualElementContent_MetaFragment;
      };
    };
  };
  subtopics?: Array<{ __typename?: "Topic"; id: string; name: string; path: string }>;
} & GQLResources_TopicFragment;

export type GQLProgrammeFragmentFragment = {
  __typename?: "ProgrammePage";
  id: string;
  url: string;
  title: { __typename?: "Title"; title: string; language: string };
  desktopImage?: { __typename?: "MetaImage"; url: string; alt: string };
  mobileImage?: { __typename?: "MetaImage"; url: string; alt: string };
};

export type GQLFrontpageDataQueryVariables = Exact<{
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLFrontpageDataQuery = {
  __typename?: "Query";
  programmes?: Array<{ __typename?: "ProgrammePage" } & GQLProgrammeFragmentFragment>;
  frontpage?: {
    __typename?: "FrontpageMenu";
    articleId: number;
    article: {
      __typename?: "Article";
      id: number;
      introduction?: string;
      created: string;
      updated: string;
      published: string;
      transformedContent: {
        __typename?: "TransformedArticleContent";
        content: string;
        metaData?: { __typename?: "ArticleMetaData"; copyText?: string };
      };
    } & GQLLicenseBox_ArticleFragment &
      GQLStructuredArticleDataFragment;
  };
};

export type GQLIframeArticlePage_ArticleFragment = {
  __typename?: "Article";
  articleType: string;
  created: string;
  updated: string;
  metaDescription: string;
  oembed?: string;
  tags?: Array<string>;
  metaImage?: { __typename?: "MetaImage"; url: string };
} & GQLArticle_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLIframeArticlePage_ResourceFragment = {
  __typename?: "Resource";
  id: string;
  path: string;
  resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
};

export type GQLIframePageQueryVariables = Exact<{
  articleId: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  taxonomyId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLIframePageQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article" } & GQLIframeArticlePage_ArticleFragment;
  articleResource?: { __typename?: "Resource" } & GQLIframeArticlePage_ResourceFragment;
};

export type GQLContributorInfoFragment = { __typename?: "Contributor"; name: string; type: string };

export type GQLSearchFilmArticleSearchResultFragment = {
  __typename?: "ArticleSearchResult";
  id: number;
  url: string;
  metaDescription: string;
  title: string;
  supportedLanguages: Array<string>;
  traits: Array<string>;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  contexts: Array<{
    __typename?: "SearchContext";
    breadcrumbs: Array<string>;
    relevance: string;
    relevanceId: string;
    language: string;
    contextType: string;
    path: string;
    root: string;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string; language: string }>;
  }>;
};

export type GQLSearchFilmLearningpathSearchResultFragment = {
  __typename?: "LearningpathSearchResult";
  id: number;
  url: string;
  metaDescription: string;
  title: string;
  supportedLanguages: Array<string>;
  traits: Array<string>;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  contexts: Array<{
    __typename?: "SearchContext";
    breadcrumbs: Array<string>;
    relevance: string;
    relevanceId: string;
    language: string;
    contextType: string;
    path: string;
    root: string;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string; language: string }>;
  }>;
};

export type GQLSearchWithoutPaginationQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  contextFilters?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
  languageFilter?: InputMaybe<Scalars["String"]["input"]>;
  relevance?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLSearchWithoutPaginationQuery = {
  __typename?: "Query";
  searchWithoutPagination?: {
    __typename?: "SearchWithoutPagination";
    results: Array<
      | ({ __typename?: "ArticleSearchResult" } & GQLSearchFilmArticleSearchResultFragment)
      | ({ __typename?: "LearningpathSearchResult" } & GQLSearchFilmLearningpathSearchResultFragment)
    >;
  };
};

export type GQLGroupSearchResourceFragment = {
  __typename?: "GroupSearchResult";
  id: number;
  path: string;
  name: string;
  ingress: string;
  traits: Array<string>;
  contexts: Array<{
    __typename?: "SearchContext";
    language: string;
    path: string;
    breadcrumbs: Array<string>;
    rootId: string;
    root: string;
    relevance: string;
    relevanceId: string;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
  }>;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
};

export type GQLGroupSearchQueryVariables = Exact<{
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  grepCodes?: InputMaybe<Scalars["String"]["input"]>;
  aggregatePaths?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  grepCodesList?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>> | InputMaybe<Scalars["String"]["input"]>>;
  filterInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLGroupSearchQuery = {
  __typename?: "Query";
  groupSearch?: Array<{
    __typename?: "GroupSearch";
    resourceType: string;
    totalCount: number;
    language: string;
    resources: Array<{ __typename?: "GroupSearchResult" } & GQLGroupSearchResourceFragment>;
    aggregations: Array<{
      __typename?: "AggregationResult";
      values: Array<{ __typename?: "BucketResult"; value: string }>;
    }>;
    suggestions: Array<{
      __typename?: "SuggestionResult";
      suggestions: Array<{
        __typename?: "SearchSuggestion";
        options: Array<{ __typename?: "SuggestOption"; text: string }>;
      }>;
    }>;
  }>;
  competenceGoals?: Array<{
    __typename?: "CompetenceGoal";
    id: string;
    type: string;
    name: string;
    curriculum?: { __typename?: "Reference"; id: string; title: string };
    competenceGoalSet?: { __typename?: "Reference"; id: string; title: string };
  }>;
  coreElements?: Array<{ __typename?: "CoreElement"; id: string; title: string; text?: string }>;
};

export type GQLCopyrightInfoFragment = {
  __typename?: "Copyright";
  origin?: string;
  license: { __typename?: "License"; license: string; url?: string; description?: string };
  creators: Array<{ __typename?: "Contributor" } & GQLContributorInfoFragment>;
  processors: Array<{ __typename?: "Contributor" } & GQLContributorInfoFragment>;
  rightsholders: Array<{ __typename?: "Contributor" } & GQLContributorInfoFragment>;
};

export type GQLSubjectInfoFragment = {
  __typename?: "Subject";
  id: string;
  name: string;
  path: string;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  subjectpage?: {
    __typename?: "SubjectPage";
    about?: { __typename?: "SubjectPageAbout"; title: string };
    banner: { __typename?: "SubjectPageBanner"; desktopUrl: string };
  };
};

export type GQLSearchPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSearchPageQuery = {
  __typename?: "Query";
  subjects?: Array<{ __typename?: "Subject" } & GQLSubjectInfoFragment>;
  resourceTypes?: Array<{
    __typename?: "ResourceTypeDefinition";
    id: string;
    name: string;
    subtypes?: Array<{ __typename?: "ResourceTypeDefinition"; id: string; name: string }>;
  }>;
};

export type GQLMovedResourceQueryVariables = Exact<{
  resourceId: Scalars["String"]["input"];
}>;

export type GQLMovedResourceQuery = {
  __typename?: "Query";
  resource?: {
    __typename?: "Resource";
    contexts: Array<{ __typename?: "TaxonomyContext"; path: string; breadcrumbs: Array<string> }>;
  };
};

export type GQLCompetenceGoalsQueryVariables = Exact<{
  codes?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  language?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLCompetenceGoalsQuery = {
  __typename?: "Query";
  competenceGoals?: Array<{
    __typename?: "CompetenceGoal";
    id: string;
    type: string;
    name: string;
    curriculum?: { __typename?: "Reference"; id: string; title: string };
    competenceGoalSet?: { __typename?: "Reference"; id: string; title: string };
  }>;
  coreElements?: Array<{
    __typename?: "CoreElement";
    id: string;
    name: string;
    text?: string;
    curriculum?: { __typename?: "Reference"; id: string; title: string };
  }>;
};

export type GQLMovieInfoFragment = {
  __typename?: "Movie";
  id: string;
  title: string;
  metaDescription: string;
  path: string;
  metaImage?: { __typename?: "MetaImage"; alt: string; url: string };
  resourceTypes: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
};

export type GQLAlertsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAlertsQuery = {
  __typename?: "Query";
  alerts?: Array<{ __typename?: "UptimeAlert"; title: string; body?: string; closable: boolean; number: number }>;
};

export type GQLEmbedOembedQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
}>;

export type GQLEmbedOembedQuery = {
  __typename?: "Query";
  resourceEmbed: {
    __typename?: "ResourceEmbed";
    meta: {
      __typename?: "ResourceMetaData";
      images?: Array<{ __typename?: "ImageLicense"; title: string }>;
      concepts?: Array<{ __typename?: "ConceptLicense"; title: string }>;
      audios?: Array<{ __typename?: "AudioLicense"; title: string }>;
      podcasts?: Array<{ __typename?: "PodcastLicense"; title: string }>;
      brightcoves?: Array<{ __typename?: "BrightcoveLicense"; title: string }>;
    };
  };
};

export type GQLPodcastSeriesQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GQLPodcastSeriesQuery = {
  __typename?: "Query";
  podcastSeries?: {
    __typename?: "PodcastSeriesWithEpisodes";
    id: number;
    supportedLanguages: Array<string>;
    hasRSS: boolean;
    title: { __typename?: "Title"; title: string; language: string };
    description: { __typename?: "Description"; description: string };
    image: { __typename?: "ImageMetaInformation"; imageUrl: string };
    coverPhoto: { __typename?: "CoverPhoto"; url: string };
    content?: { __typename?: "ResourceEmbed"; content: string };
    episodes?: Array<{
      __typename?: "Audio";
      id: number;
      created: string;
      title: { __typename?: "Title"; title: string };
      audioFile: { __typename?: "AudioFile"; url: string; fileSize: number; mimeType: string };
      podcastMeta?: {
        __typename?: "PodcastMeta";
        introduction: string;
        image?: { __typename?: "ImageMetaInformation"; imageUrl: string };
      };
      copyright: {
        __typename?: "Copyright";
        origin?: string;
        license: { __typename?: "License"; license: string; url?: string; description?: string };
        creators: Array<{ __typename?: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename?: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename?: "Contributor"; name: string; type: string }>;
      };
      tags: { __typename?: "Tags"; tags: Array<string> };
    }>;
  };
};

export type GQLStructuredArticleData_CopyrightFragment = {
  __typename?: "Copyright";
  processed?: boolean;
  license: { __typename?: "License"; url?: string; license: string };
  creators: Array<{ __typename?: "Contributor"; name: string; type: string }>;
  processors: Array<{ __typename?: "Contributor"; name: string; type: string }>;
  rightsholders: Array<{ __typename?: "Contributor"; name: string; type: string }>;
};

export type GQLStructuredArticleData_ImageLicenseFragment = {
  __typename?: "ImageLicense";
  src: string;
  title: string;
  copyright: { __typename?: "Copyright" } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleData_AudioLicenseFragment = {
  __typename?: "AudioLicense";
  src: string;
  title: string;
  copyright: { __typename?: "Copyright" } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleData_PodcastLicenseFragment = {
  __typename?: "PodcastLicense";
  src: string;
  title: string;
  description?: string;
  copyright: { __typename?: "Copyright" } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleData_BrightcoveLicenseFragment = {
  __typename?: "BrightcoveLicense";
  src?: string;
  title: string;
  cover?: string;
  description?: string;
  download?: string;
  uploadDate?: string;
  copyright?: { __typename?: "Copyright" } & GQLStructuredArticleData_CopyrightFragment;
};

export type GQLStructuredArticleDataFragment = {
  __typename?: "Article";
  id: number;
  title: string;
  metaDescription: string;
  published: string;
  updated: string;
  supportedLanguages?: Array<string>;
  availability?: string;
  copyright: { __typename?: "Copyright" } & GQLStructuredArticleData_CopyrightFragment;
  metaImage?: { __typename?: "MetaImage"; url: string };
  competenceGoals?: Array<{ __typename?: "CompetenceGoal"; id: string; code?: string; title: string; type: string }>;
  coreElements?: Array<{ __typename?: "CoreElement"; id: string; title: string }>;
  transformedContent: {
    __typename?: "TransformedArticleContent";
    metaData?: {
      __typename?: "ArticleMetaData";
      images?: Array<{ __typename?: "ImageLicense" } & GQLStructuredArticleData_ImageLicenseFragment>;
      audios?: Array<{ __typename?: "AudioLicense" } & GQLStructuredArticleData_AudioLicenseFragment>;
      podcasts?: Array<{ __typename?: "PodcastLicense" } & GQLStructuredArticleData_PodcastLicenseFragment>;
      brightcoves?: Array<{ __typename?: "BrightcoveLicense" } & GQLStructuredArticleData_BrightcoveLicenseFragment>;
    };
  };
};

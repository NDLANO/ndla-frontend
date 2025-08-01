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
  metaImage?: Maybe<GQLMetaImageWithCopyright>;
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
  transformedDisclaimer: GQLTransformedArticleContent;
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

export type GQLArticleTransformedDisclaimerArgs = {
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
  context?: Maybe<GQLSearchContext>;
  contexts: Array<GQLSearchContext>;
  htmlTitle: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
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

export type GQLCategoryBreadcrumb = {
  __typename?: "CategoryBreadcrumb";
  id: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
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
  conceptType: Scalars["String"]["output"];
  content: Scalars["String"]["output"];
  copyright?: Maybe<GQLConceptCopyright>;
  created: Scalars["String"]["output"];
  glossData?: Maybe<GQLGloss>;
  htmlTitle: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  source?: Maybe<Scalars["String"]["output"]>;
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
  src?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
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

export type GQLContributorInput = {
  name: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
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
  url?: Maybe<Scalars["String"]["output"]>;
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

export type GQLExternalOpengraph = {
  __typename?: "ExternalOpengraph";
  description?: Maybe<Scalars["String"]["output"]>;
  imageAlt?: Maybe<Scalars["String"]["output"]>;
  imageUrl?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
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
  url?: Maybe<Scalars["String"]["output"]>;
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
  htmlTitle: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  ingress: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  name: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
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

export type GQLImageMetaInformationV3 = {
  __typename?: "ImageMetaInformationV3";
  alttext: GQLImageAltText;
  caption: GQLCaption;
  copyright: GQLCopyright;
  created: Scalars["String"]["output"];
  createdBy: Scalars["String"]["output"];
  editorNotes?: Maybe<Array<GQLEditorNote>>;
  id: Scalars["String"]["output"];
  image: GQLImageV3;
  metaUrl: Scalars["String"]["output"];
  modelRelease: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  tags: GQLTags;
  title: GQLTitle;
};

export type GQLImageSearch = {
  __typename?: "ImageSearch";
  language: Scalars["String"]["output"];
  page: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  results: Array<GQLImageMetaInformationV3>;
  totalCount: Scalars["Int"]["output"];
};

export type GQLImageV3 = {
  __typename?: "ImageV3";
  contentType: Scalars["String"]["output"];
  dimensions?: Maybe<GQLImageDimensions>;
  fileName: Scalars["String"]["output"];
  imageUrl: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
  size: Scalars["Int"]["output"];
};

export type GQLLearningpath = {
  __typename?: "Learningpath";
  basedOn?: Maybe<Scalars["String"]["output"]>;
  canEdit: Scalars["Boolean"]["output"];
  copyright: GQLLearningpathCopyright;
  coverphoto?: Maybe<GQLLearningpathCoverphoto>;
  created: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  duration?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["Int"]["output"];
  isBasedOn?: Maybe<Scalars["Int"]["output"]>;
  isMyNDLAOwner: Scalars["Boolean"]["output"];
  lastUpdated: Scalars["String"]["output"];
  learningstepUrl: Scalars["String"]["output"];
  learningsteps: Array<GQLLearningpathStep>;
  madeAvailable?: Maybe<Scalars["String"]["output"]>;
  metaUrl: Scalars["String"]["output"];
  revision: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  tags: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  verificationStatus: Scalars["String"]["output"];
};

export type GQLLearningpathCopyInput = {
  copyright?: InputMaybe<GQLLearningpathCopyrightInput>;
  coverPhotoMetaUrl?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  language: Scalars["String"]["input"];
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title: Scalars["String"]["input"];
};

export type GQLLearningpathCopyright = {
  __typename?: "LearningpathCopyright";
  contributors: Array<GQLContributor>;
  license: GQLLicense;
};

export type GQLLearningpathCopyrightInput = {
  contributors: Array<GQLContributorInput>;
  license: GQLLicenseInput;
};

export type GQLLearningpathCoverphoto = {
  __typename?: "LearningpathCoverphoto";
  metaUrl: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLLearningpathEmbedInput = {
  embedType: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
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

export type GQLLearningpathNewInput = {
  copyright: GQLLearningpathCopyrightInput;
  coverPhotoMetaUrl?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  introduction?: InputMaybe<Scalars["String"]["input"]>;
  language: Scalars["String"]["input"];
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title: Scalars["String"]["input"];
};

export type GQLLearningpathSearchResult = GQLSearchResult & {
  __typename?: "LearningpathSearchResult";
  context?: Maybe<GQLSearchContext>;
  contexts: Array<GQLSearchContext>;
  htmlTitle: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  traits: Array<Scalars["String"]["output"]>;
  url: Scalars["String"]["output"];
};

export type GQLLearningpathSeqNo = {
  __typename?: "LearningpathSeqNo";
  seqNo: Scalars["Int"]["output"];
};

export type GQLLearningpathStep = {
  __typename?: "LearningpathStep";
  description?: Maybe<Scalars["String"]["output"]>;
  embedUrl?: Maybe<GQLLearningpathStepEmbedUrl>;
  id: Scalars["Int"]["output"];
  introduction?: Maybe<Scalars["String"]["output"]>;
  license?: Maybe<GQLLicense>;
  metaUrl: Scalars["String"]["output"];
  oembed?: Maybe<GQLLearningpathStepOembed>;
  opengraph?: Maybe<GQLExternalOpengraph>;
  resource?: Maybe<GQLResource>;
  revision: Scalars["Int"]["output"];
  seqNo: Scalars["Int"]["output"];
  showTitle: Scalars["Boolean"]["output"];
  status: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLLearningpathStepResourceArgs = {
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  rootId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLLearningpathStepEmbedUrl = {
  __typename?: "LearningpathStepEmbedUrl";
  embedType: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLLearningpathStepNewInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  embedUrl?: InputMaybe<GQLLearningpathEmbedInput>;
  introduction?: InputMaybe<Scalars["String"]["input"]>;
  language: Scalars["String"]["input"];
  license?: InputMaybe<Scalars["String"]["input"]>;
  showTitle: Scalars["Boolean"]["input"];
  title: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type GQLLearningpathStepOembed = {
  __typename?: "LearningpathStepOembed";
  height: Scalars["Int"]["output"];
  html: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
  width: Scalars["Int"]["output"];
};

export type GQLLearningpathStepUpdateInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  embedUrl?: InputMaybe<GQLLearningpathEmbedInput>;
  introduction?: InputMaybe<Scalars["String"]["input"]>;
  language: Scalars["String"]["input"];
  license?: InputMaybe<Scalars["String"]["input"]>;
  revision: Scalars["Int"]["input"];
  showTitle?: InputMaybe<Scalars["Boolean"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLLearningpathUpdateInput = {
  copyright?: InputMaybe<GQLLearningpathCopyrightInput>;
  coverPhotoMetaUrl?: InputMaybe<Scalars["String"]["input"]>;
  deleteMessage?: InputMaybe<Scalars["Boolean"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  language: Scalars["String"]["input"];
  revision: Scalars["Int"]["input"];
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLLicense = {
  __typename?: "License";
  description?: Maybe<Scalars["String"]["output"]>;
  license: Scalars["String"]["output"];
  url?: Maybe<Scalars["String"]["output"]>;
};

export type GQLLicenseInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  license: Scalars["String"]["input"];
  url?: InputMaybe<Scalars["String"]["input"]>;
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

export type GQLMetaImageWithCopyright = {
  __typename?: "MetaImageWithCopyright";
  alt: Scalars["String"]["output"];
  copyright: GQLCopyright;
  url: Scalars["String"]["output"];
};

export type GQLMovie = {
  __typename?: "Movie";
  id: Scalars["String"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  resourceTypes: Array<GQLResourceType>;
  title: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLMovieMeta = {
  __typename?: "MovieMeta";
  metaDescription?: Maybe<Scalars["String"]["output"]>;
  metaImage?: Maybe<GQLMetaImage>;
  title: Scalars["String"]["output"];
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
  copyLearningpath: GQLMyNdlaLearningpath;
  copySharedFolder: GQLFolder;
  deleteFolder: Scalars["String"]["output"];
  deleteFolderResource: Scalars["String"]["output"];
  deleteLearningpath?: Maybe<Scalars["Boolean"]["output"]>;
  deleteLearningpathStep?: Maybe<Scalars["Boolean"]["output"]>;
  deletePersonalData: Scalars["Boolean"]["output"];
  favoriteSharedFolder: Scalars["String"]["output"];
  newLearningpath: GQLMyNdlaLearningpath;
  newLearningpathStep: GQLMyNdlaLearningpathStep;
  sortFolders: GQLSortResult;
  sortResources: GQLSortResult;
  sortSavedSharedFolders: GQLSortResult;
  transformArticleContent: Scalars["String"]["output"];
  unFavoriteSharedFolder: Scalars["String"]["output"];
  updateFolder: GQLFolder;
  updateFolderResource: GQLFolderResource;
  updateFolderStatus: Array<Scalars["String"]["output"]>;
  updateLearningpath: GQLMyNdlaLearningpath;
  updateLearningpathStatus: GQLMyNdlaLearningpath;
  updateLearningpathStep: GQLMyNdlaLearningpathStep;
  updateLearningpathStepSeqNo: GQLLearningpathSeqNo;
  updatePersonalData: GQLMyNdlaPersonalData;
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

export type GQLMutationCopyLearningpathArgs = {
  learningpathId: Scalars["Int"]["input"];
  params: GQLLearningpathCopyInput;
};

export type GQLMutationCopySharedFolderArgs = {
  destinationFolderId?: InputMaybe<Scalars["String"]["input"]>;
  folderId: Scalars["String"]["input"];
};

export type GQLMutationDeleteFolderArgs = {
  id: Scalars["String"]["input"];
};

export type GQLMutationDeleteFolderResourceArgs = {
  folderId: Scalars["String"]["input"];
  resourceId: Scalars["String"]["input"];
};

export type GQLMutationDeleteLearningpathArgs = {
  id: Scalars["Int"]["input"];
};

export type GQLMutationDeleteLearningpathStepArgs = {
  learningpathId: Scalars["Int"]["input"];
  learningstepId: Scalars["Int"]["input"];
};

export type GQLMutationFavoriteSharedFolderArgs = {
  folderId: Scalars["String"]["input"];
};

export type GQLMutationNewLearningpathArgs = {
  params: GQLLearningpathNewInput;
};

export type GQLMutationNewLearningpathStepArgs = {
  learningpathId: Scalars["Int"]["input"];
  params: GQLLearningpathStepNewInput;
};

export type GQLMutationSortFoldersArgs = {
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  sortedIds: Array<Scalars["String"]["input"]>;
};

export type GQLMutationSortResourcesArgs = {
  parentId: Scalars["String"]["input"];
  sortedIds: Array<Scalars["String"]["input"]>;
};

export type GQLMutationSortSavedSharedFoldersArgs = {
  sortedIds: Array<Scalars["String"]["input"]>;
};

export type GQLMutationTransformArticleContentArgs = {
  absoluteUrl?: InputMaybe<Scalars["Boolean"]["input"]>;
  content: Scalars["String"]["input"];
  draftConcept?: InputMaybe<Scalars["Boolean"]["input"]>;
  previewH5p?: InputMaybe<Scalars["Boolean"]["input"]>;
  subject?: InputMaybe<Scalars["String"]["input"]>;
  visualElement?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLMutationUnFavoriteSharedFolderArgs = {
  folderId: Scalars["String"]["input"];
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

export type GQLMutationUpdateLearningpathArgs = {
  learningpathId: Scalars["Int"]["input"];
  params: GQLLearningpathUpdateInput;
};

export type GQLMutationUpdateLearningpathStatusArgs = {
  id: Scalars["Int"]["input"];
  status: Scalars["String"]["input"];
};

export type GQLMutationUpdateLearningpathStepArgs = {
  learningpathId: Scalars["Int"]["input"];
  learningstepId: Scalars["Int"]["input"];
  params: GQLLearningpathStepUpdateInput;
};

export type GQLMutationUpdateLearningpathStepSeqNoArgs = {
  learningpathId: Scalars["Int"]["input"];
  learningpathStepId: Scalars["Int"]["input"];
  seqNo: Scalars["Int"]["input"];
};

export type GQLMutationUpdatePersonalDataArgs = {
  arenaAccepted?: InputMaybe<Scalars["Boolean"]["input"]>;
  favoriteSubjects?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  shareNameAccepted?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLMyNdlaGroup = {
  __typename?: "MyNdlaGroup";
  displayName: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  isPrimarySchool: Scalars["Boolean"]["output"];
  parentId?: Maybe<Scalars["String"]["output"]>;
};

export type GQLMyNdlaLearningpath = {
  __typename?: "MyNdlaLearningpath";
  basedOn?: Maybe<Scalars["String"]["output"]>;
  canEdit: Scalars["Boolean"]["output"];
  copyright: GQLLearningpathCopyright;
  coverphoto?: Maybe<GQLLearningpathCoverphoto>;
  created: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  duration?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["Int"]["output"];
  isBasedOn?: Maybe<Scalars["Int"]["output"]>;
  isMyNDLAOwner: Scalars["Boolean"]["output"];
  lastUpdated: Scalars["String"]["output"];
  learningstepUrl: Scalars["String"]["output"];
  learningsteps: Array<GQLMyNdlaLearningpathStep>;
  madeAvailable?: Maybe<Scalars["String"]["output"]>;
  metaUrl: Scalars["String"]["output"];
  revision: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  tags: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  verificationStatus: Scalars["String"]["output"];
};

export type GQLMyNdlaLearningpathStep = {
  __typename?: "MyNdlaLearningpathStep";
  description?: Maybe<Scalars["String"]["output"]>;
  embedUrl?: Maybe<GQLLearningpathStepEmbedUrl>;
  id: Scalars["Int"]["output"];
  introduction?: Maybe<Scalars["String"]["output"]>;
  license?: Maybe<GQLLicense>;
  metaUrl: Scalars["String"]["output"];
  oembed?: Maybe<GQLLearningpathStepOembed>;
  opengraph?: Maybe<GQLExternalOpengraph>;
  resource?: Maybe<GQLResource>;
  revision: Scalars["Int"]["output"];
  seqNo: Scalars["Int"]["output"];
  showTitle: Scalars["Boolean"]["output"];
  status: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GQLMyNdlaLearningpathStepResourceArgs = {
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  rootId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLMyNdlaPersonalData = {
  __typename?: "MyNdlaPersonalData";
  arenaAccepted: Scalars["Boolean"]["output"];
  arenaEnabled: Scalars["Boolean"]["output"];
  displayName: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  favoriteSubjects: Array<Scalars["String"]["output"]>;
  feideId: Scalars["String"]["output"];
  groups: Array<GQLMyNdlaGroup>;
  id: Scalars["Int"]["output"];
  organization: Scalars["String"]["output"];
  role: Scalars["String"]["output"];
  shareNameAccepted: Scalars["Boolean"]["output"];
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

export type GQLNode = GQLTaxBase &
  GQLTaxonomyEntity &
  GQLWithArticle & {
    __typename?: "Node";
    alternateNodes?: Maybe<Array<GQLNode>>;
    article?: Maybe<GQLArticle>;
    availability?: Maybe<Scalars["String"]["output"]>;
    breadcrumbs: Array<Scalars["String"]["output"]>;
    children?: Maybe<Array<GQLNode>>;
    connectionId?: Maybe<Scalars["String"]["output"]>;
    contentUri?: Maybe<Scalars["String"]["output"]>;
    context?: Maybe<GQLTaxonomyContext>;
    contextId?: Maybe<Scalars["String"]["output"]>;
    contexts: Array<GQLTaxonomyContext>;
    grepCodes?: Maybe<Array<Scalars["String"]["output"]>>;
    id: Scalars["String"]["output"];
    language?: Maybe<Scalars["String"]["output"]>;
    learningpath?: Maybe<GQLLearningpath>;
    meta?: Maybe<GQLMeta>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars["String"]["output"];
    nodeType: Scalars["String"]["output"];
    parentId?: Maybe<Scalars["String"]["output"]>;
    rank?: Maybe<Scalars["Int"]["output"]>;
    relevanceId?: Maybe<Scalars["String"]["output"]>;
    resourceTypes?: Maybe<Array<GQLResourceType>>;
    subjectpage?: Maybe<GQLSubjectPage>;
    supportedLanguages: Array<Scalars["String"]["output"]>;
    url?: Maybe<Scalars["String"]["output"]>;
  };

export type GQLNodeChildrenArgs = {
  nodeType?: InputMaybe<Scalars["String"]["input"]>;
  recursive?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type GQLNodeSearchResult = GQLSearchResult & {
  __typename?: "NodeSearchResult";
  context?: Maybe<GQLSearchContext>;
  contexts: Array<GQLSearchContext>;
  htmlTitle: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  metaDescription: Scalars["String"]["output"];
  metaImage?: Maybe<GQLMetaImage>;
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLOwner = {
  __typename?: "Owner";
  name: Scalars["String"]["output"];
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
  contextId?: Maybe<Scalars["String"]["output"]>;
  desktopImage?: Maybe<GQLMetaImage>;
  grades?: Maybe<Array<GQLGrade>>;
  id: Scalars["String"]["output"];
  metaDescription?: Maybe<Scalars["String"]["output"]>;
  mobileImage?: Maybe<GQLMetaImage>;
  title: GQLTitle;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type GQLQuery = {
  __typename?: "Query";
  aiEnabledOrgs?: Maybe<GQLConfigMetaStringList>;
  alerts?: Maybe<Array<Maybe<GQLUptimeAlert>>>;
  allFolderResources: Array<GQLFolderResource>;
  arenaEnabledOrgs?: Maybe<GQLConfigMetaStringList>;
  article?: Maybe<GQLArticle>;
  articleResource?: Maybe<GQLResource>;
  audio?: Maybe<GQLAudio>;
  competenceGoal?: Maybe<GQLCompetenceGoal>;
  competenceGoals?: Maybe<Array<GQLCompetenceGoal>>;
  coreElement?: Maybe<GQLCoreElement>;
  coreElements?: Maybe<Array<GQLCoreElement>>;
  examLockStatus: GQLConfigMetaBoolean;
  filmfrontpage?: Maybe<GQLFilmFrontpage>;
  folder: GQLFolder;
  folderResourceMeta?: Maybe<GQLFolderResourceMeta>;
  folderResourceMetaSearch: Array<GQLFolderResourceMeta>;
  folders: GQLUserFolder;
  frontpage?: Maybe<GQLFrontpageMenu>;
  groupSearch?: Maybe<Array<GQLGroupSearch>>;
  image?: Maybe<GQLImageMetaInformationV2>;
  imageSearch: GQLImageSearch;
  imageV3?: Maybe<GQLImageMetaInformationV3>;
  learningpath?: Maybe<GQLLearningpath>;
  learningpathStepOembed: GQLLearningpathStepOembed;
  myLearningpaths?: Maybe<Array<GQLMyNdlaLearningpath>>;
  myNdlaLearningpath?: Maybe<GQLMyNdlaLearningpath>;
  node?: Maybe<GQLNode>;
  nodeByArticleId?: Maybe<GQLNode>;
  nodes?: Maybe<Array<GQLNode>>;
  opengraph?: Maybe<GQLExternalOpengraph>;
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
  subjectCollection?: Maybe<Array<GQLSubject>>;
  subjectpage?: Maybe<GQLSubjectPage>;
  subjects?: Maybe<Array<GQLSubject>>;
  topic?: Maybe<GQLTopic>;
  topics?: Maybe<Array<GQLTopic>>;
};

export type GQLQueryAllFolderResourcesArgs = {
  size?: InputMaybe<Scalars["Int"]["input"]>;
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
  license?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryImageArgs = {
  id: Scalars["String"]["input"];
};

export type GQLQueryImageSearchArgs = {
  license?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryImageV3Args = {
  id: Scalars["String"]["input"];
};

export type GQLQueryLearningpathArgs = {
  pathId: Scalars["String"]["input"];
};

export type GQLQueryLearningpathStepOembedArgs = {
  url: Scalars["String"]["input"];
};

export type GQLQueryMyNdlaLearningpathArgs = {
  pathId: Scalars["String"]["input"];
};

export type GQLQueryNodeArgs = {
  contextId?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  rootId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryNodeByArticleIdArgs = {
  articleId?: InputMaybe<Scalars["String"]["input"]>;
  nodeId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryNodesArgs = {
  contentUri?: InputMaybe<Scalars["String"]["input"]>;
  filterVisible?: InputMaybe<Scalars["Boolean"]["input"]>;
  ids?: InputMaybe<Array<Scalars["String"]["input"]>>;
  metadataFilterKey?: InputMaybe<Scalars["String"]["input"]>;
  metadataFilterValue?: InputMaybe<Scalars["String"]["input"]>;
  nodeType?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryOpengraphArgs = {
  url: Scalars["String"]["input"];
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
  contextId?: InputMaybe<Scalars["String"]["input"]>;
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
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  filterInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  grepCodes?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  languageFilter?: InputMaybe<Scalars["String"]["input"]>;
  levels?: InputMaybe<Scalars["String"]["input"]>;
  license?: InputMaybe<Scalars["String"]["input"]>;
  nodeTypes?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  relevance?: InputMaybe<Scalars["String"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  resultTypes?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
  traits?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type GQLQuerySearchWithoutPaginationArgs = {
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  languageFilter?: InputMaybe<Scalars["String"]["input"]>;
  levels?: InputMaybe<Scalars["String"]["input"]>;
  license?: InputMaybe<Scalars["String"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  relevance?: InputMaybe<Scalars["String"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQuerySharedFolderArgs = {
  id: Scalars["String"]["input"];
};

export type GQLQuerySubjectArgs = {
  id: Scalars["String"]["input"];
};

export type GQLQuerySubjectCollectionArgs = {
  language: Scalars["String"]["input"];
};

export type GQLQuerySubjectpageArgs = {
  id: Scalars["Int"]["input"];
};

export type GQLQuerySubjectsArgs = {
  filterVisible?: InputMaybe<Scalars["Boolean"]["input"]>;
  ids?: InputMaybe<Array<Scalars["String"]["input"]>>;
  metadataFilterKey?: InputMaybe<Scalars["String"]["input"]>;
  metadataFilterValue?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryTopicArgs = {
  id: Scalars["String"]["input"];
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GQLQueryTopicsArgs = {
  contentUri: Scalars["String"]["input"];
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

export type GQLResource = GQLTaxBase &
  GQLTaxonomyEntity &
  GQLWithArticle & {
    __typename?: "Resource";
    article?: Maybe<GQLArticle>;
    availability?: Maybe<Scalars["String"]["output"]>;
    breadcrumbs: Array<Scalars["String"]["output"]>;
    contentUri?: Maybe<Scalars["String"]["output"]>;
    context?: Maybe<GQLTaxonomyContext>;
    contextId?: Maybe<Scalars["String"]["output"]>;
    contexts: Array<GQLTaxonomyContext>;
    id: Scalars["String"]["output"];
    language?: Maybe<Scalars["String"]["output"]>;
    learningpath?: Maybe<GQLLearningpath>;
    meta?: Maybe<GQLMeta>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars["String"]["output"];
    nodeType: Scalars["String"]["output"];
    parents?: Maybe<Array<GQLTopic>>;
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
  language: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  publicId: Scalars["String"]["output"];
  relevance: Scalars["String"]["output"];
  relevanceId: Scalars["String"]["output"];
  resourceTypes: Array<GQLSearchContextResourceTypes>;
  root: Scalars["String"]["output"];
  rootId: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLSearchContextResourceTypes = {
  __typename?: "SearchContextResourceTypes";
  id: Scalars["String"]["output"];
  language: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type GQLSearchResult = {
  context?: Maybe<GQLSearchContext>;
  contexts: Array<GQLSearchContext>;
  id: Scalars["String"]["output"];
  metaDescription: Scalars["String"]["output"];
  supportedLanguages: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLSearchResultUnion = GQLArticleSearchResult | GQLLearningpathSearchResult | GQLNodeSearchResult;

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

export type GQLSubject = GQLTaxBase &
  GQLTaxonomyEntity & {
    __typename?: "Subject";
    allTopics?: Maybe<Array<GQLTopic>>;
    breadcrumbs: Array<Scalars["String"]["output"]>;
    contentUri?: Maybe<Scalars["String"]["output"]>;
    context?: Maybe<GQLTaxonomyContext>;
    contextId?: Maybe<Scalars["String"]["output"]>;
    contexts: Array<GQLTaxonomyContext>;
    grepCodes?: Maybe<Array<Scalars["String"]["output"]>>;
    id: Scalars["String"]["output"];
    language?: Maybe<Scalars["String"]["output"]>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars["String"]["output"];
    nodeType: Scalars["String"]["output"];
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
  url?: Maybe<Scalars["String"]["output"]>;
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
  imageLicense?: Maybe<GQLImageLicense>;
  imageUrl?: Maybe<Scalars["String"]["output"]>;
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

export type GQLTaxBase = {
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  url?: Maybe<Scalars["String"]["output"]>;
};

export type GQLTaxonomyContext = {
  __typename?: "TaxonomyContext";
  breadcrumbs: Array<Scalars["String"]["output"]>;
  contextId: Scalars["String"]["output"];
  isActive: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  parentIds: Array<Scalars["String"]["output"]>;
  parents?: Maybe<Array<GQLTaxonomyCrumb>>;
  relevance: Scalars["String"]["output"];
  root: Scalars["String"]["output"];
  rootId: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLTaxonomyCrumb = GQLTaxBase & {
  __typename?: "TaxonomyCrumb";
  contextId: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type GQLTaxonomyEntity = {
  breadcrumbs: Array<Scalars["String"]["output"]>;
  contentUri?: Maybe<Scalars["String"]["output"]>;
  context?: Maybe<GQLTaxonomyContext>;
  contextId?: Maybe<Scalars["String"]["output"]>;
  contexts: Array<GQLTaxonomyContext>;
  id: Scalars["String"]["output"];
  language?: Maybe<Scalars["String"]["output"]>;
  metadata: GQLTaxonomyMetadata;
  name: Scalars["String"]["output"];
  nodeType: Scalars["String"]["output"];
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

export type GQLTopic = GQLTaxBase &
  GQLTaxonomyEntity &
  GQLWithArticle & {
    __typename?: "Topic";
    alternateTopics?: Maybe<Array<GQLTopic>>;
    article?: Maybe<GQLArticle>;
    availability?: Maybe<Scalars["String"]["output"]>;
    breadcrumbs: Array<Scalars["String"]["output"]>;
    contentUri?: Maybe<Scalars["String"]["output"]>;
    context?: Maybe<GQLTaxonomyContext>;
    contextId?: Maybe<Scalars["String"]["output"]>;
    contexts: Array<GQLTaxonomyContext>;
    coreResources?: Maybe<Array<GQLResource>>;
    id: Scalars["String"]["output"];
    isPrimary?: Maybe<Scalars["Boolean"]["output"]>;
    language?: Maybe<Scalars["String"]["output"]>;
    meta?: Maybe<GQLMeta>;
    metadata: GQLTaxonomyMetadata;
    name: Scalars["String"]["output"];
    nodeType: Scalars["String"]["output"];
    parentId?: Maybe<Scalars["String"]["output"]>;
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
  contextId?: InputMaybe<Scalars["String"]["input"]>;
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

export type GQLUserFolder = {
  __typename?: "UserFolder";
  folders: Array<GQLFolder>;
  sharedFolders: Array<GQLSharedFolder>;
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
  article?: Maybe<GQLArticle>;
  availability?: Maybe<Scalars["String"]["output"]>;
  contentUri?: Maybe<Scalars["String"]["output"]>;
  meta?: Maybe<GQLMeta>;
};

export type GQLArticle_ArticleFragment = {
  __typename?: "Article";
  id: number;
  created: string;
  updated: string;
  supportedLanguages?: Array<string>;
  grepCodes?: Array<string>;
  htmlIntroduction?: string;
  htmlTitle: string;
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
  transformedDisclaimer: { __typename?: "TransformedArticleContent"; content: string };
} & GQLLicenseBox_ArticleFragment;

export type GQLMyNdlaPersonalDataFragmentFragment = {
  __typename: "MyNdlaPersonalData";
  id: number;
  username: string;
  email: string;
  displayName: string;
  organization: string;
  favoriteSubjects: Array<string>;
  role: string;
  shareNameAccepted: boolean;
  arenaEnabled: boolean;
  arenaAccepted: boolean;
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

export type GQLCompetenceGoalsQueryVariables = Exact<{
  codes?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  language?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLCompetenceGoalsQuery = {
  __typename?: "Query";
  competenceGoals?: Array<{
    __typename?: "CompetenceGoal";
    id: string;
    title: string;
    type: string;
    curriculum?: { __typename?: "Reference"; id: string; title: string };
    competenceGoalSet?: { __typename?: "Reference"; id: string; title: string };
  }>;
  coreElements?: Array<{
    __typename?: "CoreElement";
    id: string;
    title: string;
    description?: string;
    curriculum?: { __typename?: "Reference"; id: string; title: string };
  }>;
};

export type GQLFavoriteSubject_NodeFragment = { __typename?: "Node"; id: string; name: string };

export type GQLLearningpath_LearningpathStepFragment = {
  __typename?: "LearningpathStep";
  seqNo: number;
  id: number;
  showTitle: boolean;
  title: string;
  description?: string;
  license?: { __typename?: "License"; license: string };
} & GQLLearningpathMenu_LearningpathStepFragment &
  GQLLearningpathStep_LearningpathStepFragment;

export type GQLLearningpath_LearningpathFragment = {
  __typename?: "Learningpath";
} & GQLLearningpathMenu_LearningpathFragment;

export type GQLLearningpathMenu_LearningpathFragment = {
  __typename?: "Learningpath";
  id: number;
  title: string;
  lastUpdated: string;
  basedOn?: string;
  isMyNDLAOwner: boolean;
  copyright: {
    __typename?: "LearningpathCopyright";
    license: { __typename?: "License"; license: string };
    contributors: Array<{ __typename?: "Contributor"; type: string; name: string }>;
  };
  learningsteps: Array<{ __typename?: "LearningpathStep"; id: number; title: string; seqNo: number }>;
};

export type GQLLearningpathMenu_LearningpathStepFragment = {
  __typename?: "LearningpathStep";
  id: number;
  seqNo: number;
};

export type GQLLearningpathEmbed_ArticleFragment = {
  __typename?: "Article";
  id: number;
  metaDescription: string;
  created: string;
  updated: string;
  articleType: string;
  requiredLibraries?: Array<{ __typename?: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
} & GQLStructuredArticleDataFragment &
  GQLArticle_ArticleFragment;

export type GQLArticleStep_LearningpathStepFragment = {
  __typename?: "LearningpathStep";
  id: number;
  title: string;
  description?: string;
  introduction?: string;
  opengraph?: { __typename?: "ExternalOpengraph"; title?: string; description?: string; url?: string };
  resource?: {
    __typename?: "Resource";
    id: string;
    url?: string;
    resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
    article?: { __typename?: "Article" } & GQLLearningpathEmbed_ArticleFragment;
  };
  embedUrl?: { __typename?: "LearningpathStepEmbedUrl"; embedType: string; url: string };
  oembed?: {
    __typename?: "LearningpathStepOembed";
    html: string;
    width: number;
    height: number;
    type: string;
    version: string;
  };
};

export type GQLLearningpathStepQueryVariables = Exact<{
  articleId: Scalars["String"]["input"];
  resourceId: Scalars["String"]["input"];
  includeResource: Scalars["Boolean"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLLearningpathStepQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article"; oembed?: string } & GQLLearningpathEmbed_ArticleFragment;
  node?: {
    __typename?: "Node";
    id: string;
    url?: string;
    resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
  };
};

export type GQLLearningpathStep_LearningpathStepFragment = {
  __typename?: "LearningpathStep";
} & GQLArticleStep_LearningpathStepFragment;

export type GQLSubjectLinks_SubjectPageFragment = {
  __typename?: "SubjectPage";
  buildsOn: Array<{ __typename?: "SubjectLink"; name?: string; url?: string }>;
  connectedTo: Array<{ __typename?: "SubjectLink"; name?: string; url?: string }>;
  leadsTo: Array<{ __typename?: "SubjectLink"; name?: string; url?: string }>;
};

export type GQLTransportationNode_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  availability?: string;
  relevanceId?: string;
  meta?: { __typename?: "Meta"; metaDescription?: string };
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
  grepCodes?: Array<string>;
  htmlIntroduction?: string;
  created: string;
  updated: string;
  slug?: string;
  language: string;
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

export type GQLAllSubjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAllSubjectsQuery = {
  __typename?: "Query";
  nodes?: Array<{ __typename?: "Node" } & GQLNodeWithMetadataFragment>;
};

export type GQLArticlePage_ResourceTypeFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLResources_ResourceTypeDefinitionFragment;

export type GQLArticlePage_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  contentUri?: string;
  resourceTypes?: Array<{ __typename?: "ResourceType"; name: string; id: string }>;
  context?: {
    __typename?: "TaxonomyContext";
    contextId: string;
    isActive: boolean;
    parents?: Array<{ __typename?: "TaxonomyCrumb"; contextId: string; id: string; name: string; url: string }>;
  };
  article?: {
    __typename?: "Article";
    created: string;
    updated: string;
    metaDescription: string;
    oembed?: string;
    tags?: Array<string>;
  } & GQLStructuredArticleDataFragment &
    GQLArticle_ArticleFragment;
};

export type GQLCollectionPageQueryVariables = Exact<{
  language: Scalars["String"]["input"];
}>;

export type GQLCollectionPageQuery = {
  __typename?: "Query";
  subjectCollection?: Array<{
    __typename?: "Subject";
    id: string;
    name: string;
    url?: string;
    metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  }>;
};

export type GQLAllMoviesQueryVariables = Exact<{
  resourceTypes: Scalars["String"]["input"];
  language: Scalars["String"]["input"];
}>;

export type GQLAllMoviesQuery = {
  __typename?: "Query";
  searchWithoutPagination?: {
    __typename?: "SearchWithoutPagination";
    results: Array<
      | {
          __typename?: "ArticleSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage?: { __typename?: "MetaImage"; url: string };
          contexts: Array<{ __typename?: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename?: "LearningpathSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage?: { __typename?: "MetaImage"; url: string };
          contexts: Array<{ __typename?: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename?: "NodeSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          contexts: Array<{ __typename?: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
    >;
  };
};

export type GQLFilmContent_MovieFragment = { __typename?: "Movie" } & GQLSelectionMovieGrid_MovieFragment;

export type GQLFilmContentCard_MovieFragment = {
  __typename?: "Movie";
  id: string;
  title: string;
  metaDescription: string;
  url: string;
  metaImage?: { __typename?: "MetaImage"; alt: string; url: string };
  resourceTypes: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
};

export type GQLFilmFrontPageQueryVariables = Exact<{
  nodeId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLFilmFrontPageQuery = {
  __typename?: "Query";
  filmfrontpage?: {
    __typename?: "FilmFrontpage";
    slideShow: Array<{ __typename?: "Movie" } & GQLFilmSlideshow_MovieFragment>;
    movieThemes: Array<{
      __typename?: "MovieTheme";
      name: Array<{ __typename?: "Name"; name: string; language: string }>;
      movies: Array<{ __typename?: "Movie" } & GQLFilmContent_MovieFragment>;
    }>;
    about: Array<{
      __typename?: "FilmPageAbout";
      title: string;
      description: string;
      language: string;
      visualElement: { __typename?: "SubjectPageVisualElement"; alt?: string; url: string; type: string };
    }>;
    article?: { __typename?: "Article" } & GQLArticle_ArticleFragment;
  };
  node?: {
    __typename?: "Node";
    id: string;
    name: string;
    url?: string;
    children?: Array<{ __typename?: "Node"; id: string; name: string; url?: string }>;
  };
};

export type GQLFilmSlideshow_MovieFragment = { __typename?: "Movie" } & GQLFilmContentCard_MovieFragment;

export type GQLSelectionMovieGrid_MovieFragment = { __typename?: "Movie" } & GQLFilmContentCard_MovieFragment;

export type GQLResourceTypeMoviesQueryVariables = Exact<{
  resourceType: Scalars["String"]["input"];
  language: Scalars["String"]["input"];
}>;

export type GQLResourceTypeMoviesQuery = {
  __typename?: "Query";
  searchWithoutPagination?: {
    __typename?: "SearchWithoutPagination";
    results: Array<
      | {
          __typename?: "ArticleSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage?: { __typename?: "MetaImage"; url: string };
          contexts: Array<{ __typename?: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename?: "LearningpathSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage?: { __typename?: "MetaImage"; url: string };
          contexts: Array<{ __typename?: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename?: "NodeSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          contexts: Array<{ __typename?: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
    >;
  };
};

export type GQLLearningpathPage_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  context?: {
    __typename?: "TaxonomyContext";
    contextId: string;
    isActive: boolean;
    parents?: Array<{ __typename?: "TaxonomyCrumb"; contextId: string; id: string; name: string; url: string }>;
  };
  learningpath?: {
    __typename?: "Learningpath";
    id: number;
    supportedLanguages: Array<string>;
    tags: Array<string>;
    description: string;
    coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string; metaUrl: string };
    learningsteps: Array<{ __typename?: "LearningpathStep"; type: string } & GQLLearningpath_LearningpathStepFragment>;
  } & GQLLearningpath_LearningpathFragment;
};

export type GQLDynamicMenuQueryVariables = Exact<{ [key: string]: never }>;

export type GQLDynamicMenuQuery = {
  __typename?: "Query";
  frontpage?: {
    __typename?: "FrontpageMenu";
    articleId: number;
    menu?: Array<{
      __typename?: "FrontpageMenu";
      articleId: number;
      article: { __typename?: "Article"; id: number; title: string; slug?: string };
    }>;
  };
};

export type GQLCurrentContextQueryVariables = Exact<{
  contextId: Scalars["String"]["input"];
}>;

export type GQLCurrentContextQuery = {
  __typename?: "Query";
  root?: {
    __typename?: "Node";
    id: string;
    nodeType: string;
    name: string;
    context?: { __typename?: "TaxonomyContext"; contextId: string; rootId: string; root: string };
  };
};

export type GQLMovedResourceQueryVariables = Exact<{
  resourceId: Scalars["String"]["input"];
}>;

export type GQLMovedResourceQuery = {
  __typename?: "Query";
  resource?: {
    __typename?: "Node";
    contexts: Array<{ __typename?: "TaxonomyContext"; contextId: string; url: string; breadcrumbs: Array<string> }>;
  };
};

export type GQLMovedResourcePage_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  breadcrumbs: Array<string>;
  contexts: Array<{ __typename?: "TaxonomyContext"; contextId: string; url: string; breadcrumbs: Array<string> }>;
  article?: {
    __typename?: "Article";
    id: number;
    metaDescription: string;
    metaImage?: { __typename?: "MetaImageWithCopyright"; url: string; alt: string };
  };
  learningpath?: {
    __typename?: "Learningpath";
    id: number;
    description: string;
    coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string };
  };
  resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
};

export type GQLPreviewLearningpathQueryVariables = Exact<{
  pathId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLPreviewLearningpathQuery = {
  __typename?: "Query";
  learningpath?: {
    __typename?: "Learningpath";
    id: number;
    canEdit: boolean;
    learningsteps: Array<{ __typename?: "LearningpathStep" } & GQLLearningpath_LearningpathStepFragment>;
  } & GQLLearningpath_LearningpathFragment;
};

export type GQLMyLearningpathsQueryVariables = Exact<{
  includeSteps?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLMyLearningpathsQuery = {
  __typename?: "Query";
  myLearningpaths?: Array<{ __typename?: "MyNdlaLearningpath" } & GQLMyNdlaLearningpathFragment>;
};

export type GQLMyNdlaLearningpathQueryVariables = Exact<{
  pathId: Scalars["String"]["input"];
  includeSteps?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLMyNdlaLearningpathQuery = {
  __typename?: "Query";
  myNdlaLearningpath?: { __typename?: "MyNdlaLearningpath" } & GQLMyNdlaLearningpathFragment;
};

export type GQLLearningpathStepOembedQueryVariables = Exact<{
  url: Scalars["String"]["input"];
}>;

export type GQLLearningpathStepOembedQuery = {
  __typename?: "Query";
  learningpathStepOembed: { __typename?: "LearningpathStepOembed" } & GQLLearningpathStepOembedFragment;
};

export type GQLOpengraphQueryVariables = Exact<{
  url: Scalars["String"]["input"];
}>;

export type GQLOpengraphQuery = {
  __typename?: "Query";
  opengraph?: {
    __typename?: "ExternalOpengraph";
    title?: string;
    description?: string;
    imageUrl?: string;
    url?: string;
  };
};

export type GQLImageFragment = {
  __typename?: "ImageMetaInformationV3";
  id: string;
  metaUrl: string;
  supportedLanguages: Array<string>;
  created: string;
  createdBy: string;
  modelRelease: string;
  title: { __typename?: "Title"; title: string; language: string };
  alttext: { __typename?: "ImageAltText"; alttext: string; language: string };
  copyright: {
    __typename?: "Copyright";
    origin?: string;
    processed?: boolean;
    license: { __typename?: "License"; license: string; url?: string; description?: string };
    creators: Array<{ __typename?: "Contributor"; type: string; name: string }>;
    processors: Array<{ __typename?: "Contributor"; type: string; name: string }>;
    rightsholders: Array<{ __typename?: "Contributor"; type: string; name: string }>;
  };
  tags: { __typename?: "Tags"; tags: Array<string>; language: string };
  caption: { __typename?: "Caption"; caption: string; language: string };
  editorNotes?: Array<{ __typename?: "EditorNote"; timestamp: string; updatedBy: string; note: string }>;
  image: {
    __typename?: "ImageV3";
    fileName: string;
    size: number;
    contentType: string;
    imageUrl: string;
    language: string;
    dimensions?: { __typename?: "ImageDimensions"; width: number; height: number };
  };
};

export type GQLImageSearchQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  license?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLImageSearchQuery = {
  __typename?: "Query";
  imageSearch: {
    __typename?: "ImageSearch";
    totalCount: number;
    pageSize: number;
    page: number;
    language: string;
    results: Array<{ __typename?: "ImageMetaInformationV3" } & GQLImageFragment>;
  };
};

export type GQLFetchImageQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GQLFetchImageQuery = {
  __typename?: "Query";
  imageV3?: { __typename?: "ImageMetaInformationV3" } & GQLImageFragment;
};

export type GQLPlainArticleContainer_ArticleFragment = {
  __typename?: "Article";
  created: string;
  tags?: Array<string>;
} & GQLArticle_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLPlainArticlePageQueryVariables = Exact<{
  articleId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLPlainArticlePageQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article" } & GQLPlainArticleContainer_ArticleFragment;
};

export type GQLPlainLearningpathContainer_LearningpathFragment = {
  __typename?: "Learningpath";
  id: number;
  supportedLanguages: Array<string>;
  tags: Array<string>;
  description: string;
  coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string };
  learningsteps: Array<{ __typename?: "LearningpathStep" } & GQLLearningpath_LearningpathStepFragment>;
} & GQLLearningpath_LearningpathFragment;

export type GQLPlainLearningpathPageQueryVariables = Exact<{
  pathId: Scalars["String"]["input"];
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
      meta: { __typename?: "ResourceMetaData" } & GQLResourceEmbedLicenseContent_MetaFragment;
    };
    episodes?: Array<{
      __typename?: "Audio";
      id: number;
      title: { __typename?: "Title"; title: string };
      audioFile: { __typename?: "AudioFile"; url: string };
      podcastMeta?: { __typename?: "PodcastMeta"; introduction: string };
      copyright: {
        __typename?: "Copyright";
        origin?: string;
        processed?: boolean;
        license: { __typename?: "License"; license: string; url?: string; description?: string };
        creators: Array<{ __typename?: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename?: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename?: "Contributor"; name: string; type: string }>;
      };
    }>;
  };
};

export type GQLProgrammeContainer_ProgrammeFragment = {
  __typename?: "ProgrammePage";
  id: string;
  metaDescription?: string;
  url?: string;
  title: { __typename?: "Title"; title: string; language: string };
  desktopImage?: { __typename?: "MetaImage"; url: string };
  grades?: Array<{
    __typename?: "Grade";
    id: string;
    url?: string;
    title: { __typename?: "Title"; title: string };
    categories?: Array<{
      __typename?: "Category";
      id: string;
      isProgrammeSubject: boolean;
      title: { __typename?: "Title"; title: string };
      subjects?: Array<{
        __typename?: "Subject";
        id: string;
        name: string;
        url?: string;
        subjectpage?: { __typename?: "SubjectPage"; about?: { __typename?: "SubjectPageAbout"; title: string } };
      }>;
    }>;
  }>;
};

export type GQLProgrammePageQueryVariables = Exact<{
  contextId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLProgrammePageQuery = {
  __typename?: "Query";
  programme?: {
    __typename?: "ProgrammePage";
    grades?: Array<{ __typename?: "Grade"; title: { __typename?: "Title"; title: string } }>;
  } & GQLProgrammeContainer_ProgrammeFragment;
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
    meta: { __typename?: "ResourceMetaData" } & GQLResourceEmbedLicenseContent_MetaFragment;
  };
};

export type GQLResourceEmbedLicenseContent_MetaFragment = {
  __typename?: "ResourceMetaData";
  concepts?: Array<{ __typename?: "ConceptLicense"; content?: string } & GQLConceptLicenseList_ConceptLicenseFragment>;
  glosses?: Array<{ __typename?: "GlossLicense"; content?: string } & GQLGlossLicenseList_GlossLicenseFragment>;
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
  topicId?: InputMaybe<Scalars["String"]["input"]>;
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  contextId?: InputMaybe<Scalars["String"]["input"]>;
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLResourcePageQuery = {
  __typename?: "Query";
  resourceTypes?: Array<{ __typename?: "ResourceTypeDefinition" } & GQLArticlePage_ResourceTypeFragment>;
  node?: {
    __typename?: "Node";
    relevanceId?: string;
    breadcrumbs: Array<string>;
    context?: { __typename?: "TaxonomyContext"; contextId: string; url: string };
    contexts: Array<{ __typename?: "TaxonomyContext"; contextId: string; url: string }>;
  } & GQLMovedResourcePage_NodeFragment &
    GQLArticlePage_NodeFragment &
    GQLLearningpathPage_NodeFragment;
};

export type GQLResources_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
  id: string;
  name: string;
};

export type GQLResources_ParentFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  children?: Array<{
    __typename?: "Node";
    id: string;
    name: string;
    url?: string;
    rank?: number;
    language?: string;
    relevanceId?: string;
    article?: {
      __typename?: "Article";
      id: number;
      metaImage?: { __typename?: "MetaImageWithCopyright"; url: string; alt: string };
    };
    learningpath?: {
      __typename?: "Learningpath";
      id: number;
      coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string };
    };
    resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
  }>;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
};

export type GQLResourcesQueryQueryVariables = Exact<{
  parentId: Scalars["String"]["input"];
  rootId: Scalars["String"]["input"];
}>;

export type GQLResourcesQueryQuery = {
  __typename?: "Query";
  node?: { __typename?: "Node" } & GQLResources_ParentFragment;
  resourceTypes?: Array<{ __typename?: "ResourceTypeDefinition" } & GQLResources_ResourceTypeDefinitionFragment>;
};

export type GQLGrepFilterQueryVariables = Exact<{
  codes?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  language: Scalars["String"]["input"];
}>;

export type GQLGrepFilterQuery = {
  __typename?: "Query";
  competenceGoals?: Array<{
    __typename?: "CompetenceGoal";
    id: string;
    title: string;
    type: string;
    curriculum?: { __typename?: "Reference"; id: string; title: string };
    competenceGoalSet?: { __typename?: "Reference"; id: string; title: string };
  }>;
  coreElements?: Array<{ __typename?: "CoreElement"; id: string; title: string; description?: string }>;
};

export type GQLProgrammesQueryVariables = Exact<{ [key: string]: never }>;

export type GQLProgrammesQuery = {
  __typename?: "Query";
  programmes?: Array<{ __typename?: "ProgrammePage"; id: string; title: { __typename?: "Title"; title: string } }>;
};

export type GQLResourceTypeFilter_BucketResultFragment = { __typename?: "BucketResult"; value: string; count: number };

export type GQLResourceTypeFilter_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
  id: string;
  name: string;
  subtypes?: Array<{ __typename?: "ResourceTypeDefinition"; id: string; name: string }>;
};

export type GQLSearchPageQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  levels?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
  languageFilter?: InputMaybe<Scalars["String"]["input"]>;
  relevance?: InputMaybe<Scalars["String"]["input"]>;
  grepCodes?: InputMaybe<Scalars["String"]["input"]>;
  traits?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  aggregatePaths?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  filterInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  license?: InputMaybe<Scalars["String"]["input"]>;
  resultTypes?: InputMaybe<Scalars["String"]["input"]>;
  nodeTypes?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLSearchPageQuery = {
  __typename?: "Query";
  search?: {
    __typename?: "Search";
    page?: number;
    pageSize: number;
    language: string;
    totalCount: number;
    results: Array<
      | ({ __typename?: "ArticleSearchResult" } & GQLSearchResult_SearchResult_ArticleSearchResult_Fragment)
      | ({ __typename?: "LearningpathSearchResult" } & GQLSearchResult_SearchResult_LearningpathSearchResult_Fragment)
      | ({ __typename?: "NodeSearchResult" } & GQLSearchResult_SearchResult_NodeSearchResult_Fragment)
    >;
    aggregations: Array<{
      __typename?: "AggregationResult";
      values: Array<{ __typename?: "BucketResult" } & GQLResourceTypeFilter_BucketResultFragment>;
    }>;
  };
};

export type GQLSearchContainer_ResourceTypeDefinitionFragment = {
  __typename?: "ResourceTypeDefinition";
} & GQLResourceTypeFilter_ResourceTypeDefinitionFragment;

export type GQLSearchResourceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSearchResourceTypesQuery = {
  __typename?: "Query";
  resourceTypes?: Array<{ __typename?: "ResourceTypeDefinition" } & GQLSearchContainer_ResourceTypeDefinitionFragment>;
};

type GQLSearchResult_SearchResult_ArticleSearchResult_Fragment = {
  __typename?: "ArticleSearchResult";
  htmlTitle: string;
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  context?: {
    __typename?: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
  };
  contexts: Array<{
    __typename?: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    relevanceId: string;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
  }>;
};

type GQLSearchResult_SearchResult_LearningpathSearchResult_Fragment = {
  __typename?: "LearningpathSearchResult";
  htmlTitle: string;
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  context?: {
    __typename?: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
  };
  contexts: Array<{
    __typename?: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    relevanceId: string;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
  }>;
};

type GQLSearchResult_SearchResult_NodeSearchResult_Fragment = {
  __typename?: "NodeSearchResult";
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  context?: {
    __typename?: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
  };
  contexts: Array<{
    __typename?: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    relevanceId: string;
    resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
  }>;
};

export type GQLSearchResult_SearchResultFragment =
  | GQLSearchResult_SearchResult_ArticleSearchResult_Fragment
  | GQLSearchResult_SearchResult_LearningpathSearchResult_Fragment
  | GQLSearchResult_SearchResult_NodeSearchResult_Fragment;

export type GQLSubjectFilterQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSubjectFilterQuery = {
  __typename?: "Query";
  nodes?: Array<{
    __typename?: "Node";
    id: string;
    name: string;
    url?: string;
    metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  }>;
};

export type GQLSubjectContainer_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  supportedLanguages: Array<string>;
  url?: string;
  nodeType: string;
  grepCodes?: Array<string>;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  context?: {
    __typename?: "TaxonomyContext";
    contextId: string;
    isActive: boolean;
    rootId: string;
    parentIds: Array<string>;
    url: string;
  };
  nodes?: Array<{ __typename?: "Node" } & GQLTransportationNode_NodeFragment>;
  subjectpage?: {
    __typename?: "SubjectPage";
    id: number;
    metaDescription?: string;
    about?: {
      __typename?: "SubjectPageAbout";
      title: string;
      visualElement: {
        __typename?: "SubjectPageVisualElement";
        type: string;
        alt?: string;
        url: string;
        imageUrl?: string;
        imageLicense?: { __typename?: "ImageLicense" } & GQLImageLicenseList_ImageLicenseFragment;
      };
    };
  } & GQLSubjectLinks_SubjectPageFragment;
} & GQLFavoriteSubject_NodeFragment;

export type GQLSubjectPageQueryVariables = Exact<{
  subjectId?: InputMaybe<Scalars["String"]["input"]>;
  contextId?: InputMaybe<Scalars["String"]["input"]>;
  metadataFilterKey?: InputMaybe<Scalars["String"]["input"]>;
  metadataFilterValue?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLSubjectPageQuery = {
  __typename?: "Query";
  node?: { __typename?: "Node" } & GQLSubjectContainer_NodeFragment;
  nodes?: Array<{
    __typename?: "Node";
    url?: string;
    metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
  }>;
};

export type GQLMovedTopicPage_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  breadcrumbs: Array<string>;
  meta?: {
    __typename?: "Meta";
    metaDescription?: string;
    metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  };
  contexts: Array<{
    __typename?: "TaxonomyContext";
    contextId: string;
    url: string;
    name: string;
    breadcrumbs: Array<string>;
  }>;
};

export type GQLMultidisciplinaryArticleList_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  meta?: {
    __typename?: "Meta";
    metaDescription?: string;
    metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  };
};

export type GQLMultidisciplinarySubjectArticle_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  context?: {
    __typename?: "TaxonomyContext";
    contextId: string;
    rootId: string;
    breadcrumbs: Array<string>;
    url: string;
    isActive: boolean;
    parents?: Array<{ __typename?: "TaxonomyCrumb"; contextId: string; id: string; name: string; url: string }>;
  };
  resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
  article?: {
    __typename?: "Article";
    id: number;
    language: string;
    created: string;
    updated: string;
    oembed?: string;
    introduction?: string;
    metaDescription: string;
    metaImage?: { __typename?: "MetaImageWithCopyright"; url: string; alt: string };
    crossSubjectTopics?: Array<{ __typename?: "CrossSubjectElement"; title: string; path?: string; url?: string }>;
  } & GQLArticle_ArticleFragment;
};

export type GQLTopicContainer_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  contentUri?: string;
  url?: string;
  children?: Array<
    { __typename?: "Node"; id: string } & GQLTransportationNode_NodeFragment &
      GQLMultidisciplinaryArticleList_NodeFragment
  >;
};

export type GQLTopicPageQueryVariables = Exact<{
  id?: InputMaybe<Scalars["String"]["input"]>;
  rootId?: InputMaybe<Scalars["String"]["input"]>;
  contextId?: InputMaybe<Scalars["String"]["input"]>;
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLTopicPageQuery = {
  __typename?: "Query";
  node?: {
    __typename?: "Node";
    id: string;
    name: string;
    supportedLanguages: Array<string>;
    breadcrumbs: Array<string>;
    relevanceId?: string;
    nodeType: string;
    article?: {
      __typename?: "Article";
      htmlTitle: string;
      htmlIntroduction?: string;
      grepCodes?: Array<string>;
      metaImage?: { __typename?: "MetaImageWithCopyright"; url: string; alt: string };
      transformedContent: {
        __typename?: "TransformedArticleContent";
        visualElementEmbed?: { __typename?: "ResourceEmbed"; content: string };
      };
    };
    alternateNodes?: Array<{ __typename?: "Node" } & GQLMovedTopicPage_NodeFragment>;
    meta?: {
      __typename?: "Meta";
      metaDescription?: string;
      metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
    };
    context?: {
      __typename?: "TaxonomyContext";
      contextId: string;
      rootId: string;
      name: string;
      url: string;
      isActive: boolean;
      parents?: Array<{ __typename?: "TaxonomyCrumb"; id: string; name: string; url: string }>;
    };
  } & GQLMultidisciplinarySubjectArticle_NodeFragment &
    GQLTopicContainer_NodeFragment;
};

export type GQLFrontpageDataQueryVariables = Exact<{
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLFrontpageDataQuery = {
  __typename?: "Query";
  programmes?: Array<{
    __typename?: "ProgrammePage";
    id: string;
    url?: string;
    title: { __typename?: "Title"; title: string; language: string };
  }>;
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
      language: string;
      htmlTitle: string;
      transformedContent: {
        __typename?: "TransformedArticleContent";
        content: string;
        metaData?: { __typename?: "ArticleMetaData"; copyText?: string };
      };
    } & GQLStructuredArticleDataFragment;
  };
};

export type GQLLearningpathStepEmbedUrlFragment = {
  __typename?: "LearningpathStepEmbedUrl";
  url: string;
  embedType: string;
};

export type GQLLearningpathStepOembedFragment = {
  __typename?: "LearningpathStepOembed";
  type: string;
  version: string;
  height: number;
  html: string;
  width: number;
};

export type GQLResource_ArticleFragment = {
  __typename?: "Article";
  id: number;
  metaDescription: string;
  created: string;
  updated: string;
  articleType: string;
  title: string;
};

export type GQLMyNdlaLearningpathStepFragment = {
  __typename?: "MyNdlaLearningpathStep";
  id: number;
  title: string;
  seqNo: number;
  description?: string;
  introduction?: string;
  type: string;
  supportedLanguages: Array<string>;
  showTitle: boolean;
  revision: number;
  embedUrl?: { __typename?: "LearningpathStepEmbedUrl" } & GQLLearningpathStepEmbedUrlFragment;
  oembed?: { __typename?: "LearningpathStepOembed" } & GQLLearningpathStepOembedFragment;
  resource?: {
    __typename?: "Resource";
    id: string;
    url?: string;
    breadcrumbs: Array<string>;
    resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
    article?: { __typename?: "Article" } & GQLResource_ArticleFragment;
  };
};

export type GQLMyNdlaLearningpathFragment = {
  __typename?: "MyNdlaLearningpath";
  id: number;
  title: string;
  description: string;
  created: string;
  canEdit: boolean;
  status: string;
  madeAvailable?: string;
  revision: number;
  coverphoto?: { __typename?: "LearningpathCoverphoto"; url: string; metaUrl: string };
  learningsteps?: Array<{ __typename?: "MyNdlaLearningpathStep" } & GQLMyNdlaLearningpathStepFragment>;
};

export type GQLIframeArticlePage_ArticleFragment = {
  __typename?: "Article";
  articleType: string;
  created: string;
  updated: string;
  metaDescription: string;
  oembed?: string;
  tags?: Array<string>;
  metaImage?: { __typename?: "MetaImageWithCopyright"; url: string };
} & GQLArticle_ArticleFragment &
  GQLStructuredArticleDataFragment;

export type GQLIframeArticlePage_NodeFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  resourceTypes?: Array<{ __typename?: "ResourceType"; id: string; name: string }>;
};

export type GQLIframePageQueryVariables = Exact<{
  articleId: Scalars["String"]["input"];
  taxonomyId: Scalars["String"]["input"];
  transformArgs?: InputMaybe<GQLTransformedArticleContentInput>;
}>;

export type GQLIframePageQuery = {
  __typename?: "Query";
  article?: { __typename?: "Article" } & GQLIframeArticlePage_ArticleFragment;
  nodeByArticleId?: { __typename?: "Node" } & GQLIframeArticlePage_NodeFragment;
};

export type GQLLtiSearchResourceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type GQLLtiSearchResourceTypesQuery = {
  __typename?: "Query";
  resourceTypes?: Array<{ __typename?: "ResourceTypeDefinition" } & GQLSearchContainer_ResourceTypeDefinitionFragment>;
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
  folders: {
    __typename?: "UserFolder";
    folders: Array<{ __typename?: "Folder" } & GQLFoldersPageQueryFragmentFragment>;
    sharedFolders: Array<{ __typename?: "SharedFolder" } & GQLSharedFoldersPageQueryFragmentFragment>;
  };
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

export type GQLSortSavedSharedFoldersMutationVariables = Exact<{
  sortedIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type GQLSortSavedSharedFoldersMutation = {
  __typename?: "Mutation";
  sortSavedSharedFolders: { __typename?: "SortResult"; sortedIds: Array<string> };
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

export type GQLFavouriteSubjectsQueryVariables = Exact<{
  ids: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type GQLFavouriteSubjectsQuery = {
  __typename?: "Query";
  subjects?: Array<{ __typename?: "Node" } & GQLNodeWithMetadataFragment>;
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

export type GQLFavoriteSharedFolderMutationVariables = Exact<{
  folderId: Scalars["String"]["input"];
}>;

export type GQLFavoriteSharedFolderMutation = { __typename?: "Mutation"; favoriteSharedFolder: string };

export type GQLUnFavoriteSharedFolderMutationVariables = Exact<{
  folderId: Scalars["String"]["input"];
}>;

export type GQLUnFavoriteSharedFolderMutation = { __typename?: "Mutation"; unFavoriteSharedFolder: string };

export type GQLDeleteLearningpathMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GQLDeleteLearningpathMutation = { __typename?: "Mutation"; deleteLearningpath?: boolean };

export type GQLUpdateLearningpathStatusMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
  status: Scalars["String"]["input"];
  includeSteps?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLUpdateLearningpathStatusMutation = {
  __typename?: "Mutation";
  updateLearningpathStatus: { __typename?: "MyNdlaLearningpath" } & GQLMyNdlaLearningpathFragment;
};

export type GQLNewLearningpathMutationVariables = Exact<{
  params: GQLLearningpathNewInput;
  includeSteps?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLNewLearningpathMutation = {
  __typename?: "Mutation";
  newLearningpath: { __typename?: "MyNdlaLearningpath" } & GQLMyNdlaLearningpathFragment;
};

export type GQLNewLearningpathStepMutationVariables = Exact<{
  learningpathId: Scalars["Int"]["input"];
  params: GQLLearningpathStepNewInput;
}>;

export type GQLNewLearningpathStepMutation = {
  __typename?: "Mutation";
  newLearningpathStep: { __typename?: "MyNdlaLearningpathStep" } & GQLMyNdlaLearningpathStepFragment;
};

export type GQLUpdateLearningpathStepMutationVariables = Exact<{
  learningpathId: Scalars["Int"]["input"];
  learningstepId: Scalars["Int"]["input"];
  params: GQLLearningpathStepUpdateInput;
}>;

export type GQLUpdateLearningpathStepMutation = {
  __typename?: "Mutation";
  updateLearningpathStep: { __typename?: "MyNdlaLearningpathStep" } & GQLMyNdlaLearningpathStepFragment;
};

export type GQLDeleteLearningpathStepMutationVariables = Exact<{
  learningpathId: Scalars["Int"]["input"];
  learningstepId: Scalars["Int"]["input"];
}>;

export type GQLDeleteLearningpathStepMutation = { __typename?: "Mutation"; deleteLearningpathStep?: boolean };

export type GQLUpdateLearningpathMutationVariables = Exact<{
  learningpathId: Scalars["Int"]["input"];
  params: GQLLearningpathUpdateInput;
  includeSteps?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLUpdateLearningpathMutation = {
  __typename?: "Mutation";
  updateLearningpath: { __typename?: "MyNdlaLearningpath" } & GQLMyNdlaLearningpathFragment;
};

export type GQLCopyLearningpathMutationVariables = Exact<{
  learningpathId: Scalars["Int"]["input"];
  params: GQLLearningpathCopyInput;
  includeSteps?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLCopyLearningpathMutation = {
  __typename?: "Mutation";
  copyLearningpath: { __typename?: "MyNdlaLearningpath" } & GQLMyNdlaLearningpathFragment;
};

export type GQLUpdateLearningpathStepSeqNoMutationVariables = Exact<{
  learningpathId: Scalars["Int"]["input"];
  learningpathStepId: Scalars["Int"]["input"];
  seqNo: Scalars["Int"]["input"];
}>;

export type GQLUpdateLearningpathStepSeqNoMutation = {
  __typename?: "Mutation";
  updateLearningpathStepSeqNo: { __typename?: "LearningpathSeqNo"; seqNo: number };
};

export type GQLDeletePersonalDataMutationVariables = Exact<{ [key: string]: never }>;

export type GQLDeletePersonalDataMutation = { __typename?: "Mutation"; deletePersonalData: boolean };

export type GQLMySubjectMyNdlaPersonalDataFragmentFragment = {
  __typename?: "MyNdlaPersonalData";
  id: number;
  favoriteSubjects: Array<string>;
  role: string;
  arenaEnabled: boolean;
  arenaAccepted: boolean;
  shareNameAccepted: boolean;
};

export type GQLUpdatePersonalDataMutationVariables = Exact<{
  favoriteSubjects?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  arenaAccepted?: InputMaybe<Scalars["Boolean"]["input"]>;
  shareNameAccepted?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GQLUpdatePersonalDataMutation = {
  __typename?: "Mutation";
  updatePersonalData: { __typename?: "MyNdlaPersonalData" } & GQLMySubjectMyNdlaPersonalDataFragmentFragment;
};

export type GQLSearchContextFragment = {
  __typename?: "SearchContext";
  contextId: string;
  publicId: string;
  language: string;
  url: string;
  breadcrumbs: Array<string>;
  rootId: string;
  root: string;
  relevance: string;
  relevanceId: string;
  isPrimary: boolean;
  resourceTypes: Array<{ __typename?: "SearchContextResourceTypes"; id: string; name: string }>;
};

type GQLSearchResource_ArticleSearchResult_Fragment = {
  __typename?: "ArticleSearchResult";
  htmlTitle: string;
  traits: Array<string>;
  id: string;
  title: string;
  supportedLanguages: Array<string>;
  url: string;
  metaDescription: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  contexts: Array<{ __typename?: "SearchContext" } & GQLSearchContextFragment>;
};

type GQLSearchResource_LearningpathSearchResult_Fragment = {
  __typename?: "LearningpathSearchResult";
  htmlTitle: string;
  traits: Array<string>;
  id: string;
  title: string;
  supportedLanguages: Array<string>;
  url: string;
  metaDescription: string;
  metaImage?: { __typename?: "MetaImage"; url: string; alt: string };
  contexts: Array<{ __typename?: "SearchContext" } & GQLSearchContextFragment>;
};

type GQLSearchResource_NodeSearchResult_Fragment = {
  __typename?: "NodeSearchResult";
  id: string;
  title: string;
  supportedLanguages: Array<string>;
  url: string;
  metaDescription: string;
  contexts: Array<{ __typename?: "SearchContext" } & GQLSearchContextFragment>;
};

export type GQLSearchResourceFragment =
  | GQLSearchResource_ArticleSearchResult_Fragment
  | GQLSearchResource_LearningpathSearchResult_Fragment
  | GQLSearchResource_NodeSearchResult_Fragment;

export type GQLSearchQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  contextTypes?: InputMaybe<Scalars["String"]["input"]>;
  language?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"]>;
  resourceTypes?: InputMaybe<Scalars["String"]["input"]>;
  levels?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  fallback?: InputMaybe<Scalars["String"]["input"]>;
  subjects?: InputMaybe<Scalars["String"]["input"]>;
  languageFilter?: InputMaybe<Scalars["String"]["input"]>;
  relevance?: InputMaybe<Scalars["String"]["input"]>;
  grepCodes?: InputMaybe<Scalars["String"]["input"]>;
  traits?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  aggregatePaths?: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  filterInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  license?: InputMaybe<Scalars["String"]["input"]>;
  resultTypes?: InputMaybe<Scalars["String"]["input"]>;
  nodeTypes?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GQLSearchQuery = {
  __typename?: "Query";
  search?: {
    __typename?: "Search";
    pageSize: number;
    page?: number;
    language: string;
    totalCount: number;
    results: Array<
      | ({ __typename?: "ArticleSearchResult" } & GQLSearchResource_ArticleSearchResult_Fragment)
      | ({ __typename?: "LearningpathSearchResult" } & GQLSearchResource_LearningpathSearchResult_Fragment)
      | ({ __typename?: "NodeSearchResult" } & GQLSearchResource_NodeSearchResult_Fragment)
    >;
    suggestions: Array<{
      __typename?: "SuggestionResult";
      suggestions: Array<{
        __typename?: "SearchSuggestion";
        options: Array<{ __typename?: "SuggestOption"; text: string }>;
      }>;
    }>;
    aggregations: Array<{
      __typename?: "AggregationResult";
      values: Array<{ __typename?: "BucketResult"; value: string }>;
    }>;
  };
};

export type GQLAlertsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAlertsQuery = {
  __typename?: "Query";
  alerts?: Array<{ __typename?: "UptimeAlert"; title: string; body?: string; closable: boolean; number: number }>;
};

export type GQLNodeWithMetadataFragment = {
  __typename?: "Node";
  id: string;
  name: string;
  url?: string;
  metadata: { __typename?: "TaxonomyMetadata"; customFields: any };
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
  metaImage?: { __typename?: "MetaImageWithCopyright"; url: string; alt: string };
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

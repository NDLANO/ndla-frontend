export interface GQLTaxonomyEntity {
  id: string;
  name: string;
  contentUri?: string;
  path?: string;
  paths?: Array<string>;
  meta?: GQLMeta;
  metadata?: GQLTaxonomyMetadata;
  article?: GQLArticle;
  filters?: Array<GQLFilter>;
  relevanceId?: string;
  rank?: number;
}

export interface GQLFrontpageSearch {
  topicResources?: GQLFrontPageResources;
  learningResources?: GQLFrontPageResources;
}

export interface GQLFrontPageResources {
  results?: Array<GQLFrontpageSearchResult>;
  totalCount?: number;
  suggestions?: Array<GQLSuggestionResult>;
}

export interface GQLSuggestionResult {
  name?: string;
  suggestions?: Array<GQLSearchSuggestion>;
}

export interface GQLSearchSuggestion {
  text?: string;
  offset?: number;
  length?: number;
  options?: Array<GQLSuggestOption>;
}

export interface GQLSuggestOption {
  text?: string;
  score?: number;
}

export interface GQLFrontpageSearchResult {
  id: string;
  name?: string;
  resourceTypes?: Array<GQLSearchContextResourceTypes>;
  subject?: string;
  path?: string;
  filters?: Array<GQLSearchContextFilter>;
}
export interface GQLTaxonomyMetadata {
  grepCodes?: Array<string>;
  visible?: boolean;
  customFields?: GQLJSON;
}

export type GQLJSON = { [key: string]: string };

export interface GQLMetaImage {
  url?: string;
  alt?: string;
}

export interface GQLMeta {
  id: number;
  title: string;
  introduction?: string;
  metaDescription?: string;
  metaImage?: GQLMetaImage;
  lastUpdated?: string;
}

export interface GQLLicense {
  license: string;
  url?: string;
  description?: string;
}

export interface GQLContributor {
  type: string;
  name: string;
}

export interface GQLLearningpathCopyright {
  license?: GQLLicense;
  contributors?: Array<GQLContributor>;
}

export interface GQLLearningpathStepEmbedUrl {
  url?: string;
  embedType?: string;
}

export interface GQLLearningpathStepOembed {
  type: string;
  version: string;
  height: number;
  html: string;
  width: number;
}

export interface GQLLearningpathStep {
  id: number;
  title: string;
  seqNo: number;
  description?: string;
  embedUrl?: GQLLearningpathStepEmbedUrl;
  license?: GQLLicense;
  metaUrl?: string;
  revision?: number;
  status?: string;
  supportedLanguages?: Array<string>;
  type?: string;
  article?: GQLArticle;
  resource?: GQLResource;
  showTitle?: boolean;
  oembed?: GQLLearningpathStepOembed;
}
export interface GQLLearningpathCoverphoto {
  url?: string;
  metaUrl?: string;
}

export interface GQLLearningpath {
  id: number;
  title: string;
  description?: string;
  copyright?: GQLLearningpathCopyright;
  duration?: number;
  canEdit?: boolean;
  verificationStatus?: string;
  lastUpdated?: string;
  tags?: Array<string>;
  supportedLanguages?: Array<string>;
  isBasedOn?: number;
  learningsteps?: Array<GQLLearningpathStep>;
  metaUrl?: string;
  revision?: number;
  learningstepUrl?: string;
  status?: string;
  coverphoto?: GQLLearningpathCoverphoto;
}

export interface GQLResourceType {
  id: string;
  name: string;
  resources?: Array<GQLResource>;
}

export interface GQLResource extends GQLTaxonomyEntity {
  id: string;
  name: string;
  contentUri?: string;
  path?: string;
  paths?: Array<string>;
  meta?: GQLMeta;
  metadata?: GQLTaxonomyMetadata;
  article?: GQLArticle;
  learningpath?: GQLLearningpath;
  filters?: Array<GQLFilter>;
  rank?: number;
  relevanceId?: string;
  resourceTypes?: Array<GQLResourceType>;
  parentTopics?: Array<GQLTopic>;
  breadcrumbs?: Array<Array<string>>;
}
export interface GQLArticleRequiredLibrary {
  name: string;
  url: string;
  mediaType: string;
}

export interface GQLFootNote {
  ref: number;
  title: string;
  year: string;
  authors: Array<string>;
  edition?: string;
  publisher?: string;
  url?: string;
}

export interface GQLCopyright {
  license?: GQLLicense;
  creators?: Array<GQLContributor>;
  processors?: Array<GQLContributor>;
  rightsholders?: Array<GQLContributor>;
  origin?: string;
}

export interface GQLImageLicense {
  title: string;
  src: string;
  altText: string;
  copyright: GQLCopyright;
}

export interface GQLAudioLicense {
  title: string;
  src: string;
  copyright: GQLCopyright;
}

export interface GQLBrightcoveIframe {
  src: string;
  height: number;
  width: number;
}

export interface GQLBrightcoveLicense {
  title: string;
  description?: string;
  cover?: string;
  src?: string;
  download?: string;
  iframe?: GQLBrightcoveIframe;
  copyright: GQLCopyright;
  uploadDate?: string;
}

export interface GQLH5pLicense {
  title: string;
  src?: string;
  copyright: GQLCopyright;
}

export interface GQLConceptLicense {
  title: string;
  src?: string;
  copyright?: GQLCopyright;
}

export interface GQLArticleMetaData {
  footnotes?: Array<GQLFootNote>;
  images?: Array<GQLImageLicense>;
  audios?: Array<GQLAudioLicense>;
  brightcoves?: Array<GQLBrightcoveLicense>;
  h5ps?: Array<GQLH5pLicense>;
  concepts?: Array<GQLConceptLicense>;
  copyText?: string;
}

export interface GQLReference {
  id: string;
  title: string;
  code?: string;
}

export interface GQLElement {
  reference: GQLReference;
  explanation: Array<string | null>;
}

export interface GQLCompetenceGoal {
  id: string;
  code?: string;
  title: string;
  type: string;
  language?: string;
  curriculumId?: string;
  curriculumCode?: string;
  curriculum?: GQLReference;
  competenceGoalSetCode?: string;
  competenceGoalSet?: GQLReference;
  crossSubjectTopicsCodes?: Array<GQLElement>;
  crossSubjectTopics?: Array<GQLElement>;
  coreElementsCodes?: Array<GQLElement>;
  coreElements?: Array<GQLElement>;
}

export interface GQLCoreElement {
  id: string;
  title: string;
  description?: string;
  language?: string;
  curriculumCode?: string;
  curriculum?: GQLReference;
}

export interface GQLCrossSubjectElement {
  title: string;
  code?: string;
  path?: string;
}

export interface GQLConcept {
  id?: number;
  title?: string;
  content?: string;
  metaImage?: GQLMetaImage;
}

export interface GQLArticle {
  id: number;
  revision: number;
  title: string;
  introduction?: string;
  content: string;
  created: string;
  updated: string;
  published: string;
  visualElement?: GQLVisualElement;
  metaImage?: GQLMetaImage;
  metaDescription: string;
  articleType: string;
  oldNdlaUrl?: string;
  requiredLibraries?: Array<GQLArticleRequiredLibrary>;
  metaData?: GQLArticleMetaData;
  supportedLanguages?: Array<string>;
  copyright: GQLCopyright;
  tags?: Array<string>;
  grepCodes?: Array<string>;
  competenceGoals?: Array<GQLCompetenceGoal>;
  coreElements?: Array<GQLCoreElement>;
  crossSubjectTopics?: Array<GQLCrossSubjectElement>;
  oembed?: string;
  conceptIds?: Array<string>;
  concepts?: Array<GQLConcept>;
}

export interface GQLVisualElement {
  resource?: string;
  url?: string;
  copyright?: GQLCopyright;
  language?: string;
  embed?: string;
  title: string;
  brightcove?: GQLBrightcoveElement;
  h5p?: GQLH5pElement;
  oembed?: GQLVisualElementOembed;
  image?: GQLImageElement;
}

export interface GQLBrightcoveElement {
  videoid?: string;
  player?: string;
  account?: string;
  caption?: string;
  title: string;
  description?: string;
  cover?: string;
  src?: string;
  download?: string;
  iframe?: GQLBrightcoveIframe;
  copyright: GQLCopyright;
  uploadDate?: string;
  copyText?: string;
}

export interface GQLH5pElement {
  path?: string;
  title: string;
  src?: string;
  thumbnail?: string;
  copyright: GQLCopyright;
  copyText?: string;
}

export interface GQLVisualElementOembed {
  title?: string;
  html?: string;
  fullscreen?: boolean;
}

export interface GQLImageElement {
  resourceid?: string;
  fullbredde?: string;
  alt?: string;
  caption?: string;
  lowerRightX?: number;
  lowerRightY?: number;
  upperLeftX?: number;
  upperLeftY?: number;
  focalX?: number;
  focalY?: number;
  title: string;
  src: string;
  altText: string;
  copyright: GQLCopyright;
  contentType?: string;
  copyText?: string;
}

export interface GQLTopic extends GQLTaxonomyEntity {
  id: string;
  name: string;
  contentUri?: string;
  path?: string;
  paths?: Array<string>;
  meta?: GQLMeta;
  metadata?: GQLTaxonomyMetadata;
  article?: GQLArticle;
  filters?: Array<GQLFilter>;
  rank?: number;
  relevanceId?: string;
  isPrimary?: boolean;
  parent?: string;
  subtopics?: Array<GQLTopic>;
  pathTopics?: Array<Array<GQLTopic>>;
  coreResources?: Array<GQLResource>;
  supplementaryResources?: Array<GQLResource>;
  alternateTopics?: Array<GQLTopic>;
  breadcrumbs?: Array<Array<string>>;
}

export interface GQLGroupSearch {
  language: string;
  resourceType: string;
  resources: any[];
  suggestions: any[];
  aggregations: any[];
  totalCount: number;
}

export interface GQLSearchResult {
  id: number;
  title?: string;
  supportedLanguages?: Array<string>;
  url?: string;
  metaDescription?: string;
  metaImage?: GQLMetaImage;
  contentType?: string;
  traits?: Array<string>;
  contexts?: Array<GQLSearchContext>;
}

export interface GQLSearchContext {
  breadcrumbs?: Array<string>;
  learningResourceType?: string;
  resourceTypes?: Array<GQLSearchContextResourceTypes>;
  subject?: string;
  subjectId?: string;
  relevance?: string;
  path?: string;
  id?: string;
  language?: string;
  filters?: Array<GQLSearchContextFilter>;
}

export interface GQLSearchContextResourceTypes {
  id?: string;
  name?: string;
  language?: string;
}

export interface GQLSearchContextFilter {
  id?: string;
  name?: string;
  relevance?: string;
}

export interface GQLSubject {
  id: string;
  contentUri?: string;
  name: string;
  path: string;
  metadata?: GQLTaxonomyMetadata;
  filters?: Array<GQLSubjectFilter>;
  frontpageFilters?: Array<GQLSubjectFilter>;
  subjectpage?: GQLSubjectPage;
  topics?: Array<GQLTopic>;
}
export interface GQLResourceTypeDefinition {
  id: string;
  name: string;
  subtypes?: Array<GQLResourceTypeDefinition>;
}

export interface GQLSubjectPage {
  topical?: GQLTaxonomyEntity;
  mostRead?: Array<GQLTaxonomyEntity>;
  banner?: GQLSubjectPageBanner;
  id: number;
  name?: string;
  facebook?: string;
  editorsChoices?: Array<GQLTaxonomyEntity>;
  latestContent?: Array<GQLTaxonomyEntity>;
  about?: GQLSubjectPageAbout;
  goTo?: Array<GQLResourceTypeDefinition>;
  metaDescription?: string;
  layout?: string;
  twitter?: string;
}
export interface GQLSubjectPageBanner {
  desktopUrl?: string;
  desktopId?: string;
  mobileUrl?: string;
  mobileId?: string;
}
export interface GQLSubjectPageAbout {
  title?: string;
  description?: string;
  visualElement?: GQLSubjectPageVisualElement;
}
export interface GQLSubjectPageVisualElement {
  type?: string;
  url?: string;
  alt?: string;
}

export interface GQLFilter {
  id: string;
  name: string;
  connectionId?: string;
  relevanceId?: string;
  subjectId?: string;
  metadata?: GQLTaxonomyMetadata;
}

export interface GQLSubjectFilter {
  id: string;
  name: string;
  subjectId: string;
  contentUri?: string;
  subjectpage?: GQLSubjectPage;
  metadata?: GQLTaxonomyMetadata;
}

export interface GQLMastheadQueryData {
  resourceTypes: GQLResourceType[];
  meta?: {
    id: number;
    metaDescription: string;
  };
  subject: GQLSubject;
  topic?: GQLTopic;
  resource?: GQLResource;
}

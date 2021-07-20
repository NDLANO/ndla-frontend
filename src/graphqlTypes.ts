export interface GQLTaxonomyEntity {
  id: string;
  name: string;
  contentUri?: string;
  path?: string;
  paths?: Array<string | null>;
  meta?: GQLMeta;
  metadata?: GQLTaxonomyMetadata;
  article?: GQLArticle;
}

export interface GQLTaxonomyMetadata {
  grepCodes?: Array<string | null>;
  visible?: boolean;
}

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
  contributors?: Array<GQLContributor | null>;
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
  supportedLanguages?: Array<string | null>;
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
  tags?: Array<string | null>;
  supportedLanguages?: Array<string | null>;
  isBasedOn?: number;
  learningsteps?: Array<GQLLearningpathStep | null>;
  metaUrl?: string;
  revision?: number;
  learningstepUrl?: string;
  status?: string;
  coverphoto?: GQLLearningpathCoverphoto;
}

export interface GQLResourceType {
  id: string;
  name: string;
  resources?: Array<GQLResource | null>;
}

export interface GQLResource extends GQLTaxonomyEntity {
  id: string;
  name: string;
  contentUri?: string;
  path?: string;
  paths?: Array<string | null>;
  meta?: GQLMeta;
  metadata?: GQLTaxonomyMetadata;
  article?: GQLArticle;
  learningpath?: GQLLearningpath;
  relevanceId?: string;
  resourceTypes?: Array<GQLResourceType | null>;
  parentTopics?: Array<GQLTopic | null>;
  breadcrumbs?: Array<Array<string | null> | null>;
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
  authors: Array<string | null>;
  edition?: string;
  publisher?: string;
  url?: string;
}

export interface GQLCopyright {
  license?: GQLLicense;
  creators?: Array<GQLContributor | null>;
  processors?: Array<GQLContributor | null>;
  rightsholders?: Array<GQLContributor | null>;
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
  footnotes?: Array<GQLFootNote | null>;
  images?: Array<GQLImageLicense | null>;
  audios?: Array<GQLAudioLicense | null>;
  brightcoves?: Array<GQLBrightcoveLicense | null>;
  h5ps?: Array<GQLH5pLicense | null>;
  concepts?: Array<GQLConceptLicense | null>;
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
  crossSubjectTopicsCodes?: Array<GQLElement | null>;
  crossSubjectTopics?: Array<GQLElement | null>;
  coreElementsCodes?: Array<GQLElement | null>;
  coreElements?: Array<GQLElement | null>;
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
  requiredLibraries?: Array<GQLArticleRequiredLibrary | null>;
  metaData?: GQLArticleMetaData;
  supportedLanguages?: Array<string | null>;
  copyright: GQLCopyright;
  tags?: Array<string | null>;
  grepCodes?: Array<string | null>;
  competenceGoals?: Array<GQLCompetenceGoal | null>;
  coreElements?: Array<GQLCoreElement | null>;
  crossSubjectTopics?: Array<GQLCrossSubjectElement | null>;
  oembed?: string;
  conceptIds?: Array<string | null>;
  concepts?: Array<GQLConcept | null>;
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

export interface GQLSearchResultSubject {
  url?: string;
  title?: string;
  breadcrumb?: Array<string | null> | null;
}

export interface GQLSearchResult {
  id: string;
  title: string;
  url?: string;
  ingress?: string;
  metaImage?: GQLMetaImage;
  breadcrumbs?: Array<Array<string | null> | null>;
  subjects?: Array<GQLSearchResultSubject | null>;
  contentType: string;
}

export interface GQLVisualElement {
  resource?: string;
  resourceId?: string;
  title?: string;
  url?: string;
  alt?: string;
  account?: string;
  player?: string;
  videoid?: string;
  thumbnail?: string;
  image?: GQLImageLicense;
  oembed?: GQLVisualElementOembed;
  lowerRightX?: number;
  lowerRightY?: number;
  upperLeftX?: number;
  upperLeftY?: number;
  focalX?: number;
  focalY?: number;
  copyright?: GQLCopyright;
  copyText?: string;
  embed?: string;
  language?: string;
}


export interface GQLVisualElementOembed {
  title?: string;
  html?: string;
  fullscreen?: boolean;
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

export interface GQLSubjectFilter {
  id: string;
  name: string;
  subjectId: string;
  contentUri?: string;
  subjectpage?: GQLSubjectPage;
  metadata?: GQLTaxonomyMetadata;
}

export interface GQLResourceTypeDefinition {
  id: string;
  name: string;
  subtypes?: Array<GQLResourceTypeDefinition | null>;
}

export interface GQLSubjectPage {
  topical?: GQLTaxonomyEntity;
  mostRead?: Array<GQLTaxonomyEntity | null>;
  banner?: GQLSubjectPageBanner;
  id: number;
  name?: string;
  facebook?: string;
  editorsChoices?: Array<GQLTaxonomyEntity | null>;
  latestContent?: Array<GQLTaxonomyEntity | null>;
  about?: GQLSubjectPageAbout;
  goTo?: Array<GQLResourceTypeDefinition | null>;
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

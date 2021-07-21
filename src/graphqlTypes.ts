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
  resourceTypes?: Array<GQLResourceType>;
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
  visualElement?: string;
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
  paths?: Array<string | null>;
  meta?: GQLMeta;
  metadata?: GQLTaxonomyMetadata;
  article?: GQLArticle;
  relevanceId?: string;
  isPrimary?: boolean;
  parent?: string;
  subtopics?: Array<GQLTopic | null>;
  pathTopics?: Array<Array<GQLTopic | null> | null>;
  coreResources?: Array<GQLResource | null>;
  supplementaryResources?: Array<GQLResource | null>;
  breadcrumbs?: Array<Array<string | null> | null>;
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

export interface GQLSubject {
  id: string;
  contentUri?: string;
  name: string;
  path: string;
  metadata?: GQLTaxonomyMetadata;
  subjectpage?: GQLSubjectPage;
  topics?: Array<GQLTopic | null>;
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

export interface GQLFrontpageSearch {
  topicResources?: GQLFrontPageResources;
  learningResources?: GQLFrontPageResources;
}

export interface GQLFrontPageResources {
  results?: Array<GQLFrontpageSearchResult | null>;
  totalCount?: number;
  suggestions?: Array<GQLSuggestionResult | null>;
}

export interface GQLFrontpageSearchResult {
  id: string;
  name?: string;
  resourceTypes?: Array<GQLSearchContextResourceTypes | null>;
  subject?: string;
  path?: string;
  filters?: Array<GQLSearchContextFilter | null>;
}

export interface GQLSearchContextFilter {
  id?: string;
  name?: string;
  relevance?: string;
}

export interface GQLSearchContextResourceTypes {
  id?: string;
  name?: string;
  language?: string;
}

export interface GQLSuggestionResult {
  name?: string;
  suggestions?: Array<GQLSearchSuggestion | null>;
}

export interface GQLSearchSuggestion {
  text?: string;
  offset?: number;
  length?: number;
  options?: Array<GQLSuggestOption | null>;
}

export interface GQLSuggestOption {
  text?: string;
  score?: number;
}

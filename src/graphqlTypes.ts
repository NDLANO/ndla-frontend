/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type GQLContributorInput = {
  name: string;
  type: string;
};

export type GQLLearningpathCopyInput = {
  copyright?: GQLLearningpathCopyrightInput | null | undefined;
  coverPhotoMetaUrl?: string | null | undefined;
  description?: string | null | undefined;
  duration?: number | null | undefined;
  language: string;
  tags?: Array<string> | null | undefined;
  title: string;
};

export type GQLLearningpathCopyrightInput = {
  contributors: Array<GQLContributorInput>;
  license: GQLLicenseInput;
};

export type GQLLearningpathEmbedInput = {
  embedType: string;
  url: string;
};

export type GQLLearningpathNewInput = {
  copyright: GQLLearningpathCopyrightInput;
  coverPhotoMetaUrl?: string | null | undefined;
  description?: string | null | undefined;
  duration?: number | null | undefined;
  introduction?: string | null | undefined;
  language: string;
  tags?: Array<string> | null | undefined;
  title: string;
};

export type GQLLearningpathStepNewInput = {
  articleId?: number | null | undefined;
  copyright?: GQLLearningpathCopyrightInput | null | undefined;
  description?: string | null | undefined;
  embedUrl?: GQLLearningpathEmbedInput | null | undefined;
  introduction?: string | null | undefined;
  language: string;
  license?: string | null | undefined;
  showTitle: boolean;
  title: string;
  type: GQLLearningpathStepType;
};

export type GQLLearningpathStepType = "ARTICLE" | "EXTERNAL" | "TEXT";

export type GQLLearningpathStepUpdateInput = {
  articleId?: number | null | undefined;
  copyright?: GQLLearningpathCopyrightInput | null | undefined;
  description?: string | null | undefined;
  embedUrl?: GQLLearningpathEmbedInput | null | undefined;
  introduction?: string | null | undefined;
  language: string;
  license?: string | null | undefined;
  revision: number;
  showTitle?: boolean | null | undefined;
  title?: string | null | undefined;
  type?: GQLLearningpathStepType | null | undefined;
};

export type GQLLearningpathUpdateInput = {
  copyright?: GQLLearningpathCopyrightInput | null | undefined;
  coverPhotoMetaUrl?: string | null | undefined;
  deleteMessage?: boolean | null | undefined;
  description?: string | null | undefined;
  duration?: number | null | undefined;
  introduction?: string | null | undefined;
  language: string;
  revision: number;
  tags?: Array<string> | null | undefined;
  title?: string | null | undefined;
};

export type GQLLicenseInput = {
  description?: string | null | undefined;
  license: string;
  url?: string | null | undefined;
};

export type GQLMyNdlaResourceMetaSearchInput = {
  id: string;
  path: string;
  resourceType: string;
};

export type GQLTransformedArticleContentInput = {
  absoluteUrl?: boolean | null | undefined;
  contextId?: string | null | undefined;
  draftConcept?: boolean | null | undefined;
  isOembed?: string | null | undefined;
  path?: string | null | undefined;
  previewH5p?: boolean | null | undefined;
  showVisualElement?: string | null | undefined;
  subjectId?: string | null | undefined;
};

export type GQLAlertsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAlertsQuery = {
  alerts: Array<{
    __typename: "UptimeAlert";
    title: string;
    body: string | null;
    closable: boolean;
    number: number;
  }> | null;
};

export type GQLArticle_ArticleFragment = {
  __typename: "Article";
  id: number;
  created: string;
  updated: string;
  supportedLanguages: Array<string>;
  grepCodes: Array<string> | null;
  htmlIntroduction: string | null;
  htmlTitle: string;
  oembed: string | null;
  traits: Array<string>;
  revision: number;
  language: string;
  published: string;
  revised: string;
  revisionDate: string | null;
  title: string;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        id: string;
        title: string;
        download: string | null;
        src: string | null;
        cover: string | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        id: string;
        src: string;
        title: string;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        id: string;
        src: string;
        copyText: string | null;
        title: string;
        description: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      images: Array<{
        __typename: "ImageLicense";
        id: string;
        title: string;
        altText: string;
        src: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
  transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

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
  groups: Array<{
    __typename: "MyNdlaGroup";
    id: string;
    displayName: string;
    isPrimarySchool: boolean;
    parentId: string | null;
  }>;
};

export type GQLMyNdlaDataQueryVariables = Exact<{ [key: string]: never }>;

export type GQLMyNdlaDataQuery = {
  examLockStatus: { __typename: "ConfigMetaBoolean"; key: string; value: boolean };
  personalData: {
    __typename: "MyNdlaPersonalData";
    id: number;
    username: string;
    email: string;
    displayName: string;
    organization: string;
    favoriteSubjects: Array<string>;
    role: string;
    arenaEnabled: boolean;
    groups: Array<{
      __typename: "MyNdlaGroup";
      id: string;
      displayName: string;
      isPrimarySchool: boolean;
      parentId: string | null;
    }>;
  } | null;
};

export type GQLCompetenceGoalsQueryVariables = Exact<{
  codes?: Array<string> | string | null | undefined;
  language?: string | null | undefined;
  subjectId?: string | null | undefined;
  includeSubject: boolean;
}>;

export type GQLCompetenceGoalsQuery = {
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    title: string;
    type: string;
    curriculum: { __typename: "Reference"; id: string; title: string } | null;
    competenceGoalSet: { __typename: "Reference"; id: string; title: string } | null;
  }>;
  coreElements: Array<{
    __typename: "CoreElement";
    id: string;
    title: string;
    description: string | null;
    curriculum: { __typename: "Reference"; id: string; title: string } | null;
  }>;
  node?: {
    __typename: "Node";
    id: string;
    metadata: { __typename: "TaxonomyMetadata"; grepCodes: Array<string> };
  } | null;
};

export type GQLDisclaimer_ArticleFragment = {
  __typename: "Article";
  id: number;
  transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
};

export type GQLFavoriteSubject_NodeFragment = { __typename: "Node"; id: string; name: string };

export type GQLLastLearningpathStepInfo_NodeFragment = {
  __typename: "Node";
  id: string;
  context: {
    __typename: "TaxonomyContext";
    parents: Array<{ __typename: "TaxonomyCrumb"; id: string; contextId: string; name: string; url: string }> | null;
  } | null;
};

type GQLLearningpathContent_LearningpathStep_LearningpathStep_Fragment = {
  __typename: "LearningpathStep";
  id: number;
  title: string;
  introduction: string | null;
  type: GQLLearningpathStepType;
  description: string | null;
  showTitle: boolean;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  resource: {
    __typename: "Resource";
    id: string;
    nodeType: string;
    url: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      articleType: string;
      title: string;
      published: string;
      revised: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      oembed: string | null;
      traits: Array<string>;
      revision: number;
      language: string;
      revisionDate: string | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        origin: string | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      metaImage: {
        __typename: "ImageMetaInformationV3";
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            id: string;
            altText: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            id: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    } | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
  oembed: {
    __typename: "LearningpathStepOembed";
    html: string;
    width: number;
    height: number;
    type: string;
    version: string;
  } | null;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  } | null;
};

type GQLLearningpathContent_LearningpathStep_MyNdlaLearningpathStep_Fragment = {
  __typename: "MyNdlaLearningpathStep";
  id: number;
  title: string;
  introduction: string | null;
  type: GQLLearningpathStepType;
  description: string | null;
  showTitle: boolean;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  resource: {
    __typename: "Resource";
    id: string;
    nodeType: string;
    url: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      articleType: string;
      title: string;
      published: string;
      revised: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      oembed: string | null;
      traits: Array<string>;
      revision: number;
      language: string;
      revisionDate: string | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        origin: string | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      metaImage: {
        __typename: "ImageMetaInformationV3";
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            id: string;
            altText: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            id: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    } | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
  oembed: {
    __typename: "LearningpathStepOembed";
    html: string;
    width: number;
    height: number;
    type: string;
    version: string;
  } | null;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  } | null;
};

export type GQLLearningpathContent_LearningpathStepFragment =
  | GQLLearningpathContent_LearningpathStep_LearningpathStep_Fragment
  | GQLLearningpathContent_LearningpathStep_MyNdlaLearningpathStep_Fragment;

type GQLLearningpathContent_Learningpath_Learningpath_Fragment = {
  __typename: "Learningpath";
  id: number;
  title: string;
  introduction: string | null;
  learningsteps: Array<{ __typename: "LearningpathStep"; id: number }>;
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

type GQLLearningpathContent_Learningpath_MyNdlaLearningpath_Fragment = {
  __typename: "MyNdlaLearningpath";
  id: number;
  title: string;
  introduction: string | null;
  learningsteps: Array<{ __typename: "MyNdlaLearningpathStep"; id: number }>;
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLLearningpathContent_LearningpathFragment =
  | GQLLearningpathContent_Learningpath_Learningpath_Fragment
  | GQLLearningpathContent_Learningpath_MyNdlaLearningpath_Fragment;

export type GQLLearningpathContent_NodeFragment = {
  __typename: "Node";
  id: string;
  url: string | null;
  name: string;
  context: {
    __typename: "TaxonomyContext";
    contextId: string;
    isArchived: boolean;
    parents: Array<{ __typename: "TaxonomyCrumb"; id: string; contextId: string; url: string; name: string }> | null;
  } | null;
};

type GQLLearningpathMenu_Learningpath_Learningpath_Fragment = {
  __typename: "Learningpath";
  id: number;
  title: string;
  lastUpdated: string;
  basedOn: string | null;
  isMyNDLAOwner: boolean;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
  learningsteps: Array<{ __typename: "LearningpathStep"; id: number; title: string; seqNo: number }>;
};

type GQLLearningpathMenu_Learningpath_MyNdlaLearningpath_Fragment = {
  __typename: "MyNdlaLearningpath";
  id: number;
  title: string;
  lastUpdated: string;
  basedOn: string | null;
  isMyNDLAOwner: boolean;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
  learningsteps: Array<{ __typename: "MyNdlaLearningpathStep"; id: number; title: string; seqNo: number }>;
};

export type GQLLearningpathMenu_LearningpathFragment =
  | GQLLearningpathMenu_Learningpath_Learningpath_Fragment
  | GQLLearningpathMenu_Learningpath_MyNdlaLearningpath_Fragment;

export type GQLLearningpathEmbed_ArticleFragment = {
  __typename: "Article";
  id: number;
  metaDescription: string;
  created: string;
  updated: string;
  articleType: string;
  title: string;
  published: string;
  revised: string;
  supportedLanguages: Array<string>;
  grepCodes: Array<string> | null;
  htmlIntroduction: string | null;
  htmlTitle: string;
  oembed: string | null;
  traits: Array<string>;
  revision: number;
  language: string;
  revisionDate: string | null;
  requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    origin: string | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
  metaImage: {
    __typename: "ImageMetaInformationV3";
    image: { __typename: "ImageV3"; imageUrl: string };
    alttext: { __typename: "ImageAltText"; alttext: string };
  } | null;
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    code: string | null;
    title: string;
    type: string;
  }>;
  coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      images: Array<{
        __typename: "ImageLicense";
        src: string;
        title: string;
        id: string;
        altText: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        src: string;
        title: string;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        src: string;
        title: string;
        description: string | null;
        id: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        src: string | null;
        title: string;
        cover: string | null;
        description: string | null;
        download: string | null;
        uploadDate: string | null;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
      }>;
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
  transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
};

type GQLArticleStep_LearningpathStep_LearningpathStep_Fragment = {
  __typename: "LearningpathStep";
  id: number;
  title: string;
  description: string | null;
  introduction: string | null;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  resource: {
    __typename: "Resource";
    id: string;
    nodeType: string;
    url: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      articleType: string;
      title: string;
      published: string;
      revised: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      oembed: string | null;
      traits: Array<string>;
      revision: number;
      language: string;
      revisionDate: string | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        origin: string | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      metaImage: {
        __typename: "ImageMetaInformationV3";
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            id: string;
            altText: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            id: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    } | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
  oembed: {
    __typename: "LearningpathStepOembed";
    html: string;
    width: number;
    height: number;
    type: string;
    version: string;
  } | null;
};

type GQLArticleStep_LearningpathStep_MyNdlaLearningpathStep_Fragment = {
  __typename: "MyNdlaLearningpathStep";
  id: number;
  title: string;
  description: string | null;
  introduction: string | null;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  resource: {
    __typename: "Resource";
    id: string;
    nodeType: string;
    url: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      articleType: string;
      title: string;
      published: string;
      revised: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      oembed: string | null;
      traits: Array<string>;
      revision: number;
      language: string;
      revisionDate: string | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        origin: string | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      metaImage: {
        __typename: "ImageMetaInformationV3";
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            id: string;
            altText: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            id: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    } | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
  oembed: {
    __typename: "LearningpathStepOembed";
    html: string;
    width: number;
    height: number;
    type: string;
    version: string;
  } | null;
};

export type GQLArticleStep_LearningpathStepFragment =
  | GQLArticleStep_LearningpathStep_LearningpathStep_Fragment
  | GQLArticleStep_LearningpathStep_MyNdlaLearningpathStep_Fragment;

export type GQLLearningpathStepQueryVariables = Exact<{
  articleId: string;
  resourceId: string;
  includeResource: boolean;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLLearningpathStepQuery = {
  article: {
    __typename: "Article";
    oembed: string | null;
    id: number;
    metaDescription: string;
    created: string;
    updated: string;
    articleType: string;
    title: string;
    published: string;
    revised: string;
    supportedLanguages: Array<string>;
    grepCodes: Array<string> | null;
    htmlIntroduction: string | null;
    htmlTitle: string;
    traits: Array<string>;
    revision: number;
    language: string;
    revisionDate: string | null;
    requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
    copyright: {
      __typename: "Copyright";
      processed: boolean | null;
      origin: string | null;
      license: { __typename: "License"; url: string | null; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
    metaImage: {
      __typename: "ImageMetaInformationV3";
      image: { __typename: "ImageV3"; imageUrl: string };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
    competenceGoals: Array<{
      __typename: "CompetenceGoal";
      id: string;
      code: string | null;
      title: string;
      type: string;
    }>;
    coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
    transformedContent: {
      __typename: "TransformedArticleContent";
      content: string;
      metaData: {
        __typename: "ArticleMetaData";
        copyText: string | null;
        images: Array<{
          __typename: "ImageLicense";
          src: string;
          title: string;
          id: string;
          altText: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        audios: Array<{
          __typename: "AudioLicense";
          src: string;
          title: string;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        podcasts: Array<{
          __typename: "PodcastLicense";
          src: string;
          title: string;
          description: string | null;
          id: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        brightcoves: Array<{
          __typename: "BrightcoveLicense";
          src: string | null;
          title: string;
          cover: string | null;
          description: string | null;
          download: string | null;
          uploadDate: string | null;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
          iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        }>;
        footnotes: Array<{
          __typename: "FootNote";
          ref: number;
          title: string;
          year: string;
          authors: Array<string>;
          edition: string | null;
          publisher: string | null;
          url: string | null;
        }>;
        concepts: Array<{
          __typename: "ConceptLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        glosses: Array<{
          __typename: "GlossLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        h5ps: Array<{
          __typename: "H5pLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        textblocks: Array<{
          __typename: "TextblockLicense";
          title: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
      } | null;
    };
    transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
  } | null;
  node?: {
    __typename: "Node";
    id: string;
    nodeType: string;
    url: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
  } | null;
};

export type GQLCopyPublicLearningpathMutationVariables = Exact<{
  learningpathId: number;
  params: GQLLearningpathCopyInput;
}>;

export type GQLCopyPublicLearningpathMutation = { copyLearningpath: { __typename: "MyNdlaLearningpath"; id: number } };

type GQLCopyLearningpath_Learningpath_Learningpath_Fragment = {
  __typename: "Learningpath";
  id: number;
  title: string;
  copyright: { __typename: "LearningpathCopyright"; license: { __typename: "License"; license: string } };
};

type GQLCopyLearningpath_Learningpath_MyNdlaLearningpath_Fragment = {
  __typename: "MyNdlaLearningpath";
  id: number;
  title: string;
  copyright: { __typename: "LearningpathCopyright"; license: { __typename: "License"; license: string } };
};

export type GQLCopyLearningpath_LearningpathFragment =
  | GQLCopyLearningpath_Learningpath_Learningpath_Fragment
  | GQLCopyLearningpath_Learningpath_MyNdlaLearningpath_Fragment;

type GQLExternalStep_LearningpathStep_LearningpathStep_Fragment = {
  __typename: "LearningpathStep";
  id: number;
  title: string;
  introduction: string | null;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string } | null;
};

type GQLExternalStep_LearningpathStep_MyNdlaLearningpathStep_Fragment = {
  __typename: "MyNdlaLearningpathStep";
  id: number;
  title: string;
  introduction: string | null;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string } | null;
};

export type GQLExternalStep_LearningpathStepFragment =
  | GQLExternalStep_LearningpathStep_LearningpathStep_Fragment
  | GQLExternalStep_LearningpathStep_MyNdlaLearningpathStep_Fragment;

type GQLExternalStep_Learningpath_Learningpath_Fragment = {
  __typename: "Learningpath";
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
};

type GQLExternalStep_Learningpath_MyNdlaLearningpath_Fragment = {
  __typename: "MyNdlaLearningpath";
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
};

export type GQLExternalStep_LearningpathFragment =
  | GQLExternalStep_Learningpath_Learningpath_Fragment
  | GQLExternalStep_Learningpath_MyNdlaLearningpath_Fragment;

type GQLLearningpathNavigation_Learningpath_Learningpath_Fragment = {
  __typename: "Learningpath";
  id: number;
  introduction: string | null;
  learningsteps: Array<{ __typename: "LearningpathStep"; id: number }>;
};

type GQLLearningpathNavigation_Learningpath_MyNdlaLearningpath_Fragment = {
  __typename: "MyNdlaLearningpath";
  id: number;
  introduction: string | null;
  learningsteps: Array<{ __typename: "MyNdlaLearningpathStep"; id: number }>;
};

export type GQLLearningpathNavigation_LearningpathFragment =
  | GQLLearningpathNavigation_Learningpath_Learningpath_Fragment
  | GQLLearningpathNavigation_Learningpath_MyNdlaLearningpath_Fragment;

type GQLLearningpathStep_LearningpathStep_LearningpathStep_Fragment = {
  __typename: "LearningpathStep";
  id: number;
  type: GQLLearningpathStepType;
  title: string;
  description: string | null;
  introduction: string | null;
  showTitle: boolean;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  resource: {
    __typename: "Resource";
    id: string;
    nodeType: string;
    url: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      articleType: string;
      title: string;
      published: string;
      revised: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      oembed: string | null;
      traits: Array<string>;
      revision: number;
      language: string;
      revisionDate: string | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        origin: string | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      metaImage: {
        __typename: "ImageMetaInformationV3";
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            id: string;
            altText: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            id: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    } | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
  oembed: {
    __typename: "LearningpathStepOembed";
    html: string;
    width: number;
    height: number;
    type: string;
    version: string;
  } | null;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  } | null;
};

type GQLLearningpathStep_LearningpathStep_MyNdlaLearningpathStep_Fragment = {
  __typename: "MyNdlaLearningpathStep";
  id: number;
  type: GQLLearningpathStepType;
  title: string;
  description: string | null;
  introduction: string | null;
  showTitle: boolean;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  resource: {
    __typename: "Resource";
    id: string;
    nodeType: string;
    url: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      articleType: string;
      title: string;
      published: string;
      revised: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      oembed: string | null;
      traits: Array<string>;
      revision: number;
      language: string;
      revisionDate: string | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; name: string; url: string; mediaType: string }>;
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        origin: string | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      metaImage: {
        __typename: "ImageMetaInformationV3";
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            id: string;
            altText: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            id: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    } | null;
  } | null;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
  oembed: {
    __typename: "LearningpathStepOembed";
    html: string;
    width: number;
    height: number;
    type: string;
    version: string;
  } | null;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  } | null;
};

export type GQLLearningpathStep_LearningpathStepFragment =
  | GQLLearningpathStep_LearningpathStep_LearningpathStep_Fragment
  | GQLLearningpathStep_LearningpathStep_MyNdlaLearningpathStep_Fragment;

type GQLLearningpathStep_Learningpath_Learningpath_Fragment = {
  __typename: "Learningpath";
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

type GQLLearningpathStep_Learningpath_MyNdlaLearningpath_Fragment = {
  __typename: "MyNdlaLearningpath";
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLLearningpathStep_LearningpathFragment =
  | GQLLearningpathStep_Learningpath_Learningpath_Fragment
  | GQLLearningpathStep_Learningpath_MyNdlaLearningpath_Fragment;

type GQLLearningpathStepTitle_LearningpathStep_LearningpathStep_Fragment = {
  __typename: "LearningpathStep";
  id: number;
  showTitle: boolean;
  description: string | null;
  title: string;
  copyright: { __typename: "LearningpathCopyright"; license: { __typename: "License"; license: string } } | null;
};

type GQLLearningpathStepTitle_LearningpathStep_MyNdlaLearningpathStep_Fragment = {
  __typename: "MyNdlaLearningpathStep";
  id: number;
  showTitle: boolean;
  description: string | null;
  title: string;
  copyright: { __typename: "LearningpathCopyright"; license: { __typename: "License"; license: string } } | null;
};

export type GQLLearningpathStepTitle_LearningpathStepFragment =
  | GQLLearningpathStepTitle_LearningpathStep_LearningpathStep_Fragment
  | GQLLearningpathStepTitle_LearningpathStep_MyNdlaLearningpathStep_Fragment;

type GQLTextStep_LearningpathStep_LearningpathStep_Fragment = {
  __typename: "LearningpathStep";
  id: number;
  title: string;
  introduction: string | null;
  description: string | null;
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  } | null;
};

type GQLTextStep_LearningpathStep_MyNdlaLearningpathStep_Fragment = {
  __typename: "MyNdlaLearningpathStep";
  id: number;
  title: string;
  introduction: string | null;
  description: string | null;
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  } | null;
};

export type GQLTextStep_LearningpathStepFragment =
  | GQLTextStep_LearningpathStep_LearningpathStep_Fragment
  | GQLTextStep_LearningpathStep_MyNdlaLearningpathStep_Fragment;

type GQLTextStep_Learningpath_Learningpath_Fragment = {
  __typename: "Learningpath";
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
};

type GQLTextStep_Learningpath_MyNdlaLearningpath_Fragment = {
  __typename: "MyNdlaLearningpath";
  copyright: {
    __typename: "LearningpathCopyright";
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
};

export type GQLTextStep_LearningpathFragment =
  | GQLTextStep_Learningpath_Learningpath_Fragment
  | GQLTextStep_Learningpath_MyNdlaLearningpath_Fragment;

export type GQLAddResourceToFolderStructureQueryVariables = Exact<{
  path: string;
}>;

export type GQLAddResourceToFolderStructureQuery = {
  folders: {
    __typename: "UserFolder";
    folders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "Folder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
  };
  myNdlaResourceConnections: Array<{
    __typename: "MyNdlaResourceConnection";
    folderId: string | null;
    resourceId: string;
  }>;
};

export type GQLUpdateResourceTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLUpdateResourceTagsQuery = { myNdlaResourceTags: Array<string> };

export type GQLSubjectLinks_SubjectPageFragment = {
  __typename: "SubjectPage";
  buildsOn: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
  connectedTo: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
  leadsTo: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
};

type GQLTransportationSearchResult_SearchResult_ArticleSearchResult_Fragment = {
  __typename: "ArticleSearchResult";
  traits: Array<string>;
  id: string;
  title: string;
  url: string;
  metaDescription: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  context: {
    __typename: "SearchContext";
    contextId: string;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
};

type GQLTransportationSearchResult_SearchResult_LearningpathSearchResult_Fragment = {
  __typename: "LearningpathSearchResult";
  traits: Array<string>;
  id: string;
  title: string;
  url: string;
  metaDescription: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  context: {
    __typename: "SearchContext";
    contextId: string;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
};

type GQLTransportationSearchResult_SearchResult_NodeSearchResult_Fragment = {
  __typename: "NodeSearchResult";
  id: string;
  title: string;
  url: string;
  metaDescription: string;
  context: {
    __typename: "SearchContext";
    contextId: string;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
};

export type GQLTransportationSearchResult_SearchResultFragment =
  | GQLTransportationSearchResult_SearchResult_ArticleSearchResult_Fragment
  | GQLTransportationSearchResult_SearchResult_LearningpathSearchResult_Fragment
  | GQLTransportationSearchResult_SearchResult_NodeSearchResult_Fragment;

export type GQLTransportationNode_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  name: string;
  url: string | null;
  relevanceId: string | null;
  meta: {
    __typename: "Meta";
    metaDescription: string | null;
    metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  } | null;
  context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
};

export type GQLAudioLicenseList_AudioLicenseFragment = {
  __typename: "AudioLicense";
  id: string;
  src: string;
  title: string;
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLGlossLicenseList_GlossLicenseFragment = {
  __typename: "GlossLicense";
  id: string;
  title: string;
  src: string | null;
  copyright: {
    __typename: "ConceptCopyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string } | null;
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  } | null;
};

export type GQLConceptLicenseList_ConceptLicenseFragment = {
  __typename: "ConceptLicense";
  id: string;
  title: string;
  src: string | null;
  copyright: {
    __typename: "ConceptCopyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string } | null;
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  } | null;
};

export type GQLH5pLicenseList_H5pLicenseFragment = {
  __typename: "H5pLicense";
  id: string;
  title: string;
  src: string | null;
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  } | null;
};

export type GQLImageLicenseList_ImageLicenseFragment = {
  __typename: "ImageLicense";
  id: string;
  title: string;
  altText: string;
  src: string;
  copyText: string | null;
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLLicenseBox_ArticleFragment = {
  __typename: "Article";
  id: number;
  title: string;
  htmlTitle: string;
  published: string;
  revised: string;
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
  transformedContent: {
    __typename: "TransformedArticleContent";
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        id: string;
        title: string;
        download: string | null;
        src: string | null;
        cover: string | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        id: string;
        src: string;
        title: string;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        id: string;
        src: string;
        copyText: string | null;
        title: string;
        description: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      images: Array<{
        __typename: "ImageLicense";
        id: string;
        title: string;
        altText: string;
        src: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
};

export type GQLPodcastLicenseList_PodcastLicenseFragment = {
  __typename: "PodcastLicense";
  id: string;
  src: string;
  copyText: string | null;
  title: string;
  description: string | null;
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLTextLicenseList_CopyrightFragment = {
  __typename: "Copyright";
  origin: string | null;
  processed: boolean | null;
  license: { __typename: "License"; license: string };
  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
};

export type GQLVideoLicenseList_BrightcoveLicenseFragment = {
  __typename: "BrightcoveLicense";
  id: string;
  title: string;
  download: string | null;
  src: string | null;
  cover: string | null;
  iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  } | null;
};

export type GQLLicenseListCopyrightFragment = {
  __typename: "Copyright";
  origin: string | null;
  processed: boolean | null;
  license: { __typename: "License"; license: string };
  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
};

export type GQLAboutPageLeaf_ArticleFragment = {
  __typename: "Article";
  id: number;
  introduction: string | null;
  grepCodes: Array<string> | null;
  htmlIntroduction: string | null;
  created: string;
  updated: string;
  slug: string | null;
  language: string;
  published: string;
  htmlTitle: string;
  revised: string;
  revisionDate: string | null;
  title: string;
  metaDescription: string;
  supportedLanguages: Array<string>;
  requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      images: Array<{
        __typename: "ImageLicense";
        src: string;
        title: string;
        id: string;
        altText: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        src: string;
        title: string;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        src: string;
        title: string;
        description: string | null;
        id: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        src: string | null;
        title: string;
        cover: string | null;
        description: string | null;
        download: string | null;
        uploadDate: string | null;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
      }>;
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    origin: string | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
  metaImage: {
    __typename: "ImageMetaInformationV3";
    image: { __typename: "ImageV3"; imageUrl: string };
    alttext: { __typename: "ImageAltText"; alttext: string };
  } | null;
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    code: string | null;
    title: string;
    type: string;
  }>;
  coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
};

export type GQLAboutPageNode_ArticleFragment = {
  __typename: "Article";
  id: number;
  title: string;
  introduction: string | null;
  htmlIntroduction: string | null;
  slug: string | null;
  language: string;
  created: string;
  updated: string;
  published: string;
  oembed: string | null;
  htmlTitle: string;
  revised: string;
  metaDescription: string;
  supportedLanguages: Array<string>;
  revisionDate: string | null;
  requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
  metaImage: {
    __typename: "ImageMetaInformationV3";
    image: { __typename: "ImageV3"; imageUrl: string };
    alttext: { __typename: "ImageAltText"; alttext: string };
  } | null;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      images: Array<{
        __typename: "ImageLicense";
        src: string;
        title: string;
        id: string;
        altText: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        src: string;
        title: string;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        src: string;
        title: string;
        description: string | null;
        id: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        src: string | null;
        title: string;
        cover: string | null;
        description: string | null;
        download: string | null;
        uploadDate: string | null;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
      }>;
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
  visualElementEmbed: { __typename: "ResourceEmbed"; content: string } | null;
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    origin: string | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    code: string | null;
    title: string;
    type: string;
  }>;
  coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
};

export type GQLAboutPageNode_FrontpageMenuFragment = {
  __typename: "FrontpageMenu";
  articleId: number;
  article: { __typename: "Article"; id: number; title: string; slug: string | null; metaDescription: string };
};

export type GQLAboutPageQueryVariables = Exact<{
  slug: string;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLAboutPageQuery = {
  article: {
    __typename: "Article";
    id: number;
    introduction: string | null;
    grepCodes: Array<string> | null;
    htmlIntroduction: string | null;
    created: string;
    updated: string;
    slug: string | null;
    language: string;
    published: string;
    title: string;
    oembed: string | null;
    htmlTitle: string;
    revised: string;
    revisionDate: string | null;
    metaDescription: string;
    supportedLanguages: Array<string>;
    requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
    transformedContent: {
      __typename: "TransformedArticleContent";
      content: string;
      metaData: {
        __typename: "ArticleMetaData";
        copyText: string | null;
        images: Array<{
          __typename: "ImageLicense";
          src: string;
          title: string;
          id: string;
          altText: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        audios: Array<{
          __typename: "AudioLicense";
          src: string;
          title: string;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        podcasts: Array<{
          __typename: "PodcastLicense";
          src: string;
          title: string;
          description: string | null;
          id: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        brightcoves: Array<{
          __typename: "BrightcoveLicense";
          src: string | null;
          title: string;
          cover: string | null;
          description: string | null;
          download: string | null;
          uploadDate: string | null;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
          iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        }>;
        footnotes: Array<{
          __typename: "FootNote";
          ref: number;
          title: string;
          year: string;
          authors: Array<string>;
          edition: string | null;
          publisher: string | null;
          url: string | null;
        }>;
        concepts: Array<{
          __typename: "ConceptLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        glosses: Array<{
          __typename: "GlossLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        h5ps: Array<{
          __typename: "H5pLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        textblocks: Array<{
          __typename: "TextblockLicense";
          title: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
      } | null;
    };
    metaImage: {
      __typename: "ImageMetaInformationV3";
      image: { __typename: "ImageV3"; imageUrl: string };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
    visualElementEmbed: { __typename: "ResourceEmbed"; content: string } | null;
    copyright: {
      __typename: "Copyright";
      processed: boolean | null;
      origin: string | null;
      license: { __typename: "License"; url: string | null; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
    competenceGoals: Array<{
      __typename: "CompetenceGoal";
      id: string;
      code: string | null;
      title: string;
      type: string;
    }>;
    coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
  } | null;
  frontpage: {
    __typename: "FrontpageMenu";
    articleId: number;
    menu: Array<{
      __typename: "FrontpageMenu";
      articleId: number;
      menu: Array<{
        __typename: "FrontpageMenu";
        articleId: number;
        menu: Array<{
          __typename: "FrontpageMenu";
          articleId: number;
          article: { __typename: "Article"; id: number; title: string; slug: string | null; metaDescription: string };
        }>;
        article: { __typename: "Article"; id: number; title: string; slug: string | null; metaDescription: string };
      }>;
      article: { __typename: "Article"; id: number; title: string; slug: string | null; metaDescription: string };
    }>;
    article: { __typename: "Article"; id: number; title: string; slug: string | null; metaDescription: string };
  } | null;
};

export type GQLAllSubjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GQLAllSubjectsQuery = {
  nodes: Array<{
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
  }> | null;
};

export type GQLFavoriteSubjects_NodeFragment = { __typename: "Node"; id: string; url: string | null; name: string };

export type GQLSubjectCategory_NodeFragment = { __typename: "Node"; id: string; url: string | null; name: string };

export type GQLSubjectLink_NodeFragment = { __typename: "Node"; id: string; url: string | null; name: string };

export type GQLArticleLaunchpad_ResourceFragment = {
  __typename: "Node";
  id: string;
  name: string;
  relevanceId: string | null;
  contentUri: string | null;
  url: string | null;
  language: string | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
  context: { __typename: "TaxonomyContext"; contextId: string } | null;
  learningpath: { __typename: "Learningpath"; id: number; description: string } | null;
  article: { __typename: "Article"; id: number; revision: number; traits: Array<string> } | null;
};

export type GQLArticleLaunchpad_NodeFragment = {
  __typename: "Node";
  id: string;
  name: string;
  links: Array<{
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
  }> | null;
};

export type GQLArticleLayoutQueryVariables = Exact<{
  id: string;
  rootId?: string | null | undefined;
}>;

export type GQLArticleLayoutQuery = {
  node: {
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
    context: {
      __typename: "TaxonomyContext";
      contextId: string;
      parents: Array<{ __typename: "TaxonomyCrumb"; contextId: string; id: string; name: string; url: string }> | null;
    } | null;
    children: Array<{
      __typename: "Node";
      id: string;
      rank: number | null;
      name: string;
      relevanceId: string | null;
      contentUri: string | null;
      url: string | null;
      language: string | null;
      context: { __typename: "TaxonomyContext"; contextId: string; url: string } | null;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      learningpath: { __typename: "Learningpath"; id: number; description: string } | null;
      article: { __typename: "Article"; id: number; revision: number; traits: Array<string> } | null;
    }> | null;
    links: Array<{
      __typename: "Node";
      id: string;
      name: string;
      url: string | null;
      context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
    }> | null;
  } | null;
};

export type GQLArticlePage_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  name: string;
  url: string | null;
  defaultUrl: string | null;
  contentUri: string | null;
  relevanceId: string | null;
  resourceTypes: Array<{ __typename: "ResourceType"; name: string; id: string }>;
  context: {
    __typename: "TaxonomyContext";
    rootId: string;
    defaultUrl: string;
    contextId: string;
    isArchived: boolean;
    parents: Array<{ __typename: "TaxonomyCrumb"; contextId: string; id: string; name: string; url: string }> | null;
  } | null;
  article: {
    __typename: "Article";
    created: string;
    updated: string;
    revised: string;
    metaDescription: string;
    oembed: string | null;
    tags: Array<string> | null;
    id: number;
    title: string;
    published: string;
    supportedLanguages: Array<string>;
    grepCodes: Array<string> | null;
    htmlIntroduction: string | null;
    htmlTitle: string;
    traits: Array<string>;
    revision: number;
    language: string;
    revisionDate: string | null;
    requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
    copyright: {
      __typename: "Copyright";
      processed: boolean | null;
      origin: string | null;
      license: { __typename: "License"; url: string | null; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
    metaImage: {
      __typename: "ImageMetaInformationV3";
      image: { __typename: "ImageV3"; imageUrl: string };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
    competenceGoals: Array<{
      __typename: "CompetenceGoal";
      id: string;
      code: string | null;
      title: string;
      type: string;
    }>;
    coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
    transformedContent: {
      __typename: "TransformedArticleContent";
      content: string;
      metaData: {
        __typename: "ArticleMetaData";
        copyText: string | null;
        images: Array<{
          __typename: "ImageLicense";
          src: string;
          title: string;
          id: string;
          altText: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        audios: Array<{
          __typename: "AudioLicense";
          src: string;
          title: string;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        podcasts: Array<{
          __typename: "PodcastLicense";
          src: string;
          title: string;
          description: string | null;
          id: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        brightcoves: Array<{
          __typename: "BrightcoveLicense";
          src: string | null;
          title: string;
          cover: string | null;
          description: string | null;
          download: string | null;
          uploadDate: string | null;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
          iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        }>;
        footnotes: Array<{
          __typename: "FootNote";
          ref: number;
          title: string;
          year: string;
          authors: Array<string>;
          edition: string | null;
          publisher: string | null;
          url: string | null;
        }>;
        concepts: Array<{
          __typename: "ConceptLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        glosses: Array<{
          __typename: "GlossLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        h5ps: Array<{
          __typename: "H5pLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        textblocks: Array<{
          __typename: "TextblockLicense";
          title: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
      } | null;
    };
    transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
  } | null;
};

export type GQLCollectionPageQueryVariables = Exact<{
  language: string;
  imageId: string;
}>;

export type GQLCollectionPageQuery = {
  subjectCollection: Array<{
    __typename: "Subject";
    id: string;
    name: string;
    url: string | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
  }> | null;
  imageV3: {
    __typename: "ImageMetaInformationV3";
    id: string;
    image: {
      __typename: "ImageV3";
      imageUrl: string;
      dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
      variants: Array<{ __typename: "ImageVariant"; variantUrl: string; size: string }>;
    };
  } | null;
};

export type GQLAboutNdlaFilm_ArticleFragment = {
  __typename: "Article";
  title: string;
  id: number;
  created: string;
  updated: string;
  supportedLanguages: Array<string>;
  grepCodes: Array<string> | null;
  htmlIntroduction: string | null;
  htmlTitle: string;
  oembed: string | null;
  traits: Array<string>;
  revision: number;
  language: string;
  published: string;
  revised: string;
  revisionDate: string | null;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        id: string;
        title: string;
        download: string | null;
        src: string | null;
        cover: string | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        id: string;
        src: string;
        title: string;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        id: string;
        src: string;
        copyText: string | null;
        title: string;
        description: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      images: Array<{
        __typename: "ImageLicense";
        id: string;
        title: string;
        altText: string;
        src: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
  transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLAboutNdlaFilm_FilmPageAboutFragment = {
  __typename: "FilmPageAbout";
  title: string;
  description: string;
  visualElement: { __typename: "SubjectPageVisualElement"; type: string; url: string; alt: string | null };
};

export type GQLAllMoviesQueryVariables = Exact<{
  resourceTypes: string;
  language: string;
}>;

export type GQLAllMoviesQuery = {
  searchWithoutPagination: {
    __typename: "SearchWithoutPagination";
    results: Array<
      | {
          __typename: "ArticleSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage: { __typename: "MetaImage"; url: string } | null;
          contexts: Array<{ __typename: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename: "LearningpathSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage: { __typename: "MetaImage"; url: string } | null;
          contexts: Array<{ __typename: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename: "NodeSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          contexts: Array<{ __typename: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
    >;
  } | null;
};

export type GQLFilmContent_MovieThemeFragment = {
  __typename: "MovieTheme";
  name: Array<{ __typename: "Name"; name: string; language: string }>;
  movies: Array<{
    __typename: "Movie";
    id: string;
    title: string;
    metaDescription: string;
    url: string;
    metaImage: { __typename: "MetaImage"; alt: string; url: string } | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
  }>;
};

export type GQLFilmContentCard_MovieFragment = {
  __typename: "Movie";
  id: string;
  title: string;
  metaDescription: string;
  url: string;
  metaImage: { __typename: "MetaImage"; alt: string; url: string } | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
};

export type GQLFilmFrontPageQueryVariables = Exact<{
  nodeId: string;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLFilmFrontPageQuery = {
  filmfrontpage: {
    __typename: "FilmFrontpage";
    slideShow: Array<{
      __typename: "Movie";
      id: string;
      title: string;
      metaDescription: string;
      url: string;
      metaImage: { __typename: "MetaImage"; alt: string; url: string } | null;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    }>;
    movieThemes: Array<{
      __typename: "MovieTheme";
      name: Array<{ __typename: "Name"; name: string; language: string }>;
      movies: Array<{
        __typename: "Movie";
        id: string;
        title: string;
        metaDescription: string;
        url: string;
        metaImage: { __typename: "MetaImage"; alt: string; url: string } | null;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      }>;
    }>;
    about: Array<{
      __typename: "FilmPageAbout";
      description: string;
      language: string;
      title: string;
      visualElement: { __typename: "SubjectPageVisualElement"; type: string; url: string; alt: string | null };
    }>;
    article: {
      __typename: "Article";
      title: string;
      id: number;
      created: string;
      updated: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      oembed: string | null;
      traits: Array<string>;
      revision: number;
      language: string;
      published: string;
      revised: string;
      revisionDate: string | null;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            id: string;
            title: string;
            download: string | null;
            src: string | null;
            cover: string | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            id: string;
            src: string;
            title: string;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            id: string;
            src: string;
            copyText: string | null;
            title: string;
            description: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          images: Array<{
            __typename: "ImageLicense";
            id: string;
            title: string;
            altText: string;
            src: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
      copyright: {
        __typename: "Copyright";
        origin: string | null;
        processed: boolean | null;
        license: { __typename: "License"; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
    } | null;
  } | null;
  node: {
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    children: Array<{ __typename: "Node"; id: string; name: string; url: string | null }> | null;
  } | null;
};

export type GQLFilmSlideshow_MovieFragment = {
  __typename: "Movie";
  id: string;
  title: string;
  metaDescription: string;
  url: string;
  metaImage: { __typename: "MetaImage"; alt: string; url: string } | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
};

export type GQLSelectionMovieGrid_MovieFragment = {
  __typename: "Movie";
  id: string;
  title: string;
  metaDescription: string;
  url: string;
  metaImage: { __typename: "MetaImage"; alt: string; url: string } | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
};

export type GQLResourceTypeMoviesQueryVariables = Exact<{
  resourceType: string;
  language: string;
}>;

export type GQLResourceTypeMoviesQuery = {
  searchWithoutPagination: {
    __typename: "SearchWithoutPagination";
    results: Array<
      | {
          __typename: "ArticleSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage: { __typename: "MetaImage"; url: string } | null;
          contexts: Array<{ __typename: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename: "LearningpathSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          metaImage: { __typename: "MetaImage"; url: string } | null;
          contexts: Array<{ __typename: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
      | {
          __typename: "NodeSearchResult";
          id: string;
          metaDescription: string;
          title: string;
          contexts: Array<{ __typename: "SearchContext"; contextId: string; url: string; rootId: string }>;
        }
    >;
  } | null;
};

export type GQLLearningpathPage_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  name: string;
  url: string | null;
  context: {
    __typename: "TaxonomyContext";
    contextId: string;
    rootId: string;
    isArchived: boolean;
    url: string;
    defaultUrl: string;
    parents: Array<{ __typename: "TaxonomyCrumb"; id: string; contextId: string; url: string; name: string }> | null;
  } | null;
  learningpath: {
    __typename: "Learningpath";
    id: number;
    supportedLanguages: Array<string>;
    tags: Array<string>;
    description: string;
    title: string;
    lastUpdated: string;
    basedOn: string | null;
    isMyNDLAOwner: boolean;
    introduction: string | null;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      id: string;
      metaUrl: string;
      image: { __typename: "ImageV3"; imageUrl: string };
    } | null;
    learningsteps: Array<{
      __typename: "LearningpathStep";
      type: GQLLearningpathStepType;
      id: number;
      title: string;
      seqNo: number;
      introduction: string | null;
      description: string | null;
      showTitle: boolean;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        nodeType: string;
        url: string | null;
        relevanceId: string | null;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          published: string;
          revised: string;
          supportedLanguages: Array<string>;
          grepCodes: Array<string> | null;
          htmlIntroduction: string | null;
          htmlTitle: string;
          oembed: string | null;
          traits: Array<string>;
          revision: number;
          language: string;
          revisionDate: string | null;
          requiredLibraries: Array<{
            __typename: "ArticleRequiredLibrary";
            name: string;
            url: string;
            mediaType: string;
          }>;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
          metaImage: {
            __typename: "ImageMetaInformationV3";
            image: { __typename: "ImageV3"; imageUrl: string };
            alttext: { __typename: "ImageAltText"; alttext: string };
          } | null;
          competenceGoals: Array<{
            __typename: "CompetenceGoal";
            id: string;
            code: string | null;
            title: string;
            type: string;
          }>;
          coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
          transformedContent: {
            __typename: "TransformedArticleContent";
            content: string;
            metaData: {
              __typename: "ArticleMetaData";
              copyText: string | null;
              images: Array<{
                __typename: "ImageLicense";
                src: string;
                title: string;
                id: string;
                altText: string;
                copyText: string | null;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              audios: Array<{
                __typename: "AudioLicense";
                src: string;
                title: string;
                id: string;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              podcasts: Array<{
                __typename: "PodcastLicense";
                src: string;
                title: string;
                description: string | null;
                id: string;
                copyText: string | null;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              brightcoves: Array<{
                __typename: "BrightcoveLicense";
                src: string | null;
                title: string;
                cover: string | null;
                description: string | null;
                download: string | null;
                uploadDate: string | null;
                id: string;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
                iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
              }>;
              footnotes: Array<{
                __typename: "FootNote";
                ref: number;
                title: string;
                year: string;
                authors: Array<string>;
                edition: string | null;
                publisher: string | null;
                url: string | null;
              }>;
              concepts: Array<{
                __typename: "ConceptLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "ConceptCopyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string } | null;
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              glosses: Array<{
                __typename: "GlossLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "ConceptCopyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string } | null;
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              h5ps: Array<{
                __typename: "H5pLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "Copyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              textblocks: Array<{
                __typename: "TextblockLicense";
                title: string | null;
                copyright: {
                  __typename: "Copyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
            } | null;
          };
          transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
        } | null;
      } | null;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        html: string;
        width: number;
        height: number;
        type: string;
        version: string;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
    copyright: {
      __typename: "LearningpathCopyright";
      license: { __typename: "License"; license: string };
      contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    };
  } | null;
};

export type GQLDynamicMenuQueryVariables = Exact<{ [key: string]: never }>;

export type GQLDynamicMenuQuery = {
  frontpage: {
    __typename: "FrontpageMenu";
    articleId: number;
    menu: Array<{
      __typename: "FrontpageMenu";
      articleId: number;
      article: { __typename: "Article"; id: number; title: string; slug: string | null; revision: number };
    }>;
  } | null;
};

export type GQLMastheadFavoriteSubjectsQueryVariables = Exact<{
  ids: Array<string> | string;
}>;

export type GQLMastheadFavoriteSubjectsQuery = {
  nodes: Array<{ __typename: "Node"; id: string; name: string; url: string | null }> | null;
};

export type GQLCurrentContextQueryVariables = Exact<{
  contextId: string;
}>;

export type GQLCurrentContextQuery = {
  root: {
    __typename: "Node";
    id: string;
    nodeType: string;
    name: string;
    context: { __typename: "TaxonomyContext"; contextId: string; rootId: string; root: string } | null;
  } | null;
};

export type GQLMastheadSearchQueryVariables = Exact<{
  query?: string | null | undefined;
  language?: string | null | undefined;
}>;

export type GQLMastheadSearchQuery = {
  search: {
    __typename: "Search";
    results: Array<
      | {
          __typename: "ArticleSearchResult";
          traits: Array<string>;
          htmlTitle: string;
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            isPrimary: boolean;
            breadcrumbs: Array<string>;
            url: string;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
      | {
          __typename: "LearningpathSearchResult";
          traits: Array<string>;
          htmlTitle: string;
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            isPrimary: boolean;
            breadcrumbs: Array<string>;
            url: string;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
      | {
          __typename: "NodeSearchResult";
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            isPrimary: boolean;
            breadcrumbs: Array<string>;
            url: string;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
    >;
  } | null;
};

export type GQLMovedResourceQueryVariables = Exact<{
  resourceId: string;
}>;

export type GQLMovedResourceQuery = {
  resource: {
    __typename: "Node";
    contexts: Array<{ __typename: "TaxonomyContext"; contextId: string; url: string; breadcrumbs: Array<string> }>;
  } | null;
};

export type GQLMovedResourcePage_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  name: string;
  url: string | null;
  breadcrumbs: Array<string>;
  contexts: Array<{ __typename: "TaxonomyContext"; contextId: string; url: string; breadcrumbs: Array<string> }>;
  article: {
    __typename: "Article";
    id: number;
    metaDescription: string;
    traits: Array<string>;
    metaImage: {
      __typename: "ImageMetaInformationV3";
      id: string;
      image: {
        __typename: "ImageV3";
        imageUrl: string;
        dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
        variants: Array<{ __typename: "ImageVariant"; size: string; variantUrl: string }>;
      };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
  } | null;
  learningpath: {
    __typename: "Learningpath";
    id: number;
    description: string;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      image: {
        __typename: "ImageV3";
        imageUrl: string;
        dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
        variants: Array<{ __typename: "ImageVariant"; size: string; variantUrl: string }>;
      };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
  } | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
};

export type GQLRootFoldersPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLRootFoldersPageQuery = {
  folders: {
    __typename: "UserFolder";
    folders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "Folder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    sharedFolders: Array<{
      __typename: "SharedFolder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "SharedFolder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "SharedFolder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "SharedFolder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "SharedFolder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "SharedFolder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "SharedFolder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "SharedFolder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "SharedFolder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "SharedFolder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
  };
  myNdlaRootResources: Array<{
    __typename: "MyNdlaResource";
    resourceId: string;
    id: string;
    resourceType: string;
    path: string;
    created: string;
    tags: Array<string>;
  }>;
};

export type GQLBatchProcessFoldersQueryVariables = Exact<{ [key: string]: never }>;

export type GQLBatchProcessFoldersQuery = {
  folders: {
    __typename: "UserFolder";
    folders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "Folder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
  };
};

export type GQLMoveFolderDialogQueryVariables = Exact<{ [key: string]: never }>;

export type GQLMoveFolderDialogQuery = {
  folders: {
    __typename: "UserFolder";
    folders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "Folder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
  };
};

export type GQLMoveResourceQueryVariables = Exact<{
  path: string;
}>;

export type GQLMoveResourceQuery = {
  folders: {
    __typename: "UserFolder";
    folders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "Folder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
  };
  myNdlaResourceConnections: Array<{
    __typename: "MyNdlaResourceConnection";
    folderId: string | null;
    resourceId: string;
  }>;
};

export type GQLPreviewLearningpathQueryVariables = Exact<{
  pathId: string;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLPreviewLearningpathQuery = {
  myNdlaLearningpath: {
    __typename: "MyNdlaLearningpath";
    id: number;
    canEdit: boolean;
    title: string;
    lastUpdated: string;
    basedOn: string | null;
    isMyNDLAOwner: boolean;
    introduction: string | null;
    learningsteps: Array<{
      __typename: "MyNdlaLearningpathStep";
      id: number;
      title: string;
      seqNo: number;
      introduction: string | null;
      type: GQLLearningpathStepType;
      description: string | null;
      showTitle: boolean;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        nodeType: string;
        url: string | null;
        relevanceId: string | null;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          published: string;
          revised: string;
          supportedLanguages: Array<string>;
          grepCodes: Array<string> | null;
          htmlIntroduction: string | null;
          htmlTitle: string;
          oembed: string | null;
          traits: Array<string>;
          revision: number;
          language: string;
          revisionDate: string | null;
          requiredLibraries: Array<{
            __typename: "ArticleRequiredLibrary";
            name: string;
            url: string;
            mediaType: string;
          }>;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
          metaImage: {
            __typename: "ImageMetaInformationV3";
            image: { __typename: "ImageV3"; imageUrl: string };
            alttext: { __typename: "ImageAltText"; alttext: string };
          } | null;
          competenceGoals: Array<{
            __typename: "CompetenceGoal";
            id: string;
            code: string | null;
            title: string;
            type: string;
          }>;
          coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
          transformedContent: {
            __typename: "TransformedArticleContent";
            content: string;
            metaData: {
              __typename: "ArticleMetaData";
              copyText: string | null;
              images: Array<{
                __typename: "ImageLicense";
                src: string;
                title: string;
                id: string;
                altText: string;
                copyText: string | null;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              audios: Array<{
                __typename: "AudioLicense";
                src: string;
                title: string;
                id: string;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              podcasts: Array<{
                __typename: "PodcastLicense";
                src: string;
                title: string;
                description: string | null;
                id: string;
                copyText: string | null;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              brightcoves: Array<{
                __typename: "BrightcoveLicense";
                src: string | null;
                title: string;
                cover: string | null;
                description: string | null;
                download: string | null;
                uploadDate: string | null;
                id: string;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
                iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
              }>;
              footnotes: Array<{
                __typename: "FootNote";
                ref: number;
                title: string;
                year: string;
                authors: Array<string>;
                edition: string | null;
                publisher: string | null;
                url: string | null;
              }>;
              concepts: Array<{
                __typename: "ConceptLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "ConceptCopyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string } | null;
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              glosses: Array<{
                __typename: "GlossLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "ConceptCopyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string } | null;
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              h5ps: Array<{
                __typename: "H5pLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "Copyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              textblocks: Array<{
                __typename: "TextblockLicense";
                title: string | null;
                copyright: {
                  __typename: "Copyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
            } | null;
          };
          transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
        } | null;
      } | null;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        html: string;
        width: number;
        height: number;
        type: string;
        version: string;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
    copyright: {
      __typename: "LearningpathCopyright";
      license: { __typename: "License"; license: string };
      contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    };
  } | null;
};

export type GQLResourcePickerSearchQueryVariables = Exact<{
  query?: string | null | undefined;
  page?: number | null | undefined;
  pageSize: number;
  resourceTypes?: string | null | undefined;
}>;

export type GQLResourcePickerSearchQuery = {
  search: {
    __typename: "Search";
    pageSize: number;
    page: number | null;
    language: string;
    totalCount: number;
    results: Array<
      | {
          __typename: "ArticleSearchResult";
          htmlTitle: string;
          traits: Array<string>;
          id: string;
          url: string;
          title: string;
          contexts: Array<{
            __typename: "SearchContext";
            contextId: string;
            isPrimary: boolean;
            url: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          }>;
        }
      | {
          __typename: "LearningpathSearchResult";
          htmlTitle: string;
          traits: Array<string>;
          id: string;
          url: string;
          title: string;
          contexts: Array<{
            __typename: "SearchContext";
            contextId: string;
            isPrimary: boolean;
            url: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          }>;
        }
      | {
          __typename: "NodeSearchResult";
          id: string;
          url: string;
          title: string;
          contexts: Array<{
            __typename: "SearchContext";
            contextId: string;
            isPrimary: boolean;
            url: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          }>;
        }
    >;
  } | null;
};

export type GQLMyLearningpathsQueryVariables = Exact<{
  includeSteps?: boolean | null | undefined;
}>;

export type GQLMyLearningpathsQuery = {
  myLearningpaths: Array<{
    __typename: "MyNdlaLearningpath";
    id: number;
    title: string;
    description: string;
    introduction: string | null;
    created: string;
    canEdit: boolean;
    status: string;
    madeAvailable: string | null;
    revision: number;
    supportedLanguages: Array<string>;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      metaUrl: string;
      image: { __typename: "ImageV3"; imageUrl: string };
    } | null;
    learningsteps?: Array<{
      __typename: "MyNdlaLearningpathStep";
      id: number;
      title: string;
      seqNo: number;
      canEdit: boolean;
      articleId: number | null;
      description: string | null;
      introduction: string | null;
      type: GQLLearningpathStepType;
      supportedLanguages: Array<string>;
      showTitle: boolean;
      revision: number;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        type: string;
        version: string;
        height: number;
        html: string;
        width: number;
      } | null;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        url: string | null;
        breadcrumbs: Array<string>;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          traits: Array<string>;
          language: string;
        } | null;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
  }> | null;
};

export type GQLMyNdlaLearningpathQueryVariables = Exact<{
  pathId: string;
  includeSteps?: boolean | null | undefined;
}>;

export type GQLMyNdlaLearningpathQuery = {
  myNdlaLearningpath: {
    __typename: "MyNdlaLearningpath";
    id: number;
    title: string;
    description: string;
    introduction: string | null;
    created: string;
    canEdit: boolean;
    status: string;
    madeAvailable: string | null;
    revision: number;
    supportedLanguages: Array<string>;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      metaUrl: string;
      image: { __typename: "ImageV3"; imageUrl: string };
    } | null;
    learningsteps?: Array<{
      __typename: "MyNdlaLearningpathStep";
      id: number;
      title: string;
      seqNo: number;
      canEdit: boolean;
      articleId: number | null;
      description: string | null;
      introduction: string | null;
      type: GQLLearningpathStepType;
      supportedLanguages: Array<string>;
      showTitle: boolean;
      revision: number;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        type: string;
        version: string;
        height: number;
        html: string;
        width: number;
      } | null;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        url: string | null;
        breadcrumbs: Array<string>;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          traits: Array<string>;
          language: string;
        } | null;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
  } | null;
};

export type GQLLearningpathStepOembedQueryVariables = Exact<{
  url: string;
}>;

export type GQLLearningpathStepOembedQuery = {
  learningpathStepOembed: {
    __typename: "LearningpathStepOembed";
    type: string;
    version: string;
    height: number;
    html: string;
    width: number;
  };
};

export type GQLOpengraphQueryVariables = Exact<{
  url: string;
}>;

export type GQLOpengraphQuery = {
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    imageUrl: string | null;
    url: string | null;
  } | null;
};

export type GQLImageFragment = {
  __typename: "ImageMetaInformationV3";
  id: string;
  metaUrl: string;
  inactive: boolean;
  supportedLanguages: Array<string>;
  created: string;
  createdBy: string;
  modelRelease: string;
  title: { __typename: "Title"; title: string; language: string };
  alttext: { __typename: "ImageAltText"; alttext: string; language: string };
  copyright: {
    __typename: "Copyright";
    origin: string | null;
    processed: boolean | null;
    license: { __typename: "License"; license: string; url: string | null; description: string | null };
    creators: Array<{ __typename: "Contributor"; type: string; name: string }>;
    processors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    rightsholders: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
  tags: { __typename: "Tags"; tags: Array<string>; language: string };
  caption: { __typename: "Caption"; caption: string; language: string };
  editorNotes: Array<{ __typename: "EditorNote"; timestamp: string; updatedBy: string; note: string }> | null;
  image: {
    __typename: "ImageV3";
    fileName: string;
    size: number;
    contentType: string;
    imageUrl: string;
    language: string;
    variants: Array<{ __typename: "ImageVariant"; variantUrl: string; size: string }>;
    dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
  };
};

export type GQLImageSearchQueryVariables = Exact<{
  query?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  license?: string | null | undefined;
}>;

export type GQLImageSearchQuery = {
  imageSearch: {
    __typename: "ImageSearch";
    totalCount: number;
    pageSize: number;
    page: number;
    language: string;
    results: Array<{
      __typename: "ImageMetaInformationV3";
      id: string;
      metaUrl: string;
      inactive: boolean;
      supportedLanguages: Array<string>;
      created: string;
      createdBy: string;
      modelRelease: string;
      title: { __typename: "Title"; title: string; language: string };
      alttext: { __typename: "ImageAltText"; alttext: string; language: string };
      copyright: {
        __typename: "Copyright";
        origin: string | null;
        processed: boolean | null;
        license: { __typename: "License"; license: string; url: string | null; description: string | null };
        creators: Array<{ __typename: "Contributor"; type: string; name: string }>;
        processors: Array<{ __typename: "Contributor"; type: string; name: string }>;
        rightsholders: Array<{ __typename: "Contributor"; type: string; name: string }>;
      };
      tags: { __typename: "Tags"; tags: Array<string>; language: string };
      caption: { __typename: "Caption"; caption: string; language: string };
      editorNotes: Array<{ __typename: "EditorNote"; timestamp: string; updatedBy: string; note: string }> | null;
      image: {
        __typename: "ImageV3";
        fileName: string;
        size: number;
        contentType: string;
        imageUrl: string;
        language: string;
        variants: Array<{ __typename: "ImageVariant"; variantUrl: string; size: string }>;
        dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
      };
    }>;
  };
};

export type GQLFetchImageQueryVariables = Exact<{
  id: string;
}>;

export type GQLFetchImageQuery = {
  imageV3: {
    __typename: "ImageMetaInformationV3";
    id: string;
    metaUrl: string;
    inactive: boolean;
    supportedLanguages: Array<string>;
    created: string;
    createdBy: string;
    modelRelease: string;
    title: { __typename: "Title"; title: string; language: string };
    alttext: { __typename: "ImageAltText"; alttext: string; language: string };
    copyright: {
      __typename: "Copyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string; url: string | null; description: string | null };
      creators: Array<{ __typename: "Contributor"; type: string; name: string }>;
      processors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      rightsholders: Array<{ __typename: "Contributor"; type: string; name: string }>;
    };
    tags: { __typename: "Tags"; tags: Array<string>; language: string };
    caption: { __typename: "Caption"; caption: string; language: string };
    editorNotes: Array<{ __typename: "EditorNote"; timestamp: string; updatedBy: string; note: string }> | null;
    image: {
      __typename: "ImageV3";
      fileName: string;
      size: number;
      contentType: string;
      imageUrl: string;
      language: string;
      variants: Array<{ __typename: "ImageVariant"; variantUrl: string; size: string }>;
      dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
    };
  } | null;
};

export type GQLPlainArticleContainer_ArticleFragment = {
  __typename: "Article";
  created: string;
  tags: Array<string> | null;
  id: number;
  updated: string;
  supportedLanguages: Array<string>;
  grepCodes: Array<string> | null;
  htmlIntroduction: string | null;
  htmlTitle: string;
  oembed: string | null;
  traits: Array<string>;
  revision: number;
  language: string;
  title: string;
  metaDescription: string;
  published: string;
  revised: string;
  revisionDate: string | null;
  requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      images: Array<{
        __typename: "ImageLicense";
        src: string;
        title: string;
        id: string;
        altText: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        src: string;
        title: string;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        src: string;
        title: string;
        description: string | null;
        id: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        src: string | null;
        title: string;
        cover: string | null;
        description: string | null;
        download: string | null;
        uploadDate: string | null;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
      }>;
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
  transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    origin: string | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
  metaImage: {
    __typename: "ImageMetaInformationV3";
    image: { __typename: "ImageV3"; imageUrl: string };
    alttext: { __typename: "ImageAltText"; alttext: string };
  } | null;
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    code: string | null;
    title: string;
    type: string;
  }>;
  coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
};

export type GQLPlainArticlePageQueryVariables = Exact<{
  articleId: string;
  revision?: number | null | undefined;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLPlainArticlePageQuery = {
  article: {
    __typename: "Article";
    created: string;
    tags: Array<string> | null;
    id: number;
    updated: string;
    supportedLanguages: Array<string>;
    grepCodes: Array<string> | null;
    htmlIntroduction: string | null;
    htmlTitle: string;
    oembed: string | null;
    traits: Array<string>;
    revision: number;
    language: string;
    title: string;
    metaDescription: string;
    published: string;
    revised: string;
    revisionDate: string | null;
    requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
    transformedContent: {
      __typename: "TransformedArticleContent";
      content: string;
      metaData: {
        __typename: "ArticleMetaData";
        copyText: string | null;
        images: Array<{
          __typename: "ImageLicense";
          src: string;
          title: string;
          id: string;
          altText: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        audios: Array<{
          __typename: "AudioLicense";
          src: string;
          title: string;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        podcasts: Array<{
          __typename: "PodcastLicense";
          src: string;
          title: string;
          description: string | null;
          id: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        brightcoves: Array<{
          __typename: "BrightcoveLicense";
          src: string | null;
          title: string;
          cover: string | null;
          description: string | null;
          download: string | null;
          uploadDate: string | null;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
          iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        }>;
        footnotes: Array<{
          __typename: "FootNote";
          ref: number;
          title: string;
          year: string;
          authors: Array<string>;
          edition: string | null;
          publisher: string | null;
          url: string | null;
        }>;
        concepts: Array<{
          __typename: "ConceptLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        glosses: Array<{
          __typename: "GlossLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        h5ps: Array<{
          __typename: "H5pLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        textblocks: Array<{
          __typename: "TextblockLicense";
          title: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
      } | null;
    };
    transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    copyright: {
      __typename: "Copyright";
      processed: boolean | null;
      origin: string | null;
      license: { __typename: "License"; url: string | null; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
    metaImage: {
      __typename: "ImageMetaInformationV3";
      image: { __typename: "ImageV3"; imageUrl: string };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
    competenceGoals: Array<{
      __typename: "CompetenceGoal";
      id: string;
      code: string | null;
      title: string;
      type: string;
    }>;
    coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
  } | null;
};

export type GQLPlainLearningpathContainer_LearningpathFragment = {
  __typename: "Learningpath";
  id: number;
  supportedLanguages: Array<string>;
  tags: Array<string>;
  description: string;
  title: string;
  lastUpdated: string;
  basedOn: string | null;
  isMyNDLAOwner: boolean;
  introduction: string | null;
  coverphoto: { __typename: "ImageMetaInformationV3"; image: { __typename: "ImageV3"; imageUrl: string } } | null;
  learningsteps: Array<{
    __typename: "LearningpathStep";
    type: GQLLearningpathStepType;
    id: number;
    title: string;
    seqNo: number;
    introduction: string | null;
    description: string | null;
    showTitle: boolean;
    opengraph: {
      __typename: "ExternalOpengraph";
      title: string | null;
      description: string | null;
      url: string | null;
    } | null;
    resource: {
      __typename: "Resource";
      id: string;
      nodeType: string;
      url: string | null;
      relevanceId: string | null;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      article: {
        __typename: "Article";
        id: number;
        metaDescription: string;
        created: string;
        updated: string;
        articleType: string;
        title: string;
        published: string;
        revised: string;
        supportedLanguages: Array<string>;
        grepCodes: Array<string> | null;
        htmlIntroduction: string | null;
        htmlTitle: string;
        oembed: string | null;
        traits: Array<string>;
        revision: number;
        language: string;
        revisionDate: string | null;
        requiredLibraries: Array<{
          __typename: "ArticleRequiredLibrary";
          name: string;
          url: string;
          mediaType: string;
        }>;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
        metaImage: {
          __typename: "ImageMetaInformationV3";
          image: { __typename: "ImageV3"; imageUrl: string };
          alttext: { __typename: "ImageAltText"; alttext: string };
        } | null;
        competenceGoals: Array<{
          __typename: "CompetenceGoal";
          id: string;
          code: string | null;
          title: string;
          type: string;
        }>;
        coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
        transformedContent: {
          __typename: "TransformedArticleContent";
          content: string;
          metaData: {
            __typename: "ArticleMetaData";
            copyText: string | null;
            images: Array<{
              __typename: "ImageLicense";
              src: string;
              title: string;
              id: string;
              altText: string;
              copyText: string | null;
              copyright: {
                __typename: "Copyright";
                processed: boolean | null;
                origin: string | null;
                license: { __typename: "License"; url: string | null; license: string };
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              };
            }>;
            audios: Array<{
              __typename: "AudioLicense";
              src: string;
              title: string;
              id: string;
              copyright: {
                __typename: "Copyright";
                processed: boolean | null;
                origin: string | null;
                license: { __typename: "License"; url: string | null; license: string };
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              };
            }>;
            podcasts: Array<{
              __typename: "PodcastLicense";
              src: string;
              title: string;
              description: string | null;
              id: string;
              copyText: string | null;
              copyright: {
                __typename: "Copyright";
                processed: boolean | null;
                origin: string | null;
                license: { __typename: "License"; url: string | null; license: string };
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              };
            }>;
            brightcoves: Array<{
              __typename: "BrightcoveLicense";
              src: string | null;
              title: string;
              cover: string | null;
              description: string | null;
              download: string | null;
              uploadDate: string | null;
              id: string;
              copyright: {
                __typename: "Copyright";
                processed: boolean | null;
                origin: string | null;
                license: { __typename: "License"; url: string | null; license: string };
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              } | null;
              iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
            }>;
            footnotes: Array<{
              __typename: "FootNote";
              ref: number;
              title: string;
              year: string;
              authors: Array<string>;
              edition: string | null;
              publisher: string | null;
              url: string | null;
            }>;
            concepts: Array<{
              __typename: "ConceptLicense";
              id: string;
              title: string;
              src: string | null;
              copyright: {
                __typename: "ConceptCopyright";
                origin: string | null;
                processed: boolean | null;
                license: { __typename: "License"; license: string } | null;
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              } | null;
            }>;
            glosses: Array<{
              __typename: "GlossLicense";
              id: string;
              title: string;
              src: string | null;
              copyright: {
                __typename: "ConceptCopyright";
                origin: string | null;
                processed: boolean | null;
                license: { __typename: "License"; license: string } | null;
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              } | null;
            }>;
            h5ps: Array<{
              __typename: "H5pLicense";
              id: string;
              title: string;
              src: string | null;
              copyright: {
                __typename: "Copyright";
                origin: string | null;
                processed: boolean | null;
                license: { __typename: "License"; license: string };
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              } | null;
            }>;
            textblocks: Array<{
              __typename: "TextblockLicense";
              title: string | null;
              copyright: {
                __typename: "Copyright";
                origin: string | null;
                processed: boolean | null;
                license: { __typename: "License"; license: string };
                creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
              };
            }>;
          } | null;
        };
        transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
      } | null;
    } | null;
    embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
    oembed: {
      __typename: "LearningpathStepOembed";
      html: string;
      width: number;
      height: number;
      type: string;
      version: string;
    } | null;
    copyright: {
      __typename: "LearningpathCopyright";
      license: { __typename: "License"; license: string };
      contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    } | null;
  }>;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  };
};

export type GQLPlainLearningpathPageQueryVariables = Exact<{
  pathId: string;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLPlainLearningpathPageQuery = {
  learningpath: {
    __typename: "Learningpath";
    id: number;
    supportedLanguages: Array<string>;
    tags: Array<string>;
    description: string;
    title: string;
    lastUpdated: string;
    basedOn: string | null;
    isMyNDLAOwner: boolean;
    introduction: string | null;
    coverphoto: { __typename: "ImageMetaInformationV3"; image: { __typename: "ImageV3"; imageUrl: string } } | null;
    learningsteps: Array<{
      __typename: "LearningpathStep";
      type: GQLLearningpathStepType;
      id: number;
      title: string;
      seqNo: number;
      introduction: string | null;
      description: string | null;
      showTitle: boolean;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        nodeType: string;
        url: string | null;
        relevanceId: string | null;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          published: string;
          revised: string;
          supportedLanguages: Array<string>;
          grepCodes: Array<string> | null;
          htmlIntroduction: string | null;
          htmlTitle: string;
          oembed: string | null;
          traits: Array<string>;
          revision: number;
          language: string;
          revisionDate: string | null;
          requiredLibraries: Array<{
            __typename: "ArticleRequiredLibrary";
            name: string;
            url: string;
            mediaType: string;
          }>;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
          metaImage: {
            __typename: "ImageMetaInformationV3";
            image: { __typename: "ImageV3"; imageUrl: string };
            alttext: { __typename: "ImageAltText"; alttext: string };
          } | null;
          competenceGoals: Array<{
            __typename: "CompetenceGoal";
            id: string;
            code: string | null;
            title: string;
            type: string;
          }>;
          coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
          transformedContent: {
            __typename: "TransformedArticleContent";
            content: string;
            metaData: {
              __typename: "ArticleMetaData";
              copyText: string | null;
              images: Array<{
                __typename: "ImageLicense";
                src: string;
                title: string;
                id: string;
                altText: string;
                copyText: string | null;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              audios: Array<{
                __typename: "AudioLicense";
                src: string;
                title: string;
                id: string;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              podcasts: Array<{
                __typename: "PodcastLicense";
                src: string;
                title: string;
                description: string | null;
                id: string;
                copyText: string | null;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
              brightcoves: Array<{
                __typename: "BrightcoveLicense";
                src: string | null;
                title: string;
                cover: string | null;
                description: string | null;
                download: string | null;
                uploadDate: string | null;
                id: string;
                copyright: {
                  __typename: "Copyright";
                  processed: boolean | null;
                  origin: string | null;
                  license: { __typename: "License"; url: string | null; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
                iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
              }>;
              footnotes: Array<{
                __typename: "FootNote";
                ref: number;
                title: string;
                year: string;
                authors: Array<string>;
                edition: string | null;
                publisher: string | null;
                url: string | null;
              }>;
              concepts: Array<{
                __typename: "ConceptLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "ConceptCopyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string } | null;
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              glosses: Array<{
                __typename: "GlossLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "ConceptCopyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string } | null;
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              h5ps: Array<{
                __typename: "H5pLicense";
                id: string;
                title: string;
                src: string | null;
                copyright: {
                  __typename: "Copyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                } | null;
              }>;
              textblocks: Array<{
                __typename: "TextblockLicense";
                title: string | null;
                copyright: {
                  __typename: "Copyright";
                  origin: string | null;
                  processed: boolean | null;
                  license: { __typename: "License"; license: string };
                  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                };
              }>;
            } | null;
          };
          transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
        } | null;
      } | null;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        html: string;
        width: number;
        height: number;
        type: string;
        version: string;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
    copyright: {
      __typename: "LearningpathCopyright";
      license: { __typename: "License"; license: string };
      contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    };
  } | null;
};

export type GQLPodcastSeries_PodcastSeriesSummaryFragment = {
  __typename: "PodcastSeriesSummary";
  id: number;
  title: { __typename: "Title"; title: string };
  description: { __typename: "Description"; description: string };
  coverPhoto: { __typename: "CoverPhoto"; url: string; altText: string };
};

export type GQLPodcastSeriesListPageQueryVariables = Exact<{
  page: number;
  pageSize: number;
  fallback?: boolean | null | undefined;
}>;

export type GQLPodcastSeriesListPageQuery = {
  podcastSeriesSearch: {
    __typename: "PodcastSeriesSearch";
    totalCount: number;
    results: Array<{
      __typename: "PodcastSeriesSummary";
      id: number;
      title: { __typename: "Title"; title: string };
      description: { __typename: "Description"; description: string };
      coverPhoto: { __typename: "CoverPhoto"; url: string; altText: string };
    }>;
  } | null;
};

export type GQLPodcastSeriesPageQueryVariables = Exact<{
  id: number;
}>;

export type GQLPodcastSeriesPageQuery = {
  podcastSeries: {
    __typename: "PodcastSeriesWithEpisodes";
    id: number;
    supportedLanguages: Array<string>;
    hasRSS: boolean;
    title: { __typename: "Title"; title: string };
    description: { __typename: "Description"; description: string };
    coverPhoto: { __typename: "CoverPhoto"; url: string; altText: string };
    content: {
      __typename: "ResourceEmbed";
      content: string;
      meta: {
        __typename: "ResourceMetaData";
        concepts: Array<{
          __typename: "ConceptLicense";
          content: string | null;
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        glosses: Array<{
          __typename: "GlossLicense";
          content: string | null;
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        h5ps: Array<{
          __typename: "H5pLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        brightcoves: Array<{
          __typename: "BrightcoveLicense";
          description: string | null;
          id: string;
          title: string;
          download: string | null;
          src: string | null;
          cover: string | null;
          iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        audios: Array<{
          __typename: "AudioLicense";
          id: string;
          src: string;
          title: string;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        podcasts: Array<{
          __typename: "PodcastLicense";
          coverPhotoUrl: string | null;
          id: string;
          src: string;
          copyText: string | null;
          title: string;
          description: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        images: Array<{
          __typename: "ImageLicense";
          altText: string;
          id: string;
          title: string;
          src: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
      };
    } | null;
    episodes: Array<{
      __typename: "Audio";
      id: number;
      title: { __typename: "Title"; title: string };
      audioFile: { __typename: "AudioFile"; url: string };
      podcastMeta: { __typename: "PodcastMeta"; introduction: string } | null;
      copyright: {
        __typename: "Copyright";
        origin: string | null;
        processed: boolean | null;
        license: { __typename: "License"; license: string; url: string | null; description: string | null };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
    }> | null;
  } | null;
};

export type GQLProgrammeContainer_ProgrammeFragment = {
  __typename: "ProgrammePage";
  id: string;
  metaDescription: string | null;
  defaultUrl: string | null;
  url: string | null;
  title: { __typename: "Title"; title: string; language: string };
  desktopImage: { __typename: "MetaImage"; url: string } | null;
  grades: Array<{
    __typename: "Grade";
    id: string;
    url: string | null;
    title: { __typename: "Title"; title: string };
    categories: Array<{
      __typename: "Category";
      id: string;
      isProgrammeSubject: boolean;
      title: { __typename: "Title"; title: string };
      subjects: Array<{
        __typename: "Subject";
        id: string;
        name: string;
        url: string | null;
        subjectpage: {
          __typename: "SubjectPage";
          about: { __typename: "SubjectPageAbout"; title: string } | null;
        } | null;
      }> | null;
    }> | null;
  }> | null;
};

export type GQLProgrammePageQueryVariables = Exact<{
  contextId?: string | null | undefined;
}>;

export type GQLProgrammePageQuery = {
  programme: {
    __typename: "ProgrammePage";
    supportedLanguages: Array<string>;
    id: string;
    metaDescription: string | null;
    defaultUrl: string | null;
    url: string | null;
    grades: Array<{
      __typename: "Grade";
      id: string;
      url: string | null;
      title: { __typename: "Title"; title: string };
      categories: Array<{
        __typename: "Category";
        id: string;
        isProgrammeSubject: boolean;
        title: { __typename: "Title"; title: string };
        subjects: Array<{
          __typename: "Subject";
          id: string;
          name: string;
          url: string | null;
          subjectpage: {
            __typename: "SubjectPage";
            about: { __typename: "SubjectPageAbout"; title: string } | null;
          } | null;
        }> | null;
      }> | null;
    }> | null;
    title: { __typename: "Title"; title: string; language: string };
    desktopImage: { __typename: "MetaImage"; url: string } | null;
  } | null;
};

export type GQLResourceEmbedQueryVariables = Exact<{
  id: string;
  type: string;
}>;

export type GQLResourceEmbedQuery = {
  resourceEmbed: {
    __typename: "ResourceEmbed";
    content: string;
    meta: {
      __typename: "ResourceMetaData";
      concepts: Array<{
        __typename: "ConceptLicense";
        content: string | null;
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        content: string | null;
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        description: string | null;
        id: string;
        title: string;
        download: string | null;
        src: string | null;
        cover: string | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        id: string;
        src: string;
        title: string;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        coverPhotoUrl: string | null;
        id: string;
        src: string;
        copyText: string | null;
        title: string;
        description: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      images: Array<{
        __typename: "ImageLicense";
        altText: string;
        id: string;
        title: string;
        src: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    };
  };
};

export type GQLResourceEmbedLicenseContent_MetaFragment = {
  __typename: "ResourceMetaData";
  concepts: Array<{
    __typename: "ConceptLicense";
    content: string | null;
    id: string;
    title: string;
    src: string | null;
    copyright: {
      __typename: "ConceptCopyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string } | null;
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    } | null;
  }>;
  glosses: Array<{
    __typename: "GlossLicense";
    content: string | null;
    id: string;
    title: string;
    src: string | null;
    copyright: {
      __typename: "ConceptCopyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string } | null;
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    } | null;
  }>;
  h5ps: Array<{
    __typename: "H5pLicense";
    id: string;
    title: string;
    src: string | null;
    copyright: {
      __typename: "Copyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    } | null;
  }>;
  brightcoves: Array<{
    __typename: "BrightcoveLicense";
    description: string | null;
    id: string;
    title: string;
    download: string | null;
    src: string | null;
    cover: string | null;
    iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
    copyright: {
      __typename: "Copyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    } | null;
  }>;
  audios: Array<{
    __typename: "AudioLicense";
    id: string;
    src: string;
    title: string;
    copyright: {
      __typename: "Copyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
  }>;
  podcasts: Array<{
    __typename: "PodcastLicense";
    coverPhotoUrl: string | null;
    id: string;
    src: string;
    copyText: string | null;
    title: string;
    description: string | null;
    copyright: {
      __typename: "Copyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
  }>;
  images: Array<{
    __typename: "ImageLicense";
    altText: string;
    id: string;
    title: string;
    src: string;
    copyText: string | null;
    copyright: {
      __typename: "Copyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
  }>;
};

export type GQLResourcePageQueryVariables = Exact<{
  contextId?: string | null | undefined;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLResourcePageQuery = {
  node: {
    __typename: "Node";
    relevanceId: string | null;
    breadcrumbs: Array<string>;
    supportedLanguages: Array<string>;
    id: string;
    nodeType: string;
    name: string;
    url: string | null;
    defaultUrl: string | null;
    contentUri: string | null;
    context: {
      __typename: "TaxonomyContext";
      contextId: string;
      rootId: string;
      isArchived: boolean;
      url: string;
      defaultUrl: string;
      parents: Array<{ __typename: "TaxonomyCrumb"; id: string; contextId: string; url: string; name: string }> | null;
    } | null;
    contexts: Array<{ __typename: "TaxonomyContext"; contextId: string; url: string; breadcrumbs: Array<string> }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      traits: Array<string>;
      created: string;
      updated: string;
      revised: string;
      oembed: string | null;
      tags: Array<string> | null;
      title: string;
      published: string;
      supportedLanguages: Array<string>;
      grepCodes: Array<string> | null;
      htmlIntroduction: string | null;
      htmlTitle: string;
      revision: number;
      language: string;
      revisionDate: string | null;
      metaImage: {
        __typename: "ImageMetaInformationV3";
        id: string;
        image: {
          __typename: "ImageV3";
          imageUrl: string;
          dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
          variants: Array<{ __typename: "ImageVariant"; size: string; variantUrl: string }>;
        };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        origin: string | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            id: string;
            altText: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            id: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            id: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    } | null;
    learningpath: {
      __typename: "Learningpath";
      id: number;
      description: string;
      supportedLanguages: Array<string>;
      tags: Array<string>;
      title: string;
      lastUpdated: string;
      basedOn: string | null;
      isMyNDLAOwner: boolean;
      introduction: string | null;
      coverphoto: {
        __typename: "ImageMetaInformationV3";
        id: string;
        metaUrl: string;
        image: {
          __typename: "ImageV3";
          imageUrl: string;
          dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
          variants: Array<{ __typename: "ImageVariant"; size: string; variantUrl: string }>;
        };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      learningsteps: Array<{
        __typename: "LearningpathStep";
        type: GQLLearningpathStepType;
        id: number;
        title: string;
        seqNo: number;
        introduction: string | null;
        description: string | null;
        showTitle: boolean;
        opengraph: {
          __typename: "ExternalOpengraph";
          title: string | null;
          description: string | null;
          url: string | null;
        } | null;
        resource: {
          __typename: "Resource";
          id: string;
          nodeType: string;
          url: string | null;
          relevanceId: string | null;
          resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
          article: {
            __typename: "Article";
            id: number;
            metaDescription: string;
            created: string;
            updated: string;
            articleType: string;
            title: string;
            published: string;
            revised: string;
            supportedLanguages: Array<string>;
            grepCodes: Array<string> | null;
            htmlIntroduction: string | null;
            htmlTitle: string;
            oembed: string | null;
            traits: Array<string>;
            revision: number;
            language: string;
            revisionDate: string | null;
            requiredLibraries: Array<{
              __typename: "ArticleRequiredLibrary";
              name: string;
              url: string;
              mediaType: string;
            }>;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              origin: string | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
            metaImage: {
              __typename: "ImageMetaInformationV3";
              image: { __typename: "ImageV3"; imageUrl: string };
              alttext: { __typename: "ImageAltText"; alttext: string };
            } | null;
            competenceGoals: Array<{
              __typename: "CompetenceGoal";
              id: string;
              code: string | null;
              title: string;
              type: string;
            }>;
            coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
            transformedContent: {
              __typename: "TransformedArticleContent";
              content: string;
              metaData: {
                __typename: "ArticleMetaData";
                copyText: string | null;
                images: Array<{
                  __typename: "ImageLicense";
                  src: string;
                  title: string;
                  id: string;
                  altText: string;
                  copyText: string | null;
                  copyright: {
                    __typename: "Copyright";
                    processed: boolean | null;
                    origin: string | null;
                    license: { __typename: "License"; url: string | null; license: string };
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  };
                }>;
                audios: Array<{
                  __typename: "AudioLicense";
                  src: string;
                  title: string;
                  id: string;
                  copyright: {
                    __typename: "Copyright";
                    processed: boolean | null;
                    origin: string | null;
                    license: { __typename: "License"; url: string | null; license: string };
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  };
                }>;
                podcasts: Array<{
                  __typename: "PodcastLicense";
                  src: string;
                  title: string;
                  description: string | null;
                  id: string;
                  copyText: string | null;
                  copyright: {
                    __typename: "Copyright";
                    processed: boolean | null;
                    origin: string | null;
                    license: { __typename: "License"; url: string | null; license: string };
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  };
                }>;
                brightcoves: Array<{
                  __typename: "BrightcoveLicense";
                  src: string | null;
                  title: string;
                  cover: string | null;
                  description: string | null;
                  download: string | null;
                  uploadDate: string | null;
                  id: string;
                  copyright: {
                    __typename: "Copyright";
                    processed: boolean | null;
                    origin: string | null;
                    license: { __typename: "License"; url: string | null; license: string };
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  } | null;
                  iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
                }>;
                footnotes: Array<{
                  __typename: "FootNote";
                  ref: number;
                  title: string;
                  year: string;
                  authors: Array<string>;
                  edition: string | null;
                  publisher: string | null;
                  url: string | null;
                }>;
                concepts: Array<{
                  __typename: "ConceptLicense";
                  id: string;
                  title: string;
                  src: string | null;
                  copyright: {
                    __typename: "ConceptCopyright";
                    origin: string | null;
                    processed: boolean | null;
                    license: { __typename: "License"; license: string } | null;
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  } | null;
                }>;
                glosses: Array<{
                  __typename: "GlossLicense";
                  id: string;
                  title: string;
                  src: string | null;
                  copyright: {
                    __typename: "ConceptCopyright";
                    origin: string | null;
                    processed: boolean | null;
                    license: { __typename: "License"; license: string } | null;
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  } | null;
                }>;
                h5ps: Array<{
                  __typename: "H5pLicense";
                  id: string;
                  title: string;
                  src: string | null;
                  copyright: {
                    __typename: "Copyright";
                    origin: string | null;
                    processed: boolean | null;
                    license: { __typename: "License"; license: string };
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  } | null;
                }>;
                textblocks: Array<{
                  __typename: "TextblockLicense";
                  title: string | null;
                  copyright: {
                    __typename: "Copyright";
                    origin: string | null;
                    processed: boolean | null;
                    license: { __typename: "License"; license: string };
                    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
                    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
                  };
                }>;
              } | null;
            };
            transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
          } | null;
        } | null;
        embedUrl: { __typename: "LearningpathStepEmbedUrl"; embedType: string; url: string } | null;
        oembed: {
          __typename: "LearningpathStepOembed";
          html: string;
          width: number;
          height: number;
          type: string;
          version: string;
        } | null;
        copyright: {
          __typename: "LearningpathCopyright";
          license: { __typename: "License"; license: string };
          contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
        } | null;
      }>;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      };
    } | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
  } | null;
};

export type GQLResourceItem_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  rank: number | null;
  name: string;
  url: string | null;
  language: string | null;
  relevanceId: string | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
  article: {
    __typename: "Article";
    id: number;
    traits: Array<string>;
    metaImage: {
      __typename: "ImageMetaInformationV3";
      image: {
        __typename: "ImageV3";
        imageUrl: string;
        variants: Array<{ __typename: "ImageVariant"; size: string; variantUrl: string }>;
        dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
      };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
  } | null;
  learningpath: { __typename: "Learningpath"; id: number; description: string } | null;
};

export type GQLLaunchpadQueryVariables = Exact<{
  parentId: string;
  rootId?: string | null | undefined;
}>;

export type GQLLaunchpadQuery = {
  node: {
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    children: Array<{
      __typename: "Node";
      id: string;
      nodeType: string;
      rank: number | null;
      name: string;
      url: string | null;
      language: string | null;
      relevanceId: string | null;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      article: {
        __typename: "Article";
        id: number;
        traits: Array<string>;
        metaImage: {
          __typename: "ImageMetaInformationV3";
          image: {
            __typename: "ImageV3";
            imageUrl: string;
            variants: Array<{ __typename: "ImageVariant"; size: string; variantUrl: string }>;
            dimensions: { __typename: "ImageDimensions"; width: number; height: number } | null;
          };
          alttext: { __typename: "ImageAltText"; alttext: string };
        } | null;
      } | null;
      learningpath: { __typename: "Learningpath"; id: number; description: string } | null;
    }> | null;
    links: Array<{
      __typename: "Node";
      id: string;
      nodeType: string;
      name: string;
      url: string | null;
      relevanceId: string | null;
      meta: {
        __typename: "Meta";
        metaDescription: string | null;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
      } | null;
      context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
    }> | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
  } | null;
};

export type GQLRevisionsQueryVariables = Exact<{
  articleId: number;
  articleIdString: string;
}>;

export type GQLRevisionsQuery = {
  revisionHistory: {
    __typename: "ArticleRevisionHistory";
    revisions: Array<{ __typename: "Article"; id: number; revision: number; updated: string }>;
  } | null;
  article: { __typename: "Article"; id: number; title: string; revision: number; updated: string } | null;
};

export type GQLGrepFilterQueryVariables = Exact<{
  codes?: Array<string> | string | null | undefined;
  language: string;
}>;

export type GQLGrepFilterQuery = {
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    title: string;
    type: string;
    curriculum: { __typename: "Reference"; id: string; title: string } | null;
    competenceGoalSet: { __typename: "Reference"; id: string; title: string } | null;
  }>;
  coreElements: Array<{ __typename: "CoreElement"; id: string; title: string; description: string | null }>;
};

export type GQLResourceTypeFilter_ResourceTypeDefinitionFragment = {
  __typename: "ResourceTypeDefinition";
  id: string;
  name: string;
};

export type GQLSearchPageQueryVariables = Exact<{
  query?: string | null | undefined;
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
  contextTypes?: string | null | undefined;
  language?: string | null | undefined;
  ids?: Array<number> | number | null | undefined;
  resourceTypes?: string | null | undefined;
  levels?: string | null | undefined;
  sort?: string | null | undefined;
  fallback?: string | null | undefined;
  subjects?: string | null | undefined;
  languageFilter?: string | null | undefined;
  relevance?: string | null | undefined;
  grepCodes?: string | null | undefined;
  traits?: Array<string> | string | null | undefined;
  filterInactive?: boolean | null | undefined;
  license?: string | null | undefined;
  resultTypes?: string | null | undefined;
  nodeTypes?: string | null | undefined;
}>;

export type GQLSearchPageQuery = {
  search: {
    __typename: "Search";
    page: number | null;
    pageSize: number;
    language: string;
    totalCount: number;
    results: Array<
      | {
          __typename: "ArticleSearchResult";
          htmlTitle: string;
          traits: Array<string>;
          id: string;
          url: string;
          title: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            publicId: string;
            url: string;
            relevanceId: string;
            breadcrumbs: Array<string>;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
          contexts: Array<{
            __typename: "SearchContext";
            contextId: string;
            publicId: string;
            url: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          }>;
        }
      | {
          __typename: "LearningpathSearchResult";
          htmlTitle: string;
          traits: Array<string>;
          id: string;
          url: string;
          title: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            publicId: string;
            url: string;
            relevanceId: string;
            breadcrumbs: Array<string>;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
          contexts: Array<{
            __typename: "SearchContext";
            contextId: string;
            publicId: string;
            url: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          }>;
        }
      | {
          __typename: "NodeSearchResult";
          id: string;
          url: string;
          title: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            publicId: string;
            url: string;
            relevanceId: string;
            breadcrumbs: Array<string>;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
          contexts: Array<{
            __typename: "SearchContext";
            contextId: string;
            publicId: string;
            url: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          }>;
        }
    >;
  } | null;
};

export type GQLSearchContainer_ResourceTypeDefinitionFragment = {
  __typename: "ResourceTypeDefinition";
  id: string;
  name: string;
};

export type GQLSearchResourceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSearchResourceTypesQuery = {
  resourceTypes: Array<{ __typename: "ResourceTypeDefinition"; id: string; name: string }> | null;
};

type GQLSearchResult_SearchResult_ArticleSearchResult_Fragment = {
  __typename: "ArticleSearchResult";
  htmlTitle: string;
  traits: Array<string>;
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  context: {
    __typename: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    relevanceId: string;
    breadcrumbs: Array<string>;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
  contexts: Array<{
    __typename: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  }>;
};

type GQLSearchResult_SearchResult_LearningpathSearchResult_Fragment = {
  __typename: "LearningpathSearchResult";
  htmlTitle: string;
  traits: Array<string>;
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  context: {
    __typename: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    relevanceId: string;
    breadcrumbs: Array<string>;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
  contexts: Array<{
    __typename: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  }>;
};

type GQLSearchResult_SearchResult_NodeSearchResult_Fragment = {
  __typename: "NodeSearchResult";
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  context: {
    __typename: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    relevanceId: string;
    breadcrumbs: Array<string>;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
  contexts: Array<{
    __typename: "SearchContext";
    contextId: string;
    publicId: string;
    url: string;
    breadcrumbs: Array<string>;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  }>;
};

export type GQLSearchResult_SearchResultFragment =
  | GQLSearchResult_SearchResult_ArticleSearchResult_Fragment
  | GQLSearchResult_SearchResult_LearningpathSearchResult_Fragment
  | GQLSearchResult_SearchResult_NodeSearchResult_Fragment;

export type GQLSubjectFilterQueryVariables = Exact<{ [key: string]: never }>;

export type GQLSubjectFilterQuery = {
  nodes: Array<{
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
  }> | null;
};

export type GQLSubjectContainer_NodeFragment = {
  __typename: "Node";
  id: string;
  name: string;
  supportedLanguages: Array<string>;
  url: string | null;
  nodeType: string;
  grepCodes: Array<string> | null;
  metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
  context: {
    __typename: "TaxonomyContext";
    contextId: string;
    isArchived: boolean;
    rootId: string;
    parentIds: Array<string>;
    url: string;
    defaultUrl: string;
  } | null;
  links: Array<{
    __typename: "Node";
    id: string;
    nodeType: string;
    name: string;
    url: string | null;
    relevanceId: string | null;
    meta: {
      __typename: "Meta";
      metaDescription: string | null;
      metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
    } | null;
    context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
  }> | null;
  nodes: Array<{
    __typename: "Node";
    id: string;
    nodeType: string;
    name: string;
    url: string | null;
    relevanceId: string | null;
    meta: {
      __typename: "Meta";
      metaDescription: string | null;
      metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
    } | null;
    context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
  }> | null;
  subjectpage: {
    __typename: "SubjectPage";
    id: number;
    metaDescription: string | null;
    about: {
      __typename: "SubjectPageAbout";
      title: string;
      visualElement: {
        __typename: "SubjectPageVisualElement";
        type: string;
        alt: string | null;
        url: string;
        imageUrl: string | null;
        imageLicense: {
          __typename: "ImageLicense";
          id: string;
          title: string;
          altText: string;
          src: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        } | null;
      };
    } | null;
    popularArticles: Array<{
      __typename: "Node";
      id: string;
      name: string;
      url: string | null;
      relevanceId: string | null;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      meta: {
        __typename: "Meta";
        traits: Array<string> | null;
        metaDescription: string | null;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
      } | null;
    }> | null;
    buildsOn: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
    connectedTo: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
    leadsTo: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
  } | null;
};

type GQLSubjectContainer_SearchResult_ArticleSearchResult_Fragment = {
  __typename: "ArticleSearchResult";
  traits: Array<string>;
  id: string;
  title: string;
  url: string;
  metaDescription: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  context: {
    __typename: "SearchContext";
    contextId: string;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
};

type GQLSubjectContainer_SearchResult_LearningpathSearchResult_Fragment = {
  __typename: "LearningpathSearchResult";
  traits: Array<string>;
  id: string;
  title: string;
  url: string;
  metaDescription: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  context: {
    __typename: "SearchContext";
    contextId: string;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
};

type GQLSubjectContainer_SearchResult_NodeSearchResult_Fragment = {
  __typename: "NodeSearchResult";
  id: string;
  title: string;
  url: string;
  metaDescription: string;
  context: {
    __typename: "SearchContext";
    contextId: string;
    relevanceId: string;
    resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
  } | null;
};

export type GQLSubjectContainer_SearchResultFragment =
  | GQLSubjectContainer_SearchResult_ArticleSearchResult_Fragment
  | GQLSubjectContainer_SearchResult_LearningpathSearchResult_Fragment
  | GQLSubjectContainer_SearchResult_NodeSearchResult_Fragment;

export type GQLSubjectPageQueryVariables = Exact<{
  subjectId?: string | null | undefined;
  contextId?: string | null | undefined;
  metadataFilterKey?: string | null | undefined;
  metadataFilterValue?: string | null | undefined;
}>;

export type GQLSubjectPageQuery = {
  node: {
    __typename: "Node";
    id: string;
    name: string;
    supportedLanguages: Array<string>;
    url: string | null;
    nodeType: string;
    grepCodes: Array<string> | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
    context: {
      __typename: "TaxonomyContext";
      contextId: string;
      isArchived: boolean;
      rootId: string;
      parentIds: Array<string>;
      url: string;
      defaultUrl: string;
    } | null;
    links: Array<{
      __typename: "Node";
      id: string;
      nodeType: string;
      name: string;
      url: string | null;
      relevanceId: string | null;
      meta: {
        __typename: "Meta";
        metaDescription: string | null;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
      } | null;
      context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
    }> | null;
    nodes: Array<{
      __typename: "Node";
      id: string;
      nodeType: string;
      name: string;
      url: string | null;
      relevanceId: string | null;
      meta: {
        __typename: "Meta";
        metaDescription: string | null;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
      } | null;
      context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
    }> | null;
    subjectpage: {
      __typename: "SubjectPage";
      id: number;
      metaDescription: string | null;
      about: {
        __typename: "SubjectPageAbout";
        title: string;
        visualElement: {
          __typename: "SubjectPageVisualElement";
          type: string;
          alt: string | null;
          url: string;
          imageUrl: string | null;
          imageLicense: {
            __typename: "ImageLicense";
            id: string;
            title: string;
            altText: string;
            src: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          } | null;
        };
      } | null;
      popularArticles: Array<{
        __typename: "Node";
        id: string;
        name: string;
        url: string | null;
        relevanceId: string | null;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        meta: {
          __typename: "Meta";
          traits: Array<string> | null;
          metaDescription: string | null;
          metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        } | null;
      }> | null;
      buildsOn: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
      connectedTo: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
      leadsTo: Array<{ __typename: "SubjectLink"; name: string | null; url: string | null }>;
    } | null;
  } | null;
  nodes: Array<{
    __typename: "Node";
    url: string | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
  }> | null;
};

export type GQLSubjectVideoSearchQueryVariables = Exact<{
  subjectId: string;
  language: string;
}>;

export type GQLSubjectVideoSearchQuery = {
  search: {
    __typename: "Search";
    results: Array<
      | {
          __typename: "ArticleSearchResult";
          traits: Array<string>;
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
          context: {
            __typename: "SearchContext";
            contextId: string;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
      | {
          __typename: "LearningpathSearchResult";
          traits: Array<string>;
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
          context: {
            __typename: "SearchContext";
            contextId: string;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
      | {
          __typename: "NodeSearchResult";
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
    >;
  } | null;
};

export type GQLSubjectSearchQueryVariables = Exact<{
  query: string;
  subjectId: string;
  language: string;
}>;

export type GQLSubjectSearchQuery = {
  search: {
    __typename: "Search";
    results: Array<
      | {
          __typename: "ArticleSearchResult";
          traits: Array<string>;
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
      | {
          __typename: "LearningpathSearchResult";
          traits: Array<string>;
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
      | {
          __typename: "NodeSearchResult";
          id: string;
          title: string;
          url: string;
          metaDescription: string;
          context: {
            __typename: "SearchContext";
            contextId: string;
            breadcrumbs: Array<string>;
            relevanceId: string;
            resourceTypes: Array<{ __typename: "SearchContextResourceTypes"; id: string; name: string }>;
          } | null;
        }
    >;
  } | null;
};

export type GQLMultidisciplinarySubjectArticle_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  name: string;
  url: string | null;
  relevanceId: string | null;
  context: {
    __typename: "TaxonomyContext";
    contextId: string;
    rootId: string;
    breadcrumbs: Array<string>;
    url: string;
    defaultUrl: string;
    isArchived: boolean;
    parents: Array<{ __typename: "TaxonomyCrumb"; contextId: string; id: string; name: string; url: string }> | null;
  } | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
  article: {
    __typename: "Article";
    id: number;
    language: string;
    created: string;
    updated: string;
    revised: string;
    oembed: string | null;
    introduction: string | null;
    metaDescription: string;
    traits: Array<string>;
    revision: number;
    supportedLanguages: Array<string>;
    grepCodes: Array<string> | null;
    htmlIntroduction: string | null;
    htmlTitle: string;
    published: string;
    revisionDate: string | null;
    title: string;
    requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
    metaImage: {
      __typename: "ImageMetaInformationV3";
      id: string;
      image: { __typename: "ImageV3"; imageUrl: string };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
    crossSubjectTopics: Array<{
      __typename: "CrossSubjectElement";
      title: string;
      path: string | null;
      url: string | null;
    }> | null;
    transformedContent: {
      __typename: "TransformedArticleContent";
      content: string;
      metaData: {
        __typename: "ArticleMetaData";
        copyText: string | null;
        footnotes: Array<{
          __typename: "FootNote";
          ref: number;
          title: string;
          year: string;
          authors: Array<string>;
          edition: string | null;
          publisher: string | null;
          url: string | null;
        }>;
        concepts: Array<{
          __typename: "ConceptLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        glosses: Array<{
          __typename: "GlossLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        h5ps: Array<{
          __typename: "H5pLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        brightcoves: Array<{
          __typename: "BrightcoveLicense";
          id: string;
          title: string;
          download: string | null;
          src: string | null;
          cover: string | null;
          iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        audios: Array<{
          __typename: "AudioLicense";
          id: string;
          src: string;
          title: string;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        podcasts: Array<{
          __typename: "PodcastLicense";
          id: string;
          src: string;
          copyText: string | null;
          title: string;
          description: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        images: Array<{
          __typename: "ImageLicense";
          id: string;
          title: string;
          altText: string;
          src: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        textblocks: Array<{
          __typename: "TextblockLicense";
          title: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
      } | null;
    };
    transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    copyright: {
      __typename: "Copyright";
      origin: string | null;
      processed: boolean | null;
      license: { __typename: "License"; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
  } | null;
};

export type GQLTopicContainer_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  name: string;
  contentUri: string | null;
  url: string | null;
  defaultUrl: string | null;
  children: Array<{
    __typename: "Node";
    id: string;
    nodeType: string;
    name: string;
    url: string | null;
    relevanceId: string | null;
    meta: {
      __typename: "Meta";
      metaDescription: string | null;
      metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
    } | null;
    context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
  }> | null;
  links: Array<{
    __typename: "Node";
    id: string;
    nodeType: string;
    name: string;
    url: string | null;
    relevanceId: string | null;
    meta: {
      __typename: "Meta";
      metaDescription: string | null;
      metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
    } | null;
    context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
  }> | null;
};

export type GQLTopicPageQueryVariables = Exact<{
  rootId?: string | null | undefined;
  contextId?: string | null | undefined;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLTopicPageQuery = {
  node: {
    __typename: "Node";
    id: string;
    name: string;
    supportedLanguages: Array<string>;
    breadcrumbs: Array<string>;
    relevanceId: string | null;
    nodeType: string;
    url: string | null;
    contentUri: string | null;
    defaultUrl: string | null;
    article: {
      __typename: "Article";
      id: number;
      htmlTitle: string;
      htmlIntroduction: string | null;
      grepCodes: Array<string> | null;
      revision: number;
      language: string;
      created: string;
      updated: string;
      revised: string;
      oembed: string | null;
      introduction: string | null;
      metaDescription: string;
      traits: Array<string>;
      supportedLanguages: Array<string>;
      published: string;
      revisionDate: string | null;
      title: string;
      metaImage: {
        __typename: "ImageMetaInformationV3";
        id: string;
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      visualElementEmbed: { __typename: "ResourceEmbed"; content: string } | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
      crossSubjectTopics: Array<{
        __typename: "CrossSubjectElement";
        title: string;
        path: string | null;
        url: string | null;
      }> | null;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
          concepts: Array<{
            __typename: "ConceptLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          glosses: Array<{
            __typename: "GlossLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "ConceptCopyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string } | null;
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          h5ps: Array<{
            __typename: "H5pLicense";
            id: string;
            title: string;
            src: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            id: string;
            title: string;
            download: string | null;
            src: string | null;
            cover: string | null;
            iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            id: string;
            src: string;
            title: string;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            id: string;
            src: string;
            copyText: string | null;
            title: string;
            description: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          images: Array<{
            __typename: "ImageLicense";
            id: string;
            title: string;
            altText: string;
            src: string;
            copyText: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          textblocks: Array<{
            __typename: "TextblockLicense";
            title: string | null;
            copyright: {
              __typename: "Copyright";
              origin: string | null;
              processed: boolean | null;
              license: { __typename: "License"; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
        } | null;
      };
      transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
      copyright: {
        __typename: "Copyright";
        origin: string | null;
        processed: boolean | null;
        license: { __typename: "License"; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
    } | null;
    meta: {
      __typename: "Meta";
      metaDescription: string | null;
      metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
    } | null;
    context: {
      __typename: "TaxonomyContext";
      contextId: string;
      rootId: string;
      name: string;
      url: string;
      defaultUrl: string;
      isArchived: boolean;
      breadcrumbs: Array<string>;
      parents: Array<{ __typename: "TaxonomyCrumb"; id: string; contextId: string; url: string; name: string }> | null;
    } | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    children: Array<{
      __typename: "Node";
      id: string;
      nodeType: string;
      name: string;
      url: string | null;
      relevanceId: string | null;
      meta: {
        __typename: "Meta";
        metaDescription: string | null;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
      } | null;
      context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
    }> | null;
    links: Array<{
      __typename: "Node";
      id: string;
      nodeType: string;
      name: string;
      url: string | null;
      relevanceId: string | null;
      meta: {
        __typename: "Meta";
        metaDescription: string | null;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
      } | null;
      context: { __typename: "TaxonomyContext"; contextId: string; breadcrumbs: Array<string> } | null;
    }> | null;
  } | null;
};

export type GQLFrontpageDataQueryVariables = Exact<{
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLFrontpageDataQuery = {
  programmes: Array<{
    __typename: "ProgrammePage";
    id: string;
    url: string | null;
    title: { __typename: "Title"; title: string; language: string };
  }> | null;
  frontpage: {
    __typename: "FrontpageMenu";
    articleId: number;
    article: {
      __typename: "Article";
      id: number;
      introduction: string | null;
      created: string;
      updated: string;
      revised: string;
      published: string;
      language: string;
      htmlTitle: string;
      title: string;
      metaDescription: string;
      supportedLanguages: Array<string>;
      htmlIntroduction: string | null;
      revisionDate: string | null;
      requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
      transformedContent: {
        __typename: "TransformedArticleContent";
        content: string;
        metaData: {
          __typename: "ArticleMetaData";
          copyText: string | null;
          images: Array<{
            __typename: "ImageLicense";
            src: string;
            title: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          audios: Array<{
            __typename: "AudioLicense";
            src: string;
            title: string;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          podcasts: Array<{
            __typename: "PodcastLicense";
            src: string;
            title: string;
            description: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            };
          }>;
          brightcoves: Array<{
            __typename: "BrightcoveLicense";
            src: string | null;
            title: string;
            cover: string | null;
            description: string | null;
            download: string | null;
            uploadDate: string | null;
            copyright: {
              __typename: "Copyright";
              processed: boolean | null;
              license: { __typename: "License"; url: string | null; license: string };
              creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
              processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
              rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
            } | null;
          }>;
          footnotes: Array<{
            __typename: "FootNote";
            ref: number;
            title: string;
            year: string;
            authors: Array<string>;
            edition: string | null;
            publisher: string | null;
            url: string | null;
          }>;
        } | null;
      };
      copyright: {
        __typename: "Copyright";
        processed: boolean | null;
        license: { __typename: "License"; url: string | null; license: string };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      metaImage: {
        __typename: "ImageMetaInformationV3";
        image: { __typename: "ImageV3"; imageUrl: string };
        alttext: { __typename: "ImageAltText"; alttext: string };
      } | null;
      competenceGoals: Array<{
        __typename: "CompetenceGoal";
        id: string;
        code: string | null;
        title: string;
        type: string;
      }>;
      coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
    };
  } | null;
};

export type GQLLearningpathStepEmbedUrlFragment = {
  __typename: "LearningpathStepEmbedUrl";
  url: string;
  embedType: string;
};

export type GQLLearningpathStepOembedFragment = {
  __typename: "LearningpathStepOembed";
  type: string;
  version: string;
  height: number;
  html: string;
  width: number;
};

export type GQLResource_ArticleFragment = {
  __typename: "Article";
  id: number;
  metaDescription: string;
  created: string;
  updated: string;
  articleType: string;
  title: string;
  traits: Array<string>;
  language: string;
};

export type GQLMyNdlaLearningpathStepFragment = {
  __typename: "MyNdlaLearningpathStep";
  id: number;
  title: string;
  seqNo: number;
  canEdit: boolean;
  articleId: number | null;
  description: string | null;
  introduction: string | null;
  type: GQLLearningpathStepType;
  supportedLanguages: Array<string>;
  showTitle: boolean;
  revision: number;
  embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
  oembed: {
    __typename: "LearningpathStepOembed";
    type: string;
    version: string;
    height: number;
    html: string;
    width: number;
  } | null;
  opengraph: {
    __typename: "ExternalOpengraph";
    title: string | null;
    description: string | null;
    url: string | null;
  } | null;
  resource: {
    __typename: "Resource";
    id: string;
    url: string | null;
    breadcrumbs: Array<string>;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
    article: {
      __typename: "Article";
      id: number;
      metaDescription: string;
      created: string;
      updated: string;
      articleType: string;
      title: string;
      traits: Array<string>;
      language: string;
    } | null;
  } | null;
  copyright: {
    __typename: "LearningpathCopyright";
    license: { __typename: "License"; license: string };
    contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
  } | null;
};

export type GQLMyNdlaLearningpathFragment = {
  __typename: "MyNdlaLearningpath";
  id: number;
  title: string;
  description: string;
  introduction: string | null;
  created: string;
  canEdit: boolean;
  status: string;
  madeAvailable: string | null;
  revision: number;
  supportedLanguages: Array<string>;
  coverphoto: {
    __typename: "ImageMetaInformationV3";
    metaUrl: string;
    image: { __typename: "ImageV3"; imageUrl: string };
  } | null;
  learningsteps?: Array<{
    __typename: "MyNdlaLearningpathStep";
    id: number;
    title: string;
    seqNo: number;
    canEdit: boolean;
    articleId: number | null;
    description: string | null;
    introduction: string | null;
    type: GQLLearningpathStepType;
    supportedLanguages: Array<string>;
    showTitle: boolean;
    revision: number;
    embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
    oembed: {
      __typename: "LearningpathStepOembed";
      type: string;
      version: string;
      height: number;
      html: string;
      width: number;
    } | null;
    opengraph: {
      __typename: "ExternalOpengraph";
      title: string | null;
      description: string | null;
      url: string | null;
    } | null;
    resource: {
      __typename: "Resource";
      id: string;
      url: string | null;
      breadcrumbs: Array<string>;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      article: {
        __typename: "Article";
        id: number;
        metaDescription: string;
        created: string;
        updated: string;
        articleType: string;
        title: string;
        traits: Array<string>;
        language: string;
      } | null;
    } | null;
    copyright: {
      __typename: "LearningpathCopyright";
      license: { __typename: "License"; license: string };
      contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    } | null;
  }>;
};

export type GQLIframeArticlePage_ArticleFragment = {
  __typename: "Article";
  articleType: string;
  created: string;
  updated: string;
  metaDescription: string;
  oembed: string | null;
  tags: Array<string> | null;
  id: number;
  supportedLanguages: Array<string>;
  grepCodes: Array<string> | null;
  htmlIntroduction: string | null;
  htmlTitle: string;
  traits: Array<string>;
  revision: number;
  language: string;
  title: string;
  published: string;
  revised: string;
  revisionDate: string | null;
  requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
  metaImage: {
    __typename: "ImageMetaInformationV3";
    image: { __typename: "ImageV3"; imageUrl: string };
    alttext: { __typename: "ImageAltText"; alttext: string };
  } | null;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      copyText: string | null;
      images: Array<{
        __typename: "ImageLicense";
        src: string;
        title: string;
        id: string;
        altText: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        src: string;
        title: string;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        src: string;
        title: string;
        description: string | null;
        id: string;
        copyText: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        src: string | null;
        title: string;
        cover: string | null;
        description: string | null;
        download: string | null;
        uploadDate: string | null;
        id: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          origin: string | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
        iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
      }>;
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
      concepts: Array<{
        __typename: "ConceptLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      glosses: Array<{
        __typename: "GlossLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "ConceptCopyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string } | null;
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      h5ps: Array<{
        __typename: "H5pLicense";
        id: string;
        title: string;
        src: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
      textblocks: Array<{
        __typename: "TextblockLicense";
        title: string | null;
        copyright: {
          __typename: "Copyright";
          origin: string | null;
          processed: boolean | null;
          license: { __typename: "License"; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
    } | null;
  };
  transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    origin: string | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    code: string | null;
    title: string;
    type: string;
  }>;
  coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
};

export type GQLIframeArticlePage_NodeFragment = {
  __typename: "Node";
  id: string;
  nodeType: string;
  name: string;
  url: string | null;
  defaultUrl: string | null;
  relevanceId: string | null;
  resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
};

export type GQLIframePageQueryVariables = Exact<{
  articleId: string;
  taxonomyId: string;
  transformArgs?: GQLTransformedArticleContentInput | null | undefined;
}>;

export type GQLIframePageQuery = {
  article: {
    __typename: "Article";
    articleType: string;
    created: string;
    updated: string;
    metaDescription: string;
    oembed: string | null;
    tags: Array<string> | null;
    id: number;
    supportedLanguages: Array<string>;
    grepCodes: Array<string> | null;
    htmlIntroduction: string | null;
    htmlTitle: string;
    traits: Array<string>;
    revision: number;
    language: string;
    title: string;
    published: string;
    revised: string;
    revisionDate: string | null;
    requiredLibraries: Array<{ __typename: "ArticleRequiredLibrary"; url: string; mediaType: string }>;
    metaImage: {
      __typename: "ImageMetaInformationV3";
      image: { __typename: "ImageV3"; imageUrl: string };
      alttext: { __typename: "ImageAltText"; alttext: string };
    } | null;
    transformedContent: {
      __typename: "TransformedArticleContent";
      content: string;
      metaData: {
        __typename: "ArticleMetaData";
        copyText: string | null;
        images: Array<{
          __typename: "ImageLicense";
          src: string;
          title: string;
          id: string;
          altText: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        audios: Array<{
          __typename: "AudioLicense";
          src: string;
          title: string;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        podcasts: Array<{
          __typename: "PodcastLicense";
          src: string;
          title: string;
          description: string | null;
          id: string;
          copyText: string | null;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
        brightcoves: Array<{
          __typename: "BrightcoveLicense";
          src: string | null;
          title: string;
          cover: string | null;
          description: string | null;
          download: string | null;
          uploadDate: string | null;
          id: string;
          copyright: {
            __typename: "Copyright";
            processed: boolean | null;
            origin: string | null;
            license: { __typename: "License"; url: string | null; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
          iframe: { __typename: "BrightcoveIframe"; width: number; height: number; src: string } | null;
        }>;
        footnotes: Array<{
          __typename: "FootNote";
          ref: number;
          title: string;
          year: string;
          authors: Array<string>;
          edition: string | null;
          publisher: string | null;
          url: string | null;
        }>;
        concepts: Array<{
          __typename: "ConceptLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        glosses: Array<{
          __typename: "GlossLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "ConceptCopyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string } | null;
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        h5ps: Array<{
          __typename: "H5pLicense";
          id: string;
          title: string;
          src: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          } | null;
        }>;
        textblocks: Array<{
          __typename: "TextblockLicense";
          title: string | null;
          copyright: {
            __typename: "Copyright";
            origin: string | null;
            processed: boolean | null;
            license: { __typename: "License"; license: string };
            creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
            processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
            rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
          };
        }>;
      } | null;
    };
    transformedDisclaimer: { __typename: "TransformedArticleContent"; content: string };
    copyright: {
      __typename: "Copyright";
      processed: boolean | null;
      origin: string | null;
      license: { __typename: "License"; url: string | null; license: string };
      creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
      processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
      rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
    };
    competenceGoals: Array<{
      __typename: "CompetenceGoal";
      id: string;
      code: string | null;
      title: string;
      type: string;
    }>;
    coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
  } | null;
  nodeByArticleId: {
    __typename: "Node";
    id: string;
    nodeType: string;
    name: string;
    url: string | null;
    defaultUrl: string | null;
    relevanceId: string | null;
    resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
  } | null;
};

export type GQLLtiSearchResourceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type GQLLtiSearchResourceTypesQuery = {
  resourceTypes: Array<{ __typename: "ResourceTypeDefinition"; id: string; name: string }> | null;
};

export type GQLMyNdlaResourceFragment = {
  __typename: "MyNdlaResource";
  resourceId: string;
  id: string;
  resourceType: string;
  path: string;
  created: string;
  tags: Array<string>;
};

export type GQLBaseFolderFragment = {
  __typename: "Folder";
  id: string;
  name: string;
  status: string;
  parentId: string | null;
  created: string;
  updated: string;
  description: string | null;
  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
  owner: { __typename: "Owner"; name: string } | null;
  resources: Array<{
    __typename: "MyNdlaResource";
    resourceId: string;
    id: string;
    resourceType: string;
    path: string;
    created: string;
    tags: Array<string>;
  }>;
};

export type GQLFolderFragment = {
  __typename: "Folder";
  id: string;
  name: string;
  status: string;
  parentId: string | null;
  created: string;
  updated: string;
  description: string | null;
  subfolders: Array<{
    __typename: "Folder";
    id: string;
    name: string;
    status: string;
    parentId: string | null;
    created: string;
    updated: string;
    description: string | null;
    subfolders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
    owner: { __typename: "Owner"; name: string } | null;
    resources: Array<{
      __typename: "MyNdlaResource";
      resourceId: string;
      id: string;
      resourceType: string;
      path: string;
      created: string;
      tags: Array<string>;
    }>;
  }>;
  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
  owner: { __typename: "Owner"; name: string } | null;
  resources: Array<{
    __typename: "MyNdlaResource";
    resourceId: string;
    id: string;
    resourceType: string;
    path: string;
    created: string;
    tags: Array<string>;
  }>;
};

export type GQLBaseSharedFolderFragment = {
  __typename: "SharedFolder";
  id: string;
  name: string;
  status: string;
  parentId: string | null;
  created: string;
  updated: string;
  description: string | null;
  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
  owner: { __typename: "Owner"; name: string } | null;
  resources: Array<{
    __typename: "MyNdlaResource";
    resourceId: string;
    id: string;
    resourceType: string;
    path: string;
    created: string;
    tags: Array<string>;
  }>;
};

export type GQLSharedFolderFragment = {
  __typename: "SharedFolder";
  id: string;
  name: string;
  status: string;
  parentId: string | null;
  created: string;
  updated: string;
  description: string | null;
  subfolders: Array<{
    __typename: "SharedFolder";
    id: string;
    name: string;
    status: string;
    parentId: string | null;
    created: string;
    updated: string;
    description: string | null;
    subfolders: Array<{
      __typename: "SharedFolder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "SharedFolder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "SharedFolder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "SharedFolder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "SharedFolder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "SharedFolder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "SharedFolder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "SharedFolder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
    owner: { __typename: "Owner"; name: string } | null;
    resources: Array<{
      __typename: "MyNdlaResource";
      resourceId: string;
      id: string;
      resourceType: string;
      path: string;
      created: string;
      tags: Array<string>;
    }>;
  }>;
  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
  owner: { __typename: "Owner"; name: string } | null;
  resources: Array<{
    __typename: "MyNdlaResource";
    resourceId: string;
    id: string;
    resourceType: string;
    path: string;
    created: string;
    tags: Array<string>;
  }>;
};

type GQLMyNdlaResourceMeta_MyNdlaArticleResourceMeta_Fragment = {
  __typename: "MyNdlaArticleResourceMeta";
  traits: Array<string> | null;
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
};

type GQLMyNdlaResourceMeta_MyNdlaAudioResourceMeta_Fragment = {
  __typename: "MyNdlaAudioResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
};

type GQLMyNdlaResourceMeta_MyNdlaConceptResourceMeta_Fragment = {
  __typename: "MyNdlaConceptResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
};

type GQLMyNdlaResourceMeta_MyNdlaImageResourceMeta_Fragment = {
  __typename: "MyNdlaImageResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
};

type GQLMyNdlaResourceMeta_MyNdlaLearningpathResourceMeta_Fragment = {
  __typename: "MyNdlaLearningpathResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
};

type GQLMyNdlaResourceMeta_MyNdlaVideoResourceMeta_Fragment = {
  __typename: "MyNdlaVideoResourceMeta";
  id: string;
  title: string;
  description: string;
  type: string;
  metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
  resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
};

export type GQLMyNdlaResourceMetaFragment =
  | GQLMyNdlaResourceMeta_MyNdlaArticleResourceMeta_Fragment
  | GQLMyNdlaResourceMeta_MyNdlaAudioResourceMeta_Fragment
  | GQLMyNdlaResourceMeta_MyNdlaConceptResourceMeta_Fragment
  | GQLMyNdlaResourceMeta_MyNdlaImageResourceMeta_Fragment
  | GQLMyNdlaResourceMeta_MyNdlaLearningpathResourceMeta_Fragment
  | GQLMyNdlaResourceMeta_MyNdlaVideoResourceMeta_Fragment;

export type GQLDeleteFolderMutationVariables = Exact<{
  id: string;
}>;

export type GQLDeleteFolderMutation = { deleteFolder: string };

export type GQLUpdateMyNdlaResourceMutationVariables = Exact<{
  id: string;
  tags: Array<string> | string;
}>;

export type GQLUpdateMyNdlaResourceMutation = {
  updateMyNdlaResource: {
    __typename: "MyNdlaResource";
    resourceId: string;
    id: string;
    resourceType: string;
    path: string;
    created: string;
    tags: Array<string>;
  };
};

export type GQLAddFolderMutationVariables = Exact<{
  name: string;
  parentId?: string | null | undefined;
  status?: string | null | undefined;
  description?: string | null | undefined;
}>;

export type GQLAddFolderMutation = {
  addFolder: {
    __typename: "Folder";
    id: string;
    name: string;
    status: string;
    parentId: string | null;
    created: string;
    updated: string;
    description: string | null;
    subfolders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
    owner: { __typename: "Owner"; name: string } | null;
    resources: Array<{
      __typename: "MyNdlaResource";
      resourceId: string;
      id: string;
      resourceType: string;
      path: string;
      created: string;
      tags: Array<string>;
    }>;
  };
};

export type GQLUpdateFolderMutationVariables = Exact<{
  id: string;
  name?: string | null | undefined;
  status?: string | null | undefined;
  description?: string | null | undefined;
}>;

export type GQLUpdateFolderMutation = {
  updateFolder: {
    __typename: "Folder";
    id: string;
    name: string;
    status: string;
    parentId: string | null;
    created: string;
    updated: string;
    description: string | null;
    subfolders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
    owner: { __typename: "Owner"; name: string } | null;
    resources: Array<{
      __typename: "MyNdlaResource";
      resourceId: string;
      id: string;
      resourceType: string;
      path: string;
      created: string;
      tags: Array<string>;
    }>;
  };
};

export type GQLUpdateFolderStatusMutationVariables = Exact<{
  folderId: string;
  status: string;
}>;

export type GQLUpdateFolderStatusMutation = { updateFolderStatus: Array<string> };

export type GQLCopySharedFolderMutationVariables = Exact<{
  folderId: string;
  destinationFolderId?: string | null | undefined;
}>;

export type GQLCopySharedFolderMutation = {
  copySharedFolder: {
    __typename: "Folder";
    id: string;
    name: string;
    status: string;
    parentId: string | null;
    created: string;
    updated: string;
    description: string | null;
    subfolders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
    owner: { __typename: "Owner"; name: string } | null;
    resources: Array<{
      __typename: "MyNdlaResource";
      resourceId: string;
      id: string;
      resourceType: string;
      path: string;
      created: string;
      tags: Array<string>;
    }>;
  };
};

export type GQLMoveFolderMutationVariables = Exact<{
  id: string;
  parentId?: unknown;
}>;

export type GQLMoveFolderMutation = {
  moveFolder: {
    __typename: "Folder";
    id: string;
    name: string;
    status: string;
    parentId: string | null;
    created: string;
    updated: string;
    description: string | null;
    subfolders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
    owner: { __typename: "Owner"; name: string } | null;
    resources: Array<{
      __typename: "MyNdlaResource";
      resourceId: string;
      id: string;
      resourceType: string;
      path: string;
      created: string;
      tags: Array<string>;
    }>;
  };
};

export type GQLAddMyNdlaResourceMutationVariables = Exact<{
  resourceId: string;
  folderId?: string | null | undefined;
  resourceType: string;
  path: string;
  tags?: Array<string> | string | null | undefined;
}>;

export type GQLAddMyNdlaResourceMutation = {
  addMyNdlaResource: {
    __typename: "MyNdlaResource";
    resourceId: string;
    id: string;
    resourceType: string;
    path: string;
    created: string;
    tags: Array<string>;
  };
};

export type GQLDeleteMyNdlaResourceMutationVariables = Exact<{
  folderId?: string | null | undefined;
  resourceId: string;
}>;

export type GQLDeleteMyNdlaResourceMutation = { deleteMyNdlaResource: string };

export type GQLMoveMyNdlaResourceMutationVariables = Exact<{
  id: string;
  fromFolderId?: unknown;
  toFolderId?: unknown;
}>;

export type GQLMoveMyNdlaResourceMutation = { moveMyNdlaResource: boolean | null };

export type GQLBatchDeleteMyNdlaResourcesMutationVariables = Exact<{
  resourceIds: Array<string> | string;
  folderId?: unknown;
}>;

export type GQLBatchDeleteMyNdlaResourcesMutation = { deleteMyNdlaResources: boolean };

export type GQLBatchMoveMyNdlaResourcesMutationVariables = Exact<{
  resourceIds: Array<string> | string;
  fromFolderId?: unknown;
  toFolderId?: unknown;
}>;

export type GQLBatchMoveMyNdlaResourcesMutation = { moveMyNdlaResources: boolean };

export type GQLBatchCopyMyNdlaResourcesMutationVariables = Exact<{
  resourceIds: Array<string> | string;
  toFolderId?: unknown;
}>;

export type GQLBatchCopyMyNdlaResourcesMutation = { copyMyNdlaResources: boolean };

export type GQLFavoriteSharedFolderMutationVariables = Exact<{
  folderId: string;
}>;

export type GQLFavoriteSharedFolderMutation = { favoriteSharedFolder: string };

export type GQLUnFavoriteSharedFolderMutationVariables = Exact<{
  folderId: string;
}>;

export type GQLUnFavoriteSharedFolderMutation = { unFavoriteSharedFolder: string };

export type GQLMyNdlaResourceMetaQueryVariables = Exact<{
  resource: GQLMyNdlaResourceMetaSearchInput;
}>;

export type GQLMyNdlaResourceMetaQuery = {
  myNdlaResourceMeta:
    | {
        __typename: "MyNdlaArticleResourceMeta";
        traits: Array<string> | null;
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaAudioResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaConceptResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaImageResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaLearningpathResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaVideoResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | null;
};

export type GQLMyNdlaResourceMetaSearchQueryVariables = Exact<{
  resources: Array<GQLMyNdlaResourceMetaSearchInput> | GQLMyNdlaResourceMetaSearchInput;
}>;

export type GQLMyNdlaResourceMetaSearchQuery = {
  myNdlaResourceMetaSearch: Array<
    | {
        __typename: "MyNdlaArticleResourceMeta";
        traits: Array<string> | null;
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaAudioResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaConceptResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaImageResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaLearningpathResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
    | {
        __typename: "MyNdlaVideoResourceMeta";
        id: string;
        title: string;
        description: string;
        type: string;
        metaImage: { __typename: "MetaImage"; url: string; alt: string } | null;
        resourceTypes: Array<{ __typename: "MyNdlaResourceResourceType"; id: string; name: string }>;
      }
  >;
};

export type GQLFoldersPageQueryVariables = Exact<{ [key: string]: never }>;

export type GQLFoldersPageQuery = {
  folders: {
    __typename: "UserFolder";
    folders: Array<{
      __typename: "Folder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "Folder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "Folder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "Folder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "Folder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "Folder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "Folder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "Folder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "Folder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "Folder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    sharedFolders: Array<{
      __typename: "SharedFolder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "SharedFolder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "SharedFolder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "SharedFolder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "SharedFolder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "SharedFolder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "SharedFolder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "SharedFolder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "SharedFolder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      subfolders: Array<{
                        __typename: "SharedFolder";
                        id: string;
                        name: string;
                        status: string;
                        parentId: string | null;
                        created: string;
                        updated: string;
                        description: string | null;
                        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                        owner: { __typename: "Owner"; name: string } | null;
                        resources: Array<{
                          __typename: "MyNdlaResource";
                          resourceId: string;
                          id: string;
                          resourceType: string;
                          path: string;
                          created: string;
                          tags: Array<string>;
                        }>;
                      }>;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
  };
};

export type GQLSharedFolderQueryVariables = Exact<{
  id: string;
}>;

export type GQLSharedFolderQuery = {
  sharedFolder: {
    __typename: "SharedFolder";
    id: string;
    name: string;
    status: string;
    parentId: string | null;
    created: string;
    updated: string;
    description: string | null;
    subfolders: Array<{
      __typename: "SharedFolder";
      id: string;
      name: string;
      status: string;
      parentId: string | null;
      created: string;
      updated: string;
      description: string | null;
      subfolders: Array<{
        __typename: "SharedFolder";
        id: string;
        name: string;
        status: string;
        parentId: string | null;
        created: string;
        updated: string;
        description: string | null;
        subfolders: Array<{
          __typename: "SharedFolder";
          id: string;
          name: string;
          status: string;
          parentId: string | null;
          created: string;
          updated: string;
          description: string | null;
          subfolders: Array<{
            __typename: "SharedFolder";
            id: string;
            name: string;
            status: string;
            parentId: string | null;
            created: string;
            updated: string;
            description: string | null;
            subfolders: Array<{
              __typename: "SharedFolder";
              id: string;
              name: string;
              status: string;
              parentId: string | null;
              created: string;
              updated: string;
              description: string | null;
              subfolders: Array<{
                __typename: "SharedFolder";
                id: string;
                name: string;
                status: string;
                parentId: string | null;
                created: string;
                updated: string;
                description: string | null;
                subfolders: Array<{
                  __typename: "SharedFolder";
                  id: string;
                  name: string;
                  status: string;
                  parentId: string | null;
                  created: string;
                  updated: string;
                  description: string | null;
                  subfolders: Array<{
                    __typename: "SharedFolder";
                    id: string;
                    name: string;
                    status: string;
                    parentId: string | null;
                    created: string;
                    updated: string;
                    description: string | null;
                    subfolders: Array<{
                      __typename: "SharedFolder";
                      id: string;
                      name: string;
                      status: string;
                      parentId: string | null;
                      created: string;
                      updated: string;
                      description: string | null;
                      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                      owner: { __typename: "Owner"; name: string } | null;
                      resources: Array<{
                        __typename: "MyNdlaResource";
                        resourceId: string;
                        id: string;
                        resourceType: string;
                        path: string;
                        created: string;
                        tags: Array<string>;
                      }>;
                    }>;
                    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                    owner: { __typename: "Owner"; name: string } | null;
                    resources: Array<{
                      __typename: "MyNdlaResource";
                      resourceId: string;
                      id: string;
                      resourceType: string;
                      path: string;
                      created: string;
                      tags: Array<string>;
                    }>;
                  }>;
                  breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                  owner: { __typename: "Owner"; name: string } | null;
                  resources: Array<{
                    __typename: "MyNdlaResource";
                    resourceId: string;
                    id: string;
                    resourceType: string;
                    path: string;
                    created: string;
                    tags: Array<string>;
                  }>;
                }>;
                breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
                owner: { __typename: "Owner"; name: string } | null;
                resources: Array<{
                  __typename: "MyNdlaResource";
                  resourceId: string;
                  id: string;
                  resourceType: string;
                  path: string;
                  created: string;
                  tags: Array<string>;
                }>;
              }>;
              breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
              owner: { __typename: "Owner"; name: string } | null;
              resources: Array<{
                __typename: "MyNdlaResource";
                resourceId: string;
                id: string;
                resourceType: string;
                path: string;
                created: string;
                tags: Array<string>;
              }>;
            }>;
            breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
            owner: { __typename: "Owner"; name: string } | null;
            resources: Array<{
              __typename: "MyNdlaResource";
              resourceId: string;
              id: string;
              resourceType: string;
              path: string;
              created: string;
              tags: Array<string>;
            }>;
          }>;
          breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
          owner: { __typename: "Owner"; name: string } | null;
          resources: Array<{
            __typename: "MyNdlaResource";
            resourceId: string;
            id: string;
            resourceType: string;
            path: string;
            created: string;
            tags: Array<string>;
          }>;
        }>;
        breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
        owner: { __typename: "Owner"; name: string } | null;
        resources: Array<{
          __typename: "MyNdlaResource";
          resourceId: string;
          id: string;
          resourceType: string;
          path: string;
          created: string;
          tags: Array<string>;
        }>;
      }>;
      breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
      owner: { __typename: "Owner"; name: string } | null;
      resources: Array<{
        __typename: "MyNdlaResource";
        resourceId: string;
        id: string;
        resourceType: string;
        path: string;
        created: string;
        tags: Array<string>;
      }>;
    }>;
    breadcrumbs: Array<{ __typename: "Breadcrumb"; id: string; name: string }>;
    owner: { __typename: "Owner"; name: string } | null;
    resources: Array<{
      __typename: "MyNdlaResource";
      resourceId: string;
      id: string;
      resourceType: string;
      path: string;
      created: string;
      tags: Array<string>;
    }>;
  };
};

export type GQLRecentlyUsedQueryVariables = Exact<{ [key: string]: never }>;

export type GQLRecentlyUsedQuery = {
  allMyNdlaResources: Array<{
    __typename: "MyNdlaResource";
    id: string;
    resourceId: string;
    path: string;
    tags: Array<string>;
    resourceType: string;
    created: string;
  }>;
};

export type GQLRootResourcesQueryVariables = Exact<{ [key: string]: never }>;

export type GQLRootResourcesQuery = {
  myNdlaRootResources: Array<{
    __typename: "MyNdlaResource";
    id: string;
    resourceId: string;
    path: string;
    tags: Array<string>;
    resourceType: string;
    created: string;
  }>;
};

export type GQLFavouriteSubjectsQueryVariables = Exact<{
  ids: Array<string> | string;
}>;

export type GQLFavouriteSubjectsQuery = {
  subjects: Array<{
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    metadata: { __typename: "TaxonomyMetadata"; customFields: unknown };
  }> | null;
};

export type GQLResourceConnectionsQueryVariables = Exact<{
  path: string;
}>;

export type GQLResourceConnectionsQuery = {
  myNdlaResourceConnections: Array<{
    __typename: "MyNdlaResourceConnection";
    resourceId: string;
    folderId: string | null;
  }>;
};

export type GQLDeleteLearningpathMutationVariables = Exact<{
  id: number;
}>;

export type GQLDeleteLearningpathMutation = { deleteLearningpath: boolean | null };

export type GQLUpdateLearningpathStatusMutationVariables = Exact<{
  id: number;
  status: string;
  includeSteps?: boolean | null | undefined;
}>;

export type GQLUpdateLearningpathStatusMutation = {
  updateLearningpathStatus: {
    __typename: "MyNdlaLearningpath";
    id: number;
    title: string;
    description: string;
    introduction: string | null;
    created: string;
    canEdit: boolean;
    status: string;
    madeAvailable: string | null;
    revision: number;
    supportedLanguages: Array<string>;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      metaUrl: string;
      image: { __typename: "ImageV3"; imageUrl: string };
    } | null;
    learningsteps?: Array<{
      __typename: "MyNdlaLearningpathStep";
      id: number;
      title: string;
      seqNo: number;
      canEdit: boolean;
      articleId: number | null;
      description: string | null;
      introduction: string | null;
      type: GQLLearningpathStepType;
      supportedLanguages: Array<string>;
      showTitle: boolean;
      revision: number;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        type: string;
        version: string;
        height: number;
        html: string;
        width: number;
      } | null;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        url: string | null;
        breadcrumbs: Array<string>;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          traits: Array<string>;
          language: string;
        } | null;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
  };
};

export type GQLNewLearningpathMutationVariables = Exact<{
  params: GQLLearningpathNewInput;
  includeSteps?: boolean | null | undefined;
}>;

export type GQLNewLearningpathMutation = {
  newLearningpath: {
    __typename: "MyNdlaLearningpath";
    id: number;
    title: string;
    description: string;
    introduction: string | null;
    created: string;
    canEdit: boolean;
    status: string;
    madeAvailable: string | null;
    revision: number;
    supportedLanguages: Array<string>;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      metaUrl: string;
      image: { __typename: "ImageV3"; imageUrl: string };
    } | null;
    learningsteps?: Array<{
      __typename: "MyNdlaLearningpathStep";
      id: number;
      title: string;
      seqNo: number;
      canEdit: boolean;
      articleId: number | null;
      description: string | null;
      introduction: string | null;
      type: GQLLearningpathStepType;
      supportedLanguages: Array<string>;
      showTitle: boolean;
      revision: number;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        type: string;
        version: string;
        height: number;
        html: string;
        width: number;
      } | null;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        url: string | null;
        breadcrumbs: Array<string>;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          traits: Array<string>;
          language: string;
        } | null;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
  };
};

export type GQLNewLearningpathStepMutationVariables = Exact<{
  learningpathId: number;
  params: GQLLearningpathStepNewInput;
}>;

export type GQLNewLearningpathStepMutation = {
  newLearningpathStep: {
    __typename: "MyNdlaLearningpathStep";
    id: number;
    title: string;
    seqNo: number;
    canEdit: boolean;
    articleId: number | null;
    description: string | null;
    introduction: string | null;
    type: GQLLearningpathStepType;
    supportedLanguages: Array<string>;
    showTitle: boolean;
    revision: number;
    embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
    oembed: {
      __typename: "LearningpathStepOembed";
      type: string;
      version: string;
      height: number;
      html: string;
      width: number;
    } | null;
    opengraph: {
      __typename: "ExternalOpengraph";
      title: string | null;
      description: string | null;
      url: string | null;
    } | null;
    resource: {
      __typename: "Resource";
      id: string;
      url: string | null;
      breadcrumbs: Array<string>;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      article: {
        __typename: "Article";
        id: number;
        metaDescription: string;
        created: string;
        updated: string;
        articleType: string;
        title: string;
        traits: Array<string>;
        language: string;
      } | null;
    } | null;
    copyright: {
      __typename: "LearningpathCopyright";
      license: { __typename: "License"; license: string };
      contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    } | null;
  };
};

export type GQLUpdateLearningpathStepMutationVariables = Exact<{
  learningpathId: number;
  learningstepId: number;
  params: GQLLearningpathStepUpdateInput;
}>;

export type GQLUpdateLearningpathStepMutation = {
  updateLearningpathStep: {
    __typename: "MyNdlaLearningpathStep";
    id: number;
    title: string;
    seqNo: number;
    canEdit: boolean;
    articleId: number | null;
    description: string | null;
    introduction: string | null;
    type: GQLLearningpathStepType;
    supportedLanguages: Array<string>;
    showTitle: boolean;
    revision: number;
    embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
    oembed: {
      __typename: "LearningpathStepOembed";
      type: string;
      version: string;
      height: number;
      html: string;
      width: number;
    } | null;
    opengraph: {
      __typename: "ExternalOpengraph";
      title: string | null;
      description: string | null;
      url: string | null;
    } | null;
    resource: {
      __typename: "Resource";
      id: string;
      url: string | null;
      breadcrumbs: Array<string>;
      resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
      article: {
        __typename: "Article";
        id: number;
        metaDescription: string;
        created: string;
        updated: string;
        articleType: string;
        title: string;
        traits: Array<string>;
        language: string;
      } | null;
    } | null;
    copyright: {
      __typename: "LearningpathCopyright";
      license: { __typename: "License"; license: string };
      contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
    } | null;
  };
};

export type GQLDeleteLearningpathStepMutationVariables = Exact<{
  learningpathId: number;
  learningstepId: number;
}>;

export type GQLDeleteLearningpathStepMutation = { deleteLearningpathStep: boolean | null };

export type GQLUpdateLearningpathMutationVariables = Exact<{
  learningpathId: number;
  params: GQLLearningpathUpdateInput;
  includeSteps?: boolean | null | undefined;
}>;

export type GQLUpdateLearningpathMutation = {
  updateLearningpath: {
    __typename: "MyNdlaLearningpath";
    id: number;
    title: string;
    description: string;
    introduction: string | null;
    created: string;
    canEdit: boolean;
    status: string;
    madeAvailable: string | null;
    revision: number;
    supportedLanguages: Array<string>;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      metaUrl: string;
      image: { __typename: "ImageV3"; imageUrl: string };
    } | null;
    learningsteps?: Array<{
      __typename: "MyNdlaLearningpathStep";
      id: number;
      title: string;
      seqNo: number;
      canEdit: boolean;
      articleId: number | null;
      description: string | null;
      introduction: string | null;
      type: GQLLearningpathStepType;
      supportedLanguages: Array<string>;
      showTitle: boolean;
      revision: number;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        type: string;
        version: string;
        height: number;
        html: string;
        width: number;
      } | null;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        url: string | null;
        breadcrumbs: Array<string>;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          traits: Array<string>;
          language: string;
        } | null;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
  };
};

export type GQLCopyLearningpathMutationVariables = Exact<{
  learningpathId: number;
  params: GQLLearningpathCopyInput;
  includeSteps?: boolean | null | undefined;
}>;

export type GQLCopyLearningpathMutation = {
  copyLearningpath: {
    __typename: "MyNdlaLearningpath";
    id: number;
    title: string;
    description: string;
    introduction: string | null;
    created: string;
    canEdit: boolean;
    status: string;
    madeAvailable: string | null;
    revision: number;
    supportedLanguages: Array<string>;
    coverphoto: {
      __typename: "ImageMetaInformationV3";
      metaUrl: string;
      image: { __typename: "ImageV3"; imageUrl: string };
    } | null;
    learningsteps?: Array<{
      __typename: "MyNdlaLearningpathStep";
      id: number;
      title: string;
      seqNo: number;
      canEdit: boolean;
      articleId: number | null;
      description: string | null;
      introduction: string | null;
      type: GQLLearningpathStepType;
      supportedLanguages: Array<string>;
      showTitle: boolean;
      revision: number;
      embedUrl: { __typename: "LearningpathStepEmbedUrl"; url: string; embedType: string } | null;
      oembed: {
        __typename: "LearningpathStepOembed";
        type: string;
        version: string;
        height: number;
        html: string;
        width: number;
      } | null;
      opengraph: {
        __typename: "ExternalOpengraph";
        title: string | null;
        description: string | null;
        url: string | null;
      } | null;
      resource: {
        __typename: "Resource";
        id: string;
        url: string | null;
        breadcrumbs: Array<string>;
        resourceTypes: Array<{ __typename: "ResourceType"; id: string; name: string }>;
        article: {
          __typename: "Article";
          id: number;
          metaDescription: string;
          created: string;
          updated: string;
          articleType: string;
          title: string;
          traits: Array<string>;
          language: string;
        } | null;
      } | null;
      copyright: {
        __typename: "LearningpathCopyright";
        license: { __typename: "License"; license: string };
        contributors: Array<{ __typename: "Contributor"; type: string; name: string }>;
      } | null;
    }>;
  };
};

export type GQLUpdateLearningpathStepSeqNoMutationVariables = Exact<{
  learningpathId: number;
  learningpathStepId: number;
  seqNo: number;
}>;

export type GQLUpdateLearningpathStepSeqNoMutation = {
  updateLearningpathStepSeqNo: { __typename: "LearningpathSeqNo"; seqNo: number };
};

export type GQLDeletePersonalDataMutationVariables = Exact<{ [key: string]: never }>;

export type GQLDeletePersonalDataMutation = { deletePersonalData: boolean };

export type GQLMySubjectMyNdlaPersonalDataFragmentFragment = {
  __typename: "MyNdlaPersonalData";
  id: number;
  favoriteSubjects: Array<string>;
  role: string;
  arenaEnabled: boolean;
};

export type GQLUpdatePersonalDataMutationVariables = Exact<{
  favoriteSubjects?: Array<string> | string | null | undefined;
}>;

export type GQLUpdatePersonalDataMutation = {
  updatePersonalData: {
    __typename: "MyNdlaPersonalData";
    id: number;
    favoriteSubjects: Array<string>;
    role: string;
    arenaEnabled: boolean;
  };
};

export type GQLPodcastSeriesQueryVariables = Exact<{
  id: number;
}>;

export type GQLPodcastSeriesQuery = {
  podcastSeries: {
    __typename: "PodcastSeriesWithEpisodes";
    id: number;
    supportedLanguages: Array<string>;
    hasRSS: boolean;
    title: { __typename: "Title"; title: string; language: string };
    description: { __typename: "Description"; description: string };
    image: { __typename: "ImageMetaInformationV3"; image: { __typename: "ImageV3"; imageUrl: string } };
    coverPhoto: { __typename: "CoverPhoto"; url: string };
    content: { __typename: "ResourceEmbed"; content: string } | null;
    episodes: Array<{
      __typename: "Audio";
      id: number;
      created: string;
      title: { __typename: "Title"; title: string };
      audioFile: { __typename: "AudioFile"; url: string; fileSize: number; mimeType: string };
      podcastMeta: {
        __typename: "PodcastMeta";
        introduction: string;
        image: { __typename: "ImageMetaInformationV3"; image: { __typename: "ImageV3"; imageUrl: string } } | null;
      } | null;
      copyright: {
        __typename: "Copyright";
        origin: string | null;
        license: { __typename: "License"; license: string; url: string | null; description: string | null };
        creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
        processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
        rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
      };
      tags: { __typename: "Tags"; tags: Array<string> };
    }> | null;
  } | null;
};

export type GQLEmbedOembedQueryVariables = Exact<{
  id: string;
  type: string;
}>;

export type GQLEmbedOembedQuery = {
  resourceEmbed: {
    __typename: "ResourceEmbed";
    meta: {
      __typename: "ResourceMetaData";
      images: Array<{ __typename: "ImageLicense"; title: string }>;
      concepts: Array<{ __typename: "ConceptLicense"; title: string }>;
      audios: Array<{ __typename: "AudioLicense"; title: string }>;
      podcasts: Array<{ __typename: "PodcastLicense"; title: string }>;
      brightcoves: Array<{ __typename: "BrightcoveLicense"; title: string }>;
    };
  };
};

export type GQLLmkDataQueryVariables = Exact<{ [key: string]: never }>;

export type GQLLmkDataQuery = {
  nodes: Array<{
    __typename: "Node";
    id: string;
    name: string;
    url: string | null;
    supportedLanguages: Array<string>;
    metadata: { __typename: "TaxonomyMetadata"; grepCodes: Array<string> };
    subjectpage: {
      __typename: "SubjectPage";
      id: number;
      metaDescription: string | null;
      about: {
        __typename: "SubjectPageAbout";
        description: string;
        visualElement: { __typename: "SubjectPageVisualElement"; imageUrl: string | null };
      } | null;
    } | null;
  }> | null;
};

export type GQLStructuredArticleData_CopyrightFragment = {
  __typename: "Copyright";
  processed: boolean | null;
  license: { __typename: "License"; url: string | null; license: string };
  creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
  processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
  rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
};

export type GQLStructuredArticleData_ImageLicenseFragment = {
  __typename: "ImageLicense";
  src: string;
  title: string;
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLStructuredArticleData_AudioLicenseFragment = {
  __typename: "AudioLicense";
  src: string;
  title: string;
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLStructuredArticleData_PodcastLicenseFragment = {
  __typename: "PodcastLicense";
  src: string;
  title: string;
  description: string | null;
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
};

export type GQLStructuredArticleData_BrightcoveLicenseFragment = {
  __typename: "BrightcoveLicense";
  src: string | null;
  title: string;
  cover: string | null;
  description: string | null;
  download: string | null;
  uploadDate: string | null;
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  } | null;
};

export type GQLStructuredArticleDataFragment = {
  __typename: "Article";
  id: number;
  title: string;
  metaDescription: string;
  published: string;
  updated: string;
  revised: string;
  supportedLanguages: Array<string>;
  copyright: {
    __typename: "Copyright";
    processed: boolean | null;
    license: { __typename: "License"; url: string | null; license: string };
    creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
    processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
    rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
  };
  metaImage: {
    __typename: "ImageMetaInformationV3";
    image: { __typename: "ImageV3"; imageUrl: string };
    alttext: { __typename: "ImageAltText"; alttext: string };
  } | null;
  competenceGoals: Array<{
    __typename: "CompetenceGoal";
    id: string;
    code: string | null;
    title: string;
    type: string;
  }>;
  coreElements: Array<{ __typename: "CoreElement"; id: string; title: string }>;
  transformedContent: {
    __typename: "TransformedArticleContent";
    metaData: {
      __typename: "ArticleMetaData";
      images: Array<{
        __typename: "ImageLicense";
        src: string;
        title: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      audios: Array<{
        __typename: "AudioLicense";
        src: string;
        title: string;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      podcasts: Array<{
        __typename: "PodcastLicense";
        src: string;
        title: string;
        description: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        };
      }>;
      brightcoves: Array<{
        __typename: "BrightcoveLicense";
        src: string | null;
        title: string;
        cover: string | null;
        description: string | null;
        download: string | null;
        uploadDate: string | null;
        copyright: {
          __typename: "Copyright";
          processed: boolean | null;
          license: { __typename: "License"; url: string | null; license: string };
          creators: Array<{ __typename: "Contributor"; name: string; type: string }>;
          processors: Array<{ __typename: "Contributor"; name: string; type: string }>;
          rightsholders: Array<{ __typename: "Contributor"; name: string; type: string }>;
        } | null;
      }>;
    } | null;
  };
};

export type GQLBaseArticleFragment = {
  __typename: "Article";
  id: number;
  created: string;
  htmlTitle: string;
  htmlIntroduction: string | null;
  updated: string;
  published: string;
  revised: string;
  revisionDate: string | null;
  transformedContent: {
    __typename: "TransformedArticleContent";
    content: string;
    metaData: {
      __typename: "ArticleMetaData";
      footnotes: Array<{
        __typename: "FootNote";
        ref: number;
        title: string;
        year: string;
        authors: Array<string>;
        edition: string | null;
        publisher: string | null;
        url: string | null;
      }>;
    } | null;
  };
};

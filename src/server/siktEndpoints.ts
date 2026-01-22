/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloClient, gql } from "@apollo/client";
import { createApolloClient } from "../util/apiHelpers";
import { GQLLmkDataQuery, GQLLmkDataQueryVariables } from "../graphqlTypes";
import config from "../config";

let apolloClient: ApolloClient;
let storedLocale: string;

const getApolloClient = (locale: string) => {
  if (apolloClient && locale === storedLocale) {
    return apolloClient;
  } else {
    apolloClient = createApolloClient(locale, undefined);
    storedLocale = locale;
    return apolloClient;
  }
};

const lmkGql = gql`
  query lmkData {
    nodes(nodeType: "SUBJECT", filterVisible: true) {
      id
      name
      url
      supportedLanguages
      metadata {
        grepCodes
      }
      subjectpage {
        id
        metaDescription
        about {
          description
          visualElement {
            imageUrl
          }
        }
      }
    }
  }
`;

const NDLA_ORG = {
  "@type": "Organization",
  name: "NDLA",
  legalName: "NDLA",
  url: "https://ndla.no",
  logo: "https://ndla.no/static/logo.png",
  iso6523Code: "0192:821311632",
};

// ISO 639-3 language codes
const langMap = {
  nb: "nob",
  nn: "nno",
  se: "sme",
  sma: "sma",
  en: "eng",
};

export const fetchLmk = async () => {
  const client = getApolloClient("nb");

  const lmkQuery = await client.query<GQLLmkDataQuery, GQLLmkDataQueryVariables>({
    query: lmkGql,
  });

  const grapNodes =
    lmkQuery.data?.nodes?.map((subject) => ({
      "@id": `http://ndla.no/f/${subject.id}`,
      identifier: `http://ndla.no/f/${subject.id}`,
      "@type": "Course",
      "rdf:type": "Course",
      additionalType: "lmko:Laeremiddel",
      name: subject.name,
      description: subject.subjectpage?.about?.description ?? subject.subjectpage?.metaDescription,
      //isPartOf is omitted for now, because we don't really know if we need it, nor do we have the capability to link to programmes.
      url: `${config.ndlaFrontendDomain}${subject.url}`,
      thumbnailUrl: subject.subjectpage?.about?.visualElement?.imageUrl,
      inLanguage: subject.supportedLanguages.reduce<string[]>((acc, lang) => {
        const mappedLang = langMap[lang as keyof typeof langMap];
        if (mappedLang) {
          acc.push(mappedLang);
        }
        return acc;
      }, []),
      publisher: NDLA_ORG,
      provider: NDLA_ORG,
      educationalAlignment: subject.metadata?.grepCodes?.map((code) => ({
        "@type": "http://schema.org/AlignmentObject",
        "rdf:type": "http://schema.org/AlignmentObject",
        educationalFramework: "http://psi.udir.no/kl06",
        targetName: code,
        targetUrl: `http://psi.udir.no/kl06/${code}`,
        // Could possibly add targetDescription by doing an additional query towards gql
      })),
    })) ?? [];

  return {
    "@context": "https://admin.laeremiddelkatalogen.sikt.no/jsonld-context.jsonld",
    "@graph": grapNodes,
  };
};

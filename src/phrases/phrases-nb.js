/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const phrases = {
  meta: {
    description: 'Kvalitetssikrede fritt tilgjengelige nettbaserte læremidler for videregående opplæring',
  },
  message: 'message',
  messages: 'messages',
  WelcomePage: {
    helloworld: 'Hallo verden',
    search: 'Søk',
  },
  logo: {
    altText: 'Nasjonal digital læringsarena',
  },
  siteNav: {
    chooseSubject: 'Velg fag',
    search: 'Søk',
    contact: 'Kontakt',
    help: 'Hjelp',
  },
  searchForm: {
    placeholder: 'Søk etter artikler',
    btn: 'Søk',
    order: {
      relevance: 'Relevans',
      title: 'Alfabetisk',
    },
  },
  article: {
    author: 'Forfatter',
    published: 'Publisert',
    created: 'Opprettet',
    lastUpdated: 'Sist oppdatert',
    closeLicenseBox: 'Lukk boks',
    openLicenseBox: 'Gjenbruk {contentType}',
  },
  license: {
    heading: 'Du kan laste ned, eller innbygge innhold fra NDLA på ditt eget nettsted',
    creators: '{num, plural, one { Opphavsperson: } other { Opphavspersoner: }}',
    tabs: {
      heading: 'Regler for gjenbruk av {contentType} på NDLA',
      introduction: `Alt innhold på NDLA har egne opphavsrettigheter. Disse må du ta hensyn
      til dersom du skal gjenbruke noe av dette innholdet utenfor ndla.no. Opphavsretten
      bestemmer hvordan du kan bruke innholdet, enten det skal publiseres, deles på internett,
      eller hvis noen skal tjene penger på det. Under kan du kan du se hvordan du kan bruke innholdet
      i {contentType}.`,
      article: 'Artikkel',
      text: 'Tekst',
      cite: 'Sitere',
      citation: {
        explaination: `Når du siterer tekster fra NDLA må du vise hvor du har funnet dem
          og hvem som har laget dem. Hvis du skriver en egen tekst plasserer
          du referansen på den siste siden. Slik siterer du denne teksten:`,
      },
      images: 'Bilder',
      audios: 'Lydfiler',
    },
    articleText: 'Artikkeltekst: Last ned som (word), (txt), (pdf)',
  },
  searchPage: {
    noHits: 'Ingen atikler samsvarte med søket ditt på: %{query}',
  },
  footer: {
    aboutNDLA: 'Om NDLA',
    selectLanguage: 'Velg språk (language): ',
    footerInfo: 'Nettstedet er utarbeidet av NDLA som åpen kildekode.',
    footerEditiorInChief: 'Ansvarlig redaktør: ',
    footerManagingEditor: 'Utgaveansvarlig: ',
  },
};

export default phrases;

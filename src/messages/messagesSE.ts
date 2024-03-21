/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const titleTemplate = "NDLA";

const messages = {
  htmlTitles: {
    titleTemplate,
    welcomePage: `Ovdasiidu - ${titleTemplate}`,
    topicPage: "Fáddá",
    subjectsPage: `Vállje fága - ${titleTemplate}`,
    searchPage: `Oza - ${titleTemplate}`,
    notFound: `Siidu ii gávdno - ${titleTemplate}`,
    accessDenied: `Ingen tilgang - ${titleTemplate}`,
    subject: "Fága",
    podcast: `Podkast - Side {{pageNumber}} - ${titleTemplate}`,
    lti: `LTI - ${titleTemplate}`,
    movedResourcePage: `Siidu lea sirdojuvvon - ${titleTemplate}`,
    myNdlaPage: `Mu NDLA - ${titleTemplate}`,
    myFoldersPage: `Mu máhpat - ${titleTemplate}`,
    myFolderPage: `{{folderName}} - ${titleTemplate}`,
    myTagPage: `#{{tag}} - ${titleTemplate}`,
    myTagsPage: `Mu lihput - ${titleTemplate}`,
    aboutPage: `{{name}} - ${titleTemplate}`,
    arenaPage: `Arena - ${titleTemplate}`,
    arenaAdminPage: `Administrer Arena - ${titleTemplate}`,
    arenaTopicPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaPostPage: `{{name}} - Arena - ${titleTemplate}`,
    arenaNewTopicPage: `Ođđa reivvet - Arena - ${titleTemplate}`,
    arenaNewCategoryPage: `Ny kategori - Arena - ${titleTemplate}`,
  },
  podcastPage: {
    episodes: "Jearahusat",
    podcast: "Podkast",
    podcasts: "Podkasttat",
    pageInfo: "Siidu {{page}} eret {{lastPage}}",
    noResults: "...Eai leat oasit",
    subtitle: "Guldal ja oahpa!",
  },
  myndla: {
    campaignBlock: {
      title: "Geahččal min ságastallanbottu",
      linkText: "Geahččal NDLA ságastallanrobohta",
      ingressStudent:
        "Lea go dus juoga maid háliidat oahppat iežat fágas? Háliidatgo veahki teavstta álkidahttit, hárjehallat geahččalit dahje evttohit mo teavstta hábmet? Geahččal min ságastallanrobahttii ja oainnát sáhttágo dat veahkehit du!",
      ingress:
        "Áiggut go AI geavahit oahpahusas? NDLA lea ráhkadan guokte hupmanrobota mat suodjalit du priváhtavuođa ja maid sáhttá geavahit sihkkarit sihke barggus ja oahpahusas.",
      ingressUnauthenticated:
        "Vil du bruke KI i undervisninga? NDLA har laget to prateroboter som tar vare på personvernet ditt og trygt kan brukes til jobb og i undervisning. I perioder med eksamensgjennomføring kan det hende fylkeskommunen stenger tilgangen til praterobotene. Logg inn for å få tilgang til praterobotene.",
    },
  },
  myNdla: {
    sharedFolder: {
      learningpathUnsupportedTitle: "Læringsstier støttes ikke",
    },
    arena: {
      notification: {
        description:
          "Velkommen inn i arenaen for lærere i videregående opplæring! Dette er <em>din</em> arena: et faglig møtested for diskusjon, inspirasjon, deling og utviklende samarbeid.",
      },
    },
  },
  validation: {
    fields: {
      name: "Namma",
      description: "Válddahus",
      title: "Namahus",
      content: "Sisdoallu",
    },
    required: "Dát fealta gáibiduvvo",
    requiredField: "$t(validation.fields.{{field}}) ii sáhte leat guoros",
    notUnique: "Gávdno juo",
    maxLength: "Dát fealta sáhttá sisttisdoallat eanemus {{count}} mearkkat",
    maxLengthField: "$t(validation.fields.{{field}}) sáhttá sisttisdoallat {{count}} mearkkat",
  },
  resourcepageTitles: {
    video: "Video",
    image: "Govva",
    concept: "Čilgehus",
    audio: "Jietna",
  },
  markdownEditor: {
    link: {
      url: "Lenkeadresse",
      text: "Lenketekst",
      error: {
        url: {
          empty: "Lenkeadressa kan ikke være tom",
          invalid: "Ugyldig lenkeadresse. Følg formatet https://ndla.no",
        },
        text: {
          empty: "Lenketeksta kan ikke være tom",
        },
      },
    },
    toolbar: {
      bold: {
        active: "Váldde eret buoiddes fontta",
        inactive: "Lasit buoiddes fontta",
      },
      italic: {
        active: "Váldde eret vinjučála fontta",
        inactive: "Lasit vinjučála fontta",
      },
      unorderedList: {
        active: "Váldde eret čuoggátávvala",
        inactive: "Lasit čuoggátávvala",
      },
      orderedList: {
        active: "Váldde eret nummáraston listtu",
        inactive: "Lasit nummárastojuvvon listtu",
      },
      link: {
        active: "Váldde eret liŋkka",
        inactive: "Lasit liŋkka",
      },
    },
  },
};

export default messages;

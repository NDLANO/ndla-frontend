/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';

const freeUseNB = 'Fri bruk';
const freeUseEN = 'Free use';
const restrictedUseNB = 'Begrenset bruk';
const restrictedUseEN = 'Restricted use';

// License rights
export const BY = 'by'; // Attribution
export const SA = 'sa'; // Share-alike
export const NC = 'nc'; // Non-commercial
export const ND = 'nd'; // No derivative work

export const byncnd = {
  nb: {
    short: restrictedUseNB,
    title: 'Navngivelse-IkkeKommersiell-IngenBearbeidelser',
    description: `Denne lisensen er den mest restriktive av våre seks kjernelisenser.
        Den tillater andre å laste ned ditt verk og dele dem med andre så lenge du er navngitt som opphavspersonen, men de kan ikke endre dem på noen måte, eller bruke dem kommersielt.`,
  },

  en: {
    short: restrictedUseEN,
    title: 'Navngivelse-IkkeKommersiell-IngenBearbeidelser',
    description: `Denne lisensen er den mest restriktive av våre seks kjernelisenser.
        Den tillater andre å laste ned ditt verk og dele dem med andre så lenge du er navngitt som opphavspersonen, men de kan ikke endre dem på noen måte, eller bruke dem kommersielt.`,
  },
  rights: [BY, NC, ND],
};

export const byncsa = {
  nb: {
    short: restrictedUseNB,
    title: 'Navngivelse-IkkeKommersiell-DelPåSammeVilkår',
    description: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
        Deres verk må navngi deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.`,
  },

  en: {
    short: restrictedUseEN,
    title: 'Navngivelse-IkkeKommersiell-DelPåSammeVilkår',
    description: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
        Deres verk må navngi deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.`,
  },
  rights: [BY, NC, SA],
};


export const bync = {
  nb: {
    short: freeUseNB,
    title: 'Navngivelse-IkkeKommersiell',
    description: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
          Deres verk må navngi deg som opphavsperson og også være ikke-kommersielle, men de behøver ikke kreve at verk avledet fra deres bærer de samme vilkårene.`,
  },

  en: {
    short: freeUseEN,
    title: 'Navngivelse-IkkeKommersiell',
    description: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
          Deres verk må navngi deg som opphavsperson og også være ikke-kommersielle, men de behøver ikke kreve at verk avledet fra deres bærer de samme vilkårene.`,
  },
  rights: [BY, NC],
};

export const bynd = {
  nb: {
    short: freeUseNB,
    title: 'Navngivelse-IngenBearbeidelse',
    description: `Denne lisensen gir mulighet for å videredistribuere verket,
          både for kommersielle og for ikke-kommersielle formål, så lenge det gis videre uendret og sin helhet, og at du navngis som den som har skapt verket.`,
  },

  en: {
    short: freeUseEN,
    title: 'Navngivelse-IngenBearbeidelse',
    description: `Denne lisensen gir mulighet for å videredistribuere verket,
          både for kommersielle og for ikke-kommersielle formål, så lenge det gis videre uendret og sin helhet, og at du navngis som den som har skapt verket.`,
  },
  rights: [BY, ND],
};

export const bysa = {
  nb: {
    short: freeUseNB,
    title: 'Navngivelse-DelPåSammeVilkår',
    description: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk, også for kommersielle formål,
          så lenge de navngir deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.
          Denne lisensen blir ofte sidestilt med "copyleft" og åpen kildekode-lisenser. Alle nye verk basert på ditt vil være utstyrt ned den samme lisensen,
          slik at eventuelle avledete verk vil også tillate kommersiell bruk.
          Dette er den lisensen som brukes av Wikipedia, og som anbefales for materiale som ville ha
          nytte av å kunne inkludere innhold fra Wikipedia og fra andre prosjekter med tilsvarende lisenser.`,
  },

  en: {
    short: freeUseEN,
    title: 'Navngivelse-DelPåSammeVilkår',
    description: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk, også for kommersielle formål,
          så lenge de navngir deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.
          Denne lisensen blir ofte sidestilt med "copyleft" og åpen kildekode-lisenser. Alle nye verk basert på ditt vil være utstyrt ned den samme lisensen,
          slik at eventuelle avledete verk vil også tillate kommersiell bruk.
          Dette er den lisensen som brukes av Wikipedia, og som anbefales for materiale som ville ha
          nytte av å kunne inkludere innhold fra Wikipedia og fra andre prosjekter med tilsvarende lisenser.`,
  },
  rights: [BY, SA],
};


function licenseByLanguage(license, language) {
  const texts = defined(license[language], license.nb);
  return {
    ...texts,
    rights: license.rights,
  };
}

export default function getLicenseByKey(licenseKey, language) {
  switch (licenseKey) {
    case 'by-nc-nd' : return licenseByLanguage(byncnd, language);
    case 'by-nc-sa' : return licenseByLanguage(byncsa, language);
    case 'by-nc' : return licenseByLanguage(bync, language);
    case 'by-nd' : return licenseByLanguage(bynd, language);
    case 'by-sa' : return licenseByLanguage(bysa, language);
    default : return {
      short: licenseKey,
      title: licenseKey,
      rights: [],
      description: licenseKey };
  }
}

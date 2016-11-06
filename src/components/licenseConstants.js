/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Icon from './icons/Icons';

export function byncnd(t, language) {
  switch (language) {
    default:
      return {
        short: t('license.restrictedUse'),
        heading: 'Navngivelse-IkkeKommersiell-IngenBearbeidelser',
        img: [<Icon.LicenseBy />, <Icon.LicenseNc />, <Icon.LicenseNd />],
        body: `Denne lisensen er den mest restriktive av våre seks kjernelisenser. 
        Den tillater andre å laste ned ditt verk og dele dem med andre så lenge du er navngitt som opphavspersonen, men de kan ikke endre dem på noen måte, eller bruke dem kommersielt.`,
      };

  }
}

export function byncsa(t, language) {
  switch (language) {
    default:
      return {
        short: t('license.restrictedUse'),
        heading: 'Navngivelse-IkkeKommersiell-DelPåSammeVilkår',
        img: [<Icon.LicenseBy />, <Icon.LicenseNc />, <Icon.LicenseSa />],
        body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
        Deres verk må navngi deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.`,
      };
  }
}

export function bync(t, language) {
  switch (language) {
    default:
      return {
        short: t('license.usePhrase.freeUse'),
        heading: 'Navngivelse-IkkeKommersiell',
        img: [<Icon.LicenseBy />, <Icon.LicenseNc />],
        body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk for ikke-kommersielle formål.
          Deres verk må navngi deg som opphavsperson og også være ikke-kommersielle, men de behøver ikke kreve at verk avledet fra deres bærer de samme vilkårene.`,
      };
  }
}

export function bynd(t, language) {
  switch (language) {
    default:
      return {
        short: t('license.usePhrase.freeUse'),
        heading: 'Navngivelse-IngenBearbeidelse',
        img: [<Icon.LicenseBy />, <Icon.LicenseNd />],
        body: `Denne lisensen gir mulighet for å videredistribuere verket,
          både for kommersielle og for ikke-kommersielle formål, så lenge det gis videre uendret og sin helhet, og at du navngis som den som har skapt verket.`,
      };
  }
}

export function bysa(t, language) {
  switch (language) {
    default:
      return {
        short: t('license.usePhrase.freeUse'),
        heading: 'Navngivelse-DelPåSammeVilkår',
        img: [<Icon.LicenseBy />, <Icon.LicenseSa />],
        body: `Denne lisensen lar andre distribuere, endre, remixe, og bygge videre på ditt verk, også for kommersielle formål,
          så lenge de navngir deg som den opprinnelige opphavspersonen og avledete verk må bære en tilsvarende lisens.
          Denne lisensen blir ofte sidestilt med "copyleft" og åpen kildekode-lisenser. Alle nye verk basert på ditt vil være utstyrt ned den samme lisensen,
          slik at eventuelle avledete verk vil også tillate kommersiell bruk.
          Dette er den lisensen som brukes av Wikipedia, og som anbefales for materiale som ville ha
          nytte av å kunne inkludere innhold fra Wikipedia og fra andre prosjekter med tilsvarende lisenser.`,
      };
  }
}


export default function getLicenseByKey(t, licenseKey) {
  switch (licenseKey) {
    case 'by-nc-nd' : return byncnd(t, 'no');
    case 'by-nc-sa' : return byncsa(t, 'no');
    case 'by-nc' : return bync(t, 'no');
    case 'by-nd' : return bynd(t, 'no');
    case 'by-sa' : return bysa(t, 'no');
    default : return {
      heading: licenseKey,
      img: [''],
      body: licenseKey };
  }
}

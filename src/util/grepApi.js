/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { grepUrl, resolveJsonOrRejectWithError } from './apiHelpers';
import handleError from './handleError';

const getTitlesObject = titles => {
  return titles?.tekst || titles || [];
};

const languages = {
  nb: 'nob',
  nn: 'nno',
  en: 'eng',
};

const getTitle = (titles, locale) => {
  const title =
    titles.find(t => t.spraak === languages[locale]) ||
    titles.find(t => t.spraak === 'default');
  return title?.verdi;
};

const fetchKjerneelementer = async code =>
  fetch(grepUrl(`/kjerneelementer-lk20/${code}`));

const fetchKompetansemaal = async code =>
  fetch(grepUrl(`/kompetansemaal-lk20/${code}`));

const fetchTverrfagligeTemaer = async code =>
  fetch(grepUrl(`/tverrfaglige-temaer-lk20/${code}`));

const fetchKompetansemaalsett = async code =>
  fetch(grepUrl(`/kompetansemaalsett-lk20/${code}`));

const fetchLaereplaner = async code =>
  fetch(grepUrl(`/laereplaner-lk20/${code}`));

const doGrepCodeRequest = async code => {
  if (code.startsWith('KE')) {
    return fetchKjerneelementer(code);
  } else if (code.startsWith('KM')) {
    return fetchKompetansemaal(code);
  } else if (code.startsWith('TT')) {
    return fetchTverrfagligeTemaer(code);
  } else if (code.startsWith('KV')) {
    return fetchKompetansemaalsett(code);
  } else {
    return fetchLaereplaner(code);
  }
};

export const fetchGrepCodeTitle = async (grepCode, locale) => {
  const res = await doGrepCodeRequest(grepCode);
  try {
    if (res?.status === 404) {
      return null;
    }
    const jsonResponse = await resolveJsonOrRejectWithError(res);
    const titlesObj = getTitlesObject(jsonResponse?.tittel);
    const titleInLanguage = getTitle(titlesObj, locale);
    return titleInLanguage;
  } catch (error) {
    handleError(error);
  }
};

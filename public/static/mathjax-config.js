/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const params = new URLSearchParams(new URL(document.currentScript.src).search);

window.MathJax = {
  chtml: {
    mathmlSpacing: false,
  },
  options:{
      enableMenu: true,
      menuOptions:{
          settings:{
              assistiveMml: false,
              collapsible: false,
              explorer: true
          }
      },
      sre: {
        domain: 'mathspeak',
        style: 'sbrief',
        speech: 'shallow',
        locale: params.get('locale') || 'nb',
        structure: false,
      }
  }
};

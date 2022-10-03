/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 const locale = new URLSearchParams(document.currentScript.src).get('locale') || 'nb';

window.MathJax = {
  chtml: {
    mathmlSpacing: false,
  },
  options:{
      enableMenu: true,
      menuOptions:{
          settings:{
              assistiveMml: true,
              collapsible: false,
              explorer: true
          }
      },
      sre: {
        domain: 'mathspeak',
        style: 'sbrief',
        speech: 'shallow',
        locale: locale,
        structure: false,
      }
  }
};

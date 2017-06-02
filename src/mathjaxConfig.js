/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import 'mathjax/unpacked/MathJax';
import 'mathjax/unpacked/jax/input/MathML/config';
import 'mathjax/unpacked/jax/input/MathML/jax';

import 'mathjax/unpacked/jax/output/CommonHTML/config';
import 'mathjax/unpacked/jax/output/CommonHTML/jax';
import 'mathjax/unpacked/jax/output/CommonHTML/autoload/mtable';
import 'mathjax/unpacked/jax/output/CommonHTML/autoload/menclose';

import 'mathjax/unpacked/jax/element/mml/jax';

import 'mathjax/unpacked/extensions/mml2jax';
import 'mathjax/unpacked/extensions/MathEvents';
import 'mathjax/unpacked/extensions/AssistiveMML';
// import 'mathjax/unpacked/extensions/toMathML';

import 'mathjax/unpacked/jax/output/CommonHTML/fonts/TeX/fontdata';
import 'mathjax/unpacked/jax/output/CommonHTML/fonts/TeX/AMS-Regular';

// import 'mathjax/unpacked/jax/output/PreviewHTML/jax';
// import 'mathjax/unpacked/extensions/fast-preview';

window.MathJax.Ajax.config.root = 'https://cdn.mathjax.org/mathjax/latest';
window.MathJax.Hub.Config({
  showMathMenu: false,
  // extensions: ['AssistiveMML.js'],
  // jax: ['input/MathML', 'output/CommonHTML'],
});

window.MathJax.Ajax.Preloading(
  '[MathJax]/jax/input/MathML/config.js',
  '[MathJax]/jax/input/MathML/jax.js',
  '[MathJax]/jax/output/CommonHTML/config.js',
  '[MathJax]/jax/output/CommonHTML/jax.js',
  '[MathJax]/jax/output/CommonHTML/autoload/mtable.js',
  '[MathJax]/jax/output/CommonHTML/autoload/menclose.js',
  '[MathJax]/jax/element/mml/jax.js',
  '[MathJax]/extensions/mml2jax.js',
  '[MathJax]/extensions/MathEvents.js',
  '[MathJax]/extensions/AssistiveMML.js',
  // '[MathJax]/extensions/toMathML.js',

  // '[MathJax]/jax/output/PreviewHTML/config.js',
  // '[MathJax]/jax/output/PreviewHTML/jax.js',
  // '[MathJax]/extensions/fast-preview.js',
);

window.MathJax.Ajax.loadComplete(
  `/assets/${window.assets['mathjaxConfig.js']}`,
);

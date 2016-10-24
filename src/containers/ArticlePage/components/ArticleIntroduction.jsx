/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';

const ArticleIntroductionImage = ({ image }) => (image ? (
  <figure>
    <img src={image.src} alt={image.alt} />
    { image.caption ? <p className="figure_caption">{image.caption}</p> : null}
  </figure>
) : null);

ArticleIntroductionImage.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    caption: PropTypes.caption,
  }),
};

const ArticleIntroductionText = ({ text }) => (text ? <p className="article_introduction">{text}</p> : null);

ArticleIntroductionText.propTypes = {
  text: PropTypes.string,
};


const ArticleIntroduction = ({ introduction }) => {
  if (!introduction.text && !introduction.image) {
    return null;
  }

  return (
    <section className="article_introduction">
      <ArticleIntroductionText text={introduction.text} />
      <ArticleIntroductionImage image={introduction.image} />
    </section>
  );
};

ArticleIntroduction.propTypes = {
  introduction: PropTypes.shape({
    text: PropTypes.string,
    image: PropTypes.object,
  }),
};

export default ArticleIntroduction;

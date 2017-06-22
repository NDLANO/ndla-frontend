/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';


const FootNote = ({ footNote, editionTitle, publisherTitle, refNr }) =>
  <li className="c-footnote__item">
    <cite className="c-footnote__cite">{`${footNote.title} (${footNote.year}), ${footNote.authors.join(' ')} ${editionTitle}: ${footNote.edition}, ${publisherTitle}: ${footNote.publisher}`}</cite>
    &nbsp;<a href={`#$ref_${refNr}_sup`} name={`#$ref_${refNr}_foot`}>&#8617;</a>
  </li>;

export const FootNoteShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  authors: PropTypes.array.isRequired,
  edition: PropTypes.string.isRequired,
  publisher: PropTypes.string.isRequired,
});

FootNote.propTypes = {
  refNr: PropTypes.string.isRequired,
  footNote: FootNoteShape.isRequired,
  editionTitle: PropTypes.string.isRequired,
  publisherTitle: PropTypes.string.isRequired,
};


const ArticleFootNotes = ({ footNotes, ...rest }) => (
  <ol className="c-footnotes">
    {
    Object.keys(footNotes).map(key => (
      <FootNote key={key} refNr={key.replace('ref_', '')} footNote={footNotes[key]} {...rest} />
    ))
    }
  </ol>
);

ArticleFootNotes.propTypes = {
  footNotes: PropTypes.object,
  editionTitle: PropTypes.string.isRequired,
  publisherTitle: PropTypes.string.isRequired,
};

ArticleFootNotes.defaultProps = {
  editionTitle: 'Edition',
  publisherTitle: 'Publisher',
};

export default ArticleFootNotes;

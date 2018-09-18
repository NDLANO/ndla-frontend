/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SubjectAbout, Image } from 'ndla-ui';
import { GraphQLSubjectPageAboutShape } from '../../../graphqlShapes';
import SubjectPageFlexChild from './SubjectPageFlexChild';

const AboutMedia = ({ visualElement: { type, url, alt } }) => {
  switch (type) {
    case 'image':
      return <Image alt={alt} src={url} />;
    case 'video':
      return (
        <iframe
          title="About subject video"
          src={url}
          allowFullScreen
          scrolling="no"
          frameBorder="0"
        />
      );
    default:
      return null;
  }
};

AboutMedia.propTypes = {
  visualElement: PropTypes.shape({
    type: PropTypes.string,
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
};

export const SubjectPageAbout = ({ about, displayInTwoColumns }) => {
  if (!about) {
    return null;
  }
  return (
    <SubjectPageFlexChild displayInTwoColumns={displayInTwoColumns}>
      <SubjectAbout
        media={<AboutMedia visualElement={about.visualElement} />}
        heading={about.title}
        description={about.description}
      />
    </SubjectPageFlexChild>
  );
};
SubjectPageAbout.propTypes = {
  about: GraphQLSubjectPageAboutShape,
  displayInTwoColumns: PropTypes.bool,
};

SubjectPageAbout.defaultProps = {
  displayInTwoColumns: false,
};

export default SubjectPageAbout;

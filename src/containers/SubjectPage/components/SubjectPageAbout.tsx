/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { SubjectAbout, Image } from '@ndla/ui';
import SubjectPageFlexChild from './SubjectPageFlexChild';
import { GQLSubjectPageAbout_SubjectPageAboutFragment } from '../../../graphqlTypes';

interface VisualElementType {
  visualElement: {
    type?: string;
    url?: string;
    alt?: string;
  };
}

const AboutMedia = ({
  visualElement: { type, url, alt },
}: VisualElementType) => {
  switch (type) {
    case 'image':
      return <Image alt={alt ?? ''} src={url ?? ''} />;
    case 'video':
    case 'brightcove':
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

interface Props {
  about: GQLSubjectPageAbout_SubjectPageAboutFragment;
  twoColumns: boolean;
  wide: boolean;
}

export const SubjectPageAbout = ({
  about,
  twoColumns = false,
  wide = false,
}: Props) => {
  if (!about) {
    return null;
  }
  return (
    <SubjectPageFlexChild twoColumns={twoColumns}>
      <SubjectAbout
        media={<AboutMedia visualElement={about.visualElement!} />}
        heading={about.title || ''}
        description={about.description || ''}
        wide={wide}
      />
    </SubjectPageFlexChild>
  );
};

SubjectPageAbout.fragments = {
  about: gql`
    fragment SubjectPageAbout_SubjectPageAbout on SubjectPageAbout {
      title
      description
      visualElement {
        type
        url
        alt
      }
    }
  `,
};

export default SubjectPageAbout;

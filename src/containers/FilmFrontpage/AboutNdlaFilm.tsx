/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 as Button } from '@ndla/button';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from '@ndla/modal';
import { Image } from '@ndla/ui';
import Article from '../../components/Article';
import {
  TransformedBaseArticle,
  transformArticle,
} from '../../util/transformArticle';
import { GQLArticle_ArticleFragment } from '../../graphqlTypes';

const StyledAside = styled.aside`
  background: #184673;
  color: #fff;
  display: flex;
  padding: ${spacing.normal} ${spacing.normal} ${spacing.medium};
  > div {
    padding: ${spacing.normal};
    width: 50%;
    h2 {
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #fff;
      margin: 0 0 ${spacing.small} 0;
    }
  }
  button {
    color: #fff;
    &:hover,
    &:focus {
      color: ${colors.brand.light};
    }
  }
  ${mq.range({ until: breakpoints.tablet })} {
    flex-direction: column;
    > div {
      width: auto;
      &:first-of-type {
        padding-bottom: 0;
      }
    }
  }
`;

const StylediFrame = styled.iframe`
  height: 100%;
  width: 100%;
  border: 0;
  margin: 0;
  padding: 0;
`;

interface VisualElementProps {
  visualElement: {
    alt?: string;
    url: string;
    type: string;
  };
}

const VisualElement = ({ visualElement }: VisualElementProps) => {
  const { type, url, alt } = visualElement;
  if (type === 'image') {
    return <Image src={url} alt={alt ?? ''} />;
  } else if (type === 'brightcove') {
    return <StylediFrame allowFullScreen={true} src={url} />;
  } else {
    return null;
  }
};

interface AboutNdlaFilmProps {
  aboutNDLAVideo: {
    title: string;
    description: string;
    visualElement: {
      alt?: string;
      url: string;
      type: string;
    };
  };
  article?: any;
}

const AboutNdlaFilm = ({ aboutNDLAVideo, article }: AboutNdlaFilmProps) => {
  const { t, i18n } = useTranslation();
  const titleId = 'about-ndla-film-title';

  const transformedArticle = transformArticle(
    article,
    i18n.language,
  ) as TransformedBaseArticle<GQLArticle_ArticleFragment>;

  return (
    <div className="o-wrapper">
      <StyledAside aria-labelledby={titleId}>
        <div>
          <VisualElement visualElement={aboutNDLAVideo.visualElement} />
        </div>
        <div>
          <h2 id={titleId}>{aboutNDLAVideo.title}</h2>
          <p>{aboutNDLAVideo.description}</p>
          {article && (
            <Modal>
              <ModalTrigger>
                <Button variant="link">{t('ndlaFilm.about.more')}</Button>
              </ModalTrigger>
              <ModalContent size="full">
                <ModalHeader>
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                  <Article article={transformedArticle} label={''} />
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </div>
      </StyledAside>
    </div>
  );
};

export default AboutNdlaFilm;

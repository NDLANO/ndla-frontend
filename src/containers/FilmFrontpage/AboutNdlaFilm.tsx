/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTrigger } from "@ndla/modal";
import { Button, Heading, Image, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";
import Article from "../../components/Article";
import { GQLArticle_ArticleFragment } from "../../graphqlTypes";
import { BaseArticle, TransformedBaseArticle, transformArticle } from "../../util/transformArticle";

const StyledAside = styled("aside", {
  base: {
    display: "flex",
    padding: "medium",
    tabletDown: {
      flexDirection: "column",
    },
  },
});

const StyledDiv = styled("div", {
  base: {
    padding: "small",
    width: "100%",
    tabletDown: {
      _firstOfType: {
        paddingBottom: "0",
      },
    },
  },
});

const StyledHeading = styled(Heading, {
  base: {
    marginBottom: "medium",
  },
});

const StyledText = styled(Text, {
  base: {
    marginBottom: "xxlarge",
    tabletDown: {
      marginBottom: "0",
    },
  },
});

const StyledIframe = styled("iframe", {
  base: {
    height: "100%",
    width: "100%",
  },
});

interface VisualElementProps {
  visualElement: {
    alt?: string;
    url: string;
    type: string;
  };
}

const VisualElement = ({ visualElement }: VisualElementProps) => {
  const { type, url, alt } = visualElement;
  if (type === "image") {
    return <Image src={url} alt={alt ?? ""} />;
  } else if (type === "brightcove") {
    return <StyledIframe allowFullScreen={true} src={url} />;
  } else {
    return null;
  }
};

interface AboutNdlaFilmProps {
  aboutNDLAVideo:
    | {
        title: string;
        description: string;
        visualElement: {
          alt?: string;
          url: string;
          type: string;
        };
      }
    | undefined;
  article?: BaseArticle;
}

const StyledOneColumn = styled(OneColumn, {
  base: {
    marginTop: "3xlarge",
  },
});

// TODO: Check with designer that we even want this block :^)
const AboutNdlaFilm = ({ aboutNDLAVideo, article }: AboutNdlaFilmProps) => {
  const { t, i18n } = useTranslation();
  const titleId = "about-ndla-film-title";

  const transformedArticle = useMemo(() => {
    if (article) {
      return transformArticle(article, i18n.language) as TransformedBaseArticle<GQLArticle_ArticleFragment>;
    }
    return undefined;
  }, [article, i18n.language]);

  return (
    <StyledOneColumn>
      <StyledAside aria-labelledby={titleId}>
        {aboutNDLAVideo?.visualElement && (
          <StyledDiv>
            <VisualElement visualElement={aboutNDLAVideo?.visualElement} />
          </StyledDiv>
        )}
        <StyledDiv>
          <StyledHeading textStyle="title.large" id={titleId} asChild consumeCss>
            <h2>{aboutNDLAVideo?.title}</h2>
          </StyledHeading>
          <StyledText asChild consumeCss>
            <p>{aboutNDLAVideo?.description}</p>
          </StyledText>
          {transformedArticle && (
            <Modal>
              <ModalTrigger>
                <Button variant="secondary">{t("ndlaFilm.about.more")}</Button>
              </ModalTrigger>
              <ModalContent size="full">
                <ModalHeader>
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                  <Article article={transformedArticle} oembed={undefined} label="" />
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </StyledDiv>
      </StyledAside>
    </StyledOneColumn>
  );
};

export default AboutNdlaFilm;

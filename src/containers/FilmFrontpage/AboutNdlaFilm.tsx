/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  BleedPageContent,
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Heading,
  Image,
  PageContent,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import Article from "../../components/Article";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { GQLArticle_ArticleFragment } from "../../graphqlTypes";
import { BaseArticle, TransformedBaseArticle, transformArticle } from "../../util/transformArticle";

const StyledAside = styled("aside", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "medium",
    tabletDown: {
      gridTemplateColumns: "1fr",
    },
  },
});

const StyledContent = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    alignItems: "flex-start",
  },
});

const StyledIframe = styled("iframe", {
  base: {
    aspectRatio: "16/9",
    height: "100%",
    width: "100%",
  },
});

const StyledDialogCloseButton = styled(DialogCloseButton, {
  base: {
    marginInlineStart: "auto",
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
    return <Image src={url} alt={alt ?? ""} variant="rounded" />;
  } else if (type === "brightcove") {
    return <StyledIframe allow="fullscreen; encrypted-media" src={url} title={alt ?? ""} />;
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
    <BleedPageContent asChild>
      <PageContent variant="article">
        <StyledAside aria-labelledby={titleId}>
          {!!aboutNDLAVideo?.visualElement && (
            <StyledContent>
              <VisualElement visualElement={aboutNDLAVideo?.visualElement} />
            </StyledContent>
          )}
          <StyledContent>
            <Heading textStyle="title.large" id={titleId} asChild consumeCss>
              <h2>{aboutNDLAVideo?.title}</h2>
            </Heading>
            <Text asChild consumeCss>
              <p>{aboutNDLAVideo?.description}</p>
            </Text>
            {!!transformedArticle && (
              <DialogRoot size="full">
                <DialogTrigger asChild>
                  <Button variant="secondary">{t("ndlaFilm.about.more")}</Button>
                </DialogTrigger>
                <PageContent variant="content" asChild>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle srOnly>{transformedArticle.title}</DialogTitle>
                      <StyledDialogCloseButton />
                    </DialogHeader>
                    <DialogBody>
                      <Article article={transformedArticle} oembed={undefined} />
                    </DialogBody>
                  </DialogContent>
                </PageContent>
              </DialogRoot>
            )}
          </StyledContent>
        </StyledAside>
      </PageContent>
    </BleedPageContent>
  );
};

export default AboutNdlaFilm;

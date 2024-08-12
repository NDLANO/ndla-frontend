/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { animations, breakpoints, colors, misc, mq, spacing } from "@ndla/core";
import { CursorClick } from "@ndla/icons/action";
import { PlayCircleFill } from "@ndla/icons/common";
import { ExpandDiagonalLine } from "@ndla/icons/editor";
import { DialogContent, DialogHeader, DialogRoot, DialogTrigger, Image } from "@ndla/primitives";
import { EmbedMetaData } from "@ndla/types-embed";
import { getCrop, getFocalPoint } from "@ndla/ui";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  visualElementEmbedMeta: EmbedMetaData;
  visualElement?: ReactNode;
  metaImage: {
    url: string;
    alt: string;
  };
}

const TopicHeaderVisualElementWrapper = styled.div`
  position: relative;
  min-width: 100px;
  max-width: 100px;
  min-height: 100px;
  max-height: 100px;
  ${mq.range({ from: breakpoints.mobileWide })} {
    min-width: 150px;
    max-width: 150px;
    min-height: 150px;
    max-height: 150px;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    min-width: 200px;
    max-width: 200px;
    min-height: 200px;
    max-height: 200px;
  }
`;

const VisualElementDialogTrigger = styled(DialogTrigger)`
  color: ${colors.brand.secondary};
  cursor: pointer;
  overflow: hidden;
  border-radius: ${misc.borderRadiusLarge};
  &:hover {
    [data-indicator] {
      right: 10px;
    }
    [data-overlay] {
      opacity: 0.1;
    }
    img {
      transform: scale(1.1);
      opacity: 1.2;
    }
  }
`;

const TopicHeaderImage = styled(Image)`
  position: relative;
  aspect-ratio: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${animations.durations.fast};
`;

const TopicHeaderOverlay = styled.div`
  background: black;
  opacity: 0.05;
  position: absolute;
  inset: 0;
  border-radius: ${misc.borderRadiusLarge};
  transition: opacity ${animations.durations.fast};
`;

const ExpandVisualElementButton = styled.span`
  position: absolute;
  right: -10px;
  bottom: -${spacing.xxsmall};
  transition: all ${animations.durations.fast};
  ${mq.range({ from: breakpoints.mobileWide })} {
    right: 0;
    bottom: 0;
  }
`;

const TopicMetaImage = ({ visualElementEmbedMeta, metaImage: articleMetaImage, visualElement }: Props) => {
  const { t } = useTranslation();

  const VisualElementIcon = useMemo(() => {
    if (!visualElementEmbedMeta || visualElementEmbedMeta.status === "error") return null;
    else if (visualElementEmbedMeta.resource === "brightcove") {
      return PlayCircleFill;
    } else if (visualElementEmbedMeta.resource === "image") {
      return ExpandDiagonalLine;
    } else return CursorClick;
  }, [visualElementEmbedMeta]);

  const metaImage = useMemo(() => {
    if (visualElementEmbedMeta?.resource === "image" && visualElementEmbedMeta.status === "success") {
      return {
        url: visualElementEmbedMeta.data.image?.imageUrl,
        alt: visualElementEmbedMeta.data.alttext?.alttext,
        crop: getCrop(visualElementEmbedMeta.embedData),
        focalPoint: getFocalPoint(visualElementEmbedMeta.embedData),
      };
    } else return articleMetaImage;
  }, [articleMetaImage, visualElementEmbedMeta]);

  const [crop, focalPoint] = useMemo(() => {
    if (visualElementEmbedMeta?.resource === "image") {
      return [getCrop(visualElementEmbedMeta.embedData), getFocalPoint(visualElementEmbedMeta.embedData)];
    }
    return [];
  }, [visualElementEmbedMeta.embedData, visualElementEmbedMeta?.resource]);

  if (!metaImage) return null;

  if (visualElementEmbedMeta?.status !== "success") {
    return (
      <TopicHeaderVisualElementWrapper>
        <TopicHeaderImage
          src={metaImage.url}
          alt={metaImage.alt}
          fallbackWidth={400}
          crop={crop}
          focalPoint={focalPoint}
        />
      </TopicHeaderVisualElementWrapper>
    );
  }

  return (
    <TopicHeaderVisualElementWrapper>
      <DialogRoot size="large">
        {/* TODO: Remove consumeCss once VisualElementButton is fixed. This'll probably removed anyways */}
        <VisualElementDialogTrigger
          title={visualElementEmbedMeta.resource === "image" ? t("image.largeSize") : t("visualElement.show")}
        >
          <TopicHeaderImage
            src={metaImage.url}
            alt={metaImage.alt}
            fallbackWidth={400}
            crop={crop}
            focalPoint={focalPoint}
          />
          <TopicHeaderOverlay data-overlay="" />
          <ExpandVisualElementButton data-indicator="">
            {VisualElementIcon && <VisualElementIcon />}
          </ExpandVisualElementButton>
        </VisualElementDialogTrigger>
        <DialogContent aria-label={t("topicPage.imageModal")}>
          <DialogHeader>
            <div />
            <DialogCloseButton />
          </DialogHeader>
          {visualElement}
        </DialogContent>
      </DialogRoot>
    </TopicHeaderVisualElementWrapper>
  );
};

export default TopicMetaImage;

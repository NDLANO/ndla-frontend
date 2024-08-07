/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  MouseEvent as ReactMouseEvent,
  UIEvent,
  useRef,
  useState,
  useEffect,
  useCallback,
  HTMLAttributes,
  forwardRef,
} from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons/common";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hideButtons?: boolean;
  withInnerMargin?: boolean;
}

const StyledSlideContent = styled("div", {
  base: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "small",
  },
});

const CarouselWrapper = styled("div", {
  base: {
    position: "relative",
    cursor: "grab",
    _hover: {
      "& > button": {
        display: "block",
      },
    },
  },
});

const SliderWrapper = styled("div", {
  base: {
    display: "flex",
    overflowX: "scroll",
    paddingBlock: "xxsmall",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    display: "none",
    position: "absolute",
    top: "30%",
    transform: "translateY(-20%)",
    zIndex: "overlay",
    marginInline: "medium",
    right: 0,
    "&[data-left='true']": {
      right: "unset",
      left: 0,
    },
  },
});

export const Carousel = forwardRef<HTMLDivElement, Props>(
  ({ children, hideButtons, withInnerMargin, ...rest }, ref) => {
    const { t } = useTranslation();
    const slideshowRef = useRef<HTMLDivElement>(null);
    const slideContainer = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const onScroll = (e: UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      setShowLeft(target.scrollLeft !== 0);
      if (slideshowRef.current) {
        setShowRight(slideshowRef.current.offsetWidth > target.offsetWidth + target.scrollLeft);
      }
    };

    const onResize = useCallback(() => {
      if (slideContainer.current) {
        setShowRight(slideContainer.current.scrollWidth > slideContainer.current.clientWidth);
      }
    }, []);

    useEffect(() => {
      window.addEventListener("resize", onResize);
      onResize();
      return () => window.removeEventListener("resize", onResize);
    }, [onResize]);

    const slidePage = (direction: "left" | "right") => {
      const firstChild = slideshowRef.current?.firstChild as HTMLElement;
      if (!firstChild) return;
      const amount = firstChild.clientWidth * 3;
      slideContainer.current?.scrollBy({
        left: direction === "right" ? amount : -amount,
        behavior: "smooth",
      });
    };

    const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
      const pos = {
        left: slideContainer.current?.scrollLeft || 0,
        x: e.clientX,
      };

      const slider = slideContainer.current;
      const sliderContent = slideshowRef.current;

      if (slider) {
        slider.style.cursor = "grabbing";
      }
      document.body.style.cursor = "grabbing";

      const mouseMoveHandler = (e: MouseEvent) => {
        const dx = e.clientX - pos.x;

        if (sliderContent && !sliderContent?.style.pointerEvents) {
          sliderContent.style.pointerEvents = "none";
        }
        if (slider) {
          slider.style.userSelect = "none";
          slider.scrollLeft = pos.left - dx;
        }
      };

      const mouseUpHandler = () => {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);

        sliderContent?.style.removeProperty("pointer-events");
        slider?.style.removeProperty("user-select");
        document.body.style.removeProperty("cursor");

        if (slider) {
          slider.style.cursor = "grab";
        }
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler, { once: true });
    };

    return (
      <CarouselWrapper ref={ref} {...rest}>
        <StyledIconButton
          aria-label={t("ndlaFilm.slideBackwardsLabel")}
          variant="secondary"
          data-left={true}
          onClick={() => slidePage("left")}
          hidden={!showLeft || !!hideButtons}
        >
          <ArrowLeftShortLine />
        </StyledIconButton>
        <StyledIconButton
          aria-label={t("ndlaFilm.slideForwardsLabel")}
          variant="secondary"
          onClick={() => slidePage("right")}
          hidden={!showRight || !!hideButtons}
        >
          <ArrowRightShortLine />
        </StyledIconButton>
        <SliderWrapper ref={slideContainer} tabIndex={-1} onScroll={onScroll} onMouseDown={onMouseDown}>
          <StyledSlideContent ref={slideshowRef} data-slide-content-wrapper="true">
            {children}
          </StyledSlideContent>
        </SliderWrapper>
      </CarouselWrapper>
    );
  },
);

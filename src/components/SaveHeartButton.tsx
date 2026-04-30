/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HeartFill, HeartLine } from "@ndla/icons";
import { Button, type ButtonProps, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { type MouseEvent, useState } from "react";

const HeartContainer = styled("div", {
  base: {
    position: "relative",
    width: "medium",
    height: "medium",
    overflow: "visible",
  },
});

const StyledHeartLine = styled(HeartLine, {
  base: {
    position: "absolute",
    left: "0",
    top: "0",
    transitionProperty: "opacity, transform",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "moderate",
    opacity: "1",
    transform: "scale(1)",
    _motionReduce: {
      transitionDuration: "0ms",
    },
  },
  variants: {
    invisible: {
      true: {
        opacity: "0",
        transform: "scale(0.9)",
      },
      false: {
        opacity: "1",
      },
    },
  },
});

const StyledHeartFill = styled(HeartFill, {
  base: {
    position: "absolute",
    left: "0",
    top: "0",
    transitionProperty: "opacity, transform",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "moderate",
    opacity: "0",
    transform: "scale(0.75)",
    _motionReduce: {
      transitionDuration: "0ms",
    },
  },
  variants: {
    visible: {
      true: {
        opacity: "1",
        transform: "scale(1)",
      },
      false: {
        opacity: "0",
      },
    },
  },
});

const BurstHeartBase = styled(HeartFill, {
  base: {
    position: "absolute",
    left: "0",
    top: "0",
    opacity: "0",
    color: "surface.brand.1",
    transitionProperty: "transform",
    transitionTimingFunction: "ease-out",
    transitionDuration: "0ms",
    transform: "translate(0, 0) scale(1.0) rotate(0deg)",
    _motionReduce: {
      animation: "none",
      transitionDuration: "0ms",
      transform: "none",
    },
  },
  variants: {
    triggered: {
      true: {
        opacity: "1",
        animationName: "fade-out",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
      },
    },
  },
});

const MovingHeart1 = styled(BurstHeartBase, {
  variants: {
    triggered: {
      true: {
        transform: "translate(-30px, -62px) scale(2) rotate(-20deg)",
        animationDuration: "220ms",
        animationDelay: "150ms",
        transitionDuration: "760ms",
      },
    },
  },
});

const MovingHeart2 = styled(BurstHeartBase, {
  variants: {
    triggered: {
      true: {
        transform: "translate(42px, -64px) scale(1.9) rotate(26deg)",
        animationDuration: "240ms",
        transitionDuration: "860ms",
        animationDelay: "180ms",
      },
    },
  },
});

const MovingHeart3 = styled(BurstHeartBase, {
  variants: {
    triggered: {
      true: {
        transform: "translate(8px, -80px) scale(1.85) rotate(6deg)",
        animationDuration: "260ms",
        transitionDuration: "980ms",
        animationDelay: "220ms",
      },
    },
  },
});

interface Props extends ButtonProps {
  saved: boolean;
  saveText: string;
  savedText: string;
}

const SaveButtonLabel = styled("span", {
  base: {
    position: "relative",
    display: "inline-grid",
    alignItems: "center",
    overflow: "hidden",
  },
});

const BaseAnimatedText = styled("span", {
  base: {
    gridArea: "1 / 1",
    whiteSpace: "nowrap",
    transitionProperty: "opacity, transform",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "360ms",
    transitionDelay: "0ms",
    _motionReduce: {
      transitionProperty: "none",
      transitionDuration: "0ms",
      transitionDelay: "0ms",
    },
  },
});

const SaveText = styled(BaseAnimatedText, {
  base: {
    transform: "translateX(0)",
    opacity: "1",
  },
  variants: {
    saved: {
      true: {
        transform: "translateX(-28%)",
        opacity: "0",
      },
    },
  },
});

const AddedText = styled(BaseAnimatedText, {
  base: {
    transform: "translateX(28%)",
    opacity: "0",
  },
  variants: {
    saved: {
      true: {
        transform: "translateX(0)",
        opacity: "1",
      },
    },
  },
});

const StyledSpinner = styled(Spinner, {
  base: {
    width: "medium",
    height: "medium",
    transitionProperty: "opacity",
    transitionDuration: "normal",
    transitionTimingFunction: "ease-in-out",
    borderWidth: "4px",
    opacity: "0",
  },
  variants: {
    visible: {
      true: {
        opacity: "1",
      },
    },
  },
});

export const SaveHeartButton = ({ saved, loading, onClick: onClickProp, saveText, savedText, ...rest }: Props) => {
  const [triggered, setTriggered] = useState(false);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    setTriggered(true);
    onClickProp?.(e);
  };

  return (
    <Button onClick={onClick} {...rest}>
      <SaveButtonLabel aria-hidden>
        <SaveText saved={!!saved && !triggered}>{saveText}</SaveText>
        <AddedText saved={!!saved && !triggered}>{savedText}</AddedText>
      </SaveButtonLabel>
      <HeartContainer aria-hidden>
        <StyledSpinner visible={!triggered && !!loading} />
        <StyledHeartLine invisible={(saved && !triggered) || (!triggered && loading)} />
        <StyledHeartFill visible={!!saved && !triggered} />
        <MovingHeart1 triggered={triggered} />
        <MovingHeart2 triggered={triggered} />
        <MovingHeart3 triggered={triggered} onAnimationEnd={() => setTriggered(false)} />
      </HeartContainer>
    </Button>
  );
};

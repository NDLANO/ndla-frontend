/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrowLeftShortLine, CloseLine, HomeLine, MenuLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Skeleton,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ReactNode, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { StepperList, StepperRoot } from "../Stepper";

const StyledDialogButton = styled(Button, {
  base: {
    width: "fit-content",
    _print: {
      display: "none",
    },
  },
  variants: {
    alwaysVisible: {
      false: {
        desktop: {
          display: "none",
        },
      },
      true: {},
    },
  },
});

interface MobileLaunchpadMenuProps {
  alwaysVisisble?: boolean;
  children: ReactNode;
}

export const MobileLaunchpadMenu = ({ alwaysVisisble, children }: MobileLaunchpadMenuProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <DialogRoot
      variant="drawer"
      position="left"
      unmountOnExit={false}
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <DialogTrigger asChild>
        <StyledDialogButton variant="secondary" alwaysVisible={!!alwaysVisisble}>
          <MenuLine />
          {t("resourcePage.menuTrigger")}
        </StyledDialogButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle srOnly>{t("resourcePage.contentList")}</DialogTitle>
          <DialogCloseTrigger asChild>
            <Button variant="secondary">
              <CloseLine />
              {t("resourcePage.closeMenuTrigger")}
            </Button>
          </DialogCloseTrigger>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

interface LaunchpadProps {
  type: string;
  name: string;
  context: "desktop" | "mobile";
  actions?: ReactNode;
  loading: boolean;
  children: (collapsed: boolean) => ReactNode;
}

const LaunchpadContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "xxlarge",
    transitionProperty: "all",
    animationDuration: "fast",
    _print: {
      display: "none",
    },
  },
  variants: {
    context: {
      mobile: {},
      desktop: {
        background: "background.default",
        padding: "medium",
        boxShadow: "xsmall",
        maxWidth: "surface.small",
        height: "fit-content",
        desktopDown: {
          display: "none",
        },
      },
    },
    isLoading: {
      true: {
        width: "4xlarge",
      },
      false: {},
    },
    collapsed: {
      true: {},
      false: {
        width: "100%",
      },
    },
  },
  defaultVariants: {
    isLoading: false,
  },
});

const StyledIconButton = styled(IconButton, {
  variants: {
    collapsed: {
      false: {},
      true: {
        "& svg": {
          transitionTimingFunction: "ease-in-out",
          transitionProperty: "transform",
          animationDuration: "fast",
          transform: "rotate(180deg)",
        },
      },
    },
  },
});

const HeaderContainer = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    gap: "xsmall",
    alignItems: "flex-end",
  },
});

const MetaContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    width: "100%",
  },
});

const StyledText = styled(Text, {
  base: {
    alignItems: "center",
    overflowWrap: "anywhere",
    flex: "1",
  },
});

const NameWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "center",
  },
});

const StyledHomeLine = styled(HomeLine, {
  base: {
    color: "icon.strong",
  },
});

const ActionsContainer = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

export const Launchpad = ({ type, name, actions, children, loading, context }: LaunchpadProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const containerId = useId();
  const { t } = useTranslation();

  if (loading) {
    return (
      <LaunchpadContainer isLoading={loading} collapsed={collapsed} context={context}>
        {collapsed ? (
          <Skeleton css={{ width: "100%", height: "xxlarge" }} />
        ) : (
          <MetaContainer>
            <Skeleton css={{ width: "30%", height: "small" }} />
            <Skeleton css={{ width: "70%", height: "medium" }} />
          </MetaContainer>
        )}
        <StepperRoot asChild consumeCss collapsed={collapsed} css={{ width: "100%" }}>
          <div>
            <StepperList asChild consumeCss css={{ width: "100%" }}>
              <div>
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
                <Skeleton css={{ width: "100%", height: "xxlarge" }} />
              </div>
            </StepperList>
          </div>
        </StepperRoot>
      </LaunchpadContainer>
    );
  }

  return (
    <LaunchpadContainer id={containerId} context={context} collapsed={collapsed}>
      <MetaContainer>
        <HeaderContainer>
          {!collapsed && <Text color="text.subtle">{type}</Text>}
          <ActionsContainer>
            {collapsed ? null : actions}
            {context === "desktop" && (
              <StyledIconButton
                variant="tertiary"
                onClick={() => setCollapsed((prev) => !prev)}
                collapsed={collapsed}
                aria-label={collapsed ? t("launchpad.expand") : t("launchpad.collapse")}
                title={collapsed ? t("launchpad.expand") : t("launchpad.collapse")}
                aria-controls={containerId}
              >
                <ArrowLeftShortLine />
              </StyledIconButton>
            )}
          </ActionsContainer>
        </HeaderContainer>
        <NameWrapper>
          <StyledHomeLine />
          {!collapsed && (
            <StyledText color="text.strong" textStyle="title.medium">
              {name}
            </StyledText>
          )}
        </NameWrapper>
      </MetaContainer>
      {children(collapsed)}
    </LaunchpadContainer>
  );
};

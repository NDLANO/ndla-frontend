/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading, PageContent, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { WithCss } from "@ndla/styled-system/types";
import { createContext, ReactNode, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useRestrictedMode } from "./RestrictedModeContext";

type RestrictedBlockContextType = "learningpath" | "article" | "bleed";

const RestrictedBlockContext = createContext<RestrictedBlockContextType | undefined>(undefined);

export const RestrictedBlockContextProvider = RestrictedBlockContext.Provider;

export const useRestrictedBlockContext = (): RestrictedBlockContextType => {
  const ctx = useContext(RestrictedBlockContext);
  return ctx ?? "article";
};

const StyledPageContent = styled(PageContent, {
  base: {
    textAlign: "center",
    paddingBlock: "3xlarge",
    marginBlockStart: "4xlarge",
    marginBlockEnd: "3xlarge",
    background: "surface.action",
    gap: "medium",
    "& a": {
      color: "currentcolor",
      _focus: {
        outlineColor: "currentcolor",
      },
    },
  },
  variants: {
    context: {
      bleed: {
        width: "100%",
        gridColumnStart: "1!",
        gridColumnEnd: "-1!",
      },
      article: {
        position: "relative",
        marginInlineStart: "calc(-50vw + 50%)",
        width: "100vw",
      },
      learningpath: {
        borderRadius: "xsmall",
      },
    },
  },
});

const COOP_LINK = "https://ndla.no/om/om-ndla?mtm_campaign=varsling&mtm_source=banner";
const MAIL_LINK = "mailto:hjelp+oslo@ndla.no?subject=TilgangOslo";

interface Props extends WithCss {}

export const RestrictedBlock = ({ css }: Props) => {
  const { t } = useTranslation();
  const restrictedInfo = useRestrictedMode();
  const context = useRestrictedBlockContext();

  return (
    <StyledPageContent context={context} css={css}>
      <Heading asChild consumeCss textStyle="heading.large" color="text.onAction">
        <h2>{t("restrictedBlock.heading")}</h2>
      </Heading>
      <Text color="text.onAction" textStyle="body.xlarge">
        <Trans
          i18nKey="restrictedBlock.cause"
          components={{ safelink: <SafeLink to={COOP_LINK} /> }}
          values={{ region: restrictedInfo.region ?? t("restrictedBlock.regionFallback") }}
        />
      </Text>
      <Text color="text.onAction" textStyle="body.xlarge">
        <Trans
          i18nKey="restrictedBlock.contact"
          components={{ safelink: <SafeLink to={MAIL_LINK} /> }}
          values={{ region: restrictedInfo.region ?? t("restrictedBlock.regionFallback") }}
        />
      </Text>
    </StyledPageContent>
  );
};

interface RestrictedContentProps {
  children: ReactNode;
  context?: RestrictedBlockContextType;
}

export const RestrictedContent = ({ children, context }: RestrictedContentProps) => {
  const restrictedInfo = useRestrictedMode();
  if (restrictedInfo.restricted && context) {
    return (
      <RestrictedBlockContextProvider value={context}>
        <RestrictedBlock />
      </RestrictedBlockContextProvider>
    );
  } else if (restrictedInfo.restricted) {
    return <RestrictedBlock />;
  } else return children;
};

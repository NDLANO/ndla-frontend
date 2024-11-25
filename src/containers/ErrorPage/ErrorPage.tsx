/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { NdlaLogoText } from "@ndla/primitives";
import { MissingRouterContext, SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Status } from "../../components";
import { DefaultErrorMessage } from "../../components/DefaultErrorMessage";
import { PageLayout } from "../../components/Layout/PageContainer";
import { INTERNAL_SERVER_ERROR } from "../../statusCodes";
import Masthead from "../Masthead/components/Masthead";
import { Footer } from "../Page/components/Footer";

const LogoWrapper = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
});

const ErrorMessageMain = styled("main", {
  base: {
    paddingBlockEnd: "4xlarge",
  },
});

const ErrorPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <MissingRouterContext.Provider value={true}>
      <Status code={INTERNAL_SERVER_ERROR}>
        <Helmet
          htmlAttributes={{ lang: i18n.language === "nb" ? "no" : i18n.language }}
          title="NDLA"
          meta={[{ name: "description", content: t("meta.description") }]}
        />
        <Masthead fixed>
          <LogoWrapper>
            <SafeLink unstyled to="/" aria-label={t("logo.altText")}>
              <NdlaLogoText />
            </SafeLink>
          </LogoWrapper>
        </Masthead>
        <PageLayout asChild>
          <ErrorMessageMain>
            <DefaultErrorMessage applySkipToContentId />
          </ErrorMessageMain>
        </PageLayout>
        <Footer />
      </Status>
    </MissingRouterContext.Provider>
  );
};

export default ErrorPage;

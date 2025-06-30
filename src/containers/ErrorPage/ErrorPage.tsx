/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { NdlaLogoText } from "@ndla/primitives";
import { MissingRouterContext, SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Status } from "../../components";
import { DefaultErrorMessage } from "../../components/DefaultErrorMessage";
import { PageLayout } from "../../components/Layout/PageContainer";
import { INTERNAL_SERVER_ERROR } from "../../statusCodes";
import { MastheadContainer } from "../Masthead/Masthead";
import { Footer } from "../Page/components/Footer";

const ErrorMessageMain = styled("main", {
  base: {
    paddingBlockEnd: "4xlarge",
  },
});

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <MissingRouterContext value={true}>
      <Status code={INTERNAL_SERVER_ERROR}>
        <title>NDLA</title>
        <meta name="description" content={t("meta.description")} />
        <MastheadContainer>
          <SafeLink to="/" aria-label="NDLA" title="NDLA">
            <NdlaLogoText />
          </SafeLink>
        </MastheadContainer>
        <PageLayout asChild>
          <ErrorMessageMain>
            <DefaultErrorMessage applySkipToContentId />
          </ErrorMessageMain>
        </PageLayout>
        <Footer />
      </Status>
    </MissingRouterContext>
  );
};

export default ErrorPage;

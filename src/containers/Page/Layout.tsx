/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Outlet, ScrollRestoration } from "react-router";
import { PageLayout } from "../../components/Layout/PageContainer";
import { ToastProvider } from "../../components/ToastContext";
import { defaultValue, useVersionHash } from "../../components/VersionHashContext";
import { Masthead } from "../Masthead/Masthead";
import { Footer } from "./components/Footer";
import { TitleAnnouncer } from "./components/TitleAnnouncer";
import { GlobalEffects } from "./GlobalEffects";

export const Layout = () => {
  const hash = useVersionHash();
  const isDefaultVersion = hash === defaultValue;
  const metaChildren = isDefaultVersion ? null : <meta name="robots" content="noindex, nofollow" />;

  return (
    <ToastProvider>
      <TitleAnnouncer />
      <ScrollRestoration />
      <GlobalEffects />
      {metaChildren}
      <Masthead />
      <PageLayout>
        <Outlet />
      </PageLayout>
      <Footer />
    </ToastProvider>
  );
};

export const Component = Layout;

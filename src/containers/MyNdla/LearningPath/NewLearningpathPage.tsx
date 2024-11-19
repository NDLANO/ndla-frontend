/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import { Heading } from "@ndla/primitives";
import { HelmetWithTracker } from "@ndla/tracker";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const NewLearningpathPage = () => {
  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.newLearningpath")}` }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.newLearningpath")}
      </Heading>
    </MyNdlaPageWrapper>
  );
};

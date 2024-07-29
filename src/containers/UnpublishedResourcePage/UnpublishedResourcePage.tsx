/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { HelmetWithTracker } from "@ndla/tracker";
import { OneColumn, ErrorMessage } from "@ndla/ui";
import { Status } from "../../components";

const UnpublishedResource = () => {
  const { t } = useTranslation();
  return (
    <Status code={410}>
      <HelmetWithTracker title={t("htmlTitles.notFound")} />
      <OneColumn>
        <ErrorMessage
          illustration={{
            url: "/static/not-exist.gif",
            altText: t("errorMessage.title"),
          }}
          messages={{
            title: t(`unpublishedResourcePage.title`),
            description: t(`unpublishedResourcePage.errorDescription`),
            goToFrontPage: t("errorMessage.goToFrontPage"),
          }}
        />
      </OneColumn>
    </Status>
  );
};

UnpublishedResource.propTypes = {};

export default UnpublishedResource;

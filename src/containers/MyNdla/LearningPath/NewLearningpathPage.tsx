/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Heading } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { LearningPathStepper } from "./components/LearningPathStepper";
import { TitleForm } from "./components/TitleForm";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { useCreateLearningpath } from "../learningpathQueries";

export const NewLearningpathPage = () => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);

  const { createLearningpath } = useCreateLearningpath();

  useEffect(() => {
    trackPageView({ title: t("htmlTitles.learningpathPage"), dimensions: getAllDimensions({ user }) });
  }, [t, trackPageView, user]);

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: t("myNdla.learningpath.newLearningpath") }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.newLearningpath")}
      </Heading>
      <LearningPathStepper stepKey="title" />
      <TitleForm
        onSave={async (val) =>
          await createLearningpath({
            variables: {
              params: {
                coverPhotoMetaUrl: val.image.metaUrl,
                copyright: {
                  contributors: [],
                  license: {
                    license: "CC-BY-SA-4.0",
                  },
                },
                description: "",
                language: i18n.language,
                tags: [],
                title: val.title,
                duration: 1,
              },
            },
          })
        }
      />
    </MyNdlaPageWrapper>
  );
};

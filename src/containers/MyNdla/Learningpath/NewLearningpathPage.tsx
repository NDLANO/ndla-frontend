/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ALL_ABBREVIATIONS } from "@ndla/licenses";
import { Heading } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { LearningPathStepper } from "./components/LearningPathStepper";
import { TitleForm } from "./components/TitleForm";
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { useCreateLearningpath } from "../learningpathMutations";

export const NewLearningpathPage = () => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);

  const { createLearningpath } = useCreateLearningpath();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView({ title: t("htmlTitles.learningpathPage"), dimensions: getAllDimensions({ user }) });
  }, [t, trackPageView, user]);

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "-1", name: t("myNdla.learningpath.newLearningpath") }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.newLearningpath")}
      </Heading>
      <LearningPathStepper stepKey="title" />
      <TitleForm
        onSave={async (val) => {
          const res = await createLearningpath({
            variables: {
              params: {
                coverPhotoMetaUrl: val.image.metaUrl,
                copyright: {
                  contributors: [],
                  license: {
                    license: ALL_ABBREVIATIONS[4],
                  },
                },
                description: "",
                language: i18n.language,
                tags: [],
                title: val.title,
                duration: 1,
              },
            },
          });
          if (res.data?.newLearningpath.id) {
            navigate(routes.myNdla.learningpathEdit(res.data.newLearningpath.id));
          }
        }}
      />
    </MyNdlaPageWrapper>
  );
};

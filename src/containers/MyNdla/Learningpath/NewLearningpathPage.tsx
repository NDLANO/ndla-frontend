/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { licenses } from "@ndla/licenses";
import { Heading } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { TitleForm, TitleFormValues } from "./components/TitleForm";
import { AuthContext } from "../../../components/AuthenticationContext";
import MyNdlaBreadcrumb from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { useToast } from "../../../components/ToastContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { useCreateLearningpath } from "../../../mutations/learningpathMutations";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

export const Component = () => {
  return <PrivateRoute element={<NewLearningpathPage />} />;
};

export const NewLearningpathPage = () => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { user } = useContext(AuthContext);

  const toast = useToast();
  const { createLearningpath } = useCreateLearningpath();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView({ title: t("htmlTitles.learningpathNewPage"), dimensions: getAllDimensions({ user }) });
  }, [t, trackPageView, user]);

  const onSave = async ({ title, imageUrl }: TitleFormValues) => {
    if (!user) {
      return;
    }
    const res = await createLearningpath({
      variables: {
        params: {
          language: i18n.language,
          coverPhotoMetaUrl: imageUrl,
          title: title,
          copyright: {
            license: {
              license: licenses.CC_BY_SA_4,
            },
            contributors: [{ name: user.displayName, type: "writer" }],
          },
        },
      },
    });
    if (res.data?.newLearningpath.id) {
      navigate(routes.myNdla.learningpathEditSteps(res.data.newLearningpath.id));
    }
    if (res.errors?.length) {
      toast.create({ title: t("myNdla.learningpath.toast.createdFailed") });
    }
  };

  return (
    <MyNdlaPageWrapper type="learningpath">
      <HelmetWithTracker title={t("htmlTitles.learningpathNewPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "newLearningpath", name: t("myNdla.learningpath.newLearningpath") }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {t("myNdla.learningpath.newLearningpath")}
      </Heading>
      <LearningpathStepper step="title" />
      <TitleForm onSave={onSave} />
    </MyNdlaPageWrapper>
  );
};

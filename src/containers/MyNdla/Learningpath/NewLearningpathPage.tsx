/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { licenses } from "@ndla/licenses";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../components/AuthenticationContext";
import { MyNdlaBreadcrumb } from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { MyNdlaTitle } from "../../../components/MyNdla/MyNdlaTitle";
import { PageTitle } from "../../../components/PageTitle";
import { serializeFromRichText } from "../../../components/RichTextEditor/richTextSerialization";
import { useToast } from "../../../components/ToastContext";
import { useCreateLearningpath } from "../../../mutations/learningpathMutations";
import { routes } from "../../../routeHelpers";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyNdlaPageContent } from "../components/MyNdlaPageSection";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { TitleForm, TitleFormValues } from "./components/TitleForm";

export const Component = () => {
  return <PrivateRoute element={<NewLearningpathPage />} />;
};

export const NewLearningpathPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);

  const toast = useToast();
  const { createLearningpath } = useCreateLearningpath();
  const navigate = useNavigate();

  const onSave = async ({ title, imageUrl, introduction }: TitleFormValues) => {
    if (!user) {
      return;
    }
    const res = await createLearningpath({
      variables: {
        params: {
          language: i18n.language,
          coverPhotoMetaUrl: imageUrl,
          title: title,
          introduction: serializeFromRichText(introduction),
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
    if (res.error) {
      toast.create({ title: t("myNdla.learningpath.toast.createdFailed") });
    }
  };

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={t("htmlTitles.learningpathNewPage")} />
      <MyNdlaPageContent>
        <MyNdlaBreadcrumb
          breadcrumbs={[{ id: "newLearningpath", name: t("myNdla.learningpath.newLearningpath") }]}
          page="learningpath"
        />
        <MyNdlaTitle title={t("myNdla.learningpath.newLearningpath")} />
        <LearningpathStepper step="title" />
      </MyNdlaPageContent>
      <MyNdlaPageContent>
        <TitleForm onSave={onSave} />
      </MyNdlaPageContent>
    </MyNdlaPageWrapper>
  );
};

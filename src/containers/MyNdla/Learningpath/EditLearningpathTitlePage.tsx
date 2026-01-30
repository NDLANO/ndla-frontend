/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";
import { Spinner, Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { TitleFormValues, TitleForm } from "./components/TitleForm";
import { useFetchLearningpath } from "./learningpathQueries";
import { MyNdlaBreadcrumb } from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { MyNdlaTitle } from "../../../components/MyNdla/MyNdlaTitle";
import { PageTitle } from "../../../components/PageTitle";
import { deserializeToRichText, serializeFromRichText } from "../../../components/RichTextEditor/richTextSerialization";
import config from "../../../config";
import { useUpdateLearningpath } from "../../../mutations/learningpathMutations";
import { routes } from "../../../routeHelpers";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyNdlaPageContent } from "../components/MyNdlaPageSection";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";

const StyledMyNdlaPageContent = styled(MyNdlaPageContent, {
  base: {
    alignItems: "flex-end",
  },
});

export const Component = () => {
  return <PrivateRoute element={<EditLearningpathTitlePage />} />;
};

export const EditLearningpathTitlePage = () => {
  const [updatePath] = useUpdateLearningpath();

  const { t } = useTranslation();
  const { learningpathId } = useParams();

  const navigate = useNavigate();
  const { data, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId ?? "-1" },
    skip: !learningpathId,
  });

  const onSaveTitle = async ({ title, imageUrl, introduction: formIntroduction }: TitleFormValues) => {
    const learningpath = data?.myNdlaLearningpath;
    if (!learningpath) return;
    const serializedIntroduction = serializeFromRichText(formIntroduction);
    const introduction = serializedIntroduction === "<section></section>" ? null : serializedIntroduction;
    if (
      learningpath.title !== title ||
      learningpath.coverphoto?.image.imageUrl !== imageUrl ||
      learningpath.introduction !== introduction
    ) {
      await updatePath({
        variables: {
          learningpathId: learningpath.id,
          params: {
            title,
            coverPhotoMetaUrl: imageUrl,
            description: " ",
            //@ts-expect-error - this is null instead of undefined
            introduction: introduction,
            language: learningpath.supportedLanguages[0] ?? config.defaultLocale,
            revision: learningpath.revision,
          },
        },
      });
    }
    navigate(routes.myNdla.learningpathEditSteps(data?.myNdlaLearningpath?.id ?? 0));
  };
  if (loading) {
    return <Spinner aria-label={t("loading")} />;
  }

  if (!data?.myNdlaLearningpath) {
    return <Navigate to={routes.myNdla.learningpath} />;
  }

  if (!data.myNdlaLearningpath.canEdit) {
    return <NotFoundPage />;
  }

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={t("htmlTitles.learningpathEditTitlePage", { name: data.myNdlaLearningpath.title })} />
      <MyNdlaPageContent>
        <MyNdlaBreadcrumb
          breadcrumbs={[{ id: "0", name: t("myNdla.learningpath.editLearningpathTitle") }]}
          page="learningpath"
        />
        <MyNdlaTitle title={data.myNdlaLearningpath.title} />
        <LearningpathStepper step="title" learningpathId={data.myNdlaLearningpath.id} />
      </MyNdlaPageContent>
      <MyNdlaPageContent>
        <TitleForm
          onSave={onSaveTitle}
          initialValues={{
            title: data.myNdlaLearningpath.title,
            imageUrl: data.myNdlaLearningpath.coverphoto?.metaUrl,
            introduction: deserializeToRichText(data.myNdlaLearningpath.introduction ?? ""),
          }}
        />
      </MyNdlaPageContent>
      <StyledMyNdlaPageContent>
        <Button variant="secondary" type="submit" form="titleForm">
          {t("myNdla.learningpath.form.next")}
        </Button>
      </StyledMyNdlaPageContent>
    </MyNdlaPageWrapper>
  );
};

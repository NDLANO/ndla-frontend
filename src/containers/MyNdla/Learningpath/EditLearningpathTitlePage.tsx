/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Spinner, Heading, Button } from "@ndla/primitives";
import { Stack } from "@ndla/styled-system/jsx";
import { useTracker, HelmetWithTracker } from "@ndla/tracker";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { TitleFormValues, TitleForm } from "./components/TitleForm";
import { useFetchLearningpath } from "./learningpathQueries";
import { AuthContext } from "../../../components/AuthenticationContext";
import MyNdlaBreadcrumb from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { useUpdateLearningpath } from "../../../mutations/learningpathMutations";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

export const Component = () => {
  return <PrivateRoute element={<EditLearningpathTitlePage />} />;
};

export const EditLearningpathTitlePage = () => {
  const [updatePath] = useUpdateLearningpath();

  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const { data, loading } = useFetchLearningpath({
    variables: { pathId: learningpathId ?? "-1" },
    skip: !learningpathId,
  });

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.learningpathEditTitlePage", { name: data?.myNdlaLearningpath?.title }),
      dimensions: getAllDimensions({ user }),
    });
  }, [data?.myNdlaLearningpath?.title, t, trackPageView, user]);

  const onSaveTitle = async ({ title, imageUrl }: TitleFormValues) => {
    if (
      data?.myNdlaLearningpath &&
      (data.myNdlaLearningpath.title !== title || data.myNdlaLearningpath.coverphoto?.url !== imageUrl)
    ) {
      await updatePath({
        variables: {
          learningpathId: data.myNdlaLearningpath.id,
          params: {
            title,
            coverPhotoMetaUrl: imageUrl,
            description: " ",
            language: i18n.language,

            revision: data.myNdlaLearningpath.revision,
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
    <MyNdlaPageWrapper type="learningpath">
      <HelmetWithTracker title={t("htmlTitles.learningpathEditTitlePage", { name: data?.myNdlaLearningpath?.title })} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.editLearningpathTitle")}` }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
        {data.myNdlaLearningpath.title}
      </Heading>
      <LearningpathStepper step="title" learningpathId={data.myNdlaLearningpath.id} />
      <TitleForm
        onSave={onSaveTitle}
        initialValues={{
          title: data.myNdlaLearningpath.title,
          imageUrl: data.myNdlaLearningpath.coverphoto?.metaUrl,
        }}
      />
      <Stack justify="flex-end" direction="row">
        <Button variant="secondary" type="submit" form="titleForm">
          {t("myNdla.learningpath.form.next")}
        </Button>
      </Stack>
    </MyNdlaPageWrapper>
  );
};

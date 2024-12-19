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
import { AuthContext } from "../../../components/AuthenticationContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { TitleFormValues, TitleForm } from "./components/TitleForm";
import { useUpdateLearningpath } from "./learningpathMutations";
import { useFetchLearningpath } from "./learningpathQueries";

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
      navigate(routes.myNdla.learningpathEditSteps(data.myNdlaLearningpath.id));
    }
  };
  if (loading) {
    return <Spinner aria-label={t("loading")} />;
  }

  if (!data?.myNdlaLearningpath) {
    return <Navigate to={routes.myNdla.learningpath} />;
  }

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.learningpathEditTitlePage", { name: data?.myNdlaLearningpath?.title })} />
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: "0", name: `${t("myNdla.learningpath.newLearningpath")}` }]}
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
          imageUrl: data.myNdlaLearningpath.coverphoto?.url ?? "",
        }}
      />
      <Stack justify="flex-end" direction="row">
        <Button type="submit" form="titleForm">
          {t("myNdla.learningpath.form.next")}
        </Button>
      </Stack>
    </MyNdlaPageWrapper>
  );
};

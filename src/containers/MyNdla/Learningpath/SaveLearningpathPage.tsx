/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button, DialogRoot, Heading, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { LearningpathFormButtonContainer } from "./LearningpathFormButtonContainer";
import { useUpdateLearningpathStatus } from "./learningpathMutations";
import { useFetchLearningpath } from "./learningpathQueries";
import { copyLearningpathSharingLink, LEARNINGPATH_READY_FOR_SHARING, LEARNINGPATH_SHARED } from "./utils";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../../components/DefaultErrorMessage";
import { PageSpinner } from "../../../components/PageSpinner";
import { useToast } from "../../../components/ToastContext";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import { LearningpathItem } from "./components/LearningpathItem";
import { LearningpathShareDialogContent } from "./components/LearningpathShareDialogContent";
import { LearningpathStepper } from "./components/LearningpathStepper";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

export const SaveLearningpathPage = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { learningpathId } = useParams();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const learningpathQuery = useFetchLearningpath({
    variables: { pathId: learningpathId ?? "" },
    skip: !learningpathId,
  });
  const [updateLearningpathStatus] = useUpdateLearningpathStatus();

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.learningpathSavePage", { name: learningpathQuery.data?.myNdlaLearningpath?.title }),
      dimensions: getAllDimensions({ user }),
    });
  }, [learningpathQuery.data?.myNdlaLearningpath?.title, t, trackPageView, user]);

  const onUnshare = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await updateLearningpathStatus({
      variables: {
        id: learningpath.id,
        // TODO: Are we sure we want to set it to this status?
        status: LEARNINGPATH_READY_FOR_SHARING,
      },
    });
    if (!res.errors?.length) {
      toast.create({
        title: t("myNdla.learningpath.toast.unshared", { name: learningpath.title }),
      });
    } else {
      toast.create({ title: t("myNdla.learningpath.toast.unshareFailed") });
    }
  };

  const onShare = async () => {
    const res = await updateLearningpathStatus({
      variables: {
        id: learningpath.id,
        status: LEARNINGPATH_SHARED,
      },
    });
    if (!res.errors?.length) {
      toast.create({
        title: t("myNdla.learningpath.toast.shared"),
      });
      setOpen(true);
    } else {
      toast.create({
        title: t("myNdla.learningpath.toast.shareFailed"),
      });
    }
  };

  if (learningpathQuery.loading) {
    return <PageSpinner />;
  }

  if (!learningpathQuery.data?.myNdlaLearningpath) {
    return <DefaultErrorMessagePage />;
  }

  const learningpath = learningpathQuery.data.myNdlaLearningpath;
  const isShared = learningpath.status === LEARNINGPATH_SHARED;

  return (
    <MyNdlaPageWrapper type="learningpath">
      <title>{t("htmlTitles.learningpathSavePage", { name: learningpath?.title })}</title>
      <MyNdlaBreadcrumb
        breadcrumbs={[{ id: `save-${learningpath.id}`, name: t("myNdla.learningpath.form.steps.save") }]}
        page="learningpath"
      />
      <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1} textStyle="heading.medium">
        {learningpath.title}
      </Heading>
      <LearningpathStepper step="save" learningpathId={learningpath.id} />
      <TextWrapper>
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.learningpath.saveLearningpath.pageHeading")}</h2>
        </Heading>
        <Text>{t("myNdla.learningpath.saveLearningpath.pageDescription")}</Text>
      </TextWrapper>
      <LearningpathItem learningpath={learningpath} showMenu={false} context="standalone" />
      <LearningpathFormButtonContainer>
        <SafeLinkButton variant="secondary" to={routes.myNdla.learningpathPreview(learningpath.id)}>
          {t("myNdla.learningpath.form.back")}
        </SafeLinkButton>
        <ButtonWrapper>
          <SafeLinkButton to={routes.myNdla.learningpath} variant="secondary">
            {t("myNdla.learningpath.saveLearningpath.saveAndClose")}
          </SafeLinkButton>
          <Button variant={isShared ? "danger" : "primary"} onClick={isShared ? onUnshare : onShare} ref={buttonRef}>
            {/* TODO: Reconsider this translation. Do we want to tie this up to the menu translations? */}
            {isShared ? t("myNdla.learningpath.menu.unShare") : t("myNdla.learningpath.menu.share")}
          </Button>
        </ButtonWrapper>
        <DialogRoot
          open={open}
          onOpenChange={(details) => setOpen(details.open)}
          finalFocusEl={() => buttonRef.current}
        >
          <LearningpathShareDialogContent
            learningpath={learningpath}
            onClose={() => setOpen(false)}
            onCopyText={() => copyLearningpathSharingLink(learningpath.id)}
          />
        </DialogRoot>
      </LearningpathFormButtonContainer>
    </MyNdlaPageWrapper>
  );
};

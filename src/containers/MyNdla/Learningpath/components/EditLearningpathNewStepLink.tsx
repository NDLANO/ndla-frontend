/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { AddLine } from "@ndla/icons";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { routes } from "../../../../routeHelpers";
import PrivateRoute from "../../../PrivateRoute/PrivateRoute";

const AddSafeLinkButton = styled(SafeLinkButton, {
  base: {
    width: "100%",
  },
});

export const EditLearningpathNewStepLink = () => {
  const { learningpathId } = useParams();
  const { t } = useTranslation();
  return (
    <AddSafeLinkButton to={routes.myNdla.learningpathEditStep(Number(learningpathId ?? ""), "new")} variant="secondary">
      <AddLine />
      {t("myNdla.learningpath.form.steps.add")}
    </AddSafeLinkButton>
  );
};

export const Component = () => {
  return <PrivateRoute element={<EditLearningpathNewStepLink />} />;
};

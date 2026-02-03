/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router";
import { PageLayout } from "../components/Layout/PageContainer";
import { IframePage } from "./IframePage";

export const IframePageContainer = () => {
  const { articleId, taxonomyId } = useParams();
  return (
    <PageLayout>
      <IframePage taxonomyId={taxonomyId} articleId={articleId} isOembed="true" />
    </PageLayout>
  );
};

export const Component = IframePageContainer;

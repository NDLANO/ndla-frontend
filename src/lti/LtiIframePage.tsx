/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router";
import { MissingRouterContext } from "@ndla/safelink";
import { PageLayout } from "../components/Layout/PageContainer";
import { IframePage } from "../iframe/IframePage";

export const Component = () => {
  const { taxonomyId, articleId } = useParams();
  return (
    <PageLayout>
      <MissingRouterContext value={true}>
        <IframePage taxonomyId={taxonomyId} articleId={articleId} />
      </MissingRouterContext>
    </PageLayout>
  );
};

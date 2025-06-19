/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router-dom";
import ResourceEmbed from "./components/ResourceEmbed";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

export const ConceptPage = () => {
  const { conceptId } = useParams();
  if (!conceptId || !parseInt(conceptId)) {
    return <NotFoundPage />;
  }

  return <ResourceEmbed id={conceptId} type="concept" />;
};

export const Component = ConceptPage;

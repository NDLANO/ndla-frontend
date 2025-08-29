/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router";
import ResourceEmbed from "./components/ResourceEmbed";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

export const ImagePage = () => {
  const { imageId } = useParams();

  if (!imageId || !parseInt(imageId)) {
    return <NotFoundPage />;
  }

  return <ResourceEmbed id={imageId} type="image" />;
};

export const Component = ImagePage;

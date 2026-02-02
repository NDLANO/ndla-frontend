/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { ResourceEmbed } from "./components/ResourceEmbed";

export const AudioPage = () => {
  const { audioId } = useParams();

  if (!audioId || !parseInt(audioId)) {
    return <NotFoundPage />;
  }

  return <ResourceEmbed id={audioId} type="audio" />;
};

export const Component = AudioPage;

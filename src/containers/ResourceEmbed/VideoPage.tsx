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

const VideoPage = () => {
  const { videoId } = useParams();

  if (!videoId) {
    return <NotFoundPage />;
  }

  return <ResourceEmbed id={videoId} type="video" />;
};

export default VideoPage;

/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useParams } from 'react-router-dom';
import ResourceEmbed from './components/ResourceEmbed';
import NotFound from '../NotFoundPage/NotFoundPage';

const AudioPage = () => {
  const { audioId } = useParams();

  if (!audioId) {
    return <NotFound />;
  }

  return <ResourceEmbed id={audioId} type="audio" />;
};

export default AudioPage;

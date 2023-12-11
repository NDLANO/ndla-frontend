/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from 'react-router-dom';
import ResourceEmbed from './components/ResourceEmbed';
import NotFound from '../NotFoundPage/NotFoundPage';

const H5pPage = () => {
  const { h5pId } = useParams();

  if (!h5pId) {
    return <NotFound />;
  }

  return <ResourceEmbed id={h5pId} type="h5p" />;
};

export default H5pPage;

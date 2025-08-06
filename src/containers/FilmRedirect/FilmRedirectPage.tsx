/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate } from "react-router-dom";
import { FILM_PAGE_URL } from "../../constants";

export const FilmRedirectPage = () => {
  return <Navigate to={FILM_PAGE_URL} replace />;
};

export const Component = FilmRedirectPage;

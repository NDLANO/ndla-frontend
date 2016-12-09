/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

const TextDownloadList = () => (
  <div>
    <ul className="c-downloadable-list">
      <li className="c-downloadable-list__item"><a href={document.location.href}>Last ned som word-dokument (.docx)</a></li>
      <li className="c-downloadable-list__item"><a href={document.location.href}>Last ned som rentekst (.txt)</a></li>
      <li className="c-downloadable-list__item"><a href={document.location.href}>Last ned som HTML</a></li>
    </ul>
  </div>
);


export default TextDownloadList;

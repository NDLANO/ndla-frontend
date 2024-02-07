/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SharedFolderPage from "../../SharedFolderPage/SharedFolderPage";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const PreviewFoldersPage = () => {
  return (
    <MyNdlaPageWrapper>
      <SharedFolderPage />
    </MyNdlaPageWrapper>
  );
};

export default PreviewFoldersPage;

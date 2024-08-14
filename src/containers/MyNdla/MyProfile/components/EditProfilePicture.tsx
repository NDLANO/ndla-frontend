/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { PencilFill } from "@ndla/icons/action";
import { Button, DialogRoot, DialogTrigger } from "@ndla/primitives";

const EditProfilePicture = () => {
  const { t } = useTranslation();

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="primary" size="small">
          <PencilFill />
          {t("myNdla.myProfile.editButtonText")}
        </Button>
      </DialogTrigger>
    </DialogRoot>
  );
};

export default EditProfilePicture;

/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Icon } from "@ndla/icons";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalTrigger } from "@ndla/modal";
import { Button } from "@ndla/primitives";

const StyledPencilSvg = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const PencilIcon = StyledPencilSvg.withComponent(Pencil);

const EditProfilePicture = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <Modal open={showModal} onOpenChange={setShowModal}>
      <ModalTrigger>
        <Button variant="primary" size="small" onClick={() => setShowModal(!showModal)}>
          <PencilIcon />
          {t("myNdla.myProfile.editButtonText")}
        </Button>
      </ModalTrigger>
    </Modal>
  );
};

export default EditProfilePicture;

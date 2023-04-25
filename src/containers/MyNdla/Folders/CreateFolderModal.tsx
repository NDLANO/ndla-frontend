/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, mq } from '@ndla/core';
import { Plus } from '@ndla/icons/lib/action';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeaderV2,
  ModalV2,
} from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import FolderForm from './FolderForm';
import { useAddFolderMutation } from '../folderMutations';
import { GQLFolder } from '../../../graphqlTypes';

const iconCss = css`
  width: 22px;
  height: 22px;
`;

const AddButton = styled(ButtonV2)`
  ${mq.range({ until: breakpoints.tablet })} {
    flex: 1;
  }
`;

interface Props {
  onSaved: (folder?: GQLFolder) => void;
  parentId?: string;
}

const CreateFolderModal = ({ onSaved, parentId }: Props) => {
  const { t } = useTranslation();
  const { addFolder, loading } = useAddFolderMutation();

  return (
    <ModalV2
      labelledBy="createHeading"
      activateButton={
        <AddButton shape="pill" colorTheme="lighter">
          <Plus css={iconCss} />
          <span>{t('myNdla.newFolder')}</span>
        </AddButton>
      }
    >
      {(close) => (
        <>
          <ModalHeaderV2>
            <h1 id="createHeading">{t('myNdla.folder.create')}</h1>
            <ModalCloseButton onClick={close} />
          </ModalHeaderV2>
          <ModalBody>
            <FolderForm
              onSave={async (values) => {
                const res = await addFolder({
                  variables: {
                    name: values.name,
                    description: values.description,
                    parentId: parentId ?? undefined,
                  },
                });
                close();
                onSaved(res.data?.addFolder);
              }}
              onClose={close}
              loading={loading}
            />
          </ModalBody>
        </>
      )}
    </ModalV2>
  );
};

export default CreateFolderModal;

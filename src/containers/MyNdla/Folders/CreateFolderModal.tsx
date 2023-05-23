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
import { Plus } from '@ndla/icons/action';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeaderV2,
  ModalV2,
} from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import FolderForm from './FolderForm';
import { useAddFolderMutation, useFolders } from '../folderMutations';
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
  parentFolder?: GQLFolder | null;
}

const CreateFolderModal = ({ onSaved, parentFolder }: Props) => {
  const { t } = useTranslation();
  const { addFolder, loading } = useAddFolderMutation();

  const { folders } = useFolders();

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
            <h1 id="createHeading">{t('myNdla.newFolder')}</h1>
            <ModalCloseButton onClick={close} />
          </ModalHeaderV2>
          <ModalBody>
            <FolderForm
              siblings={parentFolder?.subfolders ?? folders ?? []}
              onSave={async (values) => {
                const res = await addFolder({
                  variables: {
                    name: values.name,
                    description: values.description,
                    parentId: parentFolder?.id ?? undefined,
                  },
                });
                close();
                const folder = res.data?.addFolder as GQLFolder | undefined;
                onSaved(folder);
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

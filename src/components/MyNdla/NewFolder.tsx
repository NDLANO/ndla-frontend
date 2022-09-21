/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';
import { FolderInput } from '@ndla/ui';
import { GQLFolder } from '../../graphqlTypes';
import {
  getFolder,
  useAddFolderMutation,
  useFolders,
} from '../../containers/MyNdla/folderMutations';
import useValidationTranslation from '../../util/useValidationTranslation';

interface Props {
  icon?: ReactNode;
  parentId: string;
  onClose?: () => void;
  initialValue?: string;
  onCreate?: (folder: GQLFolder, parentId: string) => void;
  className?: string;
}

const NewFolder = ({
  icon,
  parentId,
  onClose,
  initialValue = '',
  onCreate,
  className,
}: Props) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState('');
  const { folders } = useFolders();
  const { cache } = useApolloClient();
  const siblings = useMemo(
    () =>
      parentId !== 'folders'
        ? getFolder(cache, parentId)?.subfolders ?? []
        : folders,
    [parentId, cache, folders],
  );
  const siblingNames = siblings.map(sib => sib.name.toLowerCase());
  const { addFolder, loading } = useAddFolderMutation();
  const { t } = useTranslation();
  const { t: validateT } = useValidationTranslation();

  const onSave = async () => {
    if (error) {
      return;
    }
    const res = await addFolder({
      variables: {
        parentId: parentId === 'folders' ? undefined : parentId,
        name,
      },
    });
    if (res.data?.addFolder) {
      onCreate?.({ ...res.data.addFolder, subfolders: [] }, parentId);
      onClose?.();
    }
  };

  useEffect(() => {
    if (name.length === 0) {
      setError(validateT({ field: 'name', type: 'required' }));
    } else if (siblingNames.includes(name.toLowerCase())) {
      setError(validateT({ type: 'notUnique' }));
    } else if (name.length > 64) {
      setError(
        validateT({
          type: 'maxLength',
          field: 'name',
          vars: { count: 64 },
        }),
      );
    } else {
      setError('');
    }
  }, [name, validateT, siblingNames]);

  return (
    <FolderInput
      className={className}
      autoFocus
      labelHidden
      name="name"
      label={t('treeStructure.newFolder.folderName')}
      placeholder={t('treeStructure.newFolder.placeholder')}
      loading={loading}
      onClose={onClose}
      onSave={onSave}
      error={error}
      value={name}
      before={icon}
      onChange={e => {
        if (!loading) {
          setName(e.currentTarget.value);
        }
      }}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose?.();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          onSave();
        }
      }}
    />
  );
};

export default memo(NewFolder);

/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from '@ndla/icons/action';
import { ArenaFormValues } from './components/ArenaForm';
import { ArenaTextModalContent } from './components/ArenaTextModal';
import SettingsMenu, { MenuItemProps } from '../components/SettingsMenu';

interface ArenaActionsProps {
  text: string;
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
}

const ArenaActions = ({ text, onSave }: ArenaActionsProps) => {
  const { t } = useTranslation();

  const actionItems: MenuItemProps[] = useMemo(() => {
    const action: MenuItemProps = {
      icon: <Plus />,
      isModal: true,
      text,
      modalContent: (close) => (
        <ArenaTextModalContent onClose={close} type="topic" onSave={onSave} />
      ),
    };
    return [action];
  }, [text, onSave]);

  return (
    <SettingsMenu menuItems={actionItems} modalHeader={t('myNdla.tools')} />
  );
};

export default ArenaActions;

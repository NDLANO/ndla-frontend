/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, ReactNode, useState } from 'react';
import { getCookie, setCookie } from '@ndla/util';
import { ViewType } from '../containers/MyNdla/Folders/FoldersPage';
import { STORED_USER_SETTINGS } from '../constants';

interface Settings {
  folderViewType?: ViewType;
}

interface Context {
  userSettings: Settings;
  updateSettings: <T extends keyof Settings>(
    key: T,
    value: NonNullable<Settings[T]>,
  ) => void;
  deleteSetting: (key: keyof Settings) => void;
}

export const UserPreferenceContext = createContext<Context>({
  userSettings: {},
  updateSettings: () => {},
  deleteSetting: () => {},
});

const getDefaultSettings = (cookie?: string): Settings => {
  try {
    const stringified = cookie && getCookie(STORED_USER_SETTINGS, cookie);
    if (stringified) {
      return JSON.parse(stringified) as Settings;
    }
    return {};
  } catch {
    console.error(
      'Failed reading usersettings from cookie. Try clearing your cache.',
    );
    return {};
  }
};

interface Props {
  children: ReactNode;
  initialValue?: string;
}

const UserPreferenceProvider = ({ children, initialValue }: Props) => {
  const [userSettings, setUserSettings] = useState(
    getDefaultSettings(initialValue),
  );

  const updateSettings = <T extends keyof Settings>(
    key: T,
    value: NonNullable<Settings[T]>,
  ) => {
    const newSettings = { ...userSettings, [key]: value };

    setCookie({
      cookieName: STORED_USER_SETTINGS,
      cookieValue: JSON.stringify(newSettings),
    });
    setUserSettings(newSettings);
  };

  const deleteSetting = (key: keyof Settings) => {
    const newSettings = { ...userSettings };
    delete newSettings[key];

    setCookie({
      cookieName: STORED_USER_SETTINGS,
      cookieValue: JSON.stringify(newSettings),
    });
    setUserSettings({
      ...userSettings,
    });
  };

  return (
    <UserPreferenceContext.Provider
      value={{ userSettings, updateSettings, deleteSetting }}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export default UserPreferenceProvider;

/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { colors, fonts, misc, spacing } from '@ndla/core';
import { Heading, Text } from '@ndla/typography';
import { RadioButtonGroup } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { FeideUserApiType } from '../../../../interfaces';
import { isStudent } from '../../Folders/util';
import {
  usePersonalData,
  useUpdatePersonalData,
} from '../../../MyNdla/userMutations';

type MyPreferencesProps = {
  user: FeideUserApiType | undefined;
};

const PreferenceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  max-width: 700px;
`;

const DisclaimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledRadioButtonGroup = styled(RadioButtonGroup)`
  gap: 0px;
  max-width: 380px;
  padding: 0;
  > div {
    box-sizing: content-box;
    border: 1px solid ${colors.brand.greyLight};
    padding: ${spacing.small} ${spacing.normal};
    border-color: ${colors.brand.light};
    &:focus-within,
    &[data-state='checked'] {
      outline: 0px;
      border-color: ${colors.brand.primary};
      border-radius: 0px;
      z-index: 1;
    }
    &:first-of-type {
      border-top-left-radius: ${misc.borderRadius};
      border-top-right-radius: ${misc.borderRadius};
    }
    &:not(:first-of-type) {
      margin-top: -1px;
    }
    &:last-of-type {
      border-bottom-left-radius: ${misc.borderRadius};
      border-bottom-right-radius: ${misc.borderRadius};
    }
    > label {
      ${fonts.sizes('16px', '24px')}
      font-weight: ${fonts.weight.semibold};
    }
  }
`;

const MyPreferences = ({ user }: MyPreferencesProps) => {
  const [userPreference, setUserPreference] = useState<string | undefined>();
  const { t } = useTranslation();
  const { personalData, fetch: fetchPersonalData } = usePersonalData();
  const { updatePersonalData } = useUpdatePersonalData();

  const setUserPref = async (value: string) => {
    setUserPreference(value);
    const newPref = value === 'showName' ? true : false;
    await updatePersonalData({
      variables: { favoriteSubjects: undefined, shareName: newPref },
    });
  };

  useEffect(() => {
    fetchPersonalData();
    setUserPreference(personalData?.shareName ? 'showName' : 'dontShowName');
  }, [user, personalData?.shareName, fetchPersonalData]);

  const userRole = () => {
    return isStudent(user) ? 'student' : 'employee';
  };

  return (
    <PreferenceContainer>
      <DisclaimerContainer>
        <Heading
          element="h2"
          id="myProfileTitle"
          margin="none"
          headingStyle="h2"
        >
          {t(`myNdla.myProfile.disclaimerTitle.${userRole()}`)}
        </Heading>
        <Text element="p" textStyle="content-alt" margin="none">
          {t(`myNdla.myProfile.disclaimerText.${userRole()}`)}
        </Text>
      </DisclaimerContainer>
      {!isStudent(user) && (
        <>
          <OptionContainer>
            <Heading
              element="h2"
              id="myProfileTitle"
              margin="none"
              headingStyle="h2"
            >
              {t('myNdla.myProfile.preferenceTitle')}
            </Heading>
            <Text element="p" textStyle="content-alt" margin="none">
              {t('myNdla.myProfile.preferenceText')}
            </Text>
          </OptionContainer>
          <StyledRadioButtonGroup
            options={[
              {
                title: t('myNdla.myProfile.namePreference.showName'),
                value: 'showName',
              },
              {
                title: t('myNdla.myProfile.namePreference.dontShowName'),
                value: 'dontShowName',
              },
            ]}
            direction="vertical"
            uniqeIds
            selected={userPreference}
            onChange={(value) => {
              setUserPref(value);
            }}
          />
        </>
      )}
    </PreferenceContainer>
  );
};

export default MyPreferences;

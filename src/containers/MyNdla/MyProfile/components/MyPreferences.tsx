/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { colors, fonts, misc, spacing } from '@ndla/core';
import { Heading } from '@ndla/typography';
import { RadioButtonGroup } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { FeideUserApiType } from '../../../../interfaces';
import { isStudent } from '../../Folders/util';

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

const StyledH2Heading = styled(Heading)`
  ${fonts.sizes('22px', '33px')}
`;

const StyledText = styled.p`
  margin: 0;
  ${fonts.sizes('18px', '29px')}
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
    border-radius: ${misc.borderRadius};
    border: 1px solid ${colors.brand.greyLight};
    border-radius: 0px;
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
  const [_userPreference, setUserPreference] = useState<string>('showName');
  const { t } = useTranslation();

  return (
    <PreferenceContainer>
      <DisclaimerContainer>
        <StyledH2Heading
          element="h2"
          id="myProfileTitle"
          margin="none"
          headingStyle="default"
        >
          {t(
            `myNdla.myProfile.disclaimerTitle.${
              isStudent(user) ? 'student' : 'employee'
            }`,
          )}
        </StyledH2Heading>
        <StyledText>
          {t(
            `myNdla.myProfile.disclaimerText.${
              isStudent(user) ? 'student' : 'employee'
            }`,
          )}
        </StyledText>
      </DisclaimerContainer>
      {!isStudent(user) && (
        <>
          <OptionContainer>
            <StyledH2Heading
              element="h2"
              id="myProfileTitle"
              margin="none"
              headingStyle="default"
            >
              {t('myNdla.myProfile.preferenceTitle')}
            </StyledH2Heading>
            <StyledText>{t('myNdla.myProfile.preferenceText')}</StyledText>
          </OptionContainer>
          <StyledRadioButtonGroup
            options={[
              {
                title: t('myNdla.myProfile.radioButtonText.option1'),
                value: 'showName',
              },
              {
                title: t('myNdla.myProfile.radioButtonText.option2'),
                value: 'dontShowName',
              },
            ]}
            direction="vertical"
            uniqeIds
            onChange={(value) => {
              setUserPreference(value);
            }}
          />
        </>
      )}
    </PreferenceContainer>
  );
};

export default MyPreferences;

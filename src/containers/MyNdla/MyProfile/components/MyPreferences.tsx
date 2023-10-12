/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { Heading } from '@ndla/typography';
import { RadioButtonGroup } from '@ndla/ui';
import { useTranslation } from 'react-i18next';

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

const SelectOtionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const MyPreferences = () => {
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
          {t('myndla.myProfile.disclaimerTitle')}
        </StyledH2Heading>
        <StyledText>{t('myndla.myProfile.disclaimerText')}</StyledText>
      </DisclaimerContainer>
      <OptionContainer>
        <StyledH2Heading
          element="h2"
          id="myProfileTitle"
          margin="none"
          headingStyle="default"
        >
          {t('myndla.myProfile.preferenceTitle')}
        </StyledH2Heading>
        <StyledText>{t('myndla.myProfile.preferenceText')}</StyledText>
      </OptionContainer>
      <SelectOtionContainer>
        <RadioButtonGroup
          options={[
            {
              title: 'Vis navnet mitt når jeg deler en mappe',
              value: 'showName',
            },
            {
              title: 'Ikke vis navnet mitt når jeg deler en mappe        ',
              value: 'dontShowName',
            },
          ]}
          onChange={(value) => {
            setUserPreference(value);
          }}
        />
      </SelectOtionContainer>
    </PreferenceContainer>
  );
};

export default MyPreferences;

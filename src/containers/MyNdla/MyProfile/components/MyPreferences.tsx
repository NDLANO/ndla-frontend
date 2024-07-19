/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, misc, spacing, stackOrder } from "@ndla/core";
import { Fieldset, FormControl, Label, Legend, RadioButtonGroup, RadioButtonItem } from "@ndla/forms";
import { Heading, Text } from "@ndla/typography";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyNdlaPersonalDataFragmentFragment } from "../../../../graphqlTypes";
import { useUpdatePersonalData } from "../../../MyNdla/userMutations";
import { isStudent } from "../../Folders/util";

type MyPreferencesProps = {
  user: GQLMyNdlaPersonalDataFragmentFragment;
};

const PreferenceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  max-width: ${misc.maxTextWidth};
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
  max-width: 400px;
  padding: 0;
`;

const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  flex-direction: row;
  color: ${colors.brand.primary};
  position: relative;
  border: 1px solid ${colors.brand.greyLight};
  padding: ${spacing.small} ${spacing.normal};
  border-color: ${colors.brand.light};
  &:focus-within,
  &[data-state="checked"] {
    border-color: ${colors.brand.primary};
    z-index: ${stackOrder.offsetSingle};
  }
  &:first-of-type {
    border-radius: ${misc.borderRadius} ${misc.borderRadius} 0px 0px;
  }
  &:not(:first-of-type) {
    margin-top: -1px;
  }
  &:last-of-type {
    border-radius: 0px 0px ${misc.borderRadius} ${misc.borderRadius};
  }
`;

const MyPreferences = ({ user }: MyPreferencesProps) => {
  const { t } = useTranslation();
  const { updatePersonalData } = useUpdatePersonalData();
  const toast = useToast();

  const setUserPref = async (value: string) => {
    const newPref = value === "showName" ? true : false;
    await updatePersonalData({
      variables: { shareName: newPref },
    });
    toast.create({
      title: t(`myNdla.myProfile.namePreference.${newPref ? "onNameShown" : "onNameHidden"}`),
    });
  };

  const preferenceOptions = [
    {
      title: t("myNdla.myProfile.namePreference.showName"),
      value: "showName",
    },
    {
      title: t("myNdla.myProfile.namePreference.dontShowName"),
      value: "dontShowName",
    },
  ];

  return (
    <PreferenceContainer>
      <DisclaimerContainer>
        <Heading element="h2" id="myProfileTitle" margin="none" headingStyle="h2">
          {t(`myNdla.myProfile.disclaimerTitle.${user.role}`)}
        </Heading>
        <Text element="p" textStyle="content-alt" margin="none">
          {t(`myNdla.myProfile.disclaimerText.${user.role}`)}
        </Text>
      </DisclaimerContainer>
      {!isStudent(user) && (
        <>
          <OptionContainer>
            <Heading element="h2" id="myProfileTitle" margin="none" headingStyle="h2">
              {t("myNdla.myProfile.preferenceTitle")}
            </Heading>
            <Text element="p" textStyle="content-alt" margin="none">
              {t("myNdla.myProfile.preferenceText")}
            </Text>
          </OptionContainer>
          <form>
            <FormControl id="nameControl">
              <StyledRadioButtonGroup
                onValueChange={setUserPref}
                defaultValue={user.shareName ? "showName" : "dontShowName"}
                asChild
              >
                <Fieldset>
                  <Legend visuallyHidden>{t("myNdla.myProfile.preferenceTitle")}</Legend>
                  {preferenceOptions.map((option) => (
                    <RadioButtonWrapper key={option.value}>
                      <RadioButtonItem value={option.value} id={`name-${option.value}`} />
                      <Label margin="none" htmlFor={`name-${option.value}`} textStyle="label-small">
                        {option.title}
                      </Label>
                    </RadioButtonWrapper>
                  ))}
                </Fieldset>
              </StyledRadioButtonGroup>
            </FormControl>
          </form>
        </>
      )}
    </PreferenceContainer>
  );
};

export default MyPreferences;

/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { misc, spacing } from "@ndla/core";
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ndla/primitives";
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

const MyPreferences = ({ user }: MyPreferencesProps) => {
  const { t } = useTranslation();
  const { updatePersonalData } = useUpdatePersonalData();
  const toast = useToast();

  const setUserPref = async (value: string) => {
    const newPref = value === "showName";
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
            {/* TODO: Do optimistic update and revert if it fails */}
            <RadioGroupRoot
              orientation="vertical"
              defaultValue={user.shareName ? "showName" : "dontShowName"}
              onValueChange={(v) => setUserPref(v.value)}
            >
              <RadioGroupLabel srOnly>{t("myNdla.myProfile.preferenceTitle")}</RadioGroupLabel>
              {preferenceOptions.map((option) => (
                <RadioGroupItem value={option.value} key={option.value}>
                  <RadioGroupItemControl />
                  <RadioGroupItemText>{option.title}</RadioGroupItemText>
                  <RadioGroupItemHiddenInput />
                </RadioGroupItem>
              ))}
            </RadioGroupRoot>
          </form>
        </>
      )}
    </PreferenceContainer>
  );
};

export default MyPreferences;

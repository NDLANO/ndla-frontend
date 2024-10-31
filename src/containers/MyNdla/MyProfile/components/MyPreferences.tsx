/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Heading,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyNdlaPersonalDataFragmentFragment } from "../../../../graphqlTypes";
import { useUpdatePersonalData } from "../../../MyNdla/userMutations";
import { isStudent } from "../../Folders/util";

type MyPreferencesProps = {
  user: GQLMyNdlaPersonalDataFragmentFragment;
};

const PreferenceContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
    maxWidth: "surface.xlarge",
  },
});

const DisclaimerContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const OptionContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

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
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t(`myNdla.myProfile.disclaimerTitle.${user.role}`)}</h2>
        </Heading>
        <Text textStyle="body.large">{t(`myNdla.myProfile.disclaimerText.${user.role}`)}</Text>
      </DisclaimerContainer>
      {!isStudent(user) && (
        <>
          <OptionContainer>
            <Heading textStyle="heading.small" asChild consumeCss>
              <h2>{t("myNdla.myProfile.preferenceTitle")}</h2>
            </Heading>
            <Text textStyle="body.large">{t("myNdla.myProfile.preferenceText")}</Text>
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

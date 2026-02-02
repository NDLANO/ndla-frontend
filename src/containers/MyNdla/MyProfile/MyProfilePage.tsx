/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Heading,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { MyNdlaTitle } from "../../../components/MyNdla/MyNdlaTitle";
import { PageTitle } from "../../../components/PageTitle";
import { useDeletePersonalData } from "../../../mutations/userMutations";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyContactArea } from "../components/MyContactArea";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";
import { UserInfo } from "../components/UserInfo";

const InfoContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    maxWidth: "surface.xlarge",
  },
});

const HeadingWrapper = styled("div", {
  base: {
    alignItems: "baseline",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const DisclaimerContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    maxWidth: "surface.xlarge",
  },
});

export const Component = () => {
  return <PrivateRoute element={<MyProfilePage />} />;
};

export const MyProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const { deletePersonalData } = useDeletePersonalData();
  const logoutPath = useHref("/logout?returnTo=/");

  const onDeleteAccount = async () => {
    await deletePersonalData();
    window.location.href = logoutPath;
  };

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={t("myNdla.myProfile.title")} />
      <MyNdlaTitle title={t("myNdla.myProfile.title")} />
      <MyContactArea
        user={{
          username: user?.username,
          displayName: user?.displayName,
          role: user?.role,
          primaryOrg: user?.groups.find((g) => g.isPrimarySchool)?.displayName ?? user?.organization,
        }}
      />
      {!!user && (
        <DisclaimerContainer>
          <Heading textStyle="heading.small" asChild consumeCss>
            <h2>{t(`myNdla.myProfile.disclaimerTitle.${user.role}`)}</h2>
          </Heading>
          <Text textStyle="body.large">{t(`myNdla.myProfile.disclaimerText.${user.role}`)}</Text>
        </DisclaimerContainer>
      )}
      <InfoContainer>
        {!!user && (
          <>
            <HeadingWrapper>
              <Heading textStyle="heading.small" asChild consumeCss>
                <h2>{t("myNdla.myPage.feide")}</h2>
              </Heading>
              <UserInfo user={user} />
            </HeadingWrapper>
            <Text textStyle="body.large">
              {t("user.wrongUserInfoDisclaimer")}
              <SafeLink to="https://feide.no/brukerstotte">feide.no/brukerstotte</SafeLink>
            </Text>
          </>
        )}
        <Text textStyle="body.large">
          {`${t("myNdla.myPage.read.read")} `}
          <SafeLink target="_blank" to={t("myNdla.myPage.privacyLink")}>
            {t("myNdla.myPage.privacy")}
          </SafeLink>
          {`${t("myNdla.myPage.read.our")} `}
        </Text>
      </InfoContainer>
      <Stack gap="medium" align="flex-start">
        <Heading textStyle="heading.small" asChild consumeCss>
          <h2>{t("myNdla.myPage.wishToDelete")}</h2>
        </Heading>
        <DialogRoot>
          <DialogTrigger asChild>
            <Button variant="danger">
              <DeleteBinLine />
              {t("myNdla.myPage.deleteAccount")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("myNdla.myPage.deleteAccount")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <Text>{t("myNdla.myPage.confirmDeleteAccount")}</Text>
            </DialogBody>
            <DialogFooter>
              <DialogCloseTrigger asChild>
                <Button variant="secondary">{t("cancel")}</Button>
              </DialogCloseTrigger>
              <Button variant="danger" onClick={onDeleteAccount}>
                {t("myNdla.myPage.confirmDeleteAccountButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Stack>
    </MyNdlaPageWrapper>
  );
};

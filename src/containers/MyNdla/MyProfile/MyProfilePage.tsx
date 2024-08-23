/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Heading,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import MyPreferences from "./components/MyPreferences";
import { AuthContext } from "../../../components/AuthenticationContext";
import { useBaseName } from "../../../components/BaseNameContext";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { getAllDimensions } from "../../../util/trackingUtil";
import { constructNewPath } from "../../../util/urlHelper";
import MyContactArea from "../components/MyContactArea";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import MyNdlaTitle from "../components/MyNdlaTitle";
import { UserInfo } from "../components/UserInfo";
import InfoPart from "../InfoPart";
import { useDeletePersonalData } from "../userMutations";

const StyledPageContentContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
    marginBlockStart: "medium",
  },
});

const ButtonRow = styled("div", {
  base: {
    display: "flex",
    gap: "xxsmall",
    justifyContent: "flex-end",
  },
});

const InfoContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const ButtonContainer = styled("div", {
  base: {
    alignItems: "baseline",
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const MyProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const basename = useBaseName();
  const { trackPageView } = useTracker();
  const { deletePersonalData } = useDeletePersonalData();

  useEffect(() => {
    trackPageView({
      title: t("htmlTitles.myProfile"),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  const onDeleteAccount = async () => {
    await deletePersonalData();
    window.location.href = constructNewPath(`/logout?state=/`, basename);
  };

  return (
    <MyNdlaPageWrapper>
      <StyledPageContentContainer>
        <HelmetWithTracker title={t("myNdla.myProfile.title")} />
        <MyNdlaTitle title={t("myNdla.myProfile.title")} />
        <MyContactArea
          user={{
            username: user?.username,
            displayName: user?.displayName,
            role: user?.role,
            primaryOrg: user?.groups.find((g) => g.isPrimarySchool)?.displayName ?? user?.organization,
          }}
        />
        {user && <MyPreferences user={user} />}
        <InfoContainer>
          {user && (
            <InfoPart title={t("myNdla.myPage.feide")}>
              <UserInfo user={user} />
              <Text>
                {t("user.wrongUserInfoDisclaimer")}
                <SafeLink to="https://feide.no/brukerstotte">feide.no/brukerstotte</SafeLink>
              </Text>
            </InfoPart>
          )}
          <Text>
            {`${t("myNdla.myPage.read.read")} `}
            <SafeLink target="_blank" to={t("myNdla.myPage.privacyLink")}>
              {t("myNdla.myPage.privacy")}
            </SafeLink>
            {`${t("myNdla.myPage.read.our")} `}
          </Text>
        </InfoContainer>
        <ButtonContainer>
          <Heading id="deleteUserTitle" textStyle="heading.small" asChild consumeCss>
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
                <p>{t("myNdla.myPage.confirmDeleteAccount")}</p>
                <ButtonRow>
                  <DialogCloseTrigger asChild>
                    <Button variant="secondary">{t("cancel")}</Button>
                  </DialogCloseTrigger>
                  <Button variant="danger" onClick={onDeleteAccount}>
                    {t("myNdla.myPage.confirmDeleteAccountButton")}
                  </Button>
                </ButtonRow>
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </ButtonContainer>
      </StyledPageContentContainer>
    </MyNdlaPageWrapper>
  );
};

export default MyProfilePage;

/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import SafeLink from '@ndla/safelink';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  Modal,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { Heading, Text } from '@ndla/typography';
import InfoPart from '../InfoPart';
import { AuthContext } from '../../../components/AuthenticationContext';
import { constructNewPath, toHref } from '../../../util/urlHelper';
import { useBaseName } from '../../../components/BaseNameContext';
import { useDeletePersonalData } from '../userMutations';
import { getAllDimensions } from '../../../util/trackingUtil';
import MyPreferences from './components/MyPreferences';
import MyContactArea from '../components/MyContactArea';
import { UserInfo } from '../components/UserInfo';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaTitle from '../components/MyNdlaTitle';

const StyledPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.normal};
  gap: ${spacing.large};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.small};
  justify-content: flex-end;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: column;
  gap: ${spacing.small};
`;

const MyProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const basename = useBaseName();
  const location = useLocation();
  const { trackPageView } = useTracker();
  const { deletePersonalData } = useDeletePersonalData();

  useEffect(() => {
    trackPageView({
      title: t('htmlTitles.myProfile'),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  const onDeleteAccount = async () => {
    await deletePersonalData();
    window.location.href = constructNewPath(
      `/logout?state=${toHref(location)}`,
      basename,
    );
  };

  return (
    <MyNdlaPageWrapper>
      <StyledPageContentContainer>
        <HelmetWithTracker title={t('myNdla.myProfile.title')} />
        <MyNdlaTitle title={t('myNdla.myProfile.title')} />
        <MyContactArea
          user={{
            username: user?.username,
            displayName: user?.displayName,
            role: user?.role,
            rootOrg: user?.organization,
            primaryOrg: user?.groups.find((g) => g.isPrimarySchool)
              ?.displayName,
          }}
        />
        <MyPreferences user={user} />
        <InfoContainer>
          {user && (
            <InfoPart title={t('myNdla.myPage.feide')}>
              <UserInfo user={user} />
              <Text element="p" textStyle="content-alt" margin="none">
                {t('user.wrongUserInfoDisclaimer')}
                <SafeLink to="https://feide.no/brukerstotte">
                  feide.no/brukerstotte
                </SafeLink>
              </Text>
            </InfoPart>
          )}
          <Text element="p" textStyle="content-alt" margin="none">
            {`${t('myNdla.myPage.read.read')} `}
            <SafeLink target="_blank" to={t('myNdla.myPage.privacyLink')}>
              {t('myNdla.myPage.privacy')}
            </SafeLink>
            {`${t('myNdla.myPage.read.our')} `}
          </Text>
        </InfoContainer>
        <ButtonContainer>
          <Heading
            element="h2"
            id="deleteUserTitle"
            margin="none"
            headingStyle="h2"
          >
            {t('myNdla.myPage.wishToDelete')}
          </Heading>
          <Modal>
            <ModalTrigger>
              <ButtonV2 colorTheme="danger" variant="outline">
                {t('myNdla.myPage.deleteAccount')}
              </ButtonV2>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>{t('myNdla.myPage.deleteAccount')}</ModalTitle>
                <ModalCloseButton title={t('modal.closeModal')} />
              </ModalHeader>
              <ModalBody>
                <p>{t('myNdla.myPage.confirmDeleteAccount')}</p>
                <ButtonRow>
                  <ModalCloseButton>
                    <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
                  </ModalCloseButton>
                  <ButtonV2
                    colorTheme="danger"
                    variant="outline"
                    onClick={onDeleteAccount}
                  >
                    {t('myNdla.myPage.confirmDeleteAccountButton')}
                  </ButtonV2>
                </ButtonRow>
              </ModalBody>
            </ModalContent>
          </Modal>
        </ButtonContainer>
      </StyledPageContentContainer>
    </MyNdlaPageWrapper>
  );
};

export default MyProfilePage;

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
import { breakpoints, fonts, mq, spacing } from '@ndla/core';
import { UserInfo } from '@ndla/ui';
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
import { Heading } from '@ndla/typography';
import InfoPart from '../InfoSection';
import { AuthContext } from '../../../components/AuthenticationContext';
import { constructNewPath, toHref } from '../../../util/urlHelper';
import { useBaseName } from '../../../components/BaseNameContext';
import { useDeletePersonalData } from '../userMutations';
import { getAllDimensions } from '../../../util/trackingUtil';
import MyPreferences from './MyPreferences';
import MyContactArea from './MyContactArea';

const StyledPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.normal};
  gap: ${spacing.large};
`;

const StyledHeading = styled(Heading)`
  ${fonts.sizes('30px', '36px')}
  font-weight: ${fonts.weight.bold};
  ${mq.range({ from: breakpoints.tablet })} {
    ${fonts.sizes('38px', '48px')}
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.small};
  justify-content: flex-end;
`;

const LinkText = styled.p`
  margin: 0;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: column;
  gap: ${spacing.small};
  padding-bottom: ${spacing.normal};
`;

const StyledDeleteUserHeading = styled(Heading)`
  ${fonts.sizes('22px', '33px')}
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
    <StyledPageContentContainer>
      <HelmetWithTracker title={t('htmlTitles.myProfile')} />
      <StyledHeading
        element="h1"
        id="myProfileTitle"
        margin="none"
        headingStyle="default"
      >
        {t('myndla.myProfile.title')}
      </StyledHeading>
      <MyContactArea user={user} />
      <MyPreferences />
      {user && (
        <InfoPart title={t('myNdla.myPage.feide')} icon={''}>
          <UserInfo user={user} />
          <p>
            {t('user.wrongUserInfoDisclaimer')}
            <SafeLink to="https://feide.no/brukerstotte">
              feide.no/brukerstotte
            </SafeLink>
          </p>
        </InfoPart>
      )}
      <InfoContainer>
        <LinkText>
          {`${t('myNdla.myPage.questions.question')} `}
          <ButtonV2
            variant="link"
            onClick={() => document.getElementById('zendesk')?.click()} //ny link
          >
            {t('myNdla.myPage.questions.ask')} {/*Ny tekst */}
          </ButtonV2>
        </LinkText>
      </InfoContainer>
      <ButtonContainer>
        <StyledDeleteUserHeading
          element="h2"
          id="deleteUserTitle"
          margin="none"
          headingStyle="default"
        >
          {t('myNdla.myPage.wishToDelete')}
        </StyledDeleteUserHeading>
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
  );
};

export default MyProfilePage;

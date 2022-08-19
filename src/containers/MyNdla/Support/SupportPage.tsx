/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { HeartOutline } from '@ndla/icons/action';
import { Back, Feide, HashTag, InformationOutline } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/lib/contentType';
import SafeLink from '@ndla/safelink';
import { HelmetWithTracker } from '@ndla/tracker';
import { UserInfo } from '@ndla/ui';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../components/AuthenticationContext';
import TermsOfService from '../../../components/MyNdla/TermsOfService';
import IsMobileContext from '../../../IsMobileContext';
import InfoPart, { InfoPartIcon, InfoPartText } from '../InfoSection';

const StyledPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled.div`
  display: flex;
  padding: ${spacing.medium} 0;
  flex-direction: column;
  gap: ${spacing.small};
`;

const LinkText = styled.p`
  margin: 0;
`;

const HeartOutlineIcon = InfoPartIcon.withComponent(HeartOutline);
const FolderOutlinedIcon = InfoPartIcon.withComponent(FolderOutlined);
const HashTagIcon = InfoPartIcon.withComponent(HashTag);
const FeideIcon = InfoPartIcon.withComponent(Feide);
const TermsIcon = InfoPartIcon.withComponent(InformationOutline);

const MobileTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  h1 {
    margin: 0;
  }
`;

const StyledSafeLink = styled(SafeLink)`
  color: ${colors.brand.primary};
  box-shadow: none;
  svg {
    width: 22px;
    height: 22px;
  }
`;

const SupportPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const isMobile = useContext(IsMobileContext);

  return (
    <StyledPageContentContainer>
      <HelmetWithTracker title={t('htmlTitles.myNdlaPage')} />
      {isMobile ? (
        <MobileTitle>
          <StyledSafeLink to="/minndla/meny">
            <Back />
          </StyledSafeLink>
          <h1>{t('myNdla.support')}</h1>
        </MobileTitle>
      ) : (
        <h1>{t('myNdla.support')}</h1>
      )}
      {user && (
        <InfoPart
          icon={<FeideIcon />}
          title={t('myNdla.myPage.feide')}
          children={<UserInfo user={user} />}
        />
      )}
      <InfoPart
        icon={<HeartOutlineIcon />}
        title={t('myNdla.myPage.storageInfo.title')}
        children={
          <InfoPartText>{t('myNdla.myPage.storageInfo.text')}</InfoPartText>
        }
      />
      <InfoPart
        icon={<FolderOutlinedIcon />}
        title={t('myNdla.myPage.folderInfo.title')}
        children={
          <InfoPartText>{t('myNdla.myPage.folderInfo.text')}</InfoPartText>
        }
      />
      <InfoPart
        icon={<HashTagIcon />}
        title={t('myNdla.myPage.tagInfo.title')}
        children={
          <InfoPartText>{t('myNdla.myPage.tagInfo.text')}</InfoPartText>
        }
      />
      <InfoPart
        icon={<TermsIcon />}
        title={t('myNdla.myPage.terms.terms')}
        children={<TermsOfService />}
      />
      <InfoContainer>
        <LinkText>
          {`${t('myNdla.myPage.read.our')} `}
          <SafeLink target="_blank" to="https://om.ndla.no/gdpr">
            {t('myNdla.myPage.privacy')}
          </SafeLink>
        </LinkText>
        <LinkText>
          {`${t('myNdla.myPage.questions.question')} `}
          <Button
            link
            onClick={() => document.getElementById('zendesk')?.click()}>
            {t('myNdla.myPage.questions.ask')}
          </Button>
        </LinkText>
      </InfoContainer>
    </StyledPageContentContainer>
  );
};

export default SupportPage;

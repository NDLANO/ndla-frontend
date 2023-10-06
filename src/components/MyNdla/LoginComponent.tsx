/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { mq, breakpoints, fonts, spacing } from '@ndla/core';
import { Feide } from '@ndla/icons/common';
import SafeLink, { SafeLinkButton } from '@ndla/safelink';
import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ModalCloseButton } from '@ndla/modal';
import { Heading, Text } from '@ndla/typography';
import { toHref } from '../../util/urlHelper';

const LoginComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const FeideRow = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
  align-items: center;
  font-weight: ${fonts.weight.semibold};
  svg {
    color: #204598;
    width: 30px;
    height: 30px;
  }
`;

const BottomRow = styled.div`
  display: flex;
  gap: ${spacing.small};
  justify-content: space-between;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  align-items: center;
  ${mq.range({ until: breakpoints.tablet })} {
    grid-template-columns: 70% 30%;
  }
`;

const StyledImage = styled.img`
  aspect-ratio: 1 / 1;
  object-fit: cover;
  width: 100%;
  border-radius: 50%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface Props {
  masthead?: boolean;
  content?: ReactNode;
}

const LoginComponent = ({ masthead, content }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <LoginComponentContainer>
      {!content && (
        <TitleRow>
          <Heading headingStyle="h2" element="h2">
            <Trans t={t} i18nKey="myNdla.myPage.loginWelcome" />
          </Heading>
          <StyledImage
            src="/static/my-ndla-login.png"
            alt={t('myNdla.myPage.imageAlt')}
          />
        </TitleRow>
      )}
      {content}
      <ContentWrapper>
        <Text textStyle="meta-text-large">
          {t('myNdla.myPage.loginText')}
          <SafeLink target="_blank" to="https://om.ndla.no/gdpr">
            {t('myNdla.myPage.loginTextLink')}
          </SafeLink>
        </Text>
      </ContentWrapper>
      <BottomRow>
        <FeideRow>
          <Feide />
          Feide
        </FeideRow>
        <ButtonRow>
          <ModalCloseButton>
            <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
          </ModalCloseButton>
          <SafeLinkButton
            reloadDocument
            to={`/login?state=${masthead ? '/minndla' : toHref(location)}`}
          >
            {t('user.buttonLogIn')}
          </SafeLinkButton>
        </ButtonRow>
      </BottomRow>
    </LoginComponentContainer>
  );
};

export default LoginComponent;

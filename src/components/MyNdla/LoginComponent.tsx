/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { mq, breakpoints, fonts, spacing } from '@ndla/core';
import { Feide } from '@ndla/icons/common';
import SafeLink, { SafeLinkButton } from '@ndla/safelink';
import { ListResource } from '@ndla/ui';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { GQLFolderResourceMetaFragment } from '../../graphqlTypes';
import { toHref } from '../../util/urlHelper';
import { ResourceAttributes } from './AddResourceToFolder';

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

const Title = styled.h1`
  ${fonts.sizes('30px')};
  ${mq.range({ until: breakpoints.tablet })} {
    ${fonts.sizes('20px')};
  }
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
  onClose: () => void;
  masthead?: boolean;
  resource?: ResourceAttributes;
  meta?: GQLFolderResourceMetaFragment;
}

const LoginComponent = ({ resource, meta, masthead, onClose }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <LoginComponentContainer>
      <TitleRow>
        {resource ? (
          <Title>{t('myNdla.myPage.loginResourcePitch')}</Title>
        ) : (
          <>
            <Title>
              <Trans t={t} i18nKey="myNdla.myPage.loginWelcome" />
            </Title>
            <StyledImage
              src="/static/my-ndla-login.png"
              alt={t('myNdla.myPage.imageAlt')}
            />
          </>
        )}
      </TitleRow>
      {resource && meta && (
        <ContentWrapper>
          <ListResource
            id={resource.id.toString()}
            tagLinkPrefix="/minndla/tags"
            link={resource.path}
            title={meta.title}
            resourceImage={{
              src: meta.metaImage?.url ?? '',
              alt: meta.metaImage?.alt ?? '',
            }}
            resourceTypes={meta.resourceTypes}
          />
        </ContentWrapper>
      )}
      <ContentWrapper>
        <p>
          {t('myNdla.myPage.loginText')}
          <SafeLink target="_blank" to="https://om.ndla.no/gdpr">
            {t('myNdla.myPage.loginTextLink')}
          </SafeLink>
        </p>
      </ContentWrapper>
      <BottomRow>
        <FeideRow>
          <Feide />
          Feide
        </FeideRow>
        <ButtonRow>
          <Button onClick={onClose} outline>
            {t('cancel')}
          </Button>
          <SafeLinkButton
            reloadDocument
            to={`/login?state=${masthead ? '/minndla' : toHref(location)}`}>
            {t('user.buttonLogIn')}
          </SafeLinkButton>
        </ButtonRow>
      </BottomRow>
    </LoginComponentContainer>
  );
};

export default LoginComponent;

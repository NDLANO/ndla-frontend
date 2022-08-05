/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { fonts, spacing } from '@ndla/core';
import { Feide } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
import { ListResource } from '@ndla/ui';
import { Trans, useTranslation } from 'react-i18next';
import { GQLFolderResourceMetaFragment } from '../../graphqlTypes';
import { ResourceAttributes } from './AddResourceToFolder';
import TermsOfService from './TermsOfService';

const LoginComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing.normal};
  gap: ${spacing.small};
`;

const FeideRow = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
  align-items: center;
  font-weight: ${fonts.weight.semibold};
  svg {
    width: 22px;
    height: 22px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.small};
  justify-content: flex-end;
`;

const TitleRow = styled.div`
  display: flex;
`;

const StyledDescription = styled.p`
  margin: 0;
`;

const StyledImage = styled.img`
  height: 160px;
  min-width: 160px;
  width: 160px;
  border-radius: 50%;
`;

const StyledTermsTitle = styled.h2`
  && {
    margin: 0;
  }
`;

interface Props {
  onClose: () => void;
  resource?: ResourceAttributes;
  meta?: GQLFolderResourceMetaFragment;
  to?: string;
}

const LoginComponent = ({ resource, meta, onClose, to = '/login' }: Props) => {
  const { t } = useTranslation();
  return (
    <LoginComponentContainer>
      <TitleRow>
        <h1>
          <Trans t={t} i18nKey="myNdla.myPage.loginWelcome" />
        </h1>
        <StyledImage src="/static/my-ndla-login.png" />
      </TitleRow>
      {resource && meta && (
        <>
          <span>{t('myNdla.myPage.loginResourcePitch')}</span>
          <ListResource
            tagLinkPrefix="/minndla/tags"
            link={resource.path}
            title={meta.title}
            resourceImage={{
              src: meta.metaImage?.url ?? '',
              alt: meta.metaImage?.alt ?? '',
            }}
            topics={meta.resourceTypes.map(rt => rt.name)}
            description={meta.description}
          />
        </>
      )}
      <FeideRow>
        <Feide />
        Feide
      </FeideRow>
      <StyledDescription>{t('myNdla.myPage.loginTerms')}</StyledDescription>
      <StyledTermsTitle>{t('myNdla.myPage.terms.terms')}</StyledTermsTitle>
      <TermsOfService />
      <ButtonRow>
        <Button onClick={onClose} outline>
          {t('cancel')}
        </Button>
        <SafeLinkButton to={to}>{t('user.buttonLogIn')}</SafeLinkButton>
      </ButtonRow>
    </LoginComponentContainer>
  );
};

export default LoginComponent;

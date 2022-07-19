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
import { useTranslation } from 'react-i18next';
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
  gap: ${spacing.small};
`;

const StyledImage = styled.img`
  height: 160px;
  min-height: 160px;
  min-width: 160px;
  max-width: 160px;
  border-radius: 50%;
`;

const StyledTermsTitle = styled.h2`
  margin: 0 !important;
`;

interface Props {
  onClose: () => void;
  resource?: ResourceAttributes;
  meta?: GQLFolderResourceMetaFragment;
}

const LoginComponent = ({ resource, meta, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <LoginComponentContainer>
      <TitleRow>
        <h1>
          Velkommen til Min NDLA! Her kan du organisere fagstoffet på <i>din</i>{' '}
          måte!
        </h1>
        <StyledImage src="/static/my-ndla-login.png" />
      </TitleRow>
      {resource && meta && (
        <>
          Ønsker du å favorittmerke denne siden?
          <ListResource
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
      <StyledDescription>
        Logg på med Feide for å få tilgang. Ved å logge på godkjenner du våre
        vilkår for bruk
      </StyledDescription>
      <StyledTermsTitle>{t('myNdla.myPage.terms.terms')}</StyledTermsTitle>
      <TermsOfService />
      <ButtonRow>
        <Button onClick={onClose} outline>
          {t('cancel')}
        </Button>
        <SafeLinkButton to="/login">{t('user.buttonLogIn')}</SafeLinkButton>
      </ButtonRow>
    </LoginComponentContainer>
  );
};

export default LoginComponent;

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { fonts, spacing } from '@ndla/core';
import { Feide } from '@ndla/icons/lib/common';
import { SafeLinkButton } from '@ndla/safelink';
import { ListResource } from '@ndla/ui';
import { GQLFolderResourceMetaFragment } from '../../graphqlTypes';
import { ResourceAttributes } from './AddResourceToFolder';

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

interface Props {
  onClose: () => void;
  resource?: ResourceAttributes;
  meta?: GQLFolderResourceMetaFragment;
}

const LoginComponent = ({ resource, meta, onClose }: Props) => {
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
        Logg på med Feide for å få tilgang. Ved å logge på godkjenner du våre{' '}
        <a href="/">vilkår for bruk</a>
      </StyledDescription>
      <ButtonRow>
        <Button onClick={onClose} outline>
          Avbryt
        </Button>
        <SafeLinkButton to="/login">Logg på med Feide</SafeLinkButton>
      </ButtonRow>
    </LoginComponentContainer>
  );
};

export default LoginComponent;

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Status } from './interfaces';

const types: Status[] = ['all', 'active', 'archived', 'beta'];

interface Props {
  value: Status;
  onChange: (status: Status) => void;
}

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  border-radius: 8px;
  background: ${colors.brand.greyLightest};
  border: 1px solid ${colors.brand.tertiary};
  align-self: flex-start;
`;

const StatusFilter = ({ value, onChange }: Props) => {
  return (
    <ButtonContainer>
      {types.map(type => (
        <ButtonV2
          variant={value === type ? undefined : 'outline'}
          onClick={() => onChange(type)}
          key={type}>
          {type}
        </ButtonV2>
      ))}
    </ButtonContainer>
  );
};

export default StatusFilter;

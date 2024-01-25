/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { formatDistanceStrict } from 'date-fns';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors, spacing, misc, mq, breakpoints } from '@ndla/core';
import { Switch } from '@ndla/switch';
import { Text } from '@ndla/typography';
import { GQLArenaFlagFragment } from '../../../../graphqlTypes';
import { DateFNSLocales } from '../../../../i18n';
import { formatDateTime } from '../../../../util/formatDate';
import { useResolveFlagMutation } from '../../arenaMutations';
import UserProfileTag from '../../components/UserProfileTag';
import { capitalizeFirstLetter } from '../utils';

interface Props {
  flag: GQLArenaFlagFragment;
}

const FlagCardWrapper = styled.li`
  list-style: none;
  background-color: ${colors.support.yellowLightest};
  border: ${colors.brand.light} solid 1px;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
`;

const FlagHeader = styled.div`
  display: flex;
  justify-content: space-between;
  ${mq.range({ until: breakpoints.desktop })} {
    flex-direction: column-reverse;
  }
`;

const FlagContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} 0;
`;

const StyledSwitch = styled(Switch)`
  align-self: flex-start;
  border: 2px solid transparent;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.desktop })} {
    align-self: flex-end;
    margin-bottom: ${spacing.small};
  }
  &:focus,
  &:focus-visible,
  &:focus-within {
    border-color: ${colors.brand.dark};
  }
`;

const TimestampText = styled(Text)`
  align-self: center;
`;

const FlexLine = styled.div`
  display: flex;
  gap: ${spacing.normal};
  justify-content: space-between;
`;

const TimedistanceField = ({
  date,
  disableCapitalization,
}: {
  date: string;
  disableCapitalization?: boolean;
}) => {
  const { i18n } = useTranslation();

  const timeDistance = formatDistanceStrict(Date.parse(date), Date.now(), {
    addSuffix: true,
    locale: DateFNSLocales[i18n.language],
    roundingMethod: 'floor',
  });

  return (
    <TimestampText element="span" textStyle="content-alt" margin="none">
      <span title={formatDateTime(date, i18n.language)}>
        {disableCapitalization
          ? timeDistance
          : `${capitalizeFirstLetter(timeDistance)}`}
      </span>
    </TimestampText>
  );
};

const FlagCard = ({ flag }: Props) => {
  const { t } = useTranslation();
  const [toggleFlagResolution] = useResolveFlagMutation();

  return (
    <FlagCardWrapper key={flag.id}>
      <FlagHeader>
        <UserProfileTag user={flag.flagger} />
        <StyledSwitch
          onChange={() =>
            toggleFlagResolution({ variables: { flagId: flag.id } })
          }
          checked={flag.isResolved}
          label={t('myNdla.arena.admin.flags.status.resolved')}
          id={t('myNdla.arena.posts.flags.status')}
        />
      </FlagHeader>
      <FlagContentWrapper>{flag.reason}</FlagContentWrapper>
      <FlexLine>
        <TimedistanceField date={flag.created} />
        {flag.resolved && (
          <span>
            {t('myNdla.arena.admin.flags.solvedFor')}{' '}
            <TimedistanceField
              date={flag.resolved}
              disableCapitalization={true}
            />
          </span>
        )}
      </FlexLine>
    </FlagCardWrapper>
  );
};

export default FlagCard;

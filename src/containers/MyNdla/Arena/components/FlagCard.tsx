/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import { useTranslation } from "react-i18next";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GQLArenaFlagFragment } from "../../../../graphqlTypes";
import { DateFNSLocales } from "../../../../i18n";
import { formatDateTime } from "../../../../util/formatDate";
import { useResolveFlagMutation } from "../../arenaMutations";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

interface Props {
  flag: GQLArenaFlagFragment;
}

const FlagCardWrapper = styled("li", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    listStyle: "none",
    background: "background.subtle",
    padding: "xsmall",
    borderRadius: "xsmall",
  },
});

const FlagRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "xsmall",
  },
});

const TimedistanceField = ({ date, disableCapitalization }: { date: string; disableCapitalization?: boolean }) => {
  const { i18n } = useTranslation();

  const timeDistance = formatDistanceStrict(Date.parse(date), Date.now(), {
    addSuffix: true,
    locale: DateFNSLocales[i18n.language],
    roundingMethod: "floor",
  });

  return (
    <Text asChild consumeCss textStyle="body.small">
      <span title={formatDateTime(date, i18n.language)}>
        {disableCapitalization ? timeDistance : `${capitalizeFirstLetter(timeDistance)}`}
      </span>
    </Text>
  );
};

const FlagCard = ({ flag }: Props) => {
  const { t } = useTranslation();
  const [toggleFlagResolution] = useResolveFlagMutation();

  const toggleChecked = () => toggleFlagResolution({ variables: { flagId: flag.id } });

  return (
    <FlagCardWrapper key={flag.id}>
      <FlagRow>
        <UserProfileTag user={flag.flagger} />
        <SwitchRoot checked={flag.isResolved} onCheckedChange={toggleChecked}>
          <SwitchLabel>{t("myNdla.arena.admin.flags.status.resolved")}</SwitchLabel>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </SwitchRoot>
      </FlagRow>
      <Text>{flag.reason}</Text>
      <FlagRow>
        <TimedistanceField date={flag.created} />
        {flag.resolved && (
          <Text textStyle="body.small" asChild consumeCss>
            <span>
              {t("myNdla.arena.admin.flags.solvedFor")}{" "}
              <TimedistanceField date={flag.resolved} disableCapitalization={true} />
            </span>
          </Text>
        )}
      </FlagRow>
    </FlagCardWrapper>
  );
};

export default FlagCard;

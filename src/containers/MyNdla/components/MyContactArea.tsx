/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

type UserProp = {
  username?: string;
  displayName?: string;
  primaryOrg?: string;
  role?: string;
};

type MyContractAreaProps = {
  user: UserProp;
};

const MyContactAreaContainer = styled("div", {
  base: {
    alignItems: "center",
    backgroundColor: "surface.brand.4",
    borderRadius: "medium",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    paddingBlock: "xxlarge",
    paddingInline: "xsmall",
    textAlign: "center",
  },
});

export const MyContactArea = ({ user }: MyContractAreaProps) => {
  return (
    <MyContactAreaContainer>
      <Heading textStyle="heading.medium" asChild consumeCss>
        <h2>{user.displayName}</h2>
      </Heading>
      <Text textStyle="title.medium">{user.primaryOrg}</Text>
      {/* TODO: Vurdere om vi også skal hente fylkesorganisasjonen og legge den her, ref design */}
    </MyContactAreaContainer>
  );
};

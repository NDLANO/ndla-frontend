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
    display: "flex",
    justifyContent: "center",
    background: "linear-gradient(180deg, #E7DAFA 0%, #D8BFF9 84.41%, #C8A4F7 131.5%)",
    color: "text.strong",
    borderRadius: "medium",
    paddingBlock: "xxlarge",
    paddingInline: "xsmall",
    textAlign: "center",
  },
});

const WeirdLine = styled("div", {
  base: {
    position: "relative",
    height: "medium",
    width: "100%",
    _after: {
      content: '""',
      position: "absolute",
      background: "stroke.hover",
      border: "2px solid",
      transform: "rotate(4deg)",
      borderColor: "stroke.hover",
      width: "100%",
      top: "50%",
      left: "0",
    },
  },
});

const ContentContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    width: "max-content",
    textAlign: "center",
  },
});

export const MyContactArea = ({ user }: MyContractAreaProps) => {
  return (
    <MyContactAreaContainer>
      <ContentContainer>
        <Heading textStyle="heading.medium" asChild consumeCss>
          <h2>{user.displayName}</h2>
        </Heading>
        <WeirdLine />
        <Text textStyle="title.medium">{user.primaryOrg}</Text>
        {/* TODO: Vurdere om vi også skal hente fylkesorganisasjonen og legge den her, ref design */}
      </ContentContainer>
    </MyContactAreaContainer>
  );
};

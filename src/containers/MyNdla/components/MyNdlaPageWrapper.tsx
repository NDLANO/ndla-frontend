/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContainerProps, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const PageWrapper = ({ children, ...rest }: PageContainerProps) => {
  return (
    <PageContent variant="wide" gutters="tabletUp" {...rest} asChild consumeCss>
      <main>{children}</main>
    </PageContent>
  );
};

export const MyNdlaPageWrapper = styled(PageWrapper, {
  base: {
    gap: "medium",
  },
});

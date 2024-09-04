/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading } from "@ndla/primitives";
import { SKIP_TO_CONTENT_ID } from "../../../constants";

interface Props {
  title: string;
}

const MyNdlaTitle = ({ title }: Props) => {
  return (
    <Heading textStyle="title.large" id={SKIP_TO_CONTENT_ID}>
      {title}
    </Heading>
  );
};

export default MyNdlaTitle;

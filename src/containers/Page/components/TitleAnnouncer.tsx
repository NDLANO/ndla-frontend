/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOnTopicPage } from '../../../routeHelpers';

const VisuallyHiddenTitle = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const TitleAnnouncer = () => {
  const [title, setTitle] = useState('');
  const prevTitle = useRef(title);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const onTopicPage = useOnTopicPage();

  useEffect(() => {
    if (!!title && title !== prevTitle.current) {
      if (!onTopicPage) {
        titleRef.current?.focus();
      } else prevTitle.current = title;
    }
  }, [title, titleRef, onTopicPage]);

  return (
    <>
      <VisuallyHiddenTitle
        aria-live={onTopicPage ? `assertive` : undefined}
        tabIndex={-1}
        id="titleAnnouncer"
        ref={titleRef}
      >
        {title}
      </VisuallyHiddenTitle>
      <Helmet
        onChangeClientState={(state) => state.title && setTitle(state.title)}
      />
    </>
  );
};

export default TitleAnnouncer;

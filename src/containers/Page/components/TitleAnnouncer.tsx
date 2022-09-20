import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

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
  const titleRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!!title) {
      titleRef.current?.focus();
    }
  }, [title, titleRef]);

  return (
    <>
      <VisuallyHiddenTitle tabIndex={-1} id="titleAnnouncer" ref={titleRef}>
        {title}
      </VisuallyHiddenTitle>
      <Helmet
        onChangeClientState={state => state.title && setTitle(state.title)}
      />
    </>
  );
};

export default TitleAnnouncer;

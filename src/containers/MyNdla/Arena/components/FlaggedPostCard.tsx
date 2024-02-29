/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing, misc, mq, breakpoints } from "@ndla/core";
import { SafeLinkButton } from "@ndla/safelink";
import { Text, Heading } from "@ndla/typography";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import { DateFNSLocales } from "../../../../i18n";
import { myNdlaRoutes } from "../../../../routeHelpers";
import { formatDateTime } from "../../../../util/formatDate";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

interface Props {
  post: GQLArenaPostV2Fragment;
  topic: GQLArenaTopicByIdV2Query["arenaTopicV2"];
}

const PostCardWrapper = styled.div`
  background-color: ${colors.background.lightBlue};
  border: ${colors.brand.light} solid 1px;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  ${mq.range({ until: breakpoints.desktop })} {
    flex-direction: column-reverse;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} 0;
`;

const FlexLine = styled.div`
  display: flex;
  gap: ${spacing.normal};
  justify-content: space-between;
`;

const TimestampText = styled(Text)`
  align-self: center;
`;

const StyledContent = styled(Text)`
  word-wrap: break-word;
`;

const PostCard = ({ topic, post }: Props) => {
  const { id: postId, topicId, created, contentAsHTML } = post;

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const timeDistance = formatDistanceStrict(Date.parse(created), Date.now(), {
    addSuffix: true,
    locale: DateFNSLocales[language],
    roundingMethod: "floor",
  });

  const postTime = (
    <TimestampText element="span" textStyle="content-alt" margin="none">
      <span title={formatDateTime(created, language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
    </TimestampText>
  );

  return (
    <PostCardWrapper id={`post-${postId}`}>
      <PostHeader>
        <UserProfileTag user={post.owner} />
      </PostHeader>
      <ContentWrapper>
        <Heading element="h1" id={SKIP_TO_CONTENT_ID} headingStyle="h4" margin="none">
          {topic?.title}
        </Heading>
        <StyledContent element="div" textStyle="content-alt" margin="none">
          {parse(contentAsHTML!)}
        </StyledContent>
      </ContentWrapper>
      <FlexLine>
        <FlexLine>{postTime}</FlexLine>
        <SafeLinkButton to={myNdlaRoutes.toMyNdlaArenaTopic(topicId)}>
          {t("myNdla.arena.admin.flags.goToTopic")}
        </SafeLinkButton>
      </FlexLine>
    </PostCardWrapper>
  );
};

export default PostCard;

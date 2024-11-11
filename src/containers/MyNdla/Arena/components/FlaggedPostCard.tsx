/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { Heading, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { SKIP_TO_CONTENT_ID } from "../../../../constants";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { formatDateTime, formatDistanceToNow } from "../../../../util/formatDate";
import UserProfileTag from "../../components/UserProfileTag";
import { capitalizeFirstLetter } from "../utils";

interface Props {
  post: GQLArenaPostV2Fragment;
  topic: GQLArenaTopicByIdV2Query["arenaTopicV2"];
}

const PostCardWrapper = styled("div", {
  base: {
    backgroundColor: "surface.default",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
  },
});

const StyledBottomRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "xsmall",
  },
});

const PostCard = ({ topic, post }: Props) => {
  const { id: postId, topicId, created, contentAsHTML } = post;

  const { t, i18n } = useTranslation();
  const timeDistance = formatDistanceToNow(created, i18n.language);

  return (
    <PostCardWrapper id={`post-${postId}`}>
      <UserProfileTag user={post.owner} />
      <Stack gap="xsmall">
        <Heading asChild consumeCss id={SKIP_TO_CONTENT_ID} textStyle="title.large">
          <h3>{topic?.title}</h3>
        </Heading>
        <Text asChild consumeCss>
          <div>{parse(contentAsHTML!)}</div>
        </Text>
      </Stack>
      <StyledBottomRow>
        <Text textStyle="body.small" asChild consumeCss>
          <span title={formatDateTime(created, i18n.language)}>{`${capitalizeFirstLetter(timeDistance)}`}</span>
        </Text>
        <SafeLinkButton to={routes.myNdla.arenaTopic(topicId)}>
          {t("myNdla.arena.admin.flags.goToTopic")}
        </SafeLinkButton>
      </StyledBottomRow>
    </PostCardWrapper>
  );
};

export default PostCard;

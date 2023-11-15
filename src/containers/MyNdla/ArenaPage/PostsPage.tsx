/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import { useParams } from 'react-router';
import PostCard from '../ArenaCards/PostCard';
import { useArenaTopic } from '../arenaMutations';
import { GQLArenaPost } from '../../../graphqlTypes';

const PostsPage = () => {
  const { topicId } = useParams();
  const { data, loading } = useArenaTopic(Number(topicId), 1);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        data?.arenaTopic?.posts?.map((post: GQLArenaPost) => (
          <div key={post.id}>
            <PostCard
              id={post.id.toString()}
              isMainPost={post.isMainPost}
              title={'Test test'}
              content={post.content}
              notify={true}
            />
          </div>
        ))
      )}
    </>
  );
};

export default PostsPage;

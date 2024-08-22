/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ResourcePageContent from "./ResourcePageContent";
import { GQLContextQuery, GQLContextQueryVariables } from "../../graphqlTypes";
import { contextQuery } from "../../queries";
import { useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";

const ResourcePage = () => {
  const { contextId, subjectId: subId, resourceId: rId, topicId: tId } = useUrnIds();
  const { loading, data } = useGraphQuery<GQLContextQuery, GQLContextQueryVariables>(contextQuery, {
    variables: {
      contextId: contextId ?? "",
    },
    skip: contextId === undefined,
  });
  if (loading) {
    return null;
  }
  const node = data?.node;
  const subjectId = node?.context?.rootId || subId;
  const resourceId = node?.id || rId;
  const topicId = node?.context?.parentIds?.slice(-1)?.[0] || tId;

  return <ResourcePageContent subjectId={subjectId} topicId={topicId} resourceId={resourceId} />;
};

export default ResourcePage;

/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState, useEffect } from "react";
import { keyBy } from "@ndla/util";
import { ResourceWithMenu } from "./ResourceWithMenu";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { GQLFolder } from "../../../../graphqlTypes";
import { useFolderResourceMetaSearch } from "../../../../mutations/folder/folderQueries";

interface Props {
  selectedFolder: GQLFolder;
  resourceRefId?: string;
}

export const ResourceList = ({ selectedFolder, resourceRefId }: Props) => {
  const resources = useMemo(() => selectedFolder.resources, [selectedFolder]);

  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const [prevResources, setPrevResources] = useState(resources);

  useEffect(() => {
    const resourceIds = resources.map((f) => f.id).sort();
    const prevResourceIds = prevResources?.map((f) => f.id).sort();
    const isEqual =
      resourceIds.length === prevResourceIds.length && resourceIds.every((v, i) => v === prevResourceIds[i]);
    if (!isEqual && focusId) {
      setTimeout(
        () => document.getElementById(`resource-${focusId}`)?.getElementsByTagName("a")?.[0]?.focus(),
        // Timeout needs to be bigger than 0 in order for timeout to execute on FireFox
        1,
      );
      setFocusId(undefined);
      setPrevResources(resources);
    }
  }, [resources, prevResources, focusId]);

  const { data, loading } = useFolderResourceMetaSearch(
    resources.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);

  return (
    <BlockWrapper>
      {resources.map((resource, index) => {
        const resourceMeta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
        return (
          <ResourceWithMenu
            resource={resource}
            key={resource.id}
            index={index}
            loading={loading}
            resourceMeta={resourceMeta}
            resources={resources}
            setFocusId={setFocusId}
            selectedFolder={selectedFolder}
            resourceRefId={resourceRefId}
          />
        );
      })}
    </BlockWrapper>
  );
};

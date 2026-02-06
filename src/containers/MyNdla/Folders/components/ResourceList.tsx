/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text } from "@ndla/primitives";
import { keyBy } from "@ndla/util";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { GQLFolder } from "../../../../graphqlTypes";
import { useFolderResourceMetaSearch } from "../../../../mutations/folder/folderQueries";
import { ResourceWithMenu } from "./ResourceWithMenu";

interface Props {
  selectedFolder: GQLFolder;
  labelledBy: string;
}

export const ResourceList = ({ selectedFolder, labelledBy }: Props) => {
  const { t } = useTranslation();
  const resources = useMemo(() => selectedFolder.resources, [selectedFolder]);

  const { data, loading } = useFolderResourceMetaSearch(
    resources.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);

  if (!resources.length) {
    return <Text>{t("myNdla.folder.noResources")}</Text>;
  }

  return (
    <BlockWrapper aria-labelledby={labelledBy}>
      {resources.map((resource) => {
        const resourceMeta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
        return (
          <ResourceWithMenu
            resource={resource}
            key={resource.id}
            loading={loading}
            resourceMeta={resourceMeta}
            selectedFolder={selectedFolder}
          />
        );
      })}
    </BlockWrapper>
  );
};

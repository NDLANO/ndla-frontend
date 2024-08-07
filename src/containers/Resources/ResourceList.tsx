/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { type Resource, ResourceItem } from "./ResourceItem";

const StyledResourceList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

interface ResourceListProps {
  resources: Resource[];
  contentType?: string;
  title?: string;
  showAdditionalResources?: boolean;
}

const ResourceList = ({ resources, contentType, title, showAdditionalResources }: ResourceListProps) => {
  const { t } = useTranslation();
  const renderAdditionalResourceTrigger =
    !showAdditionalResources && resources.length - resources.filter((r) => r.additional).length === 0;

  return (
    <div>
      <StyledResourceList>
        {resources.map((resource) => (
          <ResourceItem
            key={resource.id}
            contentType={contentType}
            showAdditionalResources={showAdditionalResources}
            {...resource}
          />
        ))}
      </StyledResourceList>
      {renderAdditionalResourceTrigger && (
        <Text>
          {title
            ? t("resource.noCoreResourcesAvailable", { name: title.toLowerCase() })
            : t("resource.noCoreResourcesAvailableUnspecific")}
        </Text>
      )}
    </div>
  );
};

export default ResourceList;

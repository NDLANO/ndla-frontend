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
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";

const StyledResourceList = styled("ol", {
  base: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

interface ResourceListProps {
  resources: Resource[];
  contentType?: string;
  title?: string;
  showAdditionalResources?: boolean;
  headingId?: string;
  currentResourceId?: string;
}

export const ResourceList = ({
  resources,
  contentType,
  headingId,
  title,
  showAdditionalResources,
  currentResourceId,
}: ResourceListProps) => {
  const { t } = useTranslation();
  const renderAdditionalResourceTrigger =
    !showAdditionalResources &&
    resources.length - resources.filter((r) => r.relevanceId === RELEVANCE_SUPPLEMENTARY).length === 0;

  return (
    <div>
      <StyledResourceList aria-labelledby={headingId}>
        {resources.map((resource) => (
          <ResourceItem
            key={resource.id}
            contentType={contentType}
            showAdditionalResources={showAdditionalResources}
            active={currentResourceId === resource.id}
            {...resource}
          />
        ))}
      </StyledResourceList>
      {!!renderAdditionalResourceTrigger && (
        <Text>
          {title
            ? t("resource.noCoreResourcesAvailable", { name: title.toLowerCase() })
            : t("resource.noCoreResourcesAvailableUnspecific")}
        </Text>
      )}
    </div>
  );
};

/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import ResourceItem, { Resource } from "./ResourceItem";

const StyledResourceList = styled.ul`
  list-style: none;
  padding: 0;
`;

export type ResourceListProps = {
  resources: Resource[];
  contentType?: string;
  title?: string;
  showAdditionalResources?: boolean;
  heartButton?: (path: string) => ReactNode;
};

const ResourceList = ({ resources, contentType, title, showAdditionalResources, heartButton }: ResourceListProps) => {
  const { t } = useTranslation();
  const renderAdditionalResourceTrigger =
    !showAdditionalResources && resources.length - resources.filter((r) => r.additional).length === 0;

  return (
    <div>
      <StyledResourceList>
        {resources.map(({ id, ...resource }) => (
          <ResourceItem
            id={id}
            key={id}
            contentType={contentType}
            showAdditionalResources={showAdditionalResources}
            heartButton={heartButton}
            {...resource}
            contentTypeDescription={
              resource.additional ? t("resource.tooltipAdditionalTopic") : t("resource.tooltipCoreTopic")
            }
          />
        ))}
      </StyledResourceList>
      {renderAdditionalResourceTrigger && (
        <div>
          <p>
            {title
              ? t("resource.noCoreResourcesAvailable", { name: title.toLowerCase() })
              : t("resource.noCoreResourcesAvailableUnspecific")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceList;

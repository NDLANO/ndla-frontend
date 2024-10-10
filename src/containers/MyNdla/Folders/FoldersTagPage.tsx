/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { FolderLine, LinkMedium } from "@ndla/icons/editor";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import ListViewOptions from "./components/ListViewOptions";
import { ViewType } from "./FoldersPage";
import { AuthContext } from "../../../components/AuthenticationContext";
import { AddResourceToFolderModalContent } from "../../../components/MyNdla/AddResourceToFolderModal";
import BlockResource from "../../../components/MyNdla/BlockResource";
import { BlockWrapper } from "../../../components/MyNdla/BlockWrapper";
import ListResource from "../../../components/MyNdla/ListResource";
import { PageSpinner } from "../../../components/PageSpinner";
import { useToast } from "../../../components/ToastContext";
import config from "../../../config";
import { STORED_RESOURCE_VIEW_SETTINGS } from "../../../constants";
import { GQLFolderResource } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { getAllTags, getResourceTypesForResource, getResourcesForTag } from "../../../util/folderHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import { usePrevious } from "../../../util/utilityHooks";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import MyNdlaTitle from "../components/MyNdlaTitle";
import SettingsMenu, { MenuItemProps } from "../components/SettingsMenu";
import TitleWrapper from "../components/TitleWrapper";
import { useFolders, useFolderResourceMetaSearch } from "../folderMutations";

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
  base: {
    gap: "xsmall",
  },
});

const FoldersTagsPage = () => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const { folders, loading } = useFolders();
  const { tag } = useParams();
  const { t } = useTranslation();
  const title = useMemo(() => (tag ? t("htmlTitles.myTagPage", { tag }) : t("htmlTitles.myTagsPage")), [t, tag]);
  const tags = useMemo(() => getAllTags(folders), [folders]);
  const resources = useMemo(() => (tag ? getResourcesForTag(folders, tag) : []), [tag, folders]);
  const previousResources = usePrevious(resources);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({ title: title, dimensions: getAllDimensions({ user }) });
  }, [authContextLoaded, title, trackPageView, user]);

  useEffect(() => {
    if (tag && !!previousResources?.length && resources.length === 0) {
      navigate(routes.myNdla.folders);
    }
  }, [resources, previousResources, tag, navigate]);

  if (loading) {
    return <PageSpinner />;
  }

  if (!tag || !tags.includes(tag)) {
    return <NotFoundPage />;
  }

  return (
    <StyledMyNdlaPageWrapper>
      <HelmetWithTracker title={title} />
      <TitleWrapper>
        <MyNdlaBreadcrumb page="folders" breadcrumbs={tag ? [{ name: tag, id: tag }] : []} />
        <MyNdlaTitle title={`#${tag}`} />
      </TitleWrapper>
      {resources && <Resources resources={resources} />}
    </StyledMyNdlaPageWrapper>
  );
};

interface ResourcesProps {
  resources: GQLFolderResource[];
}

const Resources = ({ resources }: ResourcesProps) => {
  const [viewType, _setViewType] = useState<ViewType>(
    (localStorage.getItem(STORED_RESOURCE_VIEW_SETTINGS) as ViewType) || "list",
  );
  const toast = useToast();
  const { examLock } = useContext(AuthContext);
  const { t } = useTranslation();
  const { data, loading } = useFolderResourceMetaSearch(
    resources.map((res) => ({
      id: res.resourceId,
      path: res.path,
      resourceType: res.resourceType,
    })),
    { skip: resources.length === 0 },
  );
  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);

  const setViewType = (type: ViewType) => {
    _setViewType(type);
    localStorage.setItem(STORED_RESOURCE_VIEW_SETTINGS, type);
  };

  const Resource = viewType === "block" ? BlockResource : ListResource;

  const createMenuItems = (resource: GQLFolderResource): MenuItemProps[] => {
    if (examLock) return [];

    return [
      {
        type: "dialog",
        value: "addResource",
        icon: <FolderLine />,
        text: t("myNdla.resource.add"),
        modalContent: (close) => (
          <AddResourceToFolderModalContent
            resource={{
              id: resource.resourceId,
              resourceType: resource.resourceType,
              path: resource.path,
            }}
            close={close}
          />
        ),
      },
      {
        type: "action",
        value: "copyResourceLink",
        icon: <LinkMedium />,
        text: t("myNdla.resource.copyLink"),
        onClick: () => {
          navigator.clipboard.writeText(`${config.ndlaFrontendDomain}${resource.path}`);
          toast.create({
            title: t("myNdla.resource.linkCopied"),
          });
        },
      },
    ];
  };

  return (
    <>
      <ListViewOptions type={viewType} onTypeChange={setViewType} />
      <BlockWrapper variant={viewType}>
        {resources.map((resource) => {
          const meta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
          return (
            <Resource
              id={resource.id}
              isLoading={loading}
              key={resource.id}
              link={resource.path}
              title={meta?.title ?? ""}
              description={meta?.description ?? ""}
              resourceTypes={getResourceTypesForResource(resource.resourceType, meta?.resourceTypes, t)}
              resourceImage={{
                src: meta?.metaImage?.url ?? "",
                alt: "",
              }}
              menu={<SettingsMenu menuItems={createMenuItems(resource)} />}
              variant="subtle"
            />
          );
        })}
      </BlockWrapper>
    </>
  );
};

export default FoldersTagsPage;

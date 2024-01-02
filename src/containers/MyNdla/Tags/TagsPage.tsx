/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from 'lodash/keyBy';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FileDocumentOutline, HashTag, Link } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import { SafeLinkButton } from '@ndla/safelink';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { BlockResource, ListResource, useSnack } from '@ndla/ui';
import { AuthContext } from '../../../components/AuthenticationContext';
import { AddResourceToFolderModalContent } from '../../../components/MyNdla/AddResourceToFolderModal';
import config from '../../../config';
import { STORED_RESOURCE_VIEW_SETTINGS } from '../../../constants';
import { GQLFolderResource } from '../../../graphqlTypes';
import { getAllTags, getResourcesForTag } from '../../../util/folderHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { usePrevious } from '../../../util/utilityHooks';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaTitle from '../components/MyNdlaTitle';
import SettingsMenu from '../components/SettingsMenu';
import TitleWrapper from '../components/TitleWrapper';
import { useFolderResourceMetaSearch, useFolders } from '../folderMutations';
import { BlockWrapper, ViewType } from '../Folders/FoldersPage';
import ListViewOptions from '../Folders/ListViewOptions';

const StyledUl = styled.ul`
  padding: 0px;
  list-style: none;
  display: flex;
  gap: ${spacing.small};
  flex-wrap: wrap;
`;

const TagsPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  flex: 1;
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  width: fit-content;
  display: flex;
  align-items: center;
`;

const CountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const TagsPage = () => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const { folders } = useFolders();
  const { tag } = useParams();
  const { t } = useTranslation();
  const title = useMemo(() => (tag ? t('htmlTitles.myTagPage', { tag }) : t('htmlTitles.myTagsPage')), [t, tag]);
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
      navigate('/minndla/tags');
    }
  }, [resources, previousResources, tag, navigate]);

  if (tag && tags && !tags.includes(tag)) {
    return <NotFoundPage />;
  }

  return (
    <MyNdlaPageWrapper>
      <TagsPageContainer>
        <HelmetWithTracker title={title} />
        <TitleWrapper>
          <MyNdlaBreadcrumb page="tags" breadcrumbs={tag ? [{ name: tag, id: tag }] : []} />
          <MyNdlaTitle title={tag ? tag : t('myNdla.myTags')} />
        </TitleWrapper>
        {!tag && tags.length ? <Tags tags={tags} /> : null}
        {tag && resources && <Resources resources={resources} />}
      </TagsPageContainer>
    </MyNdlaPageWrapper>
  );
};

interface TagsProps {
  tags: string[];
}

interface ResourcesProps {
  resources: GQLFolderResource[];
}

const Resources = ({ resources }: ResourcesProps) => {
  const [viewType, _setViewType] = useState<ViewType>(
    (localStorage.getItem(STORED_RESOURCE_VIEW_SETTINGS) as ViewType) || 'list',
  );
  const { addSnack } = useSnack();
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

  const Resource = viewType === 'block' ? BlockResource : ListResource;
  return (
    <>
      <CountWrapper>
        <FileDocumentOutline />
        <span>{t('myNdla.resources', { count: resources.length })}</span>
      </CountWrapper>
      <ListViewOptions type={viewType} onTypeChange={setViewType} />
      <BlockWrapper data-type={viewType}>
        {resources.map((resource) => {
          const meta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
          return (
            <Resource
              id={resource.id}
              tagLinkPrefix="/minndla/tags"
              isLoading={loading}
              key={resource.id}
              link={resource.path}
              title={meta?.title ?? ''}
              description={viewType !== 'list' ? meta?.description ?? '' : undefined}
              tags={resource.tags}
              resourceTypes={meta?.resourceTypes ?? []}
              resourceImage={{
                src: meta?.metaImage?.url ?? '',
                alt: '',
              }}
              menu={
                <SettingsMenu
                  menuItems={
                    examLock
                      ? []
                      : [
                          {
                            icon: <FolderOutlined />,
                            text: t('myNdla.resource.add'),
                            isModal: true,
                            modality: false,
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
                            icon: <Link />,
                            text: t('myNdla.resource.copyLink'),
                            onClick: () => {
                              navigator.clipboard.writeText(`${config.ndlaFrontendDomain}${resource.path}`);
                              addSnack({
                                content: t('myNdla.resource.linkCopied'),
                                id: 'linkCopied',
                              });
                            },
                          },
                        ]
                  }
                />
              }
            />
          );
        })}
      </BlockWrapper>
    </>
  );
};

const Tags = ({ tags }: TagsProps) => {
  const { t } = useTranslation();
  return (
    <>
      <CountWrapper>
        <HashTag />
        <span>{t('myNdla.tags', { count: tags.length })}</span>
      </CountWrapper>
      <nav aria-label={t('myNdla.myTags')}>
        <StyledUl>
          {tags.map((tag) => (
            <li key={tag}>
              <StyledSafeLinkButton colorTheme="greyLighter" shape="pill" key={tag} to={encodeURIComponent(tag)}>
                <HashTag />
                {tag}
              </StyledSafeLinkButton>
            </li>
          ))}
        </StyledUl>
      </nav>
    </>
  );
};

export default TagsPage;

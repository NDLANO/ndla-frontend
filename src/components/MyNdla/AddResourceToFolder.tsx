/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { ListResource, TreeStructure } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { articlePageFragments } from '../../containers/ArticlePage/ArticlePage';
import { GQLAddResourceToFolder_ArticleFragment } from '../../graphqlTypes';

interface Props {
  article: GQLAddResourceToFolder_ArticleFragment;
}
const AddResourceToFolder = ({ article }: Props) => {
  const location = useLocation();
  const { t } = useTranslation();

  const onAddNewFolder = async (name: string, parentId?: string) => {
    return '';
  };
  return (
    <div>
      <h1>{t('myNdla.resource.addToMyNdla')}</h1>
      <ListResource
        link={location.pathname}
        title={article.title}
        description={article.introduction}
        resourceImage={
          article.metaImage && {
            src: article.metaImage.url,
            alt: article.metaImage.alt,
          }
        }
      />
      {/* <TreeStructure
        label="Velg plassering"
        data={[]}
        onNewFolder={({ parentId, value }) => onAddNewFolder(value, parentId)}
      /> */}
    </div>
  );
};

AddResourceToFolder.fragments = {
  article: gql`
    fragment AddResourceToFolder_Article on Article {
      id
      title
      introduction
      metaImage {
        url
        alt
      }
    }
  `,
};

export default AddResourceToFolder;

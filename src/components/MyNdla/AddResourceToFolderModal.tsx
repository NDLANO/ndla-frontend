/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery } from "@apollo/client/react";
import { DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@ndla/primitives";
import { lazy, ReactNode, Suspense, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { GQLFolderFragment } from "../../graphqlTypes";
import { myNdlaResourceMetaQuery } from "../../mutations/folder/folderQueries";
import { AuthContext } from "../AuthenticationContext";
import { DialogCloseButton } from "../DialogCloseButton";
import { ResourceAttributes } from "./AddResourceToFolder";
import { ListResource } from "./ListResource";
import { LoginModalContent } from "./LoginModalContent";

const AddResourceToFolder = lazy(() => import("./AddResourceToFolder"));

interface Props {
  defaultOpenFolder?: GQLFolderFragment;
  resource: ResourceAttributes;
  children: ReactNode;
}

export const AddResourceToFolderModal = ({ resource, children, defaultOpenFolder }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { data, loading } = useQuery(myNdlaResourceMetaQuery, { variables: { resource }, skip: !resource || !open });

  const close = useCallback(() => setOpen(false), []);

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {authenticated ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myNdla.resource.addToMyNdla")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <Suspense>
            <AddResourceToFolder
              onClose={close}
              resource={resource}
              defaultOpenFolder={defaultOpenFolder}
              type="resource"
            />
          </Suspense>
        </DialogContent>
      ) : (
        <LoginModalContent
          title={t("myNdla.myPage.loginResourcePitch")}
          content={
            !!resource && (
              <ListResource
                nonInteractive
                isLoading={loading}
                id={resource.id.toString()}
                link={resource.path}
                title={data?.myNdlaResourceMeta?.title ?? ""}
                resourceImage={{
                  src: data?.myNdlaResourceMeta?.metaImage?.url,
                  alt: data?.myNdlaResourceMeta?.metaImage?.alt ?? "",
                }}
                traits={
                  data?.myNdlaResourceMeta?.__typename === "MyNdlaArticleResourceMeta"
                    ? data.myNdlaResourceMeta.traits
                    : undefined
                }
                resourceTypes={data?.myNdlaResourceMeta?.resourceTypes}
                storedResourceType={resource.resourceType}
              />
            )
          }
        />
      )}
    </DialogRoot>
  );
};

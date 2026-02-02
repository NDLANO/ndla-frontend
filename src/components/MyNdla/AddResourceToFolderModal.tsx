/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@ndla/primitives";
import { lazy, ReactNode, Suspense, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { GQLFolder } from "../../graphqlTypes";
import { useFolderResourceMeta } from "../../mutations/folder/folderQueries";
import { AuthContext } from "../AuthenticationContext";
import { DialogCloseButton } from "../DialogCloseButton";
import { ResourceAttributes } from "./AddResourceToFolder";
import { ListResource } from "./ListResource";
import { LoginModalContent } from "./LoginModalContent";

const AddResourceToFolder = lazy(() => import("./AddResourceToFolder"));

interface Props {
  defaultOpenFolder?: GQLFolder;
  resource: ResourceAttributes;
  children: ReactNode;
}

export const AddResourceToFolderModal = ({ resource, children, defaultOpenFolder }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { meta, loading } = useFolderResourceMeta(resource, {
    skip: !resource || !open,
  });

  const close = useCallback(() => setOpen(false), []);

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)} modal={!authenticated}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {authenticated ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myNdla.resource.addToMyNdla")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <Suspense>
              <AddResourceToFolder onClose={close} resource={resource} defaultOpenFolder={defaultOpenFolder} />
            </Suspense>
          </DialogBody>
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
                title={meta?.title ?? ""}
                resourceImage={{
                  src: meta?.metaImage?.url,
                  alt: meta?.metaImage?.alt ?? "",
                }}
                traits={meta?.__typename === "ArticleFolderResourceMeta" ? meta.traits : undefined}
                resourceTypes={meta?.resourceTypes}
                storedResourceType={resource.resourceType}
              />
            )
          }
        />
      )}
    </DialogRoot>
  );
};

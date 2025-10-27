/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { DialogRoot, DialogTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { AuthContext } from "./AuthenticationContext";
import { FavoriteButton } from "./MyNdla/FavoriteButton";
import { LoginModalContent } from "./MyNdla/LoginModalContent";
import { useToast } from "./ToastContext";
import { GQLFavoriteSubject_NodeFragment } from "../graphqlTypes";
import { useUpdatePersonalData } from "../mutations/userMutations";
import { DeleteModalContent } from "./MyNdla/DeleteModalContent";

const SafeLinkWrapper = styled("div", {
  base: {
    padding: "small",
    border: "1px solid",
    borderColor: "stroke.subtle",
    borderRadius: "xsmall",
  },
});

interface Props {
  node: GQLFavoriteSubject_NodeFragment;
  favorites: string[] | undefined;
  subjectLinkOrText: ReactNode;
}

export const FavoriteSubject = ({ node, favorites, subjectLinkOrText }: Props) => {
  const isFavorite = !!favorites?.includes(node.id);
  const toast = useToast();
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { authenticated } = useContext(AuthContext);
  const { updatePersonalData } = useUpdatePersonalData();

  const setFavorite = async () => {
    if (!favorites) {
      return;
    }
    const newFavorites = favorites.concat(node.id);
    await updatePersonalData({
      variables: { favoriteSubjects: newFavorites },
    });
    toast.create({
      title: t("myNdla.resource.added"),
      description: t("subjectsPage.addConfirmed", { subject: node.name }),
    });
  };

  const removeFavorite = async () => {
    if (!favorites) {
      return;
    }
    const newFavorites = favorites?.filter((favorite) => favorite !== node.id);
    await updatePersonalData({
      variables: { favoriteSubjects: newFavorites },
    });
    setShowDeleteModal(false);
    toast.create({
      title: t("myNdla.resource.removed"),
      description: t("subjectsPage.removeConfirmed", { subject: node.name }),
    });
  };

  if (authenticated && !isFavorite) {
    return (
      <FavoriteButton
        onClick={setFavorite}
        aria-label={t("subjectsPage.addFavorite")}
        title={t("subjectsPage.addFavorite")}
        isFavorite={false}
      />
    );
  } else if (authenticated) {
    return (
      <DialogRoot open={showDeleteModal} onOpenChange={(details) => setShowDeleteModal(details.open)}>
        <DialogTrigger asChild>
          <FavoriteButton
            aria-label={t("subjectsPage.removeFavorite")}
            title={t("subjectsPage.removeFavorite")}
            isFavorite
          />
        </DialogTrigger>
        <DeleteModalContent
          onDelete={removeFavorite}
          title={t("subjectsPage.removeFavorite")}
          removeText={t("myNdla.resource.remove")}
          description={t("subjectsPage.confirmRemove", {
            subject: node.name,
          })}
        />
      </DialogRoot>
    );
  } else {
    return (
      <DialogRoot>
        <DialogTrigger asChild>
          <FavoriteButton
            aria-label={`${t("subjectsPage.addFavorite")}, ${node.name}`}
            title={`${t("subjectsPage.addFavorite")}, ${node.name}`}
            variant="tertiary"
            isFavorite={false}
          />
        </DialogTrigger>
        <LoginModalContent
          title={t("subjectsPage.subjectFavoritePitch")}
          content={
            <>
              <span>{t("subjectsPage.subjectFavoriteGuide")}</span>
              <SafeLinkWrapper>{subjectLinkOrText}</SafeLinkWrapper>
            </>
          }
        />
      </DialogRoot>
    );
  }
};

FavoriteSubject.fragments = {
  node: gql`
    fragment FavoriteSubject_Node on Node {
      id
      name
    }
  `,
};

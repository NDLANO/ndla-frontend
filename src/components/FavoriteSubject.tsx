/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogRoot, DialogTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { AuthContext } from "./AuthenticationContext";
import FavoriteButton from "./MyNdla/FavoriteButton";
import LoginModalContent from "./MyNdla/LoginModalContent";
import { useToast } from "./ToastContext";
import DeleteModalContent from "../containers/MyNdla/components/DeleteModalContent";
import { useUpdatePersonalData } from "../containers/MyNdla/userMutations";
import { GQLTaxBase } from "../graphqlTypes";

const SafeLinkWrapper = styled("div", {
  base: {
    padding: "small",
    border: "1px solid",
    borderColor: "stroke.subtle",
    borderRadius: "xsmall",
  },
});

interface Props {
  subject: GQLTaxBase;
  favorites: string[] | undefined;
  subjectLinkOrText: ReactNode;
}

const FavoriteSubject = ({ subject, favorites, subjectLinkOrText }: Props) => {
  const isFavorite = !!favorites?.includes(subject.id);
  const toast = useToast();
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { authenticated } = useContext(AuthContext);
  const { updatePersonalData } = useUpdatePersonalData();

  const setFavorite = async () => {
    if (!favorites) {
      return;
    }
    const newFavorites = favorites.concat(subject.id);
    await updatePersonalData({
      variables: { favoriteSubjects: newFavorites },
    });
    toast.create({
      title: t("myndla.resource.added"),
      description: t("subjectsPage.addConfirmed", { subject: subject.name }),
    });
  };

  const removeFavorite = async () => {
    if (!favorites) {
      return;
    }
    const newFavorites = favorites?.filter((favorite) => favorite !== subject.id);
    await updatePersonalData({
      variables: { favoriteSubjects: newFavorites, shareName: undefined },
    });
    setShowDeleteModal(false);
    toast.create({
      title: t("myndla.resource.removed"),
      description: t("subjectsPage.removeConfirmed", { subject: subject.name }),
    });
  };

  return (
    <>
      {authenticated && !isFavorite ? (
        <FavoriteButton
          onClick={setFavorite}
          aria-label={t("subjectsPage.addFavorite")}
          title={t("subjectsPage.addFavorite")}
          isFavorite={false}
        />
      ) : authenticated ? (
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
              subject: subject.name,
            })}
          />
        </DialogRoot>
      ) : (
        <DialogRoot>
          <DialogTrigger asChild>
            <FavoriteButton
              aria-label={`${t("subjectsPage.addFavorite")}, ${subject.name}`}
              title={`${t("subjectsPage.addFavorite")}, ${subject.name}`}
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
      )}
    </>
  );
};

export default FavoriteSubject;

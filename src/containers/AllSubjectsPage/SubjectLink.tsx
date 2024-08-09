/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalTrigger } from "@ndla/modal";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { AuthContext } from "../../components/AuthenticationContext";
import FavoriteButton from "../../components/MyNdla/FavoriteButton";
import LoginModalContent from "../../components/MyNdla/LoginModalContent";
import { useToast } from "../../components/ToastContext";
import config from "../../config";
import { GQLAllSubjects_SubjectFragment } from "../../graphqlTypes";
import DeleteModalContent from "../MyNdla/components/DeleteModalContent";
import { useUpdatePersonalData } from "../MyNdla/userMutations";

const SubjectLinkWrapper = styled("li", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
  },
});

const SafeLinkWrapper = styled("div", {
  base: {
    padding: "small",
    border: "1px solid",
    borderColor: "stroke.subtle",
    borderRadius: "xsmall",
  },
});

// TODO: Remove/update this custom SafeLink styling?
const StyledSafeLink = styled(SafeLink, {
  base: { color: "text.default", textDecoration: "underline", _hover: { textDecoration: "none" } },
});

interface Props {
  subject: GQLAllSubjects_SubjectFragment;
  favorites: string[] | undefined;
  className?: string;
}

// TODO: Needs to be refactored to use new components
const SubjectLink = ({ subject, favorites, className }: Props) => {
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
    <SubjectLinkWrapper className={className}>
      {authenticated && !isFavorite ? (
        <FavoriteButton
          onClick={setFavorite}
          aria-label={t("subjectsPage.addFavorite")}
          title={t("subjectsPage.addFavorite")}
          isFavorite={false}
        />
      ) : authenticated ? (
        <Modal open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <ModalTrigger>
            <FavoriteButton
              aria-label={t("subjectsPage.removeFavorite")}
              title={t("subjectsPage.removeFavorite")}
              isFavorite
            />
          </ModalTrigger>
          <DeleteModalContent
            onDelete={removeFavorite}
            title={t("subjectsPage.removeFavorite")}
            removeText={t("myNdla.resource.remove")}
            description={t("subjectsPage.confirmRemove", {
              subject: subject.name,
            })}
          />
        </Modal>
      ) : (
        <Modal>
          <ModalTrigger>
            <FavoriteButton
              aria-label={`${t("subjectsPage.addFavorite")}, ${subject.name}`}
              title={`${t("subjectsPage.addFavorite")}, ${subject.name}`}
              variant="tertiary"
              isFavorite={false}
            />
          </ModalTrigger>
          <LoginModalContent
            title={t("subjectsPage.subjectFavoritePitch")}
            content={
              <>
                <span>{t("subjectsPage.subjectFavoriteGuide")}</span>
                <SafeLinkWrapper>
                  <StyledSafeLink to={config.enablePrettyUrls ? subject.url : subject.path}>
                    {subject.name}
                  </StyledSafeLink>
                </SafeLinkWrapper>
              </>
            }
          />
        </Modal>
      )}
      <StyledSafeLink to={config.enablePrettyUrls ? subject.url : subject.path}>{subject.name}</StyledSafeLink>
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;

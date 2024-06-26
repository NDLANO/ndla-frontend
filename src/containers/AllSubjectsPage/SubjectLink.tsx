/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors, fonts, misc, spacing } from "@ndla/core";
import { Heart, HeartOutline } from "@ndla/icons/action";
import { Modal, ModalTrigger } from "@ndla/modal";
import { SafeLink } from "@ndla/safelink";
import { useSnack } from "@ndla/ui";
import { Subject } from "./interfaces";
import { AuthContext } from "../../components/AuthenticationContext";
import LoginModalContent from "../../components/MyNdla/LoginModalContent";
import { toSubject } from "../../routeHelpers";
import DeleteModalContent from "../MyNdla/components/DeleteModalContent";
import { useUpdatePersonalData } from "../MyNdla/userMutations";

const SubjectLinkWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const StyledIconButton = styled(IconButtonV2)`
  min-height: 40px;
  min-width: 40px;
`;

const SubjectSafeLink = styled(SafeLink)`
  font-weight: ${fonts.weight.semibold};
  box-shadow: none;
  :hover {
    box-shadow: ${misc.textLinkBoxShadow};
  }
  color: ${colors.brand.primary};
`;

const ModalSubjectContainer = styled.div`
  margin-top: ${spacing.normal};
  padding: ${spacing.small};
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
`;

interface Props {
  subject: Subject;
  favorites: string[] | undefined;
  className?: string;
}

const SubjectLink = ({ subject, favorites, className }: Props) => {
  const isFavorite = !!favorites?.includes(subject.id);
  const { addSnack } = useSnack();
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
    addSnack({
      id: `addedFavorite-${subject.id}`,
      content: t("subjectsPage.addConfirmed", { subject: subject.name }),
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
    addSnack({
      id: `removedFavorite-${subject.id}`,
      content: t("subjectsPage.removeConfirmed", { subject: subject.name }),
    });
  };

  return (
    <SubjectLinkWrapper className={className}>
      {authenticated && !isFavorite ? (
        <StyledIconButton
          onClick={setFavorite}
          aria-label={t("subjectsPage.addFavorite")}
          title={t("subjectsPage.addFavorite")}
          variant="ghost"
          size="xsmall"
          colorTheme="lighter"
        >
          {isFavorite ? <Heart /> : <HeartOutline />}
        </StyledIconButton>
      ) : authenticated ? (
        <Modal open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <ModalTrigger>
            <StyledIconButton
              aria-label={t("subjectsPage.removeFavorite")}
              title={t("subjectsPage.removeFavorite")}
              variant="ghost"
              size="xsmall"
              colorTheme="lighter"
            >
              <Heart />
            </StyledIconButton>
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
            <StyledIconButton
              aria-label={`${t("subjectsPage.addFavorite")}, ${subject.name}`}
              title={`${t("subjectsPage.addFavorite")}, ${subject.name}`}
              variant="ghost"
              size="xsmall"
              colorTheme="lighter"
            >
              <HeartOutline />
            </StyledIconButton>
          </ModalTrigger>
          <LoginModalContent
            title={t("subjectsPage.subjectFavoritePitch")}
            content={
              <>
                <span>{t("subjectsPage.subjectFavoriteGuide")}</span>
                <ModalSubjectContainer>
                  <SubjectSafeLink to={toSubject(subject.id)}>{subject.name}</SubjectSafeLink>
                </ModalSubjectContainer>
              </>
            }
          />
        </Modal>
      )}
      <SubjectSafeLink to={toSubject(subject.id)}>{subject.name}</SubjectSafeLink>
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;

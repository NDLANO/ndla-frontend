/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import styled from "@emotion/styled";
import { AddLine } from "@ndla/icons/action";
import { SafeLinkButton } from "@ndla/safelink";
import SettingsMenu from "../components/SettingsMenu";
import { OutletContext } from "../MyNdlaLayout";

const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const PostActions = () => {
  const { t } = useTranslation();

  return (
    <SettingsMenu
      showSingle
      menuItems={[
        {
          icon: <AddLine />,
          text: t("myNdla.arena.new.topic"),
          link: "topic/new",
        },
      ]}
    ></SettingsMenu>
  );
};

export const PostButtons = () => {
  const { setIsOpen } = useOutletContext<OutletContext>();
  const { t } = useTranslation();

  return (
    <StyledListItem key="newTopic">
      <SafeLinkButton
        to="topic/new"
        variant="tertiary"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <AddLine size="small" />
        {t("myNdla.arena.new.topic")}
      </SafeLinkButton>
    </StyledListItem>
  );
};

export const TopicActions = () => {
  const { t } = useTranslation();

  return (
    <SettingsMenu
      showSingle
      menuItems={[
        {
          icon: <AddLine />,
          text: t("myNdla.arena.admin.category.form.newCategory"),
          link: "category/new",
        },
      ]}
    ></SettingsMenu>
  );
};

export const TopicButtons = () => {
  const { setIsOpen } = useOutletContext<OutletContext>();
  const { t } = useTranslation();

  return (
    <StyledListItem key="newTopic">
      <SafeLinkButton
        key="newTopic"
        to="category/new"
        variant="tertiary"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <AddLine size="small" />
        {t("myNdla.arena.admin.category.form.newCategory")}
      </SafeLinkButton>
    </StyledListItem>
  );
};

/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useDialogContext } from "@ark-ui/react";
import { AddLine } from "@ndla/icons/action";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import SettingsMenu from "../components/SettingsMenu";

const StyledListItem = styled("li", {
  base: {
    margin: 0,
    padding: 0,
  },
});

export const PostActions = () => {
  const { t } = useTranslation();

  return (
    <SettingsMenu
      showSingle
      menuItems={[
        {
          type: "link",
          value: "newTopic",
          icon: <AddLine />,
          text: t("myNdla.arena.new.topic"),
          link: "topic/new",
        },
      ]}
    ></SettingsMenu>
  );
};

export const PostButtons = () => {
  const { setOpen } = useDialogContext();
  const { t } = useTranslation();

  return (
    <StyledListItem key="newTopic">
      <SafeLinkButton to="topic/new" variant="tertiary" onClick={() => setOpen(false)}>
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
          type: "link",
          value: "newCategory",
          icon: <AddLine />,
          text: t("myNdla.arena.admin.category.form.newCategory"),
          link: "category/new",
        },
      ]}
    ></SettingsMenu>
  );
};

export const TopicButtons = () => {
  const { setOpen } = useDialogContext();
  const { t } = useTranslation();

  return (
    <StyledListItem key="newCategory">
      <SafeLinkButton to="category/new" variant="tertiary" onClick={() => setOpen(false)}>
        <AddLine size="small" />
        {t("myNdla.arena.admin.category.form.newCategory")}
      </SafeLinkButton>
    </StyledListItem>
  );
};

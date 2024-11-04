/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { styled } from "@ndla/styled-system/jsx";
import BackButton from "./BackButton";
import { useDrawerContext } from "./DrawerContext";
import DrawerMenuItem from "./DrawerMenuItem";
import { DrawerPortion, DrawerHeader, DrawerList } from "./DrawerPortion";
import useArrowNavigation from "./useArrowNavigation";
import { GQLProgrammeMenu_ProgrammePageFragment } from "../../../graphqlTypes";
import { toProgramme, useUrnIds } from "../../../routeHelpers";

const StyledDrawerHeader = styled(DrawerHeader, {
  base: {
    paddingBlock: "small",
  },
});

interface Props {
  programmes: GQLProgrammeMenu_ProgrammePageFragment[];
  onClose: () => void;
  onCloseMenuPortion: () => void;
}

const ProgrammeMenu = ({ onClose, onCloseMenuPortion, programmes: programmesProp }: Props) => {
  const { t } = useTranslation();
  const { contextId } = useUrnIds();
  const { shouldCloseLevel, setLevelClosed } = useDrawerContext();
  const programmes = useMemo(
    () =>
      programmesProp.map((programme) => ({
        ...programme,
        path: toProgramme(programme.url),
        name: programme.title.title,
      })),
    [programmesProp],
  );

  useEffect(() => {
    if (shouldCloseLevel) {
      onCloseMenuPortion();
      setLevelClosed();
    }
  }, [shouldCloseLevel, onCloseMenuPortion, setLevelClosed]);

  useArrowNavigation(true, {
    initialFocused: programmes[0]?.path,
    onLeftKeyPressed: onCloseMenuPortion,
  });

  return (
    <DrawerPortion>
      <BackButton title={t("masthead.menu.goToMainMenu")} homeButton onGoBack={onCloseMenuPortion} />
      <StyledDrawerHeader aria-hidden={true} textStyle="title.medium" fontWeight="bold">
        {t("masthead.menuOptions.programme")}
      </StyledDrawerHeader>
      <DrawerList id="programme-menu">
        {programmes.map((programme) => (
          <DrawerMenuItem
            id={programme.path}
            type="link"
            to={programme.path}
            current={programme.contextId === contextId}
            onClose={onClose}
            active={programme.contextId === contextId}
            key={programme.url}
          >
            {programme.name}
          </DrawerMenuItem>
        ))}
      </DrawerList>
    </DrawerPortion>
  );
};

ProgrammeMenu.fragments = {
  programmeMenu: gql`
    fragment ProgrammeMenu_ProgrammePage on ProgrammePage {
      id
      contextId
      title {
        title
        language
      }
      url
      contentUri
    }
  `,
};

export default ProgrammeMenu;

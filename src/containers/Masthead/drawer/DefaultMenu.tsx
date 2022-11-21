/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { breakpoints, colors, fonts, mq, spacing } from '@ndla/core';
import { Back, Home } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import {
  FILM_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_ID,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from '../../../constants';
import { GQLDefaultMenu_SubjectFragment } from '../../../graphqlTypes';
import { removeUrn } from '../../../routeHelpers';
import DrawerMenuItem from './DrawerMenuItem';
import { MenuType } from './drawerMenuTypes';
import DrawerPortion from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';

const StyledCollapsedMenu = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100px;
  min-width: 100px;
  align-items: center;
  gap: ${spacing.normal};
  padding-top: ${spacing.small};
  border-top: 1px solid ${colors.brand.neutral7};
  border-right: 1px solid ${colors.brand.neutral7};
  flex: 1;
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
`;

const MinWidthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${mq.range({ from: breakpoints.tablet })} {
    min-width: 300px;
    max-width: 300px;
  }
`;

const UsefulTools = styled.p`
  ${fonts.sizes('20px', '24px')};
  padding: ${spacing.nsmall} ${spacing.xsmall} ${spacing.nsmall} 40px;
  margin: 0px;
`;

const multiDiscUrl = `/${removeUrn(MULTIDISCIPLINARY_SUBJECT_ID)}`;
const studentToolboxUrl = `/${removeUrn(TOOLBOX_STUDENT_SUBJECT_ID)}`;
const teacherToolboxUrl = `/${removeUrn(TOOLBOX_TEACHER_SUBJECT_ID)}`;

interface Props {
  onClose: () => void;
  setActiveMenu: (type: MenuType | undefined) => void;
  subject?: GQLDefaultMenu_SubjectFragment;
  type?: MenuType;
  closeSubMenu: () => void;
  onCloseMenuPortion: () => void;
}

const DefaultMenu = ({
  onClose,
  setActiveMenu,
  subject,
  type,
  closeSubMenu,
  onCloseMenuPortion,
}: Props) => {
  const { t } = useTranslation();
  if (type) {
    return (
      <StyledCollapsedMenu>
        <IconButtonV2
          onClick={onCloseMenuPortion}
          aria-label="Go back"
          colorTheme="light">
          <Back />
        </IconButtonV2>
        <IconButtonV2
          onClick={closeSubMenu}
          aria-label="Home"
          colorTheme="light">
          <Home />
        </IconButtonV2>
      </StyledCollapsedMenu>
    );
  }
  return (
    <DrawerPortion>
      <MinWidthWrapper>
        <DrawerRowHeader
          type="button"
          title={t('masthead.menuOptions.programme')}
          onClick={() => setActiveMenu('programme')}
        />
        <DrawerRowHeader
          type="link"
          to="/subjects"
          title={t('masthead.menuOptions.subjects')}
          onClose={onClose}
        />
        {subject && (
          <DrawerRowHeader
            type="button"
            title={subject.name}
            onClick={() => setActiveMenu('subject')}
          />
        )}
        <UsefulTools>Nyttige verktøy</UsefulTools>
        <DrawerMenuItem type="link" to={multiDiscUrl} onClose={onClose}>
          {t('masthead.menuOptions.multidisciplinarySubjects')}
        </DrawerMenuItem>
        <DrawerMenuItem type="link" to={studentToolboxUrl} onClose={onClose}>
          {t('masthead.menuOptions.toolboxStudents')}
        </DrawerMenuItem>
        <DrawerMenuItem type="link" to={teacherToolboxUrl} onClose={onClose}>
          {t('masthead.menuOptions.toolboxTeachers')}
        </DrawerMenuItem>
        <DrawerMenuItem type="link" to={FILM_PAGE_PATH} onClose={onClose}>
          {t('masthead.menuOptions.film')}
        </DrawerMenuItem>
        <DrawerMenuItem type="button" onClick={() => setActiveMenu('about')}>
          {t('masthead.menuOptions.about.title')}
        </DrawerMenuItem>
      </MinWidthWrapper>
    </DrawerPortion>
  );
};

DefaultMenu.fragments = {
  subject: gql`
    fragment DefaultMenu_Subject on Subject {
      id
      name
    }
  `,
};

export default DefaultMenu;

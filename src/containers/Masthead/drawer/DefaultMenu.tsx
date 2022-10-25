/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
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

const MenuWrapper = styled(DrawerPortion)`
  display: inline-grid;
  grid-template-columns: [currentIndicator] 1fr [item] 9fr;
  align-items: center;
`;

const StyledDrawerMenuItem = styled(DrawerMenuItem)`
  grid-column-start: item;
`;

const CurrentIndicator = styled.span`
  color: ${colors.brand.primary};
  grid-column-start: currentIndicator;
`;

const multiDiscUrl = `/${removeUrn(MULTIDISCIPLINARY_SUBJECT_ID)}`;
const studentToolboxUrl = `/${removeUrn(TOOLBOX_STUDENT_SUBJECT_ID)}`;
const teacherToolboxUrl = `/${removeUrn(TOOLBOX_TEACHER_SUBJECT_ID)}`;

interface Props {
  onClose: () => void;
  setActiveMenu: (type: MenuType) => void;
  subject?: GQLDefaultMenu_SubjectFragment;
}

const DefaultMenu = ({ onClose, setActiveMenu, subject }: Props) => {
  const { t } = useTranslation();
  return (
    <MenuWrapper>
      <StyledDrawerMenuItem
        bold
        type="button"
        onClick={() => setActiveMenu('programme')}>
        {t('masthead.menuOptions.programme')}
      </StyledDrawerMenuItem>
      <StyledDrawerMenuItem bold type="link" to="/subjects" onClose={onClose}>
        {t('masthead.menuOptions.subjects')}
      </StyledDrawerMenuItem>
      {subject && (
        <>
          <CurrentIndicator aria-hidden="true">●</CurrentIndicator>
          <StyledDrawerMenuItem
            bold
            type="button"
            onClick={() => setActiveMenu('subject')}>
            {subject.name}
          </StyledDrawerMenuItem>
        </>
      )}
      <StyledDrawerMenuItem type="link" to={multiDiscUrl} onClose={onClose}>
        {t('masthead.menuOptions.multidisciplinarySubjects')}
      </StyledDrawerMenuItem>
      <StyledDrawerMenuItem
        type="link"
        to={studentToolboxUrl}
        onClose={onClose}>
        {t('masthead.menuOptions.toolboxStudents')}
      </StyledDrawerMenuItem>
      <StyledDrawerMenuItem
        type="link"
        to={teacherToolboxUrl}
        onClose={onClose}>
        {t('masthead.menuOptions.toolboxTeachers')}
      </StyledDrawerMenuItem>
      <StyledDrawerMenuItem type="link" to={FILM_PAGE_PATH} onClose={onClose}>
        {t('masthead.menuOptions.film')}
      </StyledDrawerMenuItem>
      <StyledDrawerMenuItem
        type="button"
        onClick={() => setActiveMenu('about')}>
        {t('masthead.menuOptions.about.title')}
      </StyledDrawerMenuItem>
    </MenuWrapper>
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

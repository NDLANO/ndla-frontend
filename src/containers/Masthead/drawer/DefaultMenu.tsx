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
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { Back, Home } from '@ndla/icons/lib/common';
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
import { useMenuContext } from './MenuContext';

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

const multiDiscUrl = `/${removeUrn(MULTIDISCIPLINARY_SUBJECT_ID)}`;
const studentToolboxUrl = `/${removeUrn(TOOLBOX_STUDENT_SUBJECT_ID)}`;
const teacherToolboxUrl = `/${removeUrn(TOOLBOX_TEACHER_SUBJECT_ID)}`;

interface Props {
  onClose: () => void;
  setActiveMenu: (type: MenuType) => void;
  subject?: GQLDefaultMenu_SubjectFragment;
  type?: MenuType;
  closeSubMenu: () => void;
}

const DefaultMenu = ({
  onClose,
  setActiveMenu,
  subject,
  type,
  closeSubMenu,
}: Props) => {
  const { t } = useTranslation();
  const { close } = useMenuContext();
  if (type) {
    return (
      <StyledCollapsedMenu>
        <IconButtonV2 onClick={close} aria-label="Go back" colorTheme="light">
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
        <p>Nyttige verktøy</p>
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

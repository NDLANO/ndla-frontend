/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import Button from '@ndla/button';
import {
  getGroupedContributorDescriptionList,
  getLicenseByAbbreviation,
} from '@ndla/licenses';
import { initArticleScripts } from '@ndla/article-scripts';
import { Figure, FigureCaption, FigureLicenseDialog } from '@ndla/ui';
import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLCopyright } from '../../../graphqlTypes';

interface Props {
  resizeIframe?: boolean;
  figureId: string;
  children: ReactNode | ((params: { typeClass: string }) => ReactNode);
  id: string;
  title: string;
  copyright?: Pick<
    GQLCopyright,
    'creators' | 'processors' | 'rightsholders' | 'origin'
  >;
  licenseString: string;
  type: 'video' | 'h5p' | 'image' | 'concept';
  hideFigCaption?: boolean;
}

const FigureNotion = ({
  resizeIframe,
  figureId,
  children,
  id,
  copyright,
  licenseString,
  title,
  type,
  hideFigCaption,
}: Props) => {
  const { t, i18n } = useTranslation();
  const license = getLicenseByAbbreviation(licenseString, i18n.language);
  const { creators, processors, rightsholders } = copyright ?? {};
  const contributors = getGroupedContributorDescriptionList(
    {
      creators: creators ?? [],
      processors: processors ?? [],
      rightsholders: rightsholders ?? [],
    },
    i18n.language,
  ).map(i => ({ name: i.description, type: i.label }));

  useEffect(() => {
    initArticleScripts();
  }, []);
  return (
    <Figure resizeIframe={resizeIframe} id={figureId} type={'full-column'}>
      {({ typeClass }) => (
        <>
          {typeof children === 'function' ? children({ typeClass }) : children}
          <FigureCaption
            hideFigcaption={hideFigCaption}
            figureId={figureId}
            id={id}
            caption={title}
            reuseLabel={t(`${type}.reuse`)}
            authors={contributors}
            licenseRights={license.rights}>
            <FigureLicenseDialog
              id={id}
              authors={contributors}
              locale={i18n.language}
              title={title}
              origin={copyright?.origin}
              license={license}
              messages={{
                close: t('close'),
                rulesForUse: t('license.concept.rules'),
                source: t('source'),
                learnAboutLicenses: t('license.learnMore'),
                title: t('title'),
              }}>
              <Button outline>{t('license.copyTitle')}</Button>
            </FigureLicenseDialog>
          </FigureCaption>
        </>
      )}
    </Figure>
  );
};

export default FigureNotion;

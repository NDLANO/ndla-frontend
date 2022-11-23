/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from 'i18next';

export const topicIntroductionMessages = (t: TFunction) => ({
  noContentBoxLabel: t('resource.noCoreResourcesAvailableUnspecific'),
  noContentBoxButtonText: t('resource.activateAdditionalResources'),
  shortcutButtonText: t('resource.shortcutButtonText'),
  coreTooltip: t('resource.tooltipCoreTopic'),
  additionalTooltip: t('resource.tooltipAdditionalTopic'),
});

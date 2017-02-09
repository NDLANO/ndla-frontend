/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import Tabs from 'ndla-tabs';
import { injectT } from '../../../i18n';
import TopicDescriptionList from './TopicDescriptionList';
import { TopicShape } from '../../../shapes';


function buildLicenseTabList(t, topics, subjectId) {
  const tabs = [];

  tabs.push({ key: 'topics', displayName: t('resources.tabs.topics'), content: <TopicDescriptionList subjectId={subjectId} topics={topics} /> });
  tabs.push({ key: 'learningresources', displayName: t('resources.tabs.learningresources'), content: <p>Læringsressurser</p> });

  return tabs;
}


const Resources = ({ topics, t, subjectId }) => {
  const tabs = buildLicenseTabList(t, topics, subjectId);
  return (
    <div className="c-resources u-margin-top-large">
      <Tabs tabs={tabs} />
    </div>
  );
};


Resources.propTypes = {
  subjectId: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
};


export default injectT(Resources);

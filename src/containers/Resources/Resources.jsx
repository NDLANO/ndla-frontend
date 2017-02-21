/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import Tabs from 'ndla-tabs';
import { injectT } from '../../i18n';


function buildTabList(t) {
  const tabs = [];

  tabs.push({ key: 'all', displayName: t('resources.tabs.all'), content: <p>Alle</p> });
  tabs.push({ key: 'learningpaths', displayName: t('resources.tabs.learningpaths'), content: <p>Læringsstier</p> });
  tabs.push({ key: 'subjectMaterial', displayName: t('resources.tabs.subjectMaterial'), content: <p>Fagstoff</p> });
  tabs.push({ key: 'activities', displayName: t('resources.tabs.activities'), content: <p>Aktiviteter</p> });

  return tabs;
}


class Resources extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const { t } = this.props;
    const tabs = buildTabList(t);
    return (
      <div className="u-margin-top-large">
        <Tabs tabs={tabs} />
      </div>
    );
  }
}

Resources.propTypes = {
};


export default compose(
  // connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(Resources);

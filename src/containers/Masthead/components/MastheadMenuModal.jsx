import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import { TopicMenuButton } from '@ndla/ui';
import { Context as StaticContext, Experiment, Variant } from '@ndla/abtest';

const experimentId = 'gKKvagBlQ5SyhxWP4TqK0g';
const experimentTrackerName = 'testingMenu';

const MastheadMenuModal = ({ children, onMenuExit, t }) => {
  console.log('onMenuExit', onMenuExit);
  return (
    <StaticContext.Consumer>
      {({ googleAccountId, experiments }) => (
        <Modal
          size="fullscreen"
          activateButton={
            <TopicMenuButton data-testid="masthead-menu-button">
              <Experiment
                id={experimentId}
                googleAccountId={googleAccountId}
                experiments={experiments}
                trackerName={experimentTrackerName}
              >
                <Variant variantIndex={0} original>
                  {t('masthead.menu.title')}
                </Variant>
                <Variant variantIndex={1}>
                  {t('abTests.masthead.menu.content')}
                </Variant>
                <Variant variantIndex={2}>
                  {t('abTests.masthead.menu.overview')}
                </Variant>
                <Variant variantIndex={3}>
                  {t('abTests.masthead.menu.subjectOverview')}
                </Variant>
              </Experiment>
            </TopicMenuButton>
          }
          animation="subtle"
          animationDuration={150}
          backgroundColor="grey"
          noBackdrop
          onClose={() => {
            // Log whenever the menu closes.
            const experiment = experiments.find(experiment => experiment.id === experimentId);
            console.log('hi!');
            console.log('experiment', experiment);
            if (experiment.variant && experiment.variant.index !== undefined) {
              const tracker = window.ga.getByName(experimentTrackerName);
              if (!tracker) {
                window.ga('create', googleAccountId, 'auto', {
                  name: experimentTrackerName,
                });
              }
              // Set data
              window.ga(() => {
                window.ga(`${experimentTrackerName}.set`, {
                  expId: experimentId,
                  expVar: experiments.find(experiment => experiment.id === experimentId).variant.index,
                });
                // Send it
                window.ga(`${experimentTrackerName}.send`, {
                  hitType: 'pageview',
                  eventCategory: 'User interactions',
                  eventAction: 'closeMenu',
                  hitCallback: () => {
                    console.log('data was sendt to GA');
                  }
                });
              });
            }
            // onMenuExit();
          }}>
          {children}
        </Modal>
      )}
    </StaticContext.Consumer>
  );
};

MastheadMenuModal.propTypes = {
  onMenuExit: PropTypes.func,
};

export default injectT(MastheadMenuModal);

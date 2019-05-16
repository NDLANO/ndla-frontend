import React from 'react';
import Modal from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import { TopicMenuButton } from '@ndla/ui';
import {
  ExperimentsContext,
  Experiment,
  Variant,
  isValidExperiment,
} from '@ndla/abtest';
import { Hamburger, Menu } from '@ndla/icons/common';

const experimentId = 'OtejUgVLRHmGTAGv7jbFyA';

const MastheadMenuModal = ({ t, children }) => (
  <ExperimentsContext.Consumer>
    {({ experiments }) => (
      <Modal
        size="fullscreen"
        onOpen={() => {
          if (isValidExperiment({ experiments, id: experimentId })) {
            // check if this experimentId exists in data from server
            // this event can be tracked by optimize to evaluate variant effectiveness
            window.ga('send', {
              hitType: 'event',
              eventCategory: 'User interactions',
              eventAction: 'MenuButtonOpen',
            });
          }
        }}
        activateButton={
          <TopicMenuButton Icon={null} data-testid="masthead-menu-button">
            <Experiment
              id={experimentId}
              experiments={experiments}
              onVariantMount={({ expId, expVar, isActiveExperiment }) => {
                if (isActiveExperiment) {
                  window.ga('set', { expId, expVar }); // Perhaps get GA from ndla/tracker?
                  window.ga('send', {
                    // report display of experiment variant to analytics/optimize
                    hitType: 'event',
                    eventCategory: 'AB test',
                    eventAction: 'Display variant',
                    fieldsObject: {
                      nonInteraction: true,
                    },
                  });
                }
              }}>
              <Variant variantIndex={0} original>
                <Menu /> {t('masthead.menu.title')} orginal
              </Variant>
              <Variant variantIndex={1}>
                <Menu /> {t('abTests.masthead.menu.subjectOverview')}
              </Variant>
              <Variant variantIndex={2}>
                <Menu /> {t('abTests.masthead.menu.overview')}
              </Variant>
              <Variant variantIndex={3}>
                <Menu /> {t('abTests.masthead.menu.topics')}
              </Variant>
              <Variant variantIndex={4}>
                <Hamburger /> {t('masthead.menu.title')}
              </Variant>
              <Variant variantIndex={5}>
                <Hamburger /> {t('abTests.masthead.menu.subjectOverview')}
              </Variant>
              <Variant variantIndex={6}>
                <Hamburger /> {t('abTests.masthead.menu.overview')}
              </Variant>
              <Variant variantIndex={7}>
                <Hamburger /> {t('abTests.masthead.menu.topics')}
              </Variant>
            </Experiment>
          </TopicMenuButton>
        }
        animation="subtle"
        animationDuration={150}
        backgroundColor="grey"
        noBackdrop>
        {children}
      </Modal>
    )}
  </ExperimentsContext.Consumer>
);

MastheadMenuModal.contentType = ExperimentsContext;

export default injectT(MastheadMenuModal);

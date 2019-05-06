import React, { Component } from 'react';
import Modal from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import { TopicMenuButton } from '@ndla/ui';
import { Context as StaticContext, Experiment, Variant, fetchVariantIndex } from '@ndla/abtest';
import { Play, Time, Menu } from '@ndla/icons/common';

const experimentId = 'OtejUgVLRHmGTAGv7jbFyA';

class MastheadMenuModal extends Component {
  componentDidMount() {
    const { variant } = window.ABTestExperiments(experimentId);
    console.log('variant', variant);
    // Track open data.
    console.log(window.ga);
    window.ga('set', {
      expId: experimentId,
      expVar: variant.index,
    });
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Rendered variant',
      eventAction: 'onRender',
      fieldsObject: {
        nonInteraction: true,
      },
      hitCallback: () => {
        console.log('Registered open render.');
      },
    });
  }
  render() {
    const { t, children } = this.props;
    return (
      <StaticContext.Consumer>
        {({ googleAccountId, experiments }) => (
          <Modal
            size="fullscreen"
            onOpen={() => {
              console.log('onOpen');
              const variantIndex = fetchVariantIndex({ id: experimentId, experiments });
              if (variantIndex && variantIndex.index !== undefined) {
                // Log to GA that we opened menu.
                /*
                const tracker = window.ga.getByName('menuTestOpen');
                if (!tracker) {
                  window.ga('create', googleAccountId, 'auto', {
                    name: 'menuTestOpen',
                  });
                  window.ga('menuTestOpen.set', {
                    expId: experimentId,
                    expVar: experiments.find(experiment => experiment.id === experimentId).variant.index,
                  });
                }
                */
                // Send data
                window.ga('send', {
                  hitType: 'event',
                  eventCategory: 'User interactions',
                  eventAction: 'MenuButtonOpen',
                  hitCallback: () => {
                    console.log('Open menu to Optimize');
                  }
                });
              }
            }}
            activateButton={
              <TopicMenuButton Icon={null} data-testid="masthead-menu-button">
                <Experiment
                  id={experimentId}
                  googleAccountId={googleAccountId}
                  experiments={experiments}
                >
                  <Variant variantIndex={0} original>
                    <Menu /> {t('masthead.menu.title')}
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
                    <Play /> {t('masthead.menu.title')}
                  </Variant>
                  <Variant variantIndex={5}>
                    <Play /> {t('abTests.masthead.menu.subjectOverview')}
                  </Variant>
                  <Variant variantIndex={6}>
                    <Play /> {t('abTests.masthead.menu.overview')}
                  </Variant>
                  <Variant variantIndex={7}>
                    <Play /> {t('abTests.masthead.menu.topics')}
                  </Variant>
                </Experiment>
              </TopicMenuButton>
            }
            animation="subtle"
            animationDuration={150}
            backgroundColor="grey"
            noBackdrop
          >
            {children}
          </Modal>
        )}
      </StaticContext.Consumer>
    )
  }
};

MastheadMenuModal.contentType = StaticContext;

export default injectT(MastheadMenuModal);

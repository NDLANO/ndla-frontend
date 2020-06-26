import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from "@ndla/i18n/lib/injectT";
import CopyTextButton from './CopyTextButton';
import { ArticleShape } from '../../shapes';


const OembedItem = ({ oembed, locale, t }) => (
    <div>
        <h2>{t('embedlink.heading')}</h2>
        <p>{t('embedlink.description')}</p>
        <CopyTextButton 
            copyTitle={t('embedlink.copyTitle')} 
            hasCopiedTitle={t('embedlink.hasCopiedTitle')}
            stringToCopy={oembed}
        />
    </div>
)

OembedItem.propTypes = {
    locale: PropTypes.string.isRequired,
    oembed: PropTypes.string.isRequired,
}

export default injectT(OembedItem, 'license.');
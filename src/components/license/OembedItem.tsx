import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';

interface Props {
  oembed: string;
}
const OembedItem = ({ oembed }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.embedlink.heading')}</h2>
      <p>{t('license.embedlink.description')}</p>
      <CopyTextButton
        copyTitle={t('license.embedlink.copyTitle')}
        hasCopiedTitle={t('license.embedlink.hasCopiedTitle')}
        stringToCopy={oembed}
      />
    </div>
  );
};

OembedItem.propTypes = {
  oembed: PropTypes.string.isRequired,
};

export default OembedItem;

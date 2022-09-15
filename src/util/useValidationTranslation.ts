import { useCallback } from 'react';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import messages from '../messages/messagesNB';

type SupportedFields = keyof typeof messages['validation']['fields'];

interface TranslationProps {
  field?: SupportedFields;
  type: FieldError['type'];
}

type Props = TranslationProps | string;

const useValidationTranslation = () => {
  const { t: internalT } = useTranslation();

  const t = useCallback(
    (translation: Props | string) => {
      if (typeof translation === 'string') {
        return internalT(translation);
      } else {
        const { type, field } = translation;
        if (type && field) {
          return internalT(`validation.${type}Field`, { field });
        } else {
          return internalT(`validation.${type}`);
        }
      }
    },
    [internalT],
  );

  return { t };
};

export default useValidationTranslation;

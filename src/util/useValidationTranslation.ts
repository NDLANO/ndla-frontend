/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback } from 'react';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import messages from '../messages/messagesNB';

type SupportedFields = keyof (typeof messages)['validation']['fields'];

interface TranslationProps {
  field?: SupportedFields;
  type: FieldError['type'];
  vars?: Record<string, any>;
}

type Props = TranslationProps | string;

const useValidationTranslation = () => {
  const { t: internalT } = useTranslation();

  const validationT = useCallback(
    (translation: Props | string) => {
      if (typeof translation === 'string') {
        return internalT(translation);
      } else {
        const { type, field, vars } = translation;
        if (type && field) {
          return internalT(`validation.${type}Field`, { field, ...vars });
        } else {
          return internalT(`validation.${type}`);
        }
      }
    },
    [internalT],
  );

  return { validationT };
};

export default useValidationTranslation;

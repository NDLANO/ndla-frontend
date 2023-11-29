/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  ModalContent,
} from '@ndla/modal';
import { Text } from '@ndla/typography';
import { useState } from 'react';
import {
  FormControl,
  Label,
  TextAreaV3,
  RadioButtonGroup,
  FieldHelper,
  FieldErrorMessage,
} from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { useSnack } from '@ndla/ui';
import { useNewFlagMutation } from '../../arenaMutations';
import handleError from '../../../../util/handleError';

const MAXIMUM_LENGTH_TEXTFIELD = 64;

const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const StyledText = styled(Text)`
  margin-left: auto;
`;

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-flow: column;
  gap: ${spacing.nsmall};
`;

const StyledRadioButtonGroup = styled(RadioButtonGroup)`
  > div {
    > label {
      ${fonts.sizes('16px')};
      font-weight: ${fonts.weight.semibold};
    }
  }
`;

interface FlagContentModalProps {
  id: number;
  onClose: () => void;
}

const FlagContentModalContent = ({ id, onClose }: FlagContentModalProps) => {
  const [flaggedReason, setFlaggedReason] = useState<string>('spam');
  const [reportReasonText, setReportReasonText] = useState<string>('');
  const { addNewFlag } = useNewFlagMutation();
  const { t } = useTranslation();
  const { addSnack } = useSnack();

  const sendReport = async () => {
    try {
      await addNewFlag({
        variables: {
          id,
          type: 'post',
          reason: flaggedReason === 'other' ? reportReasonText : flaggedReason,
        },
      });
      addSnack({
        content:
          'Takk for at du rapporterer innhold som ikke er i tråd med våre retningslinjer. Rapporten er sendt til vår moderator og vil bli gjennomgått så fort som mulig.',
        id: 'reportPostAdded',
      });
    } catch (err) {
      const typedError = err as { message?: string };
      addSnack({
        content: typedError.message,
        id: 'reportPostAddedError',
      });
      handleError(err);
    }
    onClose();
  };

  return (
    <ModalContent forceOverlay>
      <ModalHeader>
        <ModalTitle>Rapporter innlegg/kommentar</ModalTitle>
        <ModalCloseButton title={t('myNdla.folder.closeModal')} />
      </ModalHeader>
      <StyledModalBody>
        <Text element="p" textStyle="meta-text-medium" margin="none">
          Takk for at du rapporterer innhold som ikke er i tråd med våre
          retningslinjer. Hva er grunnen til at du rapporterer dette innholdet?
        </Text>
        <StyledRadioButtonGroup
          options={[
            { title: 'Det er spam', value: 'spam' },
            { title: 'Innholdet er støtende', value: 'offensive' },
            { title: 'Noe annet', value: 'other' },
          ]}
          direction="vertical"
          onChange={setFlaggedReason}
        />
        {flaggedReason === 'other' && (
          <FormControl id="flag-reason" isInvalid={!reportReasonText}>
            <Label textStyle="label-small" margin="none">
              Årsak til rapportering av innhold
            </Label>
            <TextAreaV3
              onChange={(e) => setReportReasonText(e.target.value)}
              maxLength={MAXIMUM_LENGTH_TEXTFIELD}
            />
            <StyledText element="p" textStyle="meta-text-medium" margin="none">
              {`${reportReasonText.length ?? 0}/${MAXIMUM_LENGTH_TEXTFIELD}`}
            </StyledText>
            {reportReasonText.length === MAXIMUM_LENGTH_TEXTFIELD && (
              <FieldHelper aria-live="polite">
                Maksimal lengde for tekstfeltet er nådd
              </FieldHelper>
            )}
            <FieldErrorMessage>Feltet kan ikke være tomt</FieldErrorMessage>
          </FormControl>
        )}
        <StyledButtonRow>
          <ButtonV2 onClick={onClose} variant="outline">
            {t('cancel')}
          </ButtonV2>
          <ButtonV2
            onClick={sendReport}
            disabled={flaggedReason === 'other' && !reportReasonText}
          >
            Send inn rapport
          </ButtonV2>
        </StyledButtonRow>
      </StyledModalBody>
    </ModalContent>
  );
};

export default FlagContentModalContent;

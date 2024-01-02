/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { fonts, spacing } from '@ndla/core';
import { FormControl, Label, TextAreaV3, RadioButtonGroup, FieldHelper, FieldErrorMessage } from '@ndla/forms';
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle, ModalContent } from '@ndla/modal';
import { Text } from '@ndla/typography';
import { useSnack } from '@ndla/ui';
import handleError from '../../../../util/handleError';
import { useNewFlagMutation } from '../../arenaMutations';

const MAXIMUM_LENGTH_TEXTFIELD = 120;

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
      font-size: ${fonts.size.text.metaText.small};
      font-weight: ${fonts.weight.semibold};
    }
  }
`;

const StyledTextArea = styled(TextAreaV3)`
  min-height: 74px;
`;

interface FlagPostModalProps {
  id: number;
  onClose: () => void;
}

const FlagPostModalContent = ({ id, onClose }: FlagPostModalProps) => {
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
        content: t('myNdla.arena.flag.success'),
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
        <ModalTitle>{t('myNdla.arena.flag.title')}</ModalTitle>
        <ModalCloseButton title={t('myNdla.folder.closeModal')} />
      </ModalHeader>
      <StyledModalBody>
        <Text element="p" textStyle="meta-text-medium" margin="none">
          {t('myNdla.arena.flag.disclaimer')}
        </Text>
        <form>
          <StyledRadioButtonGroup
            options={[
              { title: t('myNdla.arena.flag.spam'), value: 'spam' },
              { title: t('myNdla.arena.flag.offensive'), value: 'offensive' },
              { title: t('myNdla.arena.flag.other'), value: 'other' },
            ]}
            direction="vertical"
            onChange={setFlaggedReason}
          />
        </form>
        {flaggedReason === 'other' && (
          <FormControl id="flag-reason" isInvalid={!reportReasonText}>
            <Label textStyle="label-small" margin="none">
              {t('myNdla.arena.flag.reason')}
            </Label>
            <StyledTextArea
              onChange={(e) => setReportReasonText(e.target.value)}
              maxLength={MAXIMUM_LENGTH_TEXTFIELD}
            />
            <StyledText element="p" textStyle="meta-text-medium" margin="none">
              {`${reportReasonText.length ?? 0}/${MAXIMUM_LENGTH_TEXTFIELD}`}
            </StyledText>
            {reportReasonText.length === MAXIMUM_LENGTH_TEXTFIELD && (
              <FieldHelper aria-live="polite">{t('myNdla.arena.flag.maxLength')}</FieldHelper>
            )}
            <FieldErrorMessage>{t('myNdla.arena.flag.error')}</FieldErrorMessage>
          </FormControl>
        )}
        <StyledButtonRow>
          <ButtonV2 onClick={onClose} variant="outline">
            {t('cancel')}
          </ButtonV2>
          <ButtonV2 onClick={sendReport} disabled={flaggedReason === 'other' && !reportReasonText}>
            {t('myNdla.arena.flag.send')}
          </ButtonV2>
        </StyledButtonRow>
      </StyledModalBody>
    </ModalContent>
  );
};

export default FlagPostModalContent;

import {
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
} from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import FolderForm, { FolderFormValues } from '../Folders/FolderForm';

interface Props {
  onClose: () => void;
  onCreate: (values: FolderFormValues) => Promise<void>;
  folders?: GQLFolder[];
  parentFolder?: GQLFolder | null;
}

const CreateModalContent = ({
  onClose,
  parentFolder,
  folders,
  onCreate,
}: Props) => {
  const { t } = useTranslation();
  return (
    <ModalContent onCloseAutoFocus={onClose}>
      <ModalHeader>
        <ModalTitle>{t('myNdla.newFolder')}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <FolderForm
          siblings={parentFolder?.subfolders ?? folders ?? []}
          onSave={onCreate}
        />
      </ModalBody>
    </ModalContent>
  );
};

export default CreateModalContent;

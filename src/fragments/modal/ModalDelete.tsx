import ModalWrapper from '@/elements/ModalWrapper';
import { Button, Group, Stack, Text } from '@mantine/core';
import React from 'react';

interface ModalDeleteProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  onConfirm: () => void;
  name: string;
  isLoading?: boolean;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  opened,
  onClose,
  title = 'Confirm Delete',
  onConfirm,
  name,
  isLoading = false
}) => {
  return (
    <ModalWrapper opened={opened} close={onClose} title={title}>
      <Stack gap={16}>
        <Text fz={14} fw={400}>
          Are you sure you want to delete {name}?
        </Text>
        <Group gap={16} flex={1} justify='flex-end'>
          <Button loading={isLoading} onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant='light' disabled={isLoading} onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </ModalWrapper>
  );
};

export default ModalDelete;

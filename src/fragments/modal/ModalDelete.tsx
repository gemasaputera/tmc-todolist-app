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
          <Button
            p={12}
            miw={110}
            h={'auto'}
            loading={isLoading}
            styles={{
              root: {
                backgroundColor: '#154886',
                fontSize: 14,
                fontWeight: 500
              }
            }}
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button
            variant='light'
            p={12}
            h={'auto'}
            miw={110}
            disabled={isLoading}
            styles={{
              root: {
                backgroundColor: '#E3E8EF',
                color: '#154886',
                fontSize: 14,
                fontWeight: 500
              }
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </ModalWrapper>
  );
};

export default ModalDelete;

import { Modal } from '@mantine/core';
import React from 'react';

interface ModalWrapperProps {
  title?: string;
  opened: boolean;
  withCloseButton?: boolean;
  close: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  title,
  close,
  opened,
  withCloseButton = true
}) => {
  return (
    <Modal
      centered
      opened={opened}
      onClose={close}
      title={title}
      radius={'md'}
      withCloseButton={withCloseButton}
      styles={{
        header: {
          backgroundColor: '#F6F6F6'
        },
        body: {
          padding: '24px 32px'
        }
      }}
    >
      {children}
    </Modal>
  );
};

export default ModalWrapper;

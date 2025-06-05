import ModalWrapper from '@/elements/ModalWrapper';
import { Button, Group, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { defaultActiveSession, dummyTokenSession } from '@/constant';

interface ModalLogoutProps {
  opened: boolean;
  title?: string;
  onClose: () => void;
}

const ModalLogout: React.FC<ModalLogoutProps> = ({
  opened,
  onClose,
  title = 'Logout Confirmation'
}) => {
  const router = useRouter();

  const [users, setUsers, removeUsers] =
    useLocalStorage<string>(defaultActiveSession);
  const [token, setToken, removeToken] =
    useLocalStorage<string>(dummyTokenSession);
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Using Next.js 14 navigation
        router.replace('/login');
      } else {
        // Handle error cases
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  return (
    <ModalWrapper opened={opened} close={onClose} title={title}>
      <Stack gap={16}>
        <Text fz={14} fw={500}>
          Are you sure you want to logout?
        </Text>
        <Group gap={16} flex={1} justify='space-between'>
          <Button variant='light' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </Group>
      </Stack>
    </ModalWrapper>
  );
};

export default ModalLogout;

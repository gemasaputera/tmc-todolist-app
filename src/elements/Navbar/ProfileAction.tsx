'use client';

import ModalLogout from '@/fragments/modal/ModalLogout';
import { useUserSession } from '@/hooks/useUserSession';
import {
  Group,
  Text,
  Avatar,
  Menu,
  Skeleton,
  UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import React from 'react';

const ProfileAction: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const { user, loading } = useUserSession();

  const handleLogout = () => toggle();
  return (
    <>
      {loading ? (
        <Skeleton height={40} width={150} radius='md' />
      ) : (
        <Menu shadow='md' width={140}>
          <Menu.Target>
            <UnstyledButton>
              <Group gap={12}>
                <Text fz={'sm'} c={'#4F4F4F'}>
                  {user?.name || user?.email || ''}
                </Text>
                <Avatar
                  size='sm'
                  radius='xl'
                  src={user?.image || '/default_profile.png'}
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown className='box-shadow'>
            <Menu.Item
              leftSection={
                <Image
                  src='/icon_logout.svg'
                  width={24}
                  height={24}
                  alt='icon-logout'
                />
              }
              onClick={handleLogout}
            >
              Log Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}

      <ModalLogout opened={opened} onClose={toggle} />
    </>
  );
};

export default ProfileAction;

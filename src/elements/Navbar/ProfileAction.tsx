import ModalLogout from '@/fragments/modal/ModalLogout';
import { useUserSession } from '@/hooks/useUserSession';
import {
  Group,
  Text,
  Avatar,
  Menu,
  Tooltip,
  Skeleton,
  UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import React from 'react';
import styles from './styles.module.css';

interface ProfileActionProps {
  user: any;
}

const ProfileAction: React.FC<ProfileActionProps> = () => {
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
                <Tooltip label={user?.name || user?.email}>
                  <Text fz={16} c={'#4F4F4F'} className={styles.username}>
                    {user?.name || user?.email || ''}
                  </Text>
                </Tooltip>
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

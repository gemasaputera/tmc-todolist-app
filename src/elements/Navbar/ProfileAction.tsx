import ModalLogout from '@/fragments/modal/ModalLogout';
import { useUserSession } from '@/hooks/useUserSession';
import {
  Group,
  Stack,
  Text,
  Indicator,
  Avatar,
  Menu,
  Button,
  Tooltip,
  Skeleton
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
            <Button variant='transparent' p={0} h={'auto'}>
              <Group gap={12}>
                <Stack gap={0} justify='flex-end' align='flex-end'>
                  <Tooltip label={user?.name || user?.email}>
                    <Text fz={16} c={'#4F4F4F'} className={styles.username}>
                      {user?.name || user?.email || ''}
                    </Text>
                  </Tooltip>
                  <Text fz={12} c={'gray'}>
                    Admin
                  </Text>
                </Stack>
                <Indicator color='green' position='bottom-end' mr={5} mb={5}>
                  <Avatar
                    size='sm'
                    radius='xl'
                    src={user?.image || '/default_profile.png'}
                  />
                </Indicator>
              </Group>
            </Button>
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

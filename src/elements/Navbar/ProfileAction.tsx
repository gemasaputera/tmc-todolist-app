import { defaultActiveSession } from '@/constant';
import ModalLogout from '@/fragments/modal/ModalLogout';
import {
  Group,
  Stack,
  Text,
  Indicator,
  Avatar,
  Menu,
  Button,
  Tooltip
} from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import Image from 'next/image';
import React from 'react';
import styles from './styles.module.css';

interface ProfileActionProps {
  user: any;
}

const ProfileAction: React.FC<ProfileActionProps> = () => {
  const [opened, { toggle }] = useDisclosure(false);

  const [activeSession, setActiveSession] =
    useLocalStorage<string>(defaultActiveSession);
  const activeSessionData = JSON.parse(activeSession || '{}');
  const handleLogout = () => toggle();
  return (
    <>
      <Menu shadow="md" width={140}>
        <Menu.Target>
          <Button variant="transparent" p={0} h={'auto'}>
            <Group gap={12}>
              <Stack gap={0} justify="flex-end" align="flex-end">
                <Tooltip
                  label={activeSessionData?.name || activeSessionData?.email}
                >
                  <Text fz={16} c={'#4F4F4F'} className={styles.username}>
                    {activeSessionData?.name || activeSessionData?.email || ''}
                  </Text>
                </Tooltip>
                <Text fz={12} c={'gray'}>
                  Admin
                </Text>
              </Stack>
              <Indicator color="green" position="bottom-end" mr={5} mb={5}>
                <Avatar
                  size="sm"
                  radius="xl"
                  src={activeSessionData?.image || '/default_profile.png'}
                />
              </Indicator>
            </Group>
          </Button>
        </Menu.Target>

        <Menu.Dropdown className="box-shadow">
          <Menu.Item
            leftSection={
              <Image
                src="/icon_logout.svg"
                width={24}
                height={24}
                alt="icon-logout"
              />
            }
            onClick={handleLogout}
          >
            Log Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <ModalLogout opened={opened} onClose={toggle} />
    </>
  );
};

export default ProfileAction;

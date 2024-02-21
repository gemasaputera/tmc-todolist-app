'use client';

import Menu, { MenuData } from '@/elements/Menu';
import { ActionIcon, AppShell, Group, Stack } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import { GoHome } from 'react-icons/go';
import { HiOutlineDocumentText } from 'react-icons/hi2';

interface SidebarProps {
  toggle?: () => void;
}

const Sidebar:React.FC<SidebarProps> = ({
  toggle
}) => {
  const menulist: MenuData[] = [
    {
      icon: <GoHome size={20} />,
      title: 'Dashboard',
      url: '/dashboard'
    },
    {
      icon: <HiOutlineDocumentText size={20} />,
      title: 'Todo',
      url: '/'
    }
  ];
  return (
    <AppShell.Navbar p="md" className="box-shadow" withBorder={false}>
      <Group>
        <Group justify="space-between" flex={1}>
          <Image
            src={'/todolist-logo-horizontal.svg'}
            width={123}
            height={49}
            alt="logo-todolist"
          />
          <ActionIcon variant="transparent" onClick={toggle}>
            <Image
              src={'/icon_circle-blue.svg'}
              width={24}
              height={40}
              alt="avatar"
            />
          </ActionIcon>
        </Group>
      </Group>

      <Stack gap={4} mt={20}>
        <Menu menulist={menulist} />
      </Stack>
    </AppShell.Navbar>
  );
};

export default Sidebar;

import { ActionIcon, Burger, Group, TextInput } from '@mantine/core';
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import ProfileAction from './ProfileAction';

interface NavbarProps {
  user: any;
  collapsed?: boolean;
  toggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, collapsed, toggle }) => {
  return (
    <Group
      px={32}
      justify={collapsed ? 'space-between' : 'flex-end'}
      py={14}
      flex={1}
      gap={32}
    >
      {collapsed && <Burger opened={collapsed} onClick={toggle} size='sm' />}

      <ProfileAction user={user} />
    </Group>
  );
};

export default Navbar;

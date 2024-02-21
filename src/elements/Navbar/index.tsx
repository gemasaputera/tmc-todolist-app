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
    <Group px={32} py={14} flex={1} gap={32}>
      {collapsed && <Burger opened={collapsed} onClick={toggle} size="sm" />}
      <TextInput
        placeholder="Search"
        leftSection={<FiSearch size={16} />}
        flex={1}
        radius={'md'}
        styles={{
          input: { backgroundColor: '#f1f3f4', border: 'none' }
        }}
      />
      <ActionIcon variant="transparent">
        <HiOutlineCalendar color="#4F4F4F" size={24} />
      </ActionIcon>
      <ProfileAction user={user} />
    </Group>
  );
};

export default Navbar;

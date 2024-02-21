'use client';

import Navbar from '@/elements/Navbar';
import { AppShell, Group } from '@mantine/core';
import React from 'react';

interface HeaderProps {
  user?: any;
  collapsed?: boolean;
  toggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, collapsed, toggle }) => {
  return (
    <AppShell.Header h={'auto'} className="box-shadow" withBorder={false}>
      <Group h="100%" px={0}>
        <Navbar user={user} collapsed={collapsed} toggle={toggle} />
      </Group>
    </AppShell.Header>
  );
};

export default Header;

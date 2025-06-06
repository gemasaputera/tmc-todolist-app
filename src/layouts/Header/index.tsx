import Navbar from '@/elements/Navbar';
import { AppShellHeader, Group } from '@mantine/core';
import React from 'react';

const Header: React.FC = () => {
  return (
    <AppShellHeader h={'auto'} className='box-shadow' withBorder={false}>
      <Group h='100%' px={0}>
        <Navbar />
      </Group>
    </AppShellHeader>
  );
};

export default Header;

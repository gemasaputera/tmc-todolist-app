'use client';

import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import { AppShell } from '@mantine/core';
import React from 'react';
import TodoPage from './TodoPage';
import { useDisclosure } from '@mantine/hooks';

const MainPage = () => {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <AppShell
      layout='alt'
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: opened, mobile: opened }
      }}
      padding='md'
    >
      <Header collapsed={opened} toggle={() => toggle()} />
      <Sidebar toggle={() => toggle()} />
      <TodoPage />
    </AppShell>
  );
};

export default MainPage;

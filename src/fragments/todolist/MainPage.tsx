import Header from '@/layouts/Header';
import { AppShell } from '@mantine/core';
import React from 'react';
import TodoPage from './TodoPage';

const MainPage = () => {
  return (
    <AppShell
      layout='alt'
      header={{ height: 60 }}
      footer={{ height: 60 }}
      px='md'
      pb={40}
    >
      <Header />
      <TodoPage />
    </AppShell>
  );
};

export default MainPage;

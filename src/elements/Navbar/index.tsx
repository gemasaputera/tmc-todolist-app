import { Group } from '@mantine/core';
import React from 'react';
import ProfileAction from './ProfileAction';

const Navbar: React.FC = () => {
  return (
    <Group px={32} justify='flex-end' py={14} flex={1} gap={32}>
      <ProfileAction />
    </Group>
  );
};

export default Navbar;

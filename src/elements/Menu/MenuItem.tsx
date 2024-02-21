import { Group, Text } from '@mantine/core';
import React from 'react';
import styles from './styles.module.css';
import { MenuItemData } from '.';
import Link from 'next/link';

const MenuItem: React.FC<MenuItemData> = ({ icon, title, url, active }) => {
  return (
    <Link href={url} className={styles['menu-item']}>
      <Group
        mx={-16}
        gap={12}
        px={16}
        py={14}
        className={`${styles['menu-item__group']} ${
          active ? styles['active-menu'] : ''
        } `}
      >
        {icon}
        <Text fz={14} fw={400}>
          {title}
        </Text>
      </Group>
    </Link>
  );
};

export default MenuItem;

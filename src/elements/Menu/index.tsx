'use client';

import React from 'react';
import MenuItem from './MenuItem';
import { usePathname } from 'next/navigation';

export interface MenuData {
  title: string;
  url: string;
  icon: React.ReactNode;
}

export interface MenuItemData extends MenuData {
  active: boolean;
}

interface MenuProps {
  menulist: MenuData[];
}

const Menu: React.FC<MenuProps> = ({ menulist }) => {
  const pathname = usePathname();
  return (
    <>
      {menulist.map((menu: MenuData, index: number) => {
        return (
          <MenuItem {...menu} key={index} active={menu.url === pathname} />
        );
      })}
    </>
  );
};

export default Menu;

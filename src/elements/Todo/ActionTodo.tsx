import { ActionIcon, Menu } from '@mantine/core';
import React from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

interface ActionTodoProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSubtask: (id: string) => void;
  id: string;
}

const ActionTodo: React.FC<ActionTodoProps> = ({
  onEdit,
  onDelete,
  onSubtask,
  id
}) => {
  const options = [
    {
      label: 'Edit',
      onClick: () => onEdit(id)
    },
    {
      label: 'Delete',
      onClick: () => onDelete(id)
    },
    {
      label: 'Create Sub To-do',
      onClick: () => onSubtask(id)
    }
  ];
  return (
    <Menu shadow="md" width={156}>
      <Menu.Target>
        <ActionIcon variant="transparent">
          <HiOutlineDotsVertical color="#4F4F4F" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {options.map((option, index) => (
          <Menu.Item key={index} onClick={option.onClick}>
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionTodo;

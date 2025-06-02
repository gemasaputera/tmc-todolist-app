import { SubtaskData } from '@/types/todo';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { ActionIcon, Checkbox, Flex, Input, Text } from '@mantine/core';
import { FiTrash } from 'react-icons/fi';
import { useDisclosure } from '@mantine/hooks';
import ModalDelete from '@/fragments/modal/ModalDelete';

interface SubTodoItemProps extends SubtaskData {
  onChecked: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, value: string) => void;
}
const SubTodoItem: React.FC<SubTodoItemProps> = ({
  checked,
  description,
  onChecked,
  onChange,
  onDelete,
  id: subtaskId
}) => {
  const [openModal, { toggle }] = useDisclosure(false);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (!checked && description) {
      setValue(description);
    }
  }, [description, checked]);

  const handleDeleteSubstask = () => {
    toggle();
  };

  const onDeleteData = () => {
    onDelete(subtaskId);
    toggle();
  };

  const handleChangeTitle = (value: string) => {
    onChange(subtaskId, value);
    setValue(value);
  };
  return (
    <>
      <Flex
        px={15}
        py={13}
        gap={16}
        align={'center'}
        className={`box-shadow ${styles['container-subtask-todo-item']}`}
      >
        <Checkbox
          defaultChecked={checked}
          color='green'
          iconColor='#fff'
          size='sm'
          label=''
          onChange={(event) => onChecked(subtaskId, event.target.checked)}
        />
        {checked ? (
          <Text
            fz={16}
            fw={400}
            flex={1}
            style={{
              textDecoration: checked ? 'line-through' : 'none'
            }}
          >
            {description}
          </Text>
        ) : (
          <Input
            flex={1}
            variant='unstyled'
            placeholder={description}
            defaultValue={description}
            value={value}
            onChange={(event) => handleChangeTitle(event.target.value)}
            styles={{
              input: {
                fontSize: 16
              }
            }}
          />
        )}

        <ActionIcon variant='transparent' onClick={handleDeleteSubstask}>
          <FiTrash color='#4F4F4F' />
        </ActionIcon>
      </Flex>
      <ModalDelete
        opened={openModal}
        onClose={handleDeleteSubstask}
        onConfirm={onDeleteData}
        name={description || ''}
      />
    </>
  );
};

export default SubTodoItem;

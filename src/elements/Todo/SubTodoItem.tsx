import { SubtaskData } from '@/types/todo';
import React, { useEffect, useState, useRef } from 'react';
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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleChangeTitle = (newValue: string) => {
    // Update the local state immediately for a responsive UI
    setValue(newValue);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer to update the server after a delay
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Call the API to update the subtodo
        const response = await fetch(`/api/todo/subtodo/${subtaskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            description: newValue
          })
        });

        if (response.ok) {
          // Update the parent component's state
          onChange(subtaskId, newValue);
        } else {
          // If the API call fails, revert to the original value
          setValue(description || '');
        }
      } catch (error) {
        console.error('Error updating subtodo:', error);
        // If there's an error, revert to the original value
        setValue(description || '');
      }
    }, 500); // 500ms debounce time
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
            value={value || ''}
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

import { SubtaskData } from '@/types/todo';
import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.module.css';
import {
  ActionIcon,
  Checkbox,
  Flex,
  Loader,
  Text,
  Textarea
} from '@mantine/core';
import { FiTrash } from 'react-icons/fi';
import { useDisclosure } from '@mantine/hooks';
import ModalDelete from '@/fragments/modal/ModalDelete';

interface SubTodoItemProps extends SubtaskData {
  onChecked: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, value: string) => void;
  loading?: boolean;
}
const SubTodoItem: React.FC<SubTodoItemProps> = ({
  checked,
  description,
  onChecked,
  onChange,
  onDelete,
  loading = false,
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
    setValue(newValue);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
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
          onChange(subtaskId, newValue);
        } else {
          setValue(description || '');
        }
      } catch (error) {
        console.error('Error updating subtodo:', error);
        setValue(description || '');
      }
    }, 500);
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
        {loading ? (
          <Loader size={'xs'} />
        ) : (
          <Checkbox
            defaultChecked={checked}
            color='green'
            iconColor='#fff'
            size='sm'
            label=''
            onChange={(event) => onChecked(subtaskId, event.target.checked)}
          />
        )}
        {checked ? (
          <Text
            fz={16}
            fw={400}
            flex={1}
            td={checked ? 'line-through' : 'none'}
          >
            {description}
          </Text>
        ) : (
          <Textarea
            flex={1}
            variant='unstyled'
            placeholder={description}
            value={value || ''}
            autosize
            onChange={(event) => handleChangeTitle(event.target.value)}
            td={checked ? 'line-through' : 'none'}
            styles={{
              input: {
                fontSize: 16,
                fontWeight: 400
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

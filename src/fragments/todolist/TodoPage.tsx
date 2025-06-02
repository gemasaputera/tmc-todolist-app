'use client';

import { AppShell, Button, Group, Text, Title } from '@mantine/core';
import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import TodoList from './TodoList';
import IllustrationState from '@/elements/IllustrationState';
import { useDisclosure } from '@mantine/hooks';
import ModalCreateTodo, { FormCreateTodo } from '../modal/ModalCreateTodo';
import { ModalType } from '@/types/modal';
import styles from './styles.module.css';
import { TodoData } from '@/types/todo';
import ModalDelete from '../modal/ModalDelete';
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
  useTodos
} from '@/hooks/useTodos';

const TodoPage = () => {
  const [modalType, setModalType] = useState<ModalType>('create');
  const [selectedItem, setSelectedItem] = useState<TodoData | null>(null);
  const [openedModal, { toggle: toggleModal }] = useDisclosure(false);
  const [openedDelete, { toggle: toggleDelete }] = useDisclosure(false);

  // Use TanStack Query hooks
  const { data: listTodo = [], isLoading, isError } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleCreateTodo = () => {
    setSelectedItem(null);
    setModalType('create');
    toggleModal();
  };

  const handleEditTodo = (id: string) => {
    setSelectedItem(listTodo.find((item: TodoData) => item.id === id) || null);
    setModalType('update');
    toggleModal();
  };

  const handleDeleteTodo = (id: string) => {
    setSelectedItem(listTodo.find((item: TodoData) => item.id === id) || null);
    setModalType('delete');
    toggleDelete();
  };

  const handleCloseModal = () => toggleModal();

  const onDelete = async () => {
    if (!selectedItem) return;

    // Use the delete mutation from TanStack Query
    deleteTodoMutation.mutate(selectedItem.id, {
      onSuccess: () => {
        setSelectedItem(null);
        toggleDelete();
      }
    });
  };

  const onSubmit = async (values: FormCreateTodo) => {
    if (selectedItem?.id) {
      // Update existing todo
      updateTodoMutation.mutate(
        {
          id: selectedItem.id,
          todoData: {
            description: values.todo,
            dueDate: new Date(values.deadline)
          }
        },
        {
          onSuccess: () => {
            toggleModal();
          }
        }
      );
    } else {
      // Create new todo
      createTodoMutation.mutate(
        {
          description: values.todo,
          dueDate: new Date(values.deadline)
        },
        {
          onSuccess: () => {
            toggleModal();
          }
        }
      );
    }
  };
  return (
    <>
      <AppShell.Main pr={{ base: 0, md: 32 }}>
        <section className={styles['container-section']}>
          <Group align='center' mb={32}>
            <Text fz={24}>📝 Todo</Text>
            <Button
              rightSection={<HiPlus />}
              variant='outline'
              radius={'md'}
              px={16}
              py={14}
              h={'auto'}
              styles={{
                root: {
                  border: '1px solid #BDBDBD',
                  color: '#4F4F4F'
                }
              }}
              onClick={handleCreateTodo}
            >
              Create Todo
            </Button>
          </Group>

          {isLoading ? (
            <Text>Loading todos...</Text>
          ) : isError ? (
            <Text color='red'>Error loading todos. Please try again.</Text>
          ) : listTodo.length > 0 ? (
            <TodoList
              data={listTodo}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          ) : (
            <IllustrationState />
          )}
        </section>
      </AppShell.Main>

      <ModalCreateTodo
        onClose={handleCloseModal}
        onSubmit={onSubmit}
        opened={openedModal}
        type={modalType}
        data={selectedItem}
        key={selectedItem?.id || 'create'}
        selectedItem={selectedItem}
        isLoading={createTodoMutation.isPending || updateTodoMutation.isPending}
      />

      <ModalDelete
        opened={openedDelete}
        onClose={toggleDelete}
        onConfirm={onDelete}
        name={selectedItem?.description || ''}
        isLoading={deleteTodoMutation.isPending}
      />
    </>
  );
};

export default TodoPage;

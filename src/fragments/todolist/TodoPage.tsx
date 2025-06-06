'use client';

import { AppShell, Button, Grid, Group, Text, Title } from '@mantine/core';
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
  useTodos,
  useGenerateAITodos
} from '@/hooks/useTodos';
import { useProject } from '@/hooks/useProject';
import ModalGenerateAi from '../modal/ModalGenerateAi';
import { FaMagic } from 'react-icons/fa';

const TodoPage = () => {
  const [modalType, setModalType] = useState<ModalType>('create');
  const [selectedItem, setSelectedItem] = useState<TodoData | null>(null);
  const [openedModal, { toggle: toggleModal }] = useDisclosure(false);
  const [openedDelete, { toggle: toggleDelete }] = useDisclosure(false);
  const [openedModalGenerateAi, { toggle: toggleGenerateAi }] =
    useDisclosure(false);

  // Use TanStack Query hooks
  const { data: listTodo = [], isLoading, isError } = useTodos();
  const { data: projects = [] } = useProject();
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
            dueDate: new Date(values.deadline),
            priority: values.priority,
            projectId: values.projectId
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
          dueDate: new Date(values.deadline),
          priority: values.priority,
          projectId: values.projectId
        },
        {
          onSuccess: () => {
            toggleModal();
          }
        }
      );
    }
  };

  const handleGenerate = () => toggleGenerateAi();

  return (
    <>
      <AppShell.Main pr={{ base: 0, md: 32 }}>
        <section className={styles['container-section']}>
          <Grid gutter={16} mb={24}>
            <Grid.Col span={{ base: 12, md: 'content' }}>
              <Text fz={24}>📝 Todo</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 'content' }}>
              {/* <Button
                rightSection={<HiPlus />}
                variant='outline'
                onClick={handleCreateTodo}
              >
                Create Todo
              </Button> */}
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 'content' }}>
              <Button onClick={handleGenerate} rightSection={<FaMagic />}>
                Generate AI
              </Button>
            </Grid.Col>
          </Grid>

          {isLoading ? (
            <Text>Loading todos...</Text>
          ) : isError ? (
            <Text c='red'>Error loading todos. Please try again.</Text>
          ) : listTodo.length > 0 ? (
            <TodoList
              data={listTodo}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              onAddTodo={handleCreateTodo}
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
        projects={projects}
      />

      <ModalDelete
        opened={openedDelete}
        onClose={toggleDelete}
        onConfirm={onDelete}
        name={selectedItem?.description || ''}
        isLoading={deleteTodoMutation.isPending}
      />

      <ModalGenerateAi
        onClose={toggleGenerateAi}
        opened={openedModalGenerateAi}
      />
    </>
  );
};

export default TodoPage;

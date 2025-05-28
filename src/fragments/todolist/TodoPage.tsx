'use client';

import { AppShell, Button, Group, Text } from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import TodoList from './TodoList';
import IllustrationState from '@/elements/IllustrationState';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import ModalCreateTodo, { FormCreateTodo } from '../modal/ModalCreateTodo';
import { ModalType } from '@/types/modal';
import styles from './styles.module.css';
import { TodoData } from '@/types/todo';
import { v4 as uuidv4 } from 'uuid';
import ModalDelete from '../modal/ModalDelete';
import { defaultActiveSession, userTodoList } from '@/constant';

const TodoPage = () => {
  const [modalType, setModalType] = useState<ModalType>('create');
  const [selectedItem, setSelectedItem] = useState<TodoData | null>(null);

  const [activeSession] = useLocalStorage<string>(defaultActiveSession);
  const [dataUserTodoList, setDataUserTodoList] =
    useLocalStorage<string>(userTodoList);
  const getInitialTodoList = useCallback(() => {
    if (dataUserTodoList) {
      const _dataUserTodoList = JSON.parse(dataUserTodoList);
      const profile = activeSession ? JSON.parse(activeSession) : {};
      const _data = _dataUserTodoList.find(
        (item: any) => item.email === profile?.email
      );
      if (_data && _data.todoList) {
        return _data.todoList;
      }
    }
    return [];
  }, [activeSession, dataUserTodoList]);
  const [openedModal, { toggle: toggleModal }] = useDisclosure(false);
  const [openedDelete, { toggle: toggleDelete }] = useDisclosure(false);
  const [listTodo, setListTodo] = useState<TodoData[]>(getInitialTodoList());

  useEffect(() => {
    setListTodo(getInitialTodoList());
  }, [getInitialTodoList]);

  const saveToLocalstorage = useCallback(
    (dataTodo: any) => {
      if (dataTodo.length === 0) return;
      if (!dataUserTodoList) {
        const profile = activeSession ? JSON.parse(activeSession) : {};
        const _dataUserTodoList = [
          {
            email: profile?.email,
            todoList: dataTodo
          }
        ];
        setDataUserTodoList(JSON.stringify(_dataUserTodoList));
      } else {
        const _dataUserTodoList = JSON.parse(dataUserTodoList);
        const profile = activeSession ? JSON.parse(activeSession) : {};
        const index = _dataUserTodoList.findIndex(
          (item: any) => item.email === profile?.email
        );
        if (index === -1) {
          _dataUserTodoList.push({
            email: profile?.email,
            todoList: dataTodo
          });
        } else {
          _dataUserTodoList[index].todoList = dataTodo;
        }
        setDataUserTodoList(JSON.stringify(_dataUserTodoList));
      }
    },
    [activeSession, dataUserTodoList, setDataUserTodoList]
  );

  useEffect(() => {
    saveToLocalstorage(listTodo);
  }, [listTodo, saveToLocalstorage]);

  const handleCreateTodo = () => {
    setSelectedItem(null);
    setModalType('create');
    toggleModal();
  };

  const handleEditTodo = (id: string) => {
    setSelectedItem(listTodo.find((item) => item.id === id) || null);
    setModalType('update');
    toggleModal();
  };

  const handleDeleteTodo = (id: string) => {
    setSelectedItem(listTodo.find((item) => item.id === id) || null);
    setModalType('delete');
    toggleDelete();
  };

  const handleCloseModal = () => toggleModal();

  const onDelete = () => {
    const _data = listTodo.filter((item) => item.id !== selectedItem?.id);
    setListTodo(_data);
    setSelectedItem(null);
    toggleDelete();
  };

  const onSubmit = (values: FormCreateTodo) => {
    if (modalType === 'update') {
      const _data = listTodo.map((item) => {
        if (item.id === selectedItem?.id) {
          return { ...item, title: values.todo, duedate: values.deadline };
        }
        return item;
      });

      setListTodo(_data);
      toggleModal();
      return;
    }

    const id = uuidv4();
    const _data = [
      ...listTodo,
      {
        id: id,
        checked: false,
        duedate: values.deadline,
        subtask: [],
        title: values.todo
      }
    ];

    setListTodo(_data);
    toggleModal();
  };

  return (
    <>
      <AppShell.Main pr={32}>
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
              Created Todo
            </Button>
          </Group>

          {listTodo.length > 0 && (
            <TodoList
              data={listTodo}
              setListTodo={setListTodo}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          )}

          {listTodo.length === 0 && <IllustrationState />}
        </section>
      </AppShell.Main>

      <ModalCreateTodo
        onClose={handleCloseModal}
        onSubmit={onSubmit}
        opened={openedModal}
        type={modalType}
        data={selectedItem}
        key={selectedItem?.id || 'create'}
      />

      <ModalDelete
        opened={openedDelete}
        onClose={toggleDelete}
        onConfirm={onDelete}
        name={selectedItem?.title || ''}
      />
    </>
  );
};

export default TodoPage;

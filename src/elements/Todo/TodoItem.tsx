import { Checkbox, Flex, Stack, Text } from '@mantine/core';
import React from 'react';
import styles from './styles.module.css';
import { SubtaskData, TodoData } from '@/types/todo';
import dayjs from 'dayjs';
import { formatDate } from '@/utils/formatDate';
import ActionTodo from './ActionTodo';
import SubTodoItem from './SubTodoItem';
import { useDeleteSubTodo, useUpdateSubTodo } from '@/hooks/useSubTodos';

interface TodoItemProps extends TodoData {
  onChecked: (id: string, checked: boolean) => void;
  onCheckedSubtask: (id: string, subtask: SubtaskData[]) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSubtask: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  checked,
  dueDate,
  description,
  subTodos,
  onChecked,
  onCheckedSubtask,
  onEdit,
  onDelete,
  onSubtask,
  id
}) => {
  const today = dayjs().startOf('day');
  const due = dayjs(dueDate, 'DD/MM/YYYY HH:mm').startOf('day');
  const dateColor = () => {
    if (due.isBefore(today) && !checked) {
      return 'red';
    }
    if (due.isSame(today) && !checked) {
      return 'green';
    }
    return '#154886';
  };

  const dateLabel = () => {
    if (due.isBefore(today) && !checked) {
      return `Overdue - ${formatDate(new Date(dueDate), 'DD/MM/YYYY')}`;
    }
    if (due.isSame(today) && !checked) {
      return 'Today';
    }
    return formatDate(new Date(dueDate), 'DD/MM/YYYY');
  };

  const handleCheckedSubtask = (subtaskId: string, checked: boolean) => {
    const _subtask = subTodos.map((item) => {
      if (item.id === subtaskId) {
        return { ...item, checked: checked };
      }
      return item;
    });
    onCheckedSubtask(id, _subtask);
  };

  const handleChangeTitle = (subtaskId: string, value: string) => {
    updateSubTodoMutation.mutate(
      { id: subtaskId, description: value },
      {
        onSuccess: () => {
          const _subtask = subTodos.map((item) => {
            if (item.id === subtaskId) {
              return { ...item, description: value };
            }
            return item;
          });
          onCheckedSubtask(id, _subtask);
        }
      }
    );
  };

  const deleteSubTodoMutation = useDeleteSubTodo();
  const updateSubTodoMutation = useUpdateSubTodo();

  const handleDeleteSubstask = (subtaskId: string) => {
    deleteSubTodoMutation.mutate(subtaskId, {
      onSuccess: () => {
        const _subtask = subTodos.filter((item) => item.id !== subtaskId);
        onCheckedSubtask(id, _subtask);
      }
    });
  };

  return (
    <Stack gap={0} className={`box-shadow ${styles['container-todo-item']}`}>
      <Flex px={15} py={13} gap={16} align={'center'}>
        <Checkbox
          defaultChecked={checked}
          color='green'
          iconColor='#fff'
          size='sm'
          label=''
          onChange={(event) => onChecked(id, event.target.checked)}
        />
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
        <Text fz={13} fw={400} c={dateColor()}>
          {dateLabel()}
        </Text>
        <ActionTodo
          onDelete={onDelete}
          onEdit={onEdit}
          onSubtask={onSubtask}
          id={id}
        />
      </Flex>
      {subTodos.length > 0 && (
        <Stack gap={15} px={15} pb={15}>
          {subTodos.map((item) => (
            <SubTodoItem
              key={item.id}
              {...item}
              onChecked={handleCheckedSubtask}
              onDelete={handleDeleteSubstask}
              onChange={handleChangeTitle}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default TodoItem;

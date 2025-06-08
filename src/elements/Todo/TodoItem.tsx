import { Checkbox, Group, Loader, Paper, Stack, Text } from '@mantine/core';
import React from 'react';
import { TodoData, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/todo';
import ActionTodo from './ActionTodo';
import SubTodoItem from './SubTodoItem';
import { useDeleteSubTodo, useUpdateSubTodo } from '@/hooks/useSubTodos';
import { Tooltip } from '@mantine/core';
import { FaExclamationCircle } from 'react-icons/fa';

interface TodoItemProps extends TodoData {
  onChecked: (id: string, checked: boolean) => void;
  onCheckedSubtask: (id: string, checked: boolean) => void;
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
  id,
  priority = 1
}) => {
  const getPriorityColor = (priorityLevel: number) => {
    return (
      PRIORITY_COLORS[priorityLevel as keyof typeof PRIORITY_COLORS] ||
      PRIORITY_COLORS[1]
    );
  };

  const getPriorityLabel = (priorityLevel: number) => {
    return (
      PRIORITY_LABELS[priorityLevel as keyof typeof PRIORITY_LABELS] ||
      PRIORITY_LABELS[1]
    );
  };
  const handleCheckedSubtask = (subtaskId: string, checked: boolean) => {
    onCheckedSubtask(subtaskId, checked);
  };

  const handleChangeTitle = (subtaskId: string, value: string) => {
    updateSubTodoMutation.mutate({ id: subtaskId, description: value });
  };

  const deleteSubTodoMutation = useDeleteSubTodo();
  const updateSubTodoMutation = useUpdateSubTodo();

  const handleDeleteSubstask = (subtaskId: string) => {
    deleteSubTodoMutation.mutate(subtaskId);
  };

  return (
    <Paper withBorder radius={'lg'}>
      <Stack gap={0}>
        <Group p={16} align='flex-start'>
          {updateSubTodoMutation.isPending ||
          deleteSubTodoMutation.isPending ? (
            <Loader size={'xs'} />
          ) : (
            <Checkbox
              defaultChecked={checked}
              color='green'
              iconColor='#fff'
              size='sm'
              label=''
              onChange={(event) => onChecked(id, event.target.checked)}
            />
          )}
          <Group gap={4} flex={1}>
            <Text
              fz={16}
              fw={400}
              style={{
                textDecoration: checked ? 'line-through' : 'none'
              }}
            >
              {description}
            </Text>
            <Tooltip
              label={`Priority: ${getPriorityLabel(priority)}`}
              position='top'
              withArrow
            >
              <FaExclamationCircle
                color={getPriorityColor(priority)}
                size={16}
              />
            </Tooltip>
          </Group>
          <ActionTodo
            onDelete={onDelete}
            onEdit={onEdit}
            onSubtask={onSubtask}
            id={id}
          />
        </Group>
        {subTodos.length > 0 && (
          <Stack gap={15} px={15} pb={15}>
            {subTodos.map((item) => (
              <SubTodoItem
                key={item.id}
                {...item}
                onChecked={handleCheckedSubtask}
                onDelete={handleDeleteSubstask}
                onChange={handleChangeTitle}
                loading={
                  updateSubTodoMutation.isPending ||
                  deleteSubTodoMutation.isPending
                }
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default TodoItem;

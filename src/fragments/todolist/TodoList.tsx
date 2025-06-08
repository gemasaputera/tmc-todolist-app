import TodoItem from '@/elements/Todo/TodoItem';
import { TodoData } from '@/types/todo';
import { Stack, Text, Button, ActionIcon, Group } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useToggleTodoCompletion } from '@/hooks/useTodos';
import {
  useCreateSubTodo,
  useToggleSubTodoCompletion
} from '@/hooks/useSubTodos';
import { HiPlus } from 'react-icons/hi';

interface TodoListProps {
  data: TodoData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTodo?: (date: string) => void;
}

interface GroupedTodos {
  [date: string]: TodoData[];
}

const TodoList: React.FC<TodoListProps> = ({
  data,
  onEdit,
  onDelete,
  onAddTodo
}) => {
  const [groupedData, setGroupedData] = useState<GroupedTodos>({});
  const toggleTodoMutation = useToggleTodoCompletion();
  const createSubTodoMutation = useCreateSubTodo();
  const toggleSubTodoMutation = useToggleSubTodoCompletion();

  useEffect(() => {
    if (data.length > 0) {
      const grouped = data.reduce((acc: GroupedTodos, todo) => {
        const dateKey = dayjs(todo.dueDate).format('DD MMM YYYY');

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        acc[dateKey].push(todo);

        return acc;
      }, {});

      const sortedGrouped: GroupedTodos = {};
      Object.keys(grouped)
        .sort(
          (a, b) =>
            dayjs(a, 'DD MMM YYYY').valueOf() -
            dayjs(b, 'DD MMM YYYY').valueOf()
        )
        .forEach((key) => {
          sortedGrouped[key] = grouped[key].sort((a, b) => {
            if (a.checked !== b.checked) {
              return a.checked ? 1 : -1;
            }
            return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
          });
        });

      setGroupedData(sortedGrouped);
    }
  }, [data]);

  const handleCheckedTodo = (id: string, checked: boolean) => {
    toggleTodoMutation.mutate({ id, checked });
  };

  const handleCheckedSubtask = (id: string, checked: boolean) => {
    toggleSubTodoMutation.mutate({ id, completed: checked });
  };

  const handleAddSubtask = (id: string) => {
    createSubTodoMutation.mutate({
      todoId: id,
      description: `New sub Todo ${data.length + 1}`
    });
  };

  return (
    <Stack gap={24}>
      {Object.entries(groupedData).map(([date, todos]) => (
        <div key={date}>
          <Stack gap={16}>
            <Group justify='space-between' align='center'>
              <Text size='lg' fw={600}>
                {date}
              </Text>
              {onAddTodo && (
                <ActionIcon
                  onClick={() => onAddTodo(date)}
                  c={'dark'}
                  variant='transparent'
                >
                  <HiPlus />
                </ActionIcon>
              )}
            </Group>
            <Stack gap={14}>
              {todos.map((item: TodoData) => (
                <TodoItem
                  key={item.id}
                  {...item}
                  onChecked={handleCheckedTodo}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onSubtask={handleAddSubtask}
                  onCheckedSubtask={handleCheckedSubtask}
                />
              ))}
            </Stack>
          </Stack>
        </div>
      ))}
    </Stack>
  );
};

export default TodoList;

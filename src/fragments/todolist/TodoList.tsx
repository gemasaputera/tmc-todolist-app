import Card from '@/elements/Card';
import TodoItem from '@/elements/Todo/TodoItem';
import { TodoData } from '@/types/todo';
import { Grid, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useToggleTodoCompletion } from '@/hooks/useTodos';
import { useCreateSubTodo } from '@/hooks/useSubTodos';

interface TodoListProps {
  data: TodoData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ data, onEdit, onDelete }) => {
  const [listData, setListData] = useState<TodoData[]>([]);
  const toggleTodoMutation = useToggleTodoCompletion();
  const createSubTodoMutation = useCreateSubTodo();

  useEffect(() => {
    if (data.length > 0) {
      const _data = data.sort(
        (a, b) =>
          dayjs(b.dueDate).millisecond() - dayjs(a.dueDate).millisecond()
      );
      setListData(_data);
    }
  }, [data]);

  const handleCheckedTodo = (id: string, checked: boolean) => {
    // Use the toggle todo mutation from TanStack Query
    toggleTodoMutation.mutate({ id, checked });
  };

  const handleCheckedSubtask = (id: string, subtask: any) => {
    // This will be handled by the API through query invalidation
  };

  const handleAddSubtask = (id: string) => {
    // Use the create subtodo mutation from TanStack Query
    createSubTodoMutation.mutate({
      todoId: id,
      description: `New sub Todo ${data.length + 1}`
    });
  };

  return (
    <Grid gutter={{ base: 12, md: 40 }}>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card title='Not Checked'>
          <Stack gap={14}>
            {listData
              .filter((item) => !item.checked)
              .sort(
                (a, b) =>
                  dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf()
              )
              .map((item: TodoData) => (
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
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card title='Checked'>
          <Stack gap={14}>
            {listData
              .filter((item) => item.checked)
              .sort(
                (a, b) =>
                  dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf()
              )
              .map((item: TodoData) => (
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
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default TodoList;

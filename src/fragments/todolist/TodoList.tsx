import Card from '@/elements/Card';
import TodoItem from '@/elements/Todo/TodoItem';
import { TodoData } from '@/types/todo';
import { Grid, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

interface TodoListProps {
  data: TodoData[];
  setListTodo: (data: any) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  data,
  setListTodo,
  onEdit,
  onDelete
}) => {
  const [listData, setListData] = useState<TodoData[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      const _data = data.sort(
        (a, b) =>
          dayjs(b.duedate).millisecond() - dayjs(a.duedate).millisecond()
      );
      setListData(_data);
    }
  }, [data]);

  const handleCheckedTodo = (id: string, checked: boolean) => {
    setListTodo(
      listData.map((item) => {
        if (item.id === id) {
          const _subtask = item.subTodos.map((subtask) => {
            return { ...subtask, checked: checked };
          });
          return { ...item, checked: checked, subtask: _subtask };
        }
        return item;
      })
    );
  };

  const handleCheckedSubtask = (id: string, subtask: any) => {
    setListTodo(
      listData.map((item) => {
        if (item.id === id) {
          return { ...item, subtask: subtask };
        }
        return item;
      })
    );
  };

  const handleAddSubtask = async (id: string) => {
    try {
      const createSubtodo = await fetch('api/todo/subtodo', {
        method: 'POST',
        body: JSON.stringify({
          todoId: id,
          description: `New sub Todo ${listData.length + 1}`
        })
      });
    } catch (error) {
      console.log(error);
    }
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
                  dayjs(a.duedate).valueOf() - dayjs(b.duedate).valueOf()
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
                  dayjs(a.duedate).valueOf() - dayjs(b.duedate).valueOf()
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

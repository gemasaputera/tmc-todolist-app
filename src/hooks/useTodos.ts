import { TodoData } from '@/types/todo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

// Define the key for todo queries
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const
};

// Fetch all todos
export const useTodos = () => {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/todo');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();

      // Map the 'completed' property from the API to the 'checked' property used in the frontend
      return (data?.data || []).map((todo: any) => ({
        ...todo,
        checked: todo.completed, // Map the completed field to checked
        subTodos: (todo.subTodos || []).map((subTodo: any) => ({
          ...subTodo,
          checked: subTodo.completed // Map the completed field to checked for subtodos
        }))
      }));
    }
  });
};

// Create a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoData: { description: string; dueDate: Date }) => {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      notifications.show({
        title: 'Success',
        message: 'Todo created successfully',
        color: 'green'
      });
    },
    onError: (error) => {
      console.error('Error creating todo:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create todo',
        color: 'red'
      });
    }
  });
};

// Update a todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      todoData
    }: {
      id: string;
      todoData: { description?: string; dueDate?: Date; completed?: boolean };
    }) => {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      notifications.show({
        title: 'Success',
        message: 'Todo updated successfully',
        color: 'green'
      });
    },
    onError: (error) => {
      console.error('Error updating todo:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update todo',
        color: 'red'
      });
    }
  });
};

// Delete a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      notifications.show({
        title: 'Success',
        message: 'Todo deleted successfully',
        color: 'green'
      });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete todo',
        color: 'red'
      });
    }
  });
};

// Toggle todo completion status
export const useToggleTodoCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: checked })
      });

      if (!response.ok) {
        throw new Error('Failed to update todo status');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating todo status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update todo status',
        color: 'red'
      });
    }
  });
};

// Generate todos with AI
export const useGenerateAITodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { category: string; input: string }) => {
      const response = await fetch('/api/todo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate AI todos');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      notifications.show({
        title: 'Success',
        message: `Generated ${data.data?.length || 0} AI todos successfully`,
        color: 'green'
      });
    },
    onError: (error: Error) => {
      console.error('Error generating AI todos:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to generate AI todos',
        color: 'red'
      });
    }
  });
};

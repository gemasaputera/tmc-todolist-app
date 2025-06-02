import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { todoKeys } from './useTodos';

// Create a new subtodo
export const useCreateSubTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      todoId,
      description
    }: {
      todoId: string;
      description: string;
    }) => {
      const response = await fetch('/api/todo/subtodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todoId, description })
      });

      if (!response.ok) {
        throw new Error('Failed to create subtodo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      notifications.show({
        title: 'Success',
        message: 'Sub todo created successfully',
        color: 'green'
      });
    },
    onError: (error) => {
      console.error('Error creating sub todo:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create sub todo',
        color: 'red'
      });
    }
  });
};

// Update a subtodo
export const useUpdateSubTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      description
    }: {
      id: string;
      description: string;
    }) => {
      const response = await fetch(`/api/todo/subtodo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      });

      if (!response.ok) {
        throw new Error('Failed to update sub todo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating sub todo:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update sub todo',
        color: 'red'
      });
    }
  });
};

// Delete a subtodo
export const useDeleteSubTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todo/subtodo/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete sub todo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the todos list query to refetch the data
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      notifications.show({
        title: 'Success',
        message: 'Sub todo deleted successfully',
        color: 'green'
      });
    },
    onError: (error) => {
      console.error('Error deleting sub todo:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete sub todo',
        color: 'red'
      });
    }
  });
};

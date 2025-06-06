import { useQuery } from '@tanstack/react-query';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const
};

export const useProject = () => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/project');
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();

      return data?.data || [];
    }
  });
};

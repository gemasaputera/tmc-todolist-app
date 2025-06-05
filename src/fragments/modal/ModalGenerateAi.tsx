import ModalWrapper from '@/elements/ModalWrapper';
import { useGenerateAITodos } from '@/hooks/useTodos';
import { Button, Select, Stack, Text } from '@mantine/core';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaMagic } from 'react-icons/fa';

type CategoryPrompts = 'travel' | 'skill' | 'health' | 'home' | 'finance';

interface FormData {
  category: CategoryPrompts;
  input: string;
}

interface ModalGenerateAiProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
}

const ModalGenerateAi: React.FC<ModalGenerateAiProps> = ({
  opened,
  onClose,
  title = 'Generate AI Todos'
}) => {
  const generateAITodos = useGenerateAITodos();
  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      category: 'health',
      input: ''
    }
  });

  const selectedCategory = watch('category');

  const categoryOptions = [
    { value: 'travel', label: 'Travel Planning' },
    { value: 'skill', label: 'Skill Learning' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'home', label: 'Home Organization' },
    { value: 'finance', label: 'Financial Wellness' }
  ];

  const travelPlaces: string[] = [
    'Japan',
    'Europe',
    'Southeast Asia',
    'United States',
    'Australia',
    'South America',
    'Africa'
  ];

  const skillOptions: string[] = [
    'JavaScript Programming',
    'Python Programming',
    'React Development',
    'Machine Learning',
    'Data Science',
    'UI/UX Design',
    'Digital Marketing',
    'Photography',
    'Guitar Playing',
    'Cooking'
  ];

  const onSubmit = (data: FormData) => {
    generateAITodos.mutate(
      { category: data.category, input: data.input },
      {
        onSuccess: () => {
          reset();
          onClose();
        }
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <ModalWrapper opened={opened} close={handleClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap='md'>
          <Controller
            name='category'
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label='Category'
                placeholder='Select a category'
                data={categoryOptions}
                error={fieldState.error?.message}
                required
              />
            )}
          />

          {(selectedCategory === 'travel' || selectedCategory === 'skill') && (
            <Controller
              name='input'
              control={control}
              rules={{
                required: `${
                  selectedCategory === 'travel' ? 'Destination' : 'Skill'
                } is required`
              }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label={
                    selectedCategory === 'travel'
                      ? 'Travel Destination'
                      : 'Skill to Learn'
                  }
                  placeholder={`Select ${
                    selectedCategory === 'travel' ? 'a destination' : 'a skill'
                  }`}
                  data={
                    selectedCategory === 'travel' ? travelPlaces : skillOptions
                  }
                  error={fieldState.error?.message}
                  searchable
                  required
                />
              )}
            />
          )}

          {selectedCategory !== 'travel' && selectedCategory !== 'skill' && (
            <Text size='sm' c='dimmed'>
              AI will generate {selectedCategory} todos automatically based on
              best practices.
            </Text>
          )}

          <Button
            type='submit'
            loading={generateAITodos.isPending}
            disabled={generateAITodos.isPending}
            fullWidth
            rightSection={<FaMagic />}
          >
            {generateAITodos.isPending ? 'Generating...' : 'Generate AI Todos'}
          </Button>
        </Stack>
      </form>
    </ModalWrapper>
  );
};

export default ModalGenerateAi;

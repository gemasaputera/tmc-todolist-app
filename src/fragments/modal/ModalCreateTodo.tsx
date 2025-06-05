import ModalWrapper from '@/elements/ModalWrapper';
import { ModalType } from '@/types/modal';
import { TodoData } from '@/types/todo';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const scheme = yup
  .object({
    todo: yup.string().required('Todo is required'),
    deadline: yup.string().required('Date Time is required')
  })
  .required();

interface ModalCreateTodoProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: FormCreateTodo) => void;
  type?: ModalType;
  data: TodoData | null;
  selectedItem?: TodoData | null;
  isLoading?: boolean;
}

export interface FormCreateTodo {
  todo: string;
  deadline: string;
}

const ModalCreateTodo: React.FC<ModalCreateTodoProps> = ({
  onClose,
  onSubmit,
  opened,
  type = 'create',
  data,
  selectedItem,
  isLoading = false
}) => {
  const tabletScreen = useMediaQuery('min-width: 48em');
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormCreateTodo>({
    defaultValues: {
      deadline: selectedItem?.dueDate
        ? new Date(selectedItem?.dueDate).toString()
        : data?.dueDate
        ? new Date(data?.dueDate).toString()
        : '',
      todo: selectedItem?.description || data?.description || ''
    },
    resolver: yupResolver(scheme)
  });
  useEffect(() => {
    if (opened && selectedItem) {
      reset({
        deadline: selectedItem.dueDate
          ? new Date(selectedItem.dueDate).toString()
          : '',
        todo: selectedItem.description || ''
      });
    } else if (!opened) {
      reset({
        deadline: '',
        todo: ''
      });
    }
  }, [opened, selectedItem, reset]);

  const handleChangeDate = (date: string, field: any) => {
    field.onChange(date);
  };

  const handleSubmitForm: SubmitHandler<FormCreateTodo> = (values) => {
    onSubmit(values);
    reset();
  };

  return (
    <ModalWrapper
      opened={opened}
      close={onClose}
      title={selectedItem ? 'Edit Todo' : 'Add Todo'}
    >
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Stack gap={24}>
          <TextInput
            label='Todo'
            withAsterisk
            placeholder='Todo'
            error={errors?.todo?.message as string}
            {...register('todo')}
          />

          <Controller
            name='deadline'
            render={({ field }) => (
              <DateTimePicker
                label='Date Time'
                withAsterisk
                minDate={!selectedItem ? new Date() : undefined}
                value={field?.value ? new Date(field?.value) : null}
                placeholder='DD/MM/YYYY Time'
                error={errors?.deadline?.message as string}
                onChange={(date) => handleChangeDate(date as string, field)}
              />
            )}
            control={control}
          />

          <Group gap={16} pt={16}>
            <Button type='submit' loading={isLoading}>
              Save
            </Button>
            <Button variant='light' onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    </ModalWrapper>
  );
};

export default ModalCreateTodo;

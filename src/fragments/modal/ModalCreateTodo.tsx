import ModalWrapper from '@/elements/ModalWrapper';
import { ModalType } from '@/types/modal';
import { TodoData } from '@/types/todo';
import { formatDate } from '@/utils/formatDate';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import React, { useEffect, useState } from 'react';
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
  onSubmit: (data: any) => void;
  type?: ModalType;
  data: TodoData | null;
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
  data
}) => {
  const [deadlineDate, setDeadlineDate] = useState<any>(null);

  useEffect(() => {
    if (data && type === 'update') {
      setDeadlineDate(new Date(data.duedate));
    }
  }, [data, type]);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormCreateTodo>({
    defaultValues: {
      deadline: data?.duedate ? new Date(data?.duedate).toString() : '',
      todo: data?.title || ''
    },
    resolver: yupResolver(scheme)
  });

  const handleChangeDate = (date: any, field: any) => {
    setDeadlineDate(date);
    field.onChange(date.toISOString() as string);
  };

  const handleSubmitForm: SubmitHandler<FormCreateTodo> = (values) => {
    onSubmit(values);
    setDeadlineDate(null);
    reset();
  };

  return (
    <ModalWrapper
      opened={opened}
      close={onClose}
      title={type !== 'update' ? 'Add Todo' : 'Edit Todo'}
    >
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Stack gap={24}>
          <TextInput
            label="Todo"
            withAsterisk
            placeholder="Todo"
            error={errors?.todo?.message as string}
            {...register('todo')}
          />

          <Controller
            name="deadline"
            render={({ field }) => (
              <DateTimePicker
                label="Date Time"
                withAsterisk
                minDate={type === 'create' ? new Date() : undefined}
                value={deadlineDate}
                placeholder="DD/MM/YYYY Time"
                error={errors?.deadline?.message as string}
                onChange={(date) => handleChangeDate(date, field)}
              />
            )}
            control={control}
          />

          <Group justify="flex-end" gap={16} pt={16}>
            <Button
              p={12}
              miw={110}
              type="submit"
              styles={{
                root: {
                  backgroundColor: '#154886',
                  fontSize: 14,
                  fontWeight: 500
                }
              }}
            >
              Save
            </Button>
            <Button
              variant="light"
              onClick={onClose}
              p={12}
              miw={110}
              styles={{
                root: {
                  backgroundColor: '#E3E8EF',
                  color: '#154886',
                  fontSize: 14,
                  fontWeight: 500
                }
              }}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    </ModalWrapper>
  );
};

export default ModalCreateTodo;

import ModalWrapper from '@/elements/ModalWrapper';
import { ModalType } from '@/types/modal';
import {
  TodoData,
  ProjectData,
  TodoPriority,
  PRIORITY_LABELS
} from '@/types/todo';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Stack, TextInput, Select } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const scheme = yup
  .object({
    todo: yup.string().required('Todo is required'),
    deadline: yup.string().required('Date Time is required'),
    priority: yup.number().min(1).max(4).required('Priority is required'),
    projectId: yup.string().required('Project is required')
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
  projects?: ProjectData[];
}

export interface FormCreateTodo {
  todo: string;
  deadline: string;
  priority: number;
  projectId: string;
}

const ModalCreateTodo: React.FC<ModalCreateTodoProps> = ({
  onClose,
  onSubmit,
  opened,
  type = 'create',
  data,
  selectedItem,
  isLoading = false,
  projects = []
}) => {
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
      todo: selectedItem?.description || data?.description || '',
      priority:
        selectedItem?.priority || data?.priority || TodoPriority.VERY_LOW,
      projectId:
        selectedItem?.projectId ||
        data?.projectId ||
        projects.find((p) => p.isInbox)?.id ||
        projects[0]?.id ||
        ''
    },
    resolver: yupResolver(scheme)
  });
  useEffect(() => {
    if (opened && selectedItem) {
      reset({
        deadline: selectedItem.dueDate
          ? new Date(selectedItem.dueDate).toString()
          : '',
        todo: selectedItem.description || '',
        priority: selectedItem.priority || TodoPriority.VERY_LOW,
        projectId:
          selectedItem.projectId ||
          projects.find((p) => p.isInbox)?.id ||
          projects[0]?.id ||
          ''
      });
    } else if (!opened) {
      reset({
        deadline: '',
        todo: '',
        priority: TodoPriority.VERY_LOW,
        projectId: projects.find((p) => p.isInbox)?.id || projects[0]?.id || ''
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

          <Controller
            name='priority'
            render={({ field }) => (
              <Select
                label='Priority'
                withAsterisk
                placeholder='Select priority'
                data={[
                  { value: '1', label: PRIORITY_LABELS[1] },
                  { value: '2', label: PRIORITY_LABELS[2] },
                  { value: '3', label: PRIORITY_LABELS[3] },
                  { value: '4', label: PRIORITY_LABELS[4] }
                ]}
                value={field.value?.toString()}
                onChange={(value) =>
                  field.onChange(value ? parseInt(value) : TodoPriority.LOW)
                }
                error={errors?.priority?.message as string}
              />
            )}
            control={control}
          />

          <Controller
            name='projectId'
            render={({ field }) => (
              <Select
                label='Project'
                withAsterisk
                placeholder='Select project'
                data={projects.map((project) => ({
                  value: project.id,
                  label: project.name
                }))}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                error={errors?.projectId?.message as string}
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

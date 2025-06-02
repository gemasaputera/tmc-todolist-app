'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { scheme } from './validation';
import Link from 'next/link';

interface FormLoginProps {
  email: string;
  password: string;
}

interface LoginFormProps {
  user: any;
  handleSubmitForm: (values: FormLoginProps) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ user, handleSubmitForm }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormLoginProps>({
    resolver: yupResolver(scheme)
  });

  const loginMutation = useMutation({
    mutationFn: async (values: FormLoginProps) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return response.json();
    },
    onSuccess: () => {
      router.replace('/');

      notifications.show({
        title: 'Success',
        message: 'Login successful',
        color: 'green'
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Login failed',
        color: 'red'
      });
    }
  });

  const onSubmit: SubmitHandler<FormLoginProps> = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <Container size={'xs'} mx={'auto'} w={'100%'} style={{ zIndex: 99 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={16}>
          <Text fz={32} fw={500} pb={16}>
            Welcome Back
          </Text>
          <Stack gap={20}>
            <TextInput
              label='Email'
              placeholder='Email'
              withAsterisk
              radius={'md'}
              error={errors?.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label='Password'
              placeholder='Password'
              withAsterisk
              radius={'md'}
              error={errors?.password?.message}
              {...register('password')}
            />
          </Stack>
          <Stack gap={16} pt={24}>
            <Button
              type='submit'
              variant='filled'
              bg={'#154886'}
              mih={48}
              radius={'md'}
              loading={loginMutation.isPending}
            >
              Sign in
            </Button>
            <Text ta='center' size='sm'>
              Don&apos;t have an account?{' '}
              <Link href='/register' style={{ color: '#154886' }}>
                Register
              </Link>
            </Text>
            {/* <Divider label="Or" />
            <Button
              variant="outline"
              mih={48}
              radius={'md'}
              className={styles.googleButton}
              leftSection={<FcGoogle />}
              c={'#0000008a'}
              onClick={() => signIn('google')}
            >
              {' '}
              Google sign in
            </Button> */}
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default LoginForm;

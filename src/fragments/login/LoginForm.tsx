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
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { scheme } from './validation';

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

  const onSubmit: SubmitHandler<FormLoginProps> = async (values) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Using Next.js 14 navigation
        router.replace('/');
      } else {
        // Handle error cases
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Container size={'xs'} mx={'auto'} w={'100%'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={16}>
          <Text fz={32} fw={500} pb={16}>
            Welcome Back
          </Text>
          <Stack gap={20}>
            <TextInput
              label="Email"
              placeholder="Email"
              withAsterisk
              radius={'md'}
              error={errors?.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Password"
              withAsterisk
              radius={'md'}
              error={errors?.password?.message}
              {...register('password')}
            />
          </Stack>
          <Stack gap={16} pt={24}>
            <Button
              type="submit"
              variant="filled"
              bg={'#154886'}
              mih={48}
              radius={'md'}
            >
              {' '}
              Sign in{' '}
            </Button>
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

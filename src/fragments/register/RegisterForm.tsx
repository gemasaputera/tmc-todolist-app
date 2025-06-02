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
import Link from 'next/link';

interface FormRegisterProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormRegisterProps>({
    resolver: yupResolver(scheme)
  });

  const onSubmit: SubmitHandler<FormRegisterProps> = async (values) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        })
      });

      if (response.ok) {
        router.replace('/');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <Container size={'xs'} mx={'auto'} w={'100%'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={16}>
          <Text fz={32} fw={500} pb={16}>
            Create Account
          </Text>
          <Stack gap={20}>
            <TextInput
              label='Name'
              placeholder='Your name'
              withAsterisk
              radius={'md'}
              error={errors?.name?.message}
              {...register('name')}
            />

            <TextInput
              label='Email'
              placeholder='Your email'
              withAsterisk
              radius={'md'}
              error={errors?.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label='Password'
              placeholder='Your password'
              withAsterisk
              radius={'md'}
              error={errors?.password?.message}
              {...register('password')}
            />

            <PasswordInput
              label='Confirm Password'
              placeholder='Confirm your password'
              withAsterisk
              radius={'md'}
              error={errors?.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </Stack>
          <Stack gap={16} pt={24}>
            <Button
              type='submit'
              variant='filled'
              bg={'#154886'}
              mih={48}
              radius={'md'}
            >
              Register
            </Button>
            <Text ta='center' size='sm'>
              Already have an account?{' '}
              <Link href='/login' style={{ color: '#154886' }}>
                Sign in
              </Link>
            </Text>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default RegisterForm;

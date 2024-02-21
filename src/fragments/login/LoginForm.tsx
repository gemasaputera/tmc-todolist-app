'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Container,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { scheme } from './validation';
import { FcGoogle } from 'react-icons/fc';
import styles from './styles.module.css';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  defaultActiveSession,
  dummyTokenSession,
  usersSession
} from '@/constant';
import { UserData } from '@/types/userData';

interface FormLoginProps {
  email: string;
  password: string;
}

const defaultValues: FormLoginProps = {
  email: '',
  password: ''
};

interface LoginFormProps {
  user: any;
}

const LoginForm: React.FC<LoginFormProps> = ({ user }) => {
  const [users, setUsers] = useLocalStorage<string>(usersSession);
  const [activeSession, setActiveSession] =
    useLocalStorage<string>(defaultActiveSession);
  const [token, setToken] = useLocalStorage<string>(dummyTokenSession);
  const router = useRouter();

  const [errorState, setErrorState] = useState<FormLoginProps>(defaultValues);

  useEffect(() => {
    if (token !== '' || user) {
      if (user) {
        const _users: UserData[] = users ? JSON.parse(users) : [];
        const filtered = _users.filter((item) => item?.email === user?.email);
        if (filtered.length > 0) {
          setToken(process.env.NEXT_PUBLIC_TOKEN as string);
          setActiveSession(JSON.stringify(user));
        } else {
          _users.push({
            email: user?.email,
            name: user?.name,
            image: user?.image,
            password: ''
          });
          const _users_stringify: string = JSON.stringify(_users);
          setUsers(_users_stringify);
          setToken(process.env.NEXT_PUBLIC_TOKEN as string);
          setActiveSession(JSON.stringify(filtered[0]));
        }
      }
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormLoginProps>({
    resolver: yupResolver(scheme)
  });

  const handleSubmitForm: SubmitHandler<FormLoginProps> = (values) => {
    if (!users) {
      const _users = [values];
      const _users_stringify: string = JSON.stringify(_users);
      setUsers(_users_stringify);
      setToken(process.env.NEXT_PUBLIC_TOKEN as string);
      setActiveSession(JSON.stringify(values));
    } else {
      const _users: UserData[] = JSON.parse(users);
      const userEmail: any = _users.find((user) => user.email === values.email);
      if (userEmail) {
        if (userEmail.password === values.password) {
          setErrorState(defaultValues);
          setToken(process.env.NEXT_PUBLIC_TOKEN as string);
          setActiveSession(JSON.stringify(userEmail));
        } else {
          setErrorState({
            email: '',
            password: 'Password is incorrect'
          });
        }
      } else {
        const _users: UserData[] = JSON.parse(users);
        _users.push(values);
        const _users_stringify: string = JSON.stringify(_users);
        setUsers(_users_stringify);
        setToken(process.env.NEXT_PUBLIC_TOKEN as string);
        setActiveSession(JSON.stringify(values));
      }
    }
  };

  return (
    <Container size={'xs'} mx={'auto'} w={'100%'}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
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
              error={errorState?.email || errors?.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Password"
              withAsterisk
              radius={'md'}
              error={errorState?.password || errors?.password?.message}
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
            <Divider label="Or" />
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
            </Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default LoginForm;

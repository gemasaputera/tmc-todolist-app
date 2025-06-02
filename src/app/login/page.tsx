import { Flex } from '@mantine/core';
import React, { Suspense } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import LoginForm from '@/fragments/login/LoginForm';
import { auth } from '../../auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login | Todo App by Gema Saputera',
  keywords: ['todo', 'app', 'gema', 'saputera', 'login'],
  robots: 'index, follow',
  openGraph: {
    title: 'Login | Todo App by Gema Saputera',
    description: 'Login page for Todo App by Gema Saputera'
  }
};
const LoginPage = async () => {
  const session = await auth();
  const handleSubmitForm = async (values: any) => {
    'use server';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      redirect('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  return (
    <Flex
      flex={1}
      justify={'center'}
      align={'center'}
      className={styles.container}
    >
      <Flex
        justify={'center'}
        align={'center'}
        h={'100%'}
        bg={'#F8FAFF'}
        flex={1}
        className={styles.leftSection}
      >
        <Image
          src='/illustration_login.png'
          alt='logo'
          width={1334 / 3}
          height={1284 / 3}
        />
      </Flex>
      <Flex
        justify={'center'}
        align={'center'}
        h={'100%'}
        pos={'relative'}
        flex={1}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm user={session?.user} handleSubmitForm={handleSubmitForm} />
        </Suspense>
        <Image
          className={styles.assetsLeft}
          src='/assets-rectangle.svg'
          alt='logo'
          width={220}
          height={220}
        />
        <Image
          className={styles.assetsRight}
          src='/assets-rectangle-02.svg'
          alt='logo'
          width={220}
          height={220}
        />
      </Flex>
    </Flex>
  );
};

export default LoginPage;

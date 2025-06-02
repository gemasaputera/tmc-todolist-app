import { Flex } from '@mantine/core';
import React, { Suspense } from 'react';
import RegisterForm from '@/fragments/register/RegisterForm';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Register | Todo App by Gema Saputera',
  keywords: ['todo', 'app', 'gema', 'saputera', 'register'],
  robots: 'index, follow',
  openGraph: {
    title: 'Register | Todo App by Gema Saputera',
    description: 'Register page for Todo App by Gema Saputera'
  }
};

const RegisterPage = async () => {
  const session = await auth();

  // If user is already logged in, redirect to home page
  if (session) {
    redirect('/');
  }

  return (
    <Flex flex={1} justify={'center'} align={'center'} h={'100vh'}>
      <Flex w={'100%'} maw={1000} h={'100%'} style={{ overflow: 'hidden' }}>
        <Flex
          w={'50%'}
          justify={'center'}
          align={'center'}
          display={{ base: 'none', md: 'flex' }}
        >
          <Image
            src='/illustration_login.png'
            alt='Login Illustration'
            width={400}
            height={400}
            style={{ objectFit: 'contain' }}
          />
        </Flex>
        <Flex
          w={{ base: '100%', md: '50%' }}
          justify={'center'}
          align={'center'}
          p={24}
        >
          <RegisterForm />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default RegisterPage;

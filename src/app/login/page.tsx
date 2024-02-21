import { Flex } from '@mantine/core';
import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import LoginForm from '@/fragments/login/LoginForm';
import { auth } from '../../auth';

const LoginPage = async () => {
  const session = await auth();
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
          src="/illustration_login.png"
          alt="logo"
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
        <LoginForm user={session?.user} />

        <Image
          className={styles.assetsLeft}
          src="/assets-rectangle.svg"
          alt="logo"
          width={220}
          height={220}
        />
        <Image
          className={styles.assetsRight}
          src="/assets-rectangle-02.svg"
          alt="logo"
          width={220}
          height={220}
        />
      </Flex>
    </Flex>
  );
};

export default LoginPage;

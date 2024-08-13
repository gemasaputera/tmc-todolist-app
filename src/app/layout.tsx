import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import { MantineProvider } from '@mantine/core';
import { Inter } from 'next/font/google';
import { theme } from '@/theme';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo Apps',
  description: 'Organize Your Day, Simplify Your Life.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}

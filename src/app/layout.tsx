import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Montserrat } from 'next/font/google';
import { theme } from '@/theme';
import QueryProvider from '@/providers/QueryProvider';

const inter = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo Apps',
  description: 'Organize Your Day, Simplify Your Life by Gema Saputera',
  creator: 'Gema Saputera',
  keywords: ['todo', 'app', 'gema', 'saputera'],
  robots: 'index, follow',
  openGraph: {
    title: 'Login | Todo App by Gema Saputera',
    description: 'Login page for Todo App by Gema Saputera'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a1b17e3c-13a6-413a-97c6-7df4063f385c"
        ></script>
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme}>
          <QueryProvider>
            <Notifications />
            {children}
          </QueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

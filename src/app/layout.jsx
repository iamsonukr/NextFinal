// src/app/layout.js
import { ContextProvider } from '@/src/providers/ContextProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route';
import './globals.css';

export const metadata = {
  title: 'E-commerce App',
  description: 'Modern e-commerce application',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <ContextProvider session={session}>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
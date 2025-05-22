// src/providers/ContextProvider.jsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/src/contexts/CartContext';
import { UserProvider } from '@/src/contexts/UserContext';
import { ThemeProvider } from '@/src/contexts/ThemeContext';

export function ContextProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <UserProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
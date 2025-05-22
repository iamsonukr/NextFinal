// src/utils/test-utils.jsx
import { render } from '@testing-library/react';
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';

export function renderWithContext(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <UserProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </UserProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { renderWithContext as render };
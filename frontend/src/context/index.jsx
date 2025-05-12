import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { AppProvider } from './AppContext';

export const AppProviders = ({ children }) => {
  return (
    <AppProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </AppProvider>
  );
};
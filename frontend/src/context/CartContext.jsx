import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState(['m1', 'm2']);
  const [orderType, setOrderType] = useState('standard');
  const [activePortal, setActivePortal] = useState('customer');

  const addToCart = (meal, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === meal.id);
      if (existing) {
        return prev.map(item =>
          item.id === meal.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...meal, quantity }];
    });
  };

  const removeFromCart = (mealId) => {
    setCartItems(prev => prev.filter(item => item.id !== mealId));
  };

  const updateQuantity = (mealId, delta) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === mealId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleFavorite = (mealId) => {
    setFavorites(prev =>
      prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]
    );
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      favorites,
      toggleFavorite,
      orderType,
      setOrderType,
      activePortal,
      setActivePortal
    }}>
      {children}
    </CartContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export const useCart = () => useContext(CartContext);

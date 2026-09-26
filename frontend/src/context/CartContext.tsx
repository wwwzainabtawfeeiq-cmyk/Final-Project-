import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { meals as allMeals } from '@/data/mockData';

export interface CartItem {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (mealId: number) => void;
  removeItem: (mealId: number) => void;
  updateQuantity: (mealId: number, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bf_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bf_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (mealId: number) => {
    const meal = allMeals.find(m => m.id === mealId);
    if (!meal) return;
    setItems(prev => {
      const existing = prev.find(i => i.id === mealId);
      if (existing) {
        return prev.map(i => i.id === mealId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: meal.id, name: meal.name, nameEn: meal.nameEn,
        price: meal.price, image: meal.image, quantity: 1
      }];
    });
  };

  const removeItem = (mealId: number) => {
    setItems(prev => prev.filter(i => i.id !== mealId));
  };

  const updateQuantity = (mealId: number, qty: number) => {
    if (qty <= 0) { removeItem(mealId); return; }
    setItems(prev => prev.map(i => i.id === mealId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      total, count, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

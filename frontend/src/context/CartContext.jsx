import { createContext, useContext, useEffect, useState } from "react";
import API from "@/services/api";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const token =
        localStorage.getItem("bf_token") ||
        localStorage.getItem("token");

      if (!token) {
        setItems([]);
        return;
      }

      const response = await API.get("/cart");
      const data = response?.data?.data || {};

      setItems(
        (data.items || []).map((item) => ({
          id: item.meal_id,
          cartItemId: item.id,
          name: item.meal_name,
          nameEn: item.meal_name,
          price: Number(item.price),
          image: item.image_url,
          quantity: Number(item.quantity),
          availableQuantity: Number(item.available_quantity),
          cookId: item.cook_id,
          cookName: item.cook_name,
        }))
      );
    } catch (error) {
      console.error("Failed to load cart:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addItem = async (mealId, quantity = 1) => {
    try {
      await API.post("/cart/items", {
        meal_id: mealId,
        quantity,
      });

      await loadCart();
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const removeItem = async (mealId) => {
    const item = items.find((i) => i.id === mealId);
    if (!item) return;

    try {
      await API.delete(`/cart/items/${item.cartItemId}`);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      throw error;
    }
  };

  const updateQuantity = async (mealId, qty) => {
    const item = items.find((i) => i.id === mealId);
    if (!item) return;

    if (qty <= 0) {
      await removeItem(mealId);
      return;
    }

    try {
      await API.put(`/cart/items/${item.cartItemId}`, {
        quantity: qty,
      });

      await loadCart();
    } catch (error) {
      console.error("Failed to update cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart/clear");
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);

      // Backend route may not expose /clear yet.
      // Keep UI consistent if clearing locally is needed.
      setItems([]);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const count = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
        loading,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
}

import { createContext, useContext, useEffect, useState } from "react";
import API from "@/services/api";

const FavoritesContext = createContext(undefined);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token =
          localStorage.getItem("bf_token") ||
          localStorage.getItem("token");

        if (!token) {
          setFavorites([]);
          return;
        }

        const response = await API.get("/favorites");
        const data = response?.data?.data || response?.data || [];

        setFavorites(
          data.map((item) => item.meal_id ?? item.meal?.id ?? item.id)
        );
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (id) => {
    try {
      const exists = favorites.includes(id);

      if (exists) {
        await API.delete(`/favorites/${id}`);
        setFavorites((prev) => prev.filter((f) => f !== id));
      } else {
        await API.post("/favorites", { mealId: id });
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}

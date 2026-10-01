import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

import MealCard from "@/components/meals/MealCard";
import { getMeals } from "@/services/mealService";

export default function MealsPage() {
  const { lang } = useLanguage();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMeals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMeals();

        setMeals(response?.data || []);
      } catch (err) {
        console.error("Failed to load meals:", err);
        setError(
          lang === "ar"
            ? "تعذر تحميل الوجبات من الخادم"
            : "Failed to load meals from the server"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [lang]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      

      <div className="mb-8 text-center">
        <h1 className="font-ruqaa text-4xl md:text-5xl text-gold-bright mb-3">
          {lang === "ar" ? "قائمة الوجبات الفاخرة" : "Luxury Menu"}
        </h1>

        <p className="text-cream/70 font-tajawal text-sm md:text-base max-w-xl mx-auto">
          {lang === "ar"
            ? "استكشف أطباقنا المصنوعة بعناية فائقة لتلبي ذوق الرفيع"
            : "Explore our carefully crafted dishes to satisfy your refined taste"}
        </p>
      </div>

      {loading && (
        <div className="text-center text-cream/70 py-12">
          {lang === "ar" ? "جاري تحميل الوجبات..." : "Loading meals..."}
        </div>
      )}

      {!loading && error && (
        <div className="text-center text-red-400 py-12">
          {error}
        </div>
      )}

      {!loading && !error && meals.length === 0 && (
        <div className="text-center text-cream/70 py-12">
          {lang === "ar" ? "لا توجد وجبات متاحة حاليًا" : "No meals available"}
        </div>
      )}

      {!loading && !error && meals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map((meal, index) => (
            <MealCard key={meal.id} meal={meal} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}


import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useLanguage } from "@/context/LanguageContext";
import { getMeals } from "@/services/mealService";
import MealCard from "@/components/meals/MealCard";

export default function FeaturedMeals() {
  const { t, lang } = useLanguage();
  const swiperRef = useRef(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const response = await getMeals();
        setMeals((response?.data || []).slice(0, 8));
      } catch (error) {
        console.error("Failed to load featured meals:", error);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-ruqaa text-4xl text-gradient-gold"
        >
          {t("وجبات مميزة", "Featured Meals")}
        </motion.h2>

        <div className="flex gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-11 h-11 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all"
          >
            <ChevronRight size={20} className="text-gold-bright" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-11 h-11 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all"
          >
            <ChevronLeft size={20} className="text-gold-bright" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-cream/70 py-12">
          {lang === "ar" ? "جاري تحميل الوجبات..." : "Loading meals..."}
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center text-cream/70 py-12">
          {lang === "ar" ? "لا توجد وجبات متاحة حاليًا" : "No meals available"}
        </div>
      ) : (
        <Swiper
          modules={[FreeMode, Autoplay, Pagination]}
          spaceBetween={32}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1280: { slidesPerView: 4 },
          }}
          freeMode={{ enabled: true, sticky: false }}
          autoplay={{ delay: 3000, disableOnInteraction: true }}
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          className="!pb-4"
        >
          {meals.map((meal, i) => (
            <SwiperSlide key={meal.id} className="!h-auto px-2">
              <MealCard meal={meal} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

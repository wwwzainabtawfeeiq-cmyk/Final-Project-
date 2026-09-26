import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { useLanguage } from '@/context/LanguageContext';
import { meals } from '@/data/mockData';
import MealCard from '@/components/meals/MealCard';

export default function FeaturedMeals() {
  const { t } = useLanguage();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-ruqaa text-4xl text-gradient-gold"
        >
          {t('أطباق مميزة', 'Featured Meals')}
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
        onSwiper={(s) => { swiperRef.current = s; }}
        className="!pb-4"
      >
        {meals.slice(0, 8).map((meal, i) => (
          <SwiperSlide key={meal.id} className="!h-auto px-2">
            <MealCard meal={meal} index={i} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

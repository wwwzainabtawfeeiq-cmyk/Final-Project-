import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { testimonials } from '@/data/mockData';

export default function Testimonials() {
  const { t, lang } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-ruqaa text-4xl text-center text-gradient-gold mb-12"
      >
        {t('ماذا يقول عملاؤنا', 'What Our Customers Say')}
      </motion.h2>

      <div className="relative h-64 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-light rounded-2xl p-8 md:p-10 text-center max-w-2xl w-full relative"
          >
            <Quote size={40} className="text-gold/30 absolute top-4 right-4" />

            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                <Star key={i} size={20} className="fill-gold text-gold" />
              ))}
            </div>

            <p className="text-cream/80 font-tajawal text-lg md:text-xl leading-relaxed mb-6">
              "{lang === 'ar' ? testimonials[index].text : testimonials[index].textEn}"
            </p>

            <div className="flex items-center justify-center gap-3">
              <img src={testimonials[index].avatar} alt=""
                className="w-12 h-12 rounded-full object-cover gold-border" />
              <span className="font-ruqaa text-lg text-gold-bright">
                {lang === 'ar' ? testimonials[index].name : testimonials[index].nameEn}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* نقاط التنقل */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-gold' : 'w-2 bg-gold/30'}`}
          />
        ))}
      </div>
    </section>
  );
}

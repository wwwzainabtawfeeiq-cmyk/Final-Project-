import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Cookie, Soup, Check, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { meals } from '@/data/mockData';
import MealCard from '@/components/meals/MealCard';
import { cn } from '@/utils/cn';

type Taste = 'spicy' | 'sweet' | 'salty';

export default function FlavorMatchPage() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [taste, setTaste] = useState<Taste | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const tasteOptions: { id: Taste; label: string; labelEn: string; icon: React.ComponentType<{size?: number; className?: string}> }[] = [
    { id: 'spicy', label: 'حار', labelEn: 'Spicy', icon: Flame },
    { id: 'sweet', label: 'حلو', labelEn: 'Sweet', icon: Cookie },
    { id: 'salty', label: 'مالح', labelEn: 'Salty', icon: Soup },
  ];

  const ingredientOptions = [
    { id: 'meat', label: t('لحم', 'Meat') },
    { id: 'chicken', label: t('دجاج', 'Chicken') },
    { id: 'fish', label: t('سمك', 'Fish') },
    { id: 'rice', label: t('أرز', 'Rice') },
    { id: 'bread', label: t('خبز', 'Bread') },
    { id: 'veg', label: t('خضار', 'Vegetables') },
  ];

  const toggleIngredient = (id: string) => {
    setIngredients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // منطق المطابقة
  const matchedMeals = meals.filter(m => {
    let score = 0;
    if (taste === 'spicy' && m.spicy) score += 2;
    if (taste === 'sweet' && m.sweet) score += 2;
    if (taste === 'salty' && !m.sweet) score += 1;
    if (ingredients.includes('meat') && m.tags.some(tg => tg.includes('لحم') || tg.includes('meat'))) score += 1;
    if (ingredients.includes('chicken') && m.tags.some(tg => tg.includes('دجاج') || tg.includes('chicken'))) score += 1;
    if (ingredients.includes('fish') && m.tags.some(tg => tg.includes('سمك') || tg.includes('fish'))) score += 1;
    if (ingredients.includes('rice') && (m.category === 'rice' || m.tags.some(tg => tg.includes('أرز')))) score += 1;
    if (ingredients.includes('bread') && m.tags.some(tg => tg.includes('خبز') || tg.includes('bread'))) score += 1;
    if (ingredients.includes('veg') && m.tags.some(tg => tg.includes('نباتي') || tg.includes('veg'))) score += 1;
    return score > 0;
  }).sort((a, b) => {
    let sa = 0, sb = 0;
    if (taste === 'spicy' && a.spicy) sa += 2; if (taste === 'spicy' && b.spicy) sb += 2;
    if (taste === 'sweet' && a.sweet) sa += 2; if (taste === 'sweet' && b.sweet) sb += 2;
    return sb - sa;
  }).slice(0, 6);

  const reset = () => {
    setStep(0); setTaste(null); setIngredients([]);
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-4">
          <Sparkles size={18} className="text-gold-bright" />
          <span className="font-tajawal text-sm text-gold-bright">{t('تطابق النكهة الذكي', 'Smart Flavor Match')}</span>
        </div>
        <h1 className="font-ruqaa text-5xl text-gradient-gold text-glow-gold">Flavor Match</h1>
        <p className="text-cream/60 font-tajawal mt-3 max-w-xl mx-auto">
          {t('أخبرنا عن ذوقك وسنقترح لك أفضل الأطباق', 'Tell us your taste and we\'ll suggest the best dishes')}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h2 className="font-ruqaa text-2xl text-gold-bright text-center mb-8">{t('ما هو ذوقك المفضل؟', 'What\'s your preferred taste?')}</h2>
            <div className="grid grid-cols-3 gap-4">
              {tasteOptions.map(opt => (
                <motion.button key={opt.id} whileHover={{ y: -6, scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setTaste(opt.id); setStep(1); }}
                  className={cn('p-8 rounded-2xl flex flex-col items-center gap-3 transition-all',
                    taste === opt.id ? 'gold-glow' : 'glass-light hover:gold-glow')}
                  style={taste === opt.id ? { background: 'linear-gradient(135deg, #C9A227, #F5D76E)' } : {}}>
                  <opt.icon size={40} className={taste === opt.id ? 'text-emerald-deep' : 'text-gold-bright'} />
                  <span className={cn('font-ruqaa text-xl', taste === opt.id ? 'text-emerald-deep' : 'text-cream')}>
                    {lang === 'ar' ? opt.label : opt.labelEn}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h2 className="font-ruqaa text-2xl text-gold-bright text-center mb-8">{t('اختر مكوناتك المفضلة', 'Choose your favorite ingredients')}</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {ingredientOptions.map(opt => (
                <motion.button key={opt.id} whileTap={{ scale: 0.95 }}
                  onClick={() => toggleIngredient(opt.id)}
                  className={cn('px-6 py-3 rounded-full font-tajawal text-lg transition-all flex items-center gap-2',
                    ingredients.includes(opt.id) ? 'text-emerald-deep font-bold' : 'glass-light text-cream/70 hover:gold-glow')}
                  style={ingredients.includes(opt.id) ? { background: 'linear-gradient(135deg, #C9A227, #F5D76E)' } : {}}>
                  {ingredients.includes(opt.id) && <Check size={16} />}
                  {opt.label}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-center">
              <button onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-full font-tajawal font-bold relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
                <span className="relative z-10 text-emerald-deep flex items-center gap-2">
                  {t('اعرض النتائج', 'Show Results')}
                  <Arrow size={18} />
                </span>
                <span className="absolute inset-0 shine-bg" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-ruqaa text-2xl text-gold-bright">{t('نكهات مختارة لك', 'Selected for You')}</h2>
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-full glass-light text-gold-bright font-tajawal hover:gold-glow transition-all">
                <RotateCcw size={16} />
                {t('إعادة', 'Retry')}
              </button>
            </div>

            {matchedMeals.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-cream/50 font-tajawal text-xl mb-6">{t('لا توجد نتائج مطابقة', 'No matching results')}</p>
                <button onClick={reset} className="px-6 py-3 rounded-full font-tajawal font-bold"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
                  <span className="text-emerald-deep">{t('حاول مرة أخرى', 'Try Again')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedMeals.map((meal, i) => (
                  <MealCard key={meal.id} meal={meal} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Search, ChefHat, Truck, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    { icon: Search, title: t('اختر طبقك', 'Choose Your Dish'), desc: t('تصفح الأطباق واختر ما يناسب ذوقك', 'Browse dishes and pick what suits your taste') },
    { icon: ChefHat, title: t('يحضّر الطاهي', 'Cook Prepares'), desc: t('طاهٍ منزلي محترف يحضّر طبقك بحب', 'An expert home cook prepares your dish with love') },
    { icon: Truck, title: t('توصيل سريع', 'Fast Delivery'), desc: t('يصل إلى بابك ساخناً وطازجاً', 'Arrives at your door hot and fresh') },
    { icon: CheckCircle, title: t('استمتع', 'Enjoy'), desc: t('تذوق نكهة البصرة الحقيقية', 'Taste the real Basra flavor') },
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-ruqaa text-4xl text-center text-gradient-gold mb-16"
      >
        {t('كيف يعمل؟', 'How It Works')}
      </motion.h2>

      <div className="relative">
        {/* خط timeline */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              {/* الدائرة */}
              <div className="relative w-24 h-24 mb-5">
                <div className="absolute inset-0 rounded-full gold-glow" />
                <div className="relative w-full h-full rounded-full glass-light flex items-center justify-center">
                  <step.icon size={32} className="text-gold-bright" />
                </div>
                {/* رقم */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-cairo font-bold text-sm text-emerald-deep"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
                  {i + 1}
                </div>
              </div>

              <h3 className="font-ruqaa text-xl text-cream mb-2">{step.title}</h3>
              <p className="text-cream/60 font-tajawal text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

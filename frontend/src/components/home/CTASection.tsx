import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CTASection() {
  const { t, lang } = useLanguage();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4332 0%, #0F2419 50%, #1B4332 100%)' }}
      >
        {/* توهج ذهبي */}
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(201,162,39,0.2), transparent 70%)' }} />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6"
        >
          <Sparkles size={18} className="text-gold-bright" />
          <span className="font-tajawal text-sm text-gold-bright">{t('ابدأ رحلتك', 'Start Your Journey')}</span>
        </motion.div>

        <h2 className="relative z-10 font-ruqaa text-4xl md:text-6xl text-gradient-gold text-glow-gold mb-4">
          {t('جاهز لتذوق النكهة الحقيقية؟', 'Ready to Taste the Real Flavor?')}
        </h2>
        <p className="relative z-10 text-cream/70 font-tajawal text-lg mb-8 max-w-xl mx-auto">
          {t('انضم إلى آلاف العملاء السعداء واطلب من نكهة البصرة اليوم', 'Join thousands of happy customers and order from Basra Flavor today')}
        </p>

        <Link
          to="/meals"
          className="relative z-10 inline-flex items-center gap-2 px-10 py-4 rounded-full font-tajawal font-bold text-xl overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
        >
          <span className="relative z-10 text-emerald-deep flex items-center gap-2">
            {t('ابدأ الآن', 'Start Now')}
            <Arrow size={22} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="absolute inset-0 shine-bg" />
        </Link>
      </motion.div>
    </section>
  );
}

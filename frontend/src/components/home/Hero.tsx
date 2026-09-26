import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChefHat, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function Hero() {
  const { t, lang } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // تأثير الكتابة
  const fullText = t('نكهات البصرة الحقيقية', 'Authentic Basra Flavors');
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [lang]);

  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const stats = [
    { num: 120, label: t('طبق بصري', 'Basra Dishes'), icon: UtensilsCrossed },
    { num: 45, label: t('طاهٍ منزلي', 'Home Cooks'), icon: ChefHat },
    { num: 8500, label: t('طلب سعيد', 'Happy Orders'), icon: Sparkles },
  ];

  return (
    <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* خلفية طبق بصري */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/36796430/pexels-photo-36796430.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/80 via-emerald-deep/70 to-emerald-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep/60 to-transparent" />
      </div>

      {/* spotlight يتبع الماوس */}
      <div
        className="absolute inset-0 transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(201, 162, 39, 0.15), transparent 60%)`,
        }}
      />

      {/* المحتوى */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6"
        >
          <Sparkles size={16} className="text-gold-bright" />
          <span className="font-tajawal text-sm text-gold-bright">{t('أصالة الماضي بعبق الحاضر', 'Authenticity meets the present')}</span>
        </motion.div>

        {/* عنوان typewriter */}
        <h1 className="font-ruqaa text-5xl md:text-7xl lg:text-8xl text-gradient-gold text-glow-gold mb-6 min-h-[1.2em]">
          {typed}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-1 h-12 md:h-16 bg-gold-bright ml-2 align-middle"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-cream/70 text-lg md:text-xl font-tajawal mb-10 max-w-2xl mx-auto"
        >
          {t('أطباق منزلية بصري أصيلة، محضّرة بأيدي طُهاة محترفين، تصل إلى بابك ساخنة وطازجة.', 'Authentic homemade Basra dishes, prepared by expert cooks, delivered hot and fresh to your door.')}
        </motion.p>

        {/* أزرار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/meals"
            className="group px-8 py-4 rounded-full font-tajawal font-bold text-lg relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
          >
            <span className="relative z-10 text-emerald-deep flex items-center gap-2">
              {t('اطلب الآن', 'Order Now')}
              <Arrow size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 shine-bg" />
          </Link>
          <Link
            to="/cooks"
            className="px-8 py-4 rounded-full font-tajawal font-bold text-lg glass-light text-gold-bright hover:gold-glow transition-all"
          >
            {t('تصفح الطُهاة', 'Browse Cooks')}
          </Link>
        </motion.div>

        {/* أرقام متحركة */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-2xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon size={28} className="text-gold mx-auto mb-2" />
              <div className="font-cairo text-3xl md:text-4xl text-gradient-gold">
                {inView && <CountUp end={stat.num} duration={2} separator="," />}
                {stat.num >= 1000 ? '+' : ''}
              </div>
              <div className="text-cream/60 font-tajawal text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

// نجمة تتلألأ
function Star({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gold-bright"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.2, 0.6] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// جزيء ذهبي يطفو
function Particle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gold/40 blur-[2px]"
      style={{ left: x, top: y, width: 6, height: 6 }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// نخلة SVG
function PalmTree({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.svg
      width="120" height="300" viewBox="0 0 120 300"
      className={`absolute bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} opacity-60`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 0.6 }}
      transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* الجذع */}
      <rect x="52" y="120" width="16" height="180" rx="4" fill="#C9A227" opacity="0.5" />
      {/* السعف */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <motion.ellipse
          key={angle}
          cx="60" cy="120" rx="55" ry="12"
          fill="#1B4332"
          opacity="0.7"
          style={{ transformOrigin: '60px 120px', transform: `rotate(${angle}deg)` }}
          animate={{ rotate: [angle - 3, angle + 3, angle - 3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: angle * 0.01 }}
        />
      ))}
    </motion.svg>
  );
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { t } = useLanguage();
  const [show, setShow] = useState(true);
  const title = t('نكهة البصرة', 'Basra Flavor');
  const letters = title.split('');

  useEffect(() => {
    const timer = setTimeout(() => finish(), 4500);
    return () => clearTimeout(timer);
  }, []);

  const finish = () => {
    setShow(false);
    setTimeout(onFinish, 800);
  };

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: Math.random() * 4,
  }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #0F2419 0%, #0A0A0A 100%)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* نجوم */}
          {stars.map(s => <Star key={s.id} {...s} />)}
          {/* جزيئات ذهبية */}
          {particles.map(p => <Particle key={p.id} {...p} />)}

          {/* قمر ذهبي */}
          <motion.div
            className="absolute top-12 right-1/4 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #F5D76E, #C9A227 60%, transparent 70%)',
              filter: 'blur(1px)',
            }}
            animate={{ y: [0, -15, 0], boxShadow: ['0 0 40px rgba(201,162,39,0.3)', '0 0 80px rgba(201,162,39,0.5)', '0 0 40px rgba(201,162,39,0.3)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* نخلتان */}
          <PalmTree side="left" />
          <PalmTree side="right" />

          {/* المحتوى */}
          <div className="relative z-10 flex flex-col items-center">
            {/* شعار */}
            <motion.div
              className="w-44 h-44 md:w-56 md:h-56 mb-8"
              initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center gold-glow-strong"
                style={{ background: 'linear-gradient(135deg, #1B4332, #0F2419)', border: '2px solid #C9A227' }}>
                <span className="font-ruqaa text-6xl md:text-8xl text-gradient-gold">ن</span>
              </div>
            </motion.div>

            {/* عنوان حرف بحرف */}
            <motion.h1
              className="font-ruqaa text-4xl md:text-6xl text-gradient-gold text-glow-gold mb-4"
              style={{ letterSpacing: '0.05em' }}
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </motion.h1>

            {/* جملة */}
            <motion.p
              className="text-cream/70 text-lg md:text-xl font-tajawal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              {t('أصالة الماضي... بعبق الحاضر.', 'Authenticity of the past... with the fragrance of the present.')}
            </motion.p>
          </div>

          {/* نهر شط العرب - موجات ذهبية */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{
                  background: `linear-gradient(180deg, transparent, rgba(201,162,39,${0.1 - i * 0.03}))`,
                  borderRadius: '50% 50% 0 0',
                }}
                animate={{ x: [0, 30, 0], scaleY: [1, 1.1, 1] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              />
            ))}
          </div>

          {/* زر تخطي */}
          <motion.button
            onClick={finish}
            className="absolute top-6 right-6 px-5 py-2 rounded-full glass-light text-gold-bright font-tajawal text-sm hover:gold-glow transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('تخطي', 'Skip')} ←
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

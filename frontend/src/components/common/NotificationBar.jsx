import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Gift, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type NotificationType = 'info' | 'offer' | 'warning';

interface Notification {
  id: number;
  type: NotificationType;
  ar: string;
  en: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'offer',
    ar: '🎉 خصم 20% على أول طلب — استخدم كود FIRST20',
    en: '🎉 20% OFF on your first order — use code FIRST20',
  },
  {
    id: 2,
    type: 'info',
    ar: '⚡ توصيل مجاني للطلبات فوق 50,000 د.ع',
    en: '⚡ Free delivery for orders above 50,000 IQD',
  },
  {
    id: 3,
    type: 'warning',
    ar: '🔥 عرض اليوم الوطني ينتهي قريباً — اطلب الآن!',
    en: '🔥 National Day offer ends soon — order now!',
  },
];

const TYPE_CONFIG: Record<NotificationType, { color: string; icon: LucideIcon }> = {
  info: { color: '#3b82f6', icon: Bell },
  offer: { color: '#F5D76E', icon: Gift },
  warning: { color: '#ef4444', icon: Zap },
};

export default function NotificationBar() {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const notif = NOTIFICATIONS[currentIndex];
  const config = TYPE_CONFIG[notif.type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-16 left-0 right-0 z-40"
        style={{
          background: `linear-gradient(135deg, ${config.color}15, ${config.color}08)`,
          borderBottom: `1px solid ${config.color}40`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `${config.color}25` }}
            >
              <Icon size={14} style={{ color: config.color }} />
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={notif.id}
                  initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="font-tajawal text-xs md:text-sm truncate"
                  style={{ color: '#FFFFFF' }}
                >
                  {lang === 'ar' ? notif.ar : notif.en}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            {NOTIFICATIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="rounded-full transition-all"
                style={{
                  background:
                    i === currentIndex
                      ? config.color
                      : 'rgba(255, 255, 255, 0.25)',
                  width: i === currentIndex ? '20px' : '6px',
                  height: '6px',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={14} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
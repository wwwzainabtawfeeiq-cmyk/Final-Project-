import toast from 'react-hot-toast';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ChefHat, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

type Portal = 'customer' | 'cook' | 'admin';

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [portal, setPortal] = useState<Portal>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  // التحقق من البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|iq|edu)$/i;
  if (!emailRegex.test(email)) {
    toast.error(
      t(
        'يرجى إدخال بريد إلكتروني صحيح (مثال: name@example.com)',
        'Please enter a valid email (e.g., name@example.com)'
      )
    );
    return;
  }

  // التحقق من كلمة المرور
  if (password.length < 6) {
    toast.error(
      t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters')
    );
    return;
  }

  login(email, email.split('@')[0], portal);

  if (portal === 'cook') navigate('/cook-dashboard');
  else if (portal === 'admin') navigate('/admin');
  else navigate('/');
};
  const PORTALS = [
    {
      id: 'customer' as Portal,
      label: t('عميل', 'Customer'),
      icon: User,
      desc: t('اطلب أطباقك', 'Order dishes'),
      gradient: 'linear-gradient(135deg, #1B4332, #2D5A3D)',
    },
    {
      id: 'cook' as Portal,
      label: t('طباخ', 'Cook'),
      icon: ChefHat,
      desc: t('أدر مطبخك', 'Manage kitchen'),
      gradient: 'linear-gradient(135deg, #C9A227, #F5D76E)',
    },
    {
      id: 'admin' as Portal,
      label: t('مدير', 'Admin'),
      icon: Shield,
      desc: t('تحكم كامل', 'Full control'),
      gradient: 'linear-gradient(135deg, #8B6914, #5C3A21)',
    },
  ];

  const currentPortal = PORTALS.find((p) => p.id === portal)!;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #0F2419 0%, #1B4332 100%)' }}
    >
      <div className="w-full max-w-4xl">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-ruqaa text-5xl md:text-6xl text-gradient-gold text-glow-gold mb-3">
            {t('نكهة البصرة', 'Basra Flavor')}
          </h1>
          <p className="font-tajawal text-cream/60">
            {t('اختر نوع الحساب للدخول', 'Choose your account type')}
          </p>
        </motion.div>

        {/* اختيار البوابة */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 max-w-3xl mx-auto">
          {PORTALS.map((p, i) => {
            const Icon = p.icon;
            const isActive = portal === p.id;
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => setPortal(p.id)}
                className={`relative rounded-2xl p-4 md:p-5 text-center transition-all duration-300 ${
                  isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  background: isActive ? p.gradient : 'rgba(15, 36, 25, 0.6)',
                  border: isActive
                    ? '2px solid rgba(201, 162, 39, 0.6)'
                    : '1px solid rgba(201, 162, 39, 0.2)',
                  boxShadow: isActive ? '0 15px 40px rgba(201, 162, 39, 0.4)' : 'none',
                }}
              >
                <Icon
                  size={28}
                  className={
                    isActive
                      ? 'text-white mx-auto mb-2'
                      : 'text-gold-bright mx-auto mb-2'
                  }
                />
                <div
                  className={`font-ruqaa text-lg md:text-xl ${
                    isActive ? 'text-white' : 'text-cream/70'
                  }`}
                >
                  {p.label}
                </div>
                <div
                  className={`font-tajawal text-[10px] md:text-xs mt-1 ${
                    isActive ? 'text-white/80' : 'text-cream/40'
                  }`}
                >
                  {p.desc}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* نموذج الدخول */}
        <motion.div
          key={portal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto rounded-3xl p-8"
          style={{
            background: 'rgba(15, 36, 25, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(201, 162, 39, 0.3)',
          }}
        >
          <h2 className="font-ruqaa text-2xl text-gradient-gold mb-6 text-center">
            {t('دخول', 'Login as')} {currentPortal.label}
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-tajawal text-sm text-cream/80 mb-2">
                {t('البريد الإلكتروني', 'Email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email')}
                className="w-full px-5 py-3 rounded-xl font-tajawal"
              />
            </div>

            <div>
              <label className="block font-tajawal text-sm text-cream/80 mb-2">
                {t('كلمة المرور', 'Password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('أدخل كلمة المرور', 'Enter your password')}
                className="w-full px-5 py-3 rounded-xl font-tajawal"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full font-tajawal font-bold text-lg text-emerald-deep transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
            >
              {t('دخول', 'Login')}
              <Arrow size={20} />
            </button>
          </form>

          <div className="mt-6 text-center font-tajawal text-sm space-y-2">
            <Link
              to="#"
              className="block text-cream/50 hover:text-gold-bright transition-colors"
            >
              {t('نسيت كلمة المرور؟', 'Forgot password?')}
            </Link>
            <p className="text-cream/60">
              {t('ليس لديك حساب؟', "Don't have an account?")}{' '}
              <Link
                to="/register"
                className="text-gold-bright font-bold hover:underline"
              >
                {t('سجّل الآن', 'Register now')}
              </Link>
            </p>
          </div>
        </motion.div>

        <p className="text-center font-tajawal text-xs text-cream/30 mt-8">
          © 2026 {t('نكهة البصرة', 'Basra Flavor')} —{' '}
          {t('جميع الحقوق محفوظة', 'All rights reserved')}
        </p>
      </div>
    </div>
  );
}
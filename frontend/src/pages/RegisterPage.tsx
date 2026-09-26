import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error(t('يرجى ملء جميع الحقول', 'Please fill all fields'));
      return;
    }
    register(name, email);
    toast.success(t('تم إنشاء حسابك بنجاح', 'Account created successfully'));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(27,67,50,0.4), #0F2419)' }} />
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-gold/20 blur-[3px]"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, width: 4, height: 4 }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 5 + Math.random()*3, repeat: Infinity, delay: Math.random()*2 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md glass-light rounded-3xl p-8 md:p-10"
        style={{ border: '1px solid transparent', backgroundImage: 'linear-gradient(#0F2419, #0F2419), linear-gradient(135deg, #C9A227, #F5D76E, #C9A227)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 gold-glow"
            style={{ background: 'linear-gradient(135deg, #1B4332, #0F2419)', border: '2px solid #C9A227' }}>
            <span className="font-ruqaa text-5xl text-gradient-gold">ن</span>
          </div>
          <h1 className="font-ruqaa text-3xl text-gradient-gold">{t('حساب جديد', 'Register')}</h1>
          <p className="text-cream/60 font-tajawal text-sm mt-2">{t('انضم إلى عائلة نكهة البصرة', 'Join the Basra Flavor family')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cream/70 font-tajawal text-sm mb-2">{t('الاسم الكامل', 'Full Name')}</label>
            <div className="relative">
              <User size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gold/50" />
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder={t('اسمك الكامل', 'Your full name')}
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 pr-11 pl-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-cream/70 font-tajawal text-sm mb-2">{t('البريد الإلكتروني', 'Email')}</label>
            <div className="relative">
              <Mail size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gold/50" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 pr-11 pl-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-cream/70 font-tajawal text-sm mb-2">{t('رقم الهاتف', 'Phone')}</label>
            <div className="relative">
              <Phone size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gold/50" />
              <input value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="0770 123 4567"
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 pr-11 pl-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-cream/70 font-tajawal text-sm mb-2">{t('كلمة المرور', 'Password')}</label>
            <div className="relative">
              <Lock size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gold/50" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 pr-11 pl-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
            </div>
          </div>

          <button type="submit"
            className="w-full py-3.5 rounded-xl font-tajawal font-bold text-lg relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
            <span className="relative z-10 text-emerald-deep">{t('إنشاء حساب', 'Create Account')}</span>
            <span className="absolute inset-0 shine-bg" />
          </button>
        </form>

        <p className="text-center text-cream/60 font-tajawal text-sm mt-6">
          {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
          <Link to="/login" className="text-gold-bright hover:text-glow-gold font-bold transition-all">
            {t('سجل دخول', 'Login')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { User, Mail, Phone, LogOut, Heart, ShoppingBag, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { count } = useCart();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success(t('تم تسجيل الخروج', 'Logged out'));
    navigate('/');
  };

  const stats = [
    { icon: ShoppingBag, label: t('طلبات', 'Orders'), value: 24 },
    { icon: Heart, label: t('مفضلة', 'Favorites'), value: favorites.length },
    { icon: Award, label: t('نقاط', 'Points'), value: 1250 },
  ];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-light rounded-3xl p-8 md:p-10"
      >
        {/* رأس */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center gold-glow"
            style={{ background: 'linear-gradient(135deg, #1B4332, #0F2419)', border: '3px solid #C9A227' }}>
            <User size={40} className="text-gold-bright" />
          </div>
          <div>
            <h1 className="font-ruqaa text-3xl text-gradient-gold">{user.name}</h1>
            <p className="text-cream/60 font-tajawal flex items-center gap-2 mt-1">
              <Mail size={14} /> {user.email}
            </p>
            {user.phone && <p className="text-cream/60 font-tajawal flex items-center gap-2 mt-1">
              <Phone size={14} /> {user.phone}
            </p>}
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center">
              <stat.icon size={24} className="text-gold mx-auto mb-2" />
              <div className="font-cairo text-2xl text-gold-bright">{stat.value}</div>
              <div className="text-cream/50 font-tajawal text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* أزرار */}
        <div className="space-y-3">
          <button onClick={() => navigate('/orders')} className="w-full flex items-center gap-3 p-4 rounded-xl glass hover:gold-glow transition-all">
            <ShoppingBag size={20} className="text-gold-bright" />
            <span className="font-tajawal text-cream">{t('طلباتي', 'My Orders')}</span>
          </button>
          <button onClick={() => navigate('/favorites')} className="w-full flex items-center gap-3 p-4 rounded-xl glass hover:gold-glow transition-all">
            <Heart size={20} className="text-gold-bright" />
            <span className="font-tajawal text-cream">{t('المفضلة', 'Favorites')}</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-xl glass hover:bg-red-900/30 transition-all">
            <LogOut size={20} className="text-red-400" />
            <span className="font-tajawal text-red-400">{t('تسجيل الخروج', 'Logout')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

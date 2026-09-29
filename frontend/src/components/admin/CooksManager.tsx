import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Star,
  ShoppingBag,
  DollarSign,
  Ban,
  Check,
  Search,
  Eye,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

interface AdminCook {
  id: number;
  name: string;
  email: string;
  image: string;
  specialty: string;
  area: string;
  rating: number;
  orders: number;
  earnings: number;
  status: 'active' | 'pending' | 'banned';
  joinedDate: string;
}

const MOCK_COOKS: AdminCook[] = [
  {
    id: 1,
    name: 'أم أحمد',
    email: 'umahmed@test.com',
    image: 'https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    specialty: 'مسكوف وتشريب',
    area: 'العشار',
    rating: 4.9,
    orders: 1240,
    earnings: 18500000,
    status: 'active',
    joinedDate: '2026-08-20',
  },
  {
    id: 2,
    name: 'أبو حسين',
    email: 'abuhussein@test.com',
    image: 'https://images.pexels.com/photos/4253298/pexels-photo-4253298.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    specialty: 'مشاوي وكباب',
    area: 'الزبير',
    rating: 4.8,
    orders: 980,
    earnings: 13700000,
    status: 'active',
    joinedDate: '2026-08-05',
  },
  {
    id: 3,
    name: 'ست نورية',
    email: 'nouria@test.com',
    image: 'https://images.pexels.com/photos/3770002/pexels-photo-3770002.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    specialty: 'حلويات وزلابية',
    area: 'الجبيلة',
    rating: 5.0,
    orders: 1530,
    earnings: 22950000,
    status: 'active',
    joinedDate: '2026-08-01',
  },
  {
    id: 4,
    name: 'أبو علي',
    email: 'abuail@test.com',
    image: 'https://images.pexels.com/photos/24252237/pexels-photo-24252237.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    specialty: 'قوزي ودولمة',
    area: 'البراضعية',
    rating: 4.7,
    orders: 760,
    earnings: 11400000,
    status: 'active',
    joinedDate: '2026-08-15',
  },
  {
    id: 5,
    name: 'أم سيف',
    email: 'umsaif@test.com',
    image: 'https://images.pexels.com/photos/3769739/pexels-photo-3769739.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    specialty: 'هريسة وباقلاء',
    area: 'الجزائر',
    rating: 4.6,
    orders: 540,
    earnings: 8100000,
    status: 'pending',
    joinedDate: '2026-09-25',
  },
  {
    id: 6,
    name: 'أبو كرار',
    email: 'abukarar@test.com',
    image: 'https://images.pexels.com/photos/8629075/pexels-photo-8629075.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    specialty: 'برياني وتمّن',
    area: 'خمسة ميل',
    rating: 4.8,
    orders: 1120,
    earnings: 16800000,
    status: 'active',
    joinedDate: '2026-08-10',
  },
];

const STATUS_CONFIG = {
  active: { ar: 'نشط', en: 'Active', color: '#22c55e' },
  pending: { ar: 'بانتظار الموافقة', en: 'Pending', color: '#F5D76E' },
  banned: { ar: 'محظور', en: 'Banned', color: '#ef4444' },
};

export default function CooksManager() {
  const { t, lang } = useLanguage();
  const [cooks, setCooks] = useState(MOCK_COOKS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'banned'>('all');

  const filteredCooks = cooks.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleApprove = (id: number) => {
    setCooks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'active' as const } : c))
    );
    toast.success(t('تم قبول الطباخ', 'Cook approved'));
  };

  const handleToggleBan = (id: number) => {
    setCooks((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'banned' ? 'active' : 'banned' }
          : c
      )
    );
    toast.success(t('تم تحديث حالة الطباخ', 'Cook status updated'));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-ruqaa text-2xl text-gradient-gold flex items-center gap-2">
          <ChefHat size={24} /> {t('إدارة الطُهاة', 'Cooks Manager')}
        </h2>

        <div className="relative flex-1 max-w-xs">
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 right-3"
            style={{ color: 'rgba(201, 162, 39, 0.6)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث بالاسم أو البريد...', 'Search by name or email...')}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>
      </div>

      {/* فلاتر */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all' as const, ar: 'الكل', en: 'All' },
          { key: 'active' as const, ar: 'النشطون', en: 'Active' },
          { key: 'pending' as const, ar: 'بانتظار الموافقة', en: 'Pending' },
          { key: 'banned' as const, ar: 'المحظورون', en: 'Banned' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-4 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
            style={{
              background:
                filter === f.key
                  ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                  : 'rgba(255, 255, 255, 0.08)',
              color: filter === f.key ? '#0F2419' : 'rgba(255, 255, 255, 0.7)',
              border:
                filter === f.key
                  ? 'none'
                  : '1px solid rgba(201, 162, 39, 0.25)',
            }}
          >
            {lang === 'ar' ? f.ar : f.en}
          </button>
        ))}
      </div>

      {/* الشبكة */}
      {filteredCooks.length === 0 ? (
        <div className="text-center py-16">
          <ChefHat
            size={48}
            className="mx-auto mb-4"
            style={{ color: 'rgba(201, 162, 39, 0.3)' }}
          />
          <p className="font-tajawal" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {t('لا توجد نتائج', 'No results')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCooks.map((cook, i) => {
            const status = STATUS_CONFIG[cook.status];
            return (
              <motion.div
                key={cook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-5"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
                  border:
                    cook.status === 'pending'
                      ? '2px solid rgba(201, 162, 39, 0.6)'
                      : '1px solid rgba(201, 162, 39, 0.2)',
                }}
              >
                {/* الرأس */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={cook.image}
                    alt={cook.name}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{ border: '2px solid #C9A227' }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className="font-tajawal font-bold text-base"
                          style={{ color: '#FFFFFF' }}
                        >
                          {cook.name}
                        </h3>
                        <p
                          className="font-tajawal text-xs mt-0.5"
                          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {cook.email}
                        </p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-tajawal font-bold"
                        style={{
                          background: `${status.color}20`,
                          color: status.color,
                          border: `1px solid ${status.color}40`,
                        }}
                      >
                        {lang === 'ar' ? status.ar : status.en}
                      </span>
                    </div>
                  </div>
                </div>

                {/* المعلومات */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <ChefHat size={12} style={{ color: '#F5D76E' }} />
                    <span className="font-tajawal">{cook.specialty}</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <MapPin size={12} style={{ color: '#F5D76E' }} />
                    <span className="font-tajawal">{cook.area}</span>
                  </div>
                </div>

                {/* الإحصائيات */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div
                    className="rounded-xl p-2 text-center"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <Star
                      size={14}
                      className="mx-auto mb-1"
                      style={{ color: '#F5D76E' }}
                      fill="#F5D76E"
                    />
                    <p className="font-cairo text-sm font-bold" style={{ color: '#FFFFFF' }}>
                      {cook.rating}
                    </p>
                    <p
                      className="font-tajawal text-[10px]"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      {t('تقييم', 'Rating')}
                    </p>
                  </div>
                  <div
                    className="rounded-xl p-2 text-center"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <ShoppingBag
                      size={14}
                      className="mx-auto mb-1"
                      style={{ color: '#a855f7' }}
                    />
                    <p className="font-cairo text-sm font-bold" style={{ color: '#FFFFFF' }}>
                      {cook.orders}
                    </p>
                    <p
                      className="font-tajawal text-[10px]"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      {t('طلبات', 'Orders')}
                    </p>
                  </div>
                  <div
                    className="rounded-xl p-2 text-center"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <DollarSign
                      size={14}
                      className="mx-auto mb-1"
                      style={{ color: '#22c55e' }}
                    />
                    <p className="font-cairo text-sm font-bold" style={{ color: '#FFFFFF' }}>
                      {(cook.earnings / 1000000).toFixed(1)}M
                    </p>
                    <p
                      className="font-tajawal text-[10px]"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      {t('أرباح', 'Earnings')}
                    </p>
                  </div>
                </div>

                {/* الأزرار */}
                <div className="flex gap-2">
                  {cook.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(cook.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl font-tajawal text-xs font-bold transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: '#FFFFFF',
                      }}
                    >
                      <Check size={14} /> {t('قبول', 'Approve')}
                    </button>
                  )}

                  {cook.status === 'active' && (
                    <button
                      onClick={() => handleToggleBan(cook.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl font-tajawal text-xs font-bold transition-all"
                      style={{
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#f87171',
                      }}
                    >
                      <Ban size={14} /> {t('حظر', 'Ban')}
                    </button>
                  )}

                  {cook.status === 'banned' && (
                    <button
                      onClick={() => handleToggleBan(cook.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl font-tajawal text-xs font-bold transition-all"
                      style={{
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        color: '#22c55e',
                      }}
                    >
                      <Check size={14} /> {t('تفعيل', 'Activate')}
                    </button>
                  )}

                  <button
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl transition-all"
                    style={{
                      border: '1px solid rgba(201, 162, 39, 0.4)',
                      color: '#F5D76E',
                    }}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
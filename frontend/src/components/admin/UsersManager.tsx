import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChefHat, Shield, Ban, Check, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'cook' | 'admin';
  status: 'active' | 'banned';
  joinedDate: string;
}

const MOCK_USERS: AdminUser[] = [
  { id: 1, name: 'أحمد كريم', email: 'ahmed@test.com', role: 'customer', status: 'active', joinedDate: '2026-09-15' },
  { id: 2, name: 'أم أحمد', email: 'umahmed@test.com', role: 'cook', status: 'active', joinedDate: '2026-08-20' },
  { id: 3, name: 'زينب علي', email: 'zainab@test.com', role: 'customer', status: 'active', joinedDate: '2026-09-10' },
  { id: 4, name: 'أبو حسين', email: 'abuhussein@test.com', role: 'cook', status: 'active', joinedDate: '2026-08-05' },
  { id: 5, name: 'حسين محمد', email: 'hussein@test.com', role: 'customer', status: 'banned', joinedDate: '2026-07-15' },
  { id: 6, name: 'ست نورية', email: 'nouria@test.com', role: 'cook', status: 'active', joinedDate: '2026-08-01' },
];

const ROLE_CONFIG = {
  customer: { ar: 'عميل', en: 'Customer', icon: User, color: '#3b82f6' },
  cook: { ar: 'طباخ', en: 'Cook', icon: ChefHat, color: '#F5D76E' },
  admin: { ar: 'مدير', en: 'Admin', icon: Shield, color: '#a855f7' },
};

export default function UsersManager() {
  const { t, lang } = useLanguage();
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'customer' | 'cook'>('all');

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const handleToggleBan = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'banned' : 'active' }
          : u
      )
    );
    toast.success(t('تم تحديث حالة المستخدم', 'User status updated'));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-ruqaa text-2xl text-gradient-gold flex items-center gap-2">
          <User size={24} /> {t('إدارة المستخدمين', 'Users Manager')}
        </h2>

        {/* بحث */}
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

        {/* فلتر */}
        <div className="flex gap-2">
          {[
            { key: 'all' as const, ar: 'الكل', en: 'All' },
            { key: 'customer' as const, ar: 'العملاء', en: 'Customers' },
            { key: 'cook' as const, ar: 'الطُهاة', en: 'Cooks' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-2 rounded-full font-tajawal text-xs font-bold transition-all"
              style={{
                background:
                  filter === f.key
                    ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                    : 'rgba(255, 255, 255, 0.08)',
                color: filter === f.key ? '#0F2419' : 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {lang === 'ar' ? f.ar : f.en}
            </button>
          ))}
        </div>
      </div>

      {/* الجدول */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(201, 162, 39, 0.2)' }}>
        {/* رأس الجدول */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3" style={{ background: 'rgba(15, 36, 25, 0.8)' }}>
          <div className="col-span-4 font-tajawal text-xs font-bold" style={{ color: '#F5D76E' }}>
            {t('الاسم', 'Name')}
          </div>
          <div className="col-span-4 font-tajawal text-xs font-bold" style={{ color: '#F5D76E' }}>
            {t('البريد', 'Email')}
          </div>
          <div className="col-span-2 font-tajawal text-xs font-bold" style={{ color: '#F5D76E' }}>
            {t('النوع', 'Role')}
          </div>
          <div className="col-span-2 font-tajawal text-xs font-bold text-left" style={{ color: '#F5D76E' }}>
            {t('إجراء', 'Action')}
          </div>
        </div>

        {/* الصفوف */}
        {filteredUsers.map((u, i) => {
          const roleConf = ROLE_CONFIG[u.role];
          const RoleIcon = roleConf.icon;
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-t"
              style={{ borderColor: 'rgba(201, 162, 39, 0.1)' }}
            >
              <div className="col-span-4 font-tajawal text-sm" style={{ color: '#FFFFFF' }}>
                {u.name}
              </div>
              <div className="col-span-4 font-cairo text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {u.email}
              </div>
              <div className="col-span-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-tajawal"
                  style={{
                    background: `${roleConf.color}20`,
                    color: roleConf.color,
                    border: `1px solid ${roleConf.color}40`,
                  }}
                >
                  <RoleIcon size={12} />
                  {lang === 'ar' ? roleConf.ar : roleConf.en}
                </span>
              </div>
              <div className="col-span-2 text-left">
                <button
                  onClick={() => handleToggleBan(u.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-tajawal font-bold transition-all"
                  style={{
                    border: u.status === 'banned'
                      ? '1px solid rgba(34, 197, 94, 0.4)'
                      : '1px solid rgba(239, 68, 68, 0.4)',
                    color: u.status === 'banned' ? '#22c55e' : '#f87171',
                  }}
                >
                  {u.status === 'banned' ? <Check size={12} /> : <Ban size={12} />}
                  {u.status === 'banned' ? t('تفعيل', 'Activate') : t('حظر', 'Ban')}
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-tajawal" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {t('لا توجد نتائج', 'No results')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
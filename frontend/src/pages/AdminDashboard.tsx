import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Shield, LayoutDashboard, Users, ShoppingBag, ChefHat } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import AdminStats from '@/components/admin/AdminStats';
import UsersManager from '@/components/admin/UsersManager';
import AllOrdersManager from '@/components/admin/AllOrdersManager';

type TabKey = 'overview' | 'users' | 'orders' | 'cooks';

export default function AdminDashboard() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<TabKey>('overview');

  const TABS: { key: TabKey; ar: string; en: string; icon: LucideIcon }[] = [
    { key: 'overview', ar: 'نظرة عامة', en: 'Overview', icon: LayoutDashboard },
    { key: 'users', ar: 'المستخدمون', en: 'Users', icon: Users },
    { key: 'orders', ar: 'الطلبات', en: 'Orders', icon: ShoppingBag },
    { key: 'cooks', ar: 'الطُهاة', en: 'Cooks', icon: ChefHat },
  ];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-ruqaa text-4xl md:text-5xl text-gradient-gold mb-2 flex items-center gap-3">
          <Shield size={40} /> {t('لوحة المدير', 'Admin Dashboard')}
        </h1>
        <p
          className="font-tajawal text-base"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          {t('تحكم كامل بالمنصة', 'Full platform control')}
        </p>
      </motion.div>

      {/* الإحصائيات */}
      <AdminStats
        totalUsers={1240}
        totalCooks={45}
        totalOrders={8500}
        totalRevenue={45000000}
        activeOrders={12}
      />

      {/* التبويبات */}
      <div className="flex gap-2 mb-8 border-b border-gold/15 overflow-x-auto">
        {TABS.map((tb) => {
          const Icon = tb.icon;
          const isActive = tab === tb.key;
          return (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className="relative px-5 py-3 font-tajawal text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
              style={{
                color: isActive ? '#F5D76E' : 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Icon size={16} />
              {lang === 'ar' ? tb.ar : tb.en}
              {isActive && (
                <motion.span
                  layoutId="adminTab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-bright"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* المحتوى */}
      {tab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <LayoutDashboard
            size={64}
            className="mx-auto mb-4"
            style={{ color: 'rgba(201, 162, 39, 0.4)' }}
          />
          <h2 className="font-ruqaa text-2xl text-gradient-gold mb-2">
            {t('نظرة عامة', 'Overview')}
          </h2>
          <p
            className="font-tajawal"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {t(
              'اختر تبويبًا من الأعلى لعرض التفاصيل',
              'Choose a tab above to view details'
            )}
          </p>
        </motion.div>
      )}

      {tab === 'users' && <UsersManager />}
      {tab === 'orders' && <AllOrdersManager />}
      {tab === 'cooks' && (
        <div className="text-center py-16">
          <ChefHat
            size={48}
            className="mx-auto mb-4"
            style={{ color: 'rgba(201, 162, 39, 0.4)' }}
          />
          <p
            className="font-tajawal text-lg"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {t('إدارة الطُهاة قادمة قريبًا', 'Cooks manager coming soon')}
          </p>
        </div>
      )}
    </div>
  );
}
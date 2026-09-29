import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Package, Clock, Star, DollarSign } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import CookStats from '@/components/cook/CookStats';
import CookBadge from '@/components/loyalty/CookBadge';
import MenuManager from '@/components/cook/MenuManager';
import ReviewsPanel from '@/components/cook/ReviewsPanel';
import EarningsPanel from '@/components/cook/EarningsPanel';

// ====== طلبات تجريبية ======
const mockOrders = [
  {
    id: 'ORD-1024',
    customer: 'أحمد كريم',
    items: ['مسكوف بصري × 2'],
    total: 36000,
    status: 'new',
    time: 'منذ 5 دقائق',
    address: 'البصرة - العشار',
  },
  {
    id: 'ORD-1023',
    customer: 'زينب علي',
    items: ['زلابية بالعسل × 1', 'كليجة × 2'],
    total: 20000,
    status: 'cooking',
    time: 'منذ 15 دقيقة',
    address: 'البصرة - الجبيلة',
  },
  {
    id: 'ORD-1022',
    customer: 'حسين محمد',
    items: ['برياني أبو كرار × 3'],
    total: 45000,
    status: 'ready',
    time: 'منذ 25 دقيقة',
    address: 'البصرة - الزبير',
  },
  {
    id: 'ORD-1021',
    customer: 'فاطمة سالم',
    items: ['قوزي بغدادي × 1'],
    total: 22000,
    status: 'delivering',
    time: 'منذ 40 دقيقة',
    address: 'البصرة - البراضعية',
  },
];

const STATUS_CONFIG = {
  new: { ar: 'طلب جديد', en: 'New Order', color: '#F5D76E', bg: 'rgba(201, 162, 39, 0.15)' },
  cooking: { ar: 'قيد التحضير', en: 'Cooking', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  ready: { ar: 'جاهز للتوصيل', en: 'Ready', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
  delivering: { ar: 'في الطريق', en: 'Delivering', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
};

type MainTab = 'orders' | 'menu' | 'reviews' | 'earnings';

const VALID_TABS: MainTab[] = ['orders', 'menu', 'reviews', 'earnings'];

export default function CookDashboard() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة التبويب من URL
  const initialTab = (searchParams.get('tab') as MainTab) || 'orders';
  const [activeTab, setActiveTab] = useState<MainTab>(
    VALID_TABS.includes(initialTab) ? initialTab : 'orders'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // مزامنة التبويب عند تغيير URL
  useEffect(() => {
    const urlTab = searchParams.get('tab') as MainTab;
    if (urlTab && VALID_TABS.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
    
  }, [searchParams, activeTab]);


  const handleTabChange = (newTab: MainTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const filteredOrders = mockOrders.filter(
    (o) => selectedStatus === 'all' || o.status === selectedStatus
  );

  const orderTabs = [
    { key: 'all', ar: 'الكل', en: 'All' },
    { key: 'new', ar: 'جديدة', en: 'New' },
    { key: 'cooking', ar: 'قيد التحضير', en: 'Cooking' },
    { key: 'ready', ar: 'جاهزة', en: 'Ready' },
    { key: 'delivering', ar: 'في الطريق', en: 'Delivering' },
  ];

  const MAIN_TABS: { key: MainTab; ar: string; en: string; icon: LucideIcon }[] = [
    { key: 'orders', ar: 'الطلبات', en: 'Orders', icon: Package },
    { key: 'menu', ar: 'قائمتي', en: 'My Menu', icon: ChefHat },
    { key: 'reviews', ar: 'التقييمات', en: 'Reviews', icon: Star },
    { key: 'earnings', ar: 'الأرباح', en: 'Earnings', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-ruqaa text-4xl md:text-5xl text-gradient-gold mb-2 flex items-center gap-3">
              <ChefHat size={40} /> {t('لوحة الطباخ', 'Cook Dashboard')}
            </h1>
            <p
              className="font-tajawal text-base"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              {t(
                `مرحباً ${user?.name || ''}! إليك ملخص يومك`,
                `Welcome ${user?.name || ''}! Here's your day summary`
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cook Badge */}
      <div className="mb-8">
        <CookBadge ordersCount={35} />
      </div>

      {/* الإحصائيات */}
      <CookStats
        ordersToday={8}
        earningsToday={125000}
        rating={4.9}
        newCustomers={3}
      />

      {/* التبويبات الرئيسية */}
      <div className="flex gap-2 mb-8 border-b border-gold/15 overflow-x-auto">
        {MAIN_TABS.map((tb) => {
          const Icon = tb.icon;
          const isActive = activeTab === tb.key;
          return (
            <button
              key={tb.key}
              onClick={() => handleTabChange(tb.key)}
              className="relative px-5 py-3 font-tajawal text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
              style={{
                color: isActive ? '#F5D76E' : 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Icon size={16} />
              {lang === 'ar' ? tb.ar : tb.en}
              {isActive && (
                <motion.span
                  layoutId="cookMainTab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-bright"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* المحتوى حسب التبويب */}
      {activeTab === 'menu' && <MenuManager />}
      {activeTab === 'reviews' && <ReviewsPanel />}
      {activeTab === 'earnings' && <EarningsPanel />}

      {activeTab === 'orders' && (
        <>
          {/* تبويبات الطلبات الفرعية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="font-ruqaa text-2xl text-gradient-gold mb-4 flex items-center gap-2">
              <Package size={24} /> {t('طلبات اليوم', "Today's Orders")}
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {orderTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className="px-4 py-2 rounded-full font-tajawal text-sm font-bold whitespace-nowrap transition-all"
                  style={{
                    background:
                      selectedStatus === tab.key
                        ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                        : 'rgba(255, 255, 255, 0.08)',
                    color:
                      selectedStatus === tab.key
                        ? '#0F2419'
                        : 'rgba(255, 255, 255, 0.7)',
                    border:
                      selectedStatus === tab.key
                        ? 'none'
                        : '1px solid rgba(201, 162, 39, 0.25)',
                  }}
                >
                  {lang === 'ar' ? tab.ar : tab.en}
                </button>
              ))}
            </div>
          </motion.div>

          {/* قائمة الطلبات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order, i) => {
              const status =
                STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-5"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
                    border: '1px solid rgba(201, 162, 39, 0.2)',
                  }}
                >
                  {/* رأس الطلب */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p
                        className="font-cairo text-base font-bold"
                        style={{ color: '#F5D76E' }}
                      >
                        {order.id}
                      </p>
                      <p
                        className="font-tajawal text-xs mt-1"
                        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        {order.customer}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-tajawal font-bold"
                      style={{
                        background: status.bg,
                        color: status.color,
                        border: `1px solid ${status.color}40`,
                      }}
                    >
                      {lang === 'ar' ? status.ar : status.en}
                    </span>
                  </div>

                  {/* الأطباق */}
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, idx) => (
                      <p
                        key={idx}
                        className="font-tajawal text-sm"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        • {item}
                      </p>
                    ))}
                  </div>

                  {/* العنوان */}
                  <p
                    className="font-tajawal text-xs mb-3"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    📍 {order.address}
                  </p>

                  {/* الفوتر */}
                  <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                    <span
                      className="font-tajawal text-xs flex items-center gap-1"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <Clock size={12} /> {order.time}
                    </span>
                    <span className="font-cairo text-lg text-gradient-gold">
                      {order.total.toLocaleString()} د.ع
                    </span>
                  </div>

                  {/* أزرار الإجراءات */}
                  {order.status === 'new' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        className="flex-1 py-2.5 rounded-xl font-tajawal text-sm font-bold transition-all"
                        style={{
                          background:
                            'linear-gradient(135deg, #C9A227, #F5D76E)',
                          color: '#0F2419',
                        }}
                      >
                        ✓ {t('قبول الطلب', 'Accept')}
                      </button>
                      <button
                        className="px-4 py-2.5 rounded-xl font-tajawal text-sm font-bold"
                        style={{
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#f87171',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {order.status === 'cooking' && (
                    <button
                      className="w-full mt-4 py-2.5 rounded-xl font-tajawal text-sm font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: '#FFFFFF',
                      }}
                    >
                      ✓ {t('جاهز للتوصيل', 'Mark Ready')}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
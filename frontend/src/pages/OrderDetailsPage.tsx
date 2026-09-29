import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  Package,
  Truck,
  ChefHat,
  Star,
  MapPin,
  Phone,
  CreditCard,
  FileText,
  X,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { meals, formatPrice } from '@/data/mockData';

type OrderStatus =
  | 'received'
  | 'cooking'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

// نفس بيانات OrdersPage
const mockOrders = [
  {
    id: 'ORD-1024',
    date: '2026-09-24',
    status: 'delivering' as OrderStatus,
    items: [1, 3],
    total: 33000,
    address: 'البصرة - العشار',
    eta: '15-20 دقيقة',
    cook: 'أم أحمد',
    phone: '+964 780 111 1111',
    payment: 'نقداً عند التسليم',
    notes: 'بدون بصل، حار زيادة',
  },
  {
    id: 'ORD-1023',
    date: '2026-09-22',
    status: 'cooking' as OrderStatus,
    items: [7, 12],
    total: 15000,
    address: 'البصرة - الجبيلة',
    eta: '35-40 دقيقة',
    cook: 'ست نورية',
    phone: '+964 780 333 3333',
    payment: 'زين كاش',
    notes: '',
  },
  {
    id: 'ORD-1022',
    date: '2026-09-20',
    status: 'delivered' as OrderStatus,
    items: [4],
    total: 14000,
    address: 'البصرة - الزبير',
    cook: 'أبو حسين',
    phone: '+964 780 222 2222',
    payment: 'نقداً عند التسليم',
    notes: 'بدون ثوم',
    rated: false,
  },
  {
    id: 'ORD-1021',
    date: '2026-09-18',
    status: 'delivered' as OrderStatus,
    items: [2, 5],
    total: 32000,
    address: 'البصرة - البراضعية',
    cook: 'أبو علي',
    phone: '+964 780 444 4444',
    payment: 'Mastercard',
    notes: '',
    rated: true,
  },
  {
    id: 'ORD-1019',
    date: '2026-09-15',
    status: 'cancelled' as OrderStatus,
    items: [9],
    total: 12000,
    address: 'البصرة - العشار',
    cook: 'أم أحمد',
    phone: '+964 780 111 1111',
    payment: 'نقداً عند التسليم',
    notes: '',
  },
];

const TRACKING_STEPS = [
  { key: 'received', ar: 'تم استلام الطلب', en: 'Order Received', icon: CheckCircle },
  { key: 'cooking', ar: 'قيد التحضير', en: 'Cooking', icon: ChefHat },
  { key: 'ready', ar: 'جاهز للتوصيل', en: 'Ready', icon: Package },
  { key: 'delivering', ar: 'في الطريق إليك', en: 'On the way', icon: Truck },
  { key: 'delivered', ar: 'تم التسليم', en: 'Delivered', icon: CheckCircle },
];

const getStatusIndex = (status: OrderStatus): number => {
  const map: Record<OrderStatus, number> = {
    received: 0,
    cooking: 1,
    ready: 2,
    delivering: 3,
    delivered: 4,
    cancelled: -1,
  };
  return map[status];
};

const STATUS_LABELS: Record<OrderStatus, { ar: string; en: string; color: string }> = {
  received: { ar: 'تم الاستلام', en: 'Received', color: '#3b82f6' },
  cooking: { ar: 'قيد التحضير', en: 'Cooking', color: '#F5D76E' },
  ready: { ar: 'جاهز', en: 'Ready', color: '#f97316' },
  delivering: { ar: 'في الطريق', en: 'Delivering', color: '#a855f7' },
  delivered: { ar: 'تم التسليم', en: 'Delivered', color: '#22c55e' },
  cancelled: { ar: 'ملغى', en: 'Cancelled', color: '#ef4444' },
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-ruqaa text-3xl text-gradient-gold mb-4">
            {t('لم نجد هذا الطلب', 'Order not found')}
          </h2>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 rounded-full font-tajawal font-bold"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)', color: '#0F2419' }}
          >
            {t('العودة للطلبات', 'Back to Orders')}
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_LABELS[order.status];
  const orderMeals = order.items
    .map((mid) => meals.find((m) => m.id === mid))
    .filter(Boolean) as typeof meals;
  const currentIndex = getStatusIndex(order.status);

  const handleSubmitReview = () => {
    setSubmitted(true);
    setTimeout(() => {
      setReviewOpen(false);
      setSubmitted(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      {/* زر العودة */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 mb-6 font-tajawal text-sm hover:text-gold-bright transition-colors"
        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
      >
        <Arrow size={18} /> {t('العودة للطلبات', 'Back to Orders')}
      </button>

      {/* رأس الصفحة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 36, 25, 0.9), rgba(27, 67, 50, 0.6))',
          border: '1px solid rgba(201, 162, 39, 0.3)',
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-cairo text-3xl mb-1" style={{ color: '#F5D76E' }}>
              {order.id}
            </h1>
            <p className="font-tajawal text-sm flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              <Clock size={14} /> {order.date}
            </p>
          </div>
          <div
            className="px-5 py-2.5 rounded-full font-tajawal font-bold text-sm"
            style={{
              background: `${status.color}20`,
              color: status.color,
              border: `1px solid ${status.color}60`,
            }}
          >
            {lang === 'ar' ? status.ar : status.en}
          </div>
        </div>

        {/* الأطباق */}
        <div className="space-y-3 mb-4">
          {orderMeals.map((meal) => (
            <div key={meal.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <img src={meal.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-tajawal font-bold text-base" style={{ color: '#FFFFFF' }}>
                  {lang === 'ar' ? meal.name : meal.nameEn}
                </h3>
                <p className="font-tajawal text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {meal.prepTime}
                </p>
              </div>
              <span className="font-cairo text-lg text-gradient-gold">{formatPrice(meal.price)}</span>
            </div>
          ))}
        </div>

        {/* المجموع */}
        <div className="flex items-center justify-between pt-4 border-t border-gold/15">
          <span className="font-tajawal text-lg" style={{ color: '#FFFFFF' }}>
            {t('المجموع الكلي', 'Grand Total')}
          </span>
          <span className="font-cairo text-2xl text-gradient-gold">{formatPrice(order.total)}</span>
        </div>
      </motion.div>

      {/* معلومات الطلب */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: ChefHat, label: t('الطباخ', 'Cook'), value: order.cook },
          { icon: Phone, label: t('الهاتف', 'Phone'), value: order.phone },
          { icon: CreditCard, label: t('الدفع', 'Payment'), value: order.payment },
        ].map((info, i) => {
          const Icon = info.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201, 162, 39, 0.15)' }}>
                <Icon size={18} style={{ color: '#F5D76E' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-tajawal text-xs mb-0.5" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {info.label}
                </p>
                <p className="font-tajawal text-sm truncate" style={{ color: '#FFFFFF' }}>
                  {info.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* العنوان */}
      <div className="rounded-2xl p-5 mb-6 flex items-start gap-3" style={{ background: 'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
        <MapPin size={20} style={{ color: '#F5D76E' }} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-tajawal text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {t('عنوان التوصيل', 'Delivery address')}
          </p>
          <p className="font-tajawal text-sm" style={{ color: '#FFFFFF' }}>
            {order.address}
          </p>
        </div>
      </div>

      {/* الملاحظات */}
      {order.notes && (
        <div className="rounded-2xl p-5 mb-6 flex items-start gap-3" style={{ background: 'linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
          <FileText size={20} style={{ color: '#F5D76E' }} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-tajawal text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {t('ملاحظاتك', 'Your Notes')}
            </p>
            <p className="font-tajawal text-sm" style={{ color: '#FFFFFF' }}>
              {order.notes}
            </p>
          </div>
        </div>
      )}

      {/* تتبع الطلب */}
      {order.status !== 'cancelled' && (
        <div className="rounded-3xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(15, 36, 25, 0.9), rgba(27, 67, 50, 0.6))', border: '1px solid rgba(201, 162, 39, 0.3)' }}>
          <h2 className="font-ruqaa text-2xl text-gradient-gold mb-6 flex items-center gap-2">
            <Truck size={24} /> {t('تتبع الطلب', 'Track Order')}
          </h2>

          {order.eta && (
            <div className="mb-6 p-4 rounded-2xl text-center" style={{ border: '1px solid rgba(201, 162, 39, 0.3)', backgroundColor: 'rgba(201, 162, 39, 0.08)' }}>
              <p className="font-tajawal text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {t('الوقت المتوقع للتوصيل', 'Estimated delivery time')}
              </p>
              <p className="font-cairo text-2xl text-gradient-gold">{order.eta}</p>
            </div>
          )}

          <div className="space-y-4 relative">
            {TRACKING_STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = i <= currentIndex;
              const active = i === currentIndex;

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {i < TRACKING_STEPS.length - 1 && (
                    <div className="absolute top-12 right-6 w-0.5 h-8 z-0" style={{ backgroundColor: i < currentIndex ? '#F5D76E' : 'rgba(255, 255, 255, 0.15)' }} />
                  )}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10" style={{ background: done ? 'linear-gradient(135deg, #C9A227, #F5D76E)' : 'rgba(255, 255, 255, 0.1)', border: active ? '3px solid #F5D76E' : 'none', boxShadow: active ? '0 0 20px rgba(201, 162, 39, 0.6)' : 'none' }}>
                    <Icon size={20} style={{ color: done ? '#0F2419' : 'rgba(255, 255, 255, 0.4)' }} />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-tajawal font-bold text-base" style={{ color: done ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)' }}>
                      {lang === 'ar' ? step.ar : step.en}
                    </h3>
                    {active && <p className="font-tajawal text-xs mt-1" style={{ color: '#F5D76E' }}>{t('● الآن', '● Now')}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* الأزرار */}
      <div className="flex gap-3">
        {order.status === 'delivered' && !order.rated && (
          <button
            onClick={() => setReviewOpen(true)}
            className="flex-1 py-4 rounded-full font-tajawal font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{ border: '2px solid #F5D76E', color: '#F5D76E', background: 'rgba(201, 162, 39, 0.1)' }}
          >
            <Star size={20} /> {t('قيّم الطباخ', 'Rate Cook')}
          </button>
        )}
        {order.status === 'delivered' && (
          <button
            className="flex-1 py-4 rounded-full font-tajawal font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)', color: '#0F2419' }}
          >
            <RotateCcw size={20} /> {t('أعد الطلب', 'Reorder')}
          </button>
        )}
      </div>

      {/* نافذة التقييم */}
      <AnimatePresence>
        {reviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={() => setReviewOpen(false)} />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 250 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0F2419 0%, #1B4332 100%)', border: '2px solid rgba(201, 162, 39, 0.4)', boxShadow: '0 25px 80px rgba(201, 162, 39, 0.3)' }}
            >
              <button onClick={() => setReviewOpen(false)} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <X size={18} style={{ color: '#F5D76E' }} />
              </button>

              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
                      <CheckCircle size={40} style={{ color: '#0F2419' }} />
                    </div>
                    <h2 className="font-ruqaa text-3xl text-gradient-gold mb-2">{t('شكراً لك!', 'Thank You!')}</h2>
                    <p className="font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {t('تم إرسال تقييمك بنجاح', 'Your review was submitted')}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <Star size={40} className="mx-auto mb-2" style={{ color: '#F5D76E' }} />
                      <h2 className="font-ruqaa text-2xl text-gradient-gold mb-1">{t('قيّم تجربتك', 'Rate your experience')}</h2>
                      <p className="font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{order.cook}</p>
                    </div>

                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-125">
                          <Star size={36} style={{ color: star <= rating ? '#F5D76E' : 'rgba(255, 255, 255, 0.2)', fill: star <= rating ? '#F5D76E' : 'transparent' }} />
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      placeholder={t('شاركنا تجربتك...', 'Share your experience...')}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(201, 162, 39, 0.35)', borderRadius: '12px', padding: '12px 16px', width: '100%', fontFamily: 'Tajawal, sans-serif', fontSize: '16px', outline: 'none', resize: 'vertical', minHeight: '90px' }}
                    />

                    <button
                      onClick={handleSubmitReview}
                      className="w-full mt-6 py-3.5 rounded-full font-tajawal font-bold text-base transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)', color: '#0F2419' }}
                    >
                      {t('إرسال التقييم', 'Submit Review')}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin, CreditCard, Truck, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/mockData';
import { cn } from '@/utils/cn';

export default function CheckoutPage() {
  const { t, lang } = useLanguage();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', notes: '',
  });

  const steps = [
    { icon: MapPin, title: t('العنوان', 'Address') },
    { icon: Truck, title: t('التوصيل', 'Delivery') },
    { icon: CreditCard, title: t('الدفع', 'Payment') },
    { icon: Check, title: t('تأكيد', 'Confirm') },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-gold/40 mx-auto mb-4" />
          <p className="text-cream/50 font-tajawal text-xl mb-6">{t('سلتك فارغة', 'Your cart is empty')}</p>
          <button onClick={() => navigate('/meals')} className="px-6 py-3 rounded-full font-tajawal font-bold"
            style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
            <span className="text-emerald-deep">{t('تصفح الأطباق', 'Browse Meals')}</span>
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // إتمام الطلب
      clearCart();
      toast.success(t('تم تأكيد طلبك بنجاح', 'Order confirmed successfully'));
      navigate('/orders');
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <h1 className="font-ruqaa text-4xl text-center text-gradient-gold mb-10">{t('إتمام الطلب', 'Checkout')}</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                i <= step ? 'gold-glow' : 'glass-light'
              )}
              style={i <= step ? { background: 'linear-gradient(135deg, #C9A227, #F5D76E)' } : {}}>
                <s.icon size={20} className={i <= step ? 'text-emerald-deep' : 'text-gold/50'} />
              </div>
              <span className={cn('font-tajawal text-xs mt-2', i <= step ? 'text-gold-bright' : 'text-cream/40')}>{s.title}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('h-0.5 flex-1 mx-2 transition-all duration-500', i < step ? 'bg-gold' : 'bg-gold/20')} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass-light rounded-2xl p-6 md:p-8"
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-4">{t('معلومات التوصيل', 'Delivery Information')}</h2>
              <input placeholder={t('الاسم الكامل', 'Full Name')} value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 px-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
              <input placeholder={t('رقم الهاتف', 'Phone Number')} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 px-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
              <input placeholder={t('العنوان', 'Address')} value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 px-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
              <input placeholder={t('المدينة', 'City')} value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                className="w-full bg-emerald-deep/50 border border-gold/20 rounded-xl py-3 px-4 text-cream font-tajawal focus:border-gold focus:outline-none focus:gold-glow transition-all" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-4">{t('طريقة التوصيل', 'Delivery Method')}</h2>
              {[
                { title: t('توصيل سريع', 'Fast Delivery'), desc: t('خلال 30-45 دقيقة', 'Within 30-45 minutes'), price: 3000 },
                { title: t('توصيل مجدول', 'Scheduled Delivery'), desc: t('اختر الوقت المناسب', 'Choose your preferred time'), price: 2000 },
              ].map((opt, i) => (
                <label key={i} className="flex items-center gap-4 p-4 rounded-xl glass cursor-pointer hover:gold-glow transition-all">
                  <input type="radio" name="delivery" defaultChecked={i === 0} className="accent-gold" />
                  <div className="flex-1">
                    <h3 className="font-tajawal font-bold text-cream">{opt.title}</h3>
                    <p className="text-cream/50 text-sm">{opt.desc}</p>
                  </div>
                  <span className="font-cairo text-gold-bright">{formatPrice(opt.price)}</span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-4">{t('طريقة الدفع', 'Payment Method')}</h2>
              <label className="flex items-center gap-4 p-4 rounded-xl glass cursor-pointer hover:gold-glow transition-all">
                <input type="radio" name="payment" defaultChecked className="accent-gold" />
                <Truck size={24} className="text-gold-bright" />
                <div className="flex-1">
                  <h3 className="font-tajawal font-bold text-cream">{t('نقداً عند التسليم', 'Cash on Delivery')}</h3>
                  <p className="text-cream/50 text-sm">{t('ادفع عند استلام طلبك', 'Pay when you receive your order')}</p>
                </div>
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-6">{t('تأكيد الطلب', 'Confirm Order')}</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl glass">
                    <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-tajawal text-cream text-sm">{lang === 'ar' ? item.name : item.nameEn}</h3>
                      <p className="text-cream/50 text-xs font-cairo">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <span className="font-cairo text-gold-bright">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl gold-border">
                <span className="font-tajawal text-cream text-lg">{t('المجموع الكلي', 'Grand Total')}</span>
                <span className="font-cairo text-2xl text-gradient-gold">{formatPrice(total)}</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* أزرار */}
      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-full glass-light font-tajawal text-gold-bright hover:gold-glow transition-all">
            {t('السابق', 'Previous')}
          </button>
        ) : <div />}

        <button onClick={handleNext}
          className="px-8 py-3.5 rounded-full font-tajawal font-bold relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}>
          <span className="relative z-10 text-emerald-deep flex items-center gap-2">
            {step === 3 ? t('تأكيد الطلب', 'Confirm Order') : t('التالي', 'Next')}
            {step < 3 && <Arrow size={18} />}
          </span>
          <span className="absolute inset-0 shine-bg" />
        </button>
      </div>
    </div>
  );
}
